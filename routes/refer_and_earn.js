var crypto = require('crypto');
var dataBaseUtil = require("./mysql_data.js");
var emailUtil = require("./emailUtil.js");
var config = require('./config.json');
var status_codes = require('.././status_codes/status_codes.json');
var encrypt_decrypt = require('.././encrypt_decrypt/encryption-decryption.js');
var inputValidation = require('.././validation/input-validation.js');
var userMembership = require('.././validation/membershipFunction.js');
var userRegister = require('.././validation/isUserRegister.js');
var emailFunction = require('.././email-functions-html/emailsFunctions');

var connection_db = dataBaseUtil;

var cryptkey = encrypt_decrypt.generate_crypt_key();

var referFriend = {

  save_refer_info: function(req, res, next){
    let isUserId = inputValidation.isValid(req.params.userid);
    let iv = encrypt_decrypt.generate_randomIV();
    if(isUserId!=true){
      let response_data = status_codes.userId_not_found;
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }
    else{
        var data='';
          req.setEncoding('utf8');
          req.on('data', function(chunk) {
             data += chunk;
          });
          req.on('end', function() {
              req.rawBody = data;
              // console.log(req.rawBody+'data');
              // console.log(req.rawBody+'data');
              save_refer_info(req, res, next, iv);
          });
    }
  }


} // End of bug object


function save_refer_info(req, res, next, iv){
  let userid   = encrypt_decrypt.decode_base64(req.params.userid);
  var get_string = req.rawBody || null;
  //  console.log(get_string+" get_string");
  if(get_string!=null){
    try{
      var de_cryptdata = encrypt_decrypt.decrypt_new(cryptkey, get_string);
      de_cryptdata = JSON.parse(de_cryptdata);
      // console.log(de_cryptdata);
      var email_id = de_cryptdata.identity;
      var isEmail = inputValidation.isValid(email_id);
      if(isEmail!=true){
          let response_data = status_codes.email_not_found;
          // console.log(response_data);
          let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
          res.end(enc);
      }else{
        var isValidEmail = inputValidation.emailValidator(email_id);
        if(isValidEmail!=true){
          let response_data = status_codes.email_not_valid;
          // console.log(response_data);
          let enc  = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
          res.end(enc);
        }else{
            email_id = email_id.toLowerCase();
          // let check_referral_query = 'select referral.*, gym_member.email as user_email FROM referral_log as referral '+
          // ' LEFT JOIN gym_member ON referral.referred_by_userid=gym_member.id where'+
          // '  referral.referred_by_userid="'+userid+'" and referral.referred_to_email="'+email_id+'";';

          userRegister.isUserRegister(req, res, iv, userid, function(callback1){
            // console.log((callback1.email).toLowerCase());
            if((callback1.email).toLowerCase()== (email_id).toLowerCase() ){
              let response_data = status_codes.referred_own_email;
              // console.log(response_data);
              let enc  = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
              res.end(enc);
            }else{
                if(callback1.role_id==4){
                  userMembership.checkMembership(req, res, iv, userid, function(callback2){
                    // sending referred_by_friend data from callback1
                    isAlreadyRefer(req, res, iv, userid, email_id, callback1);
                  });
                }else{
                  // sending referred_by_frined data from callback1
                  isAlreadyRefer(req, res, iv, userid, email_id, callback1);
                }
              }
            });
          }
        }
      }catch(e){
      let response_data = status_codes.wrong_string;
      // console.log(response_data);
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }
  }else{
    let response_data = status_codes.raw_data_missing;
    // console.log(response_data);
    let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
    res.end(enc);
  }
}



function isAlreadyRefer(req, res, iv, userid, email_id, referred_by_friend){

    // console.log('isAlreadyRefer Function ');
    userRegister.getDataFromEmail(req, res, iv, email_id, function(cb_email){
      // console.log(cb_email);
      if(!cb_email.user_found){
        let check_referral_query = 'select * from referral_log where referred_by_userid="'+userid+
        '" and referred_to_email="'+ email_id+'";';
        // console.log(check_referral_query);
        connection_db.query(check_referral_query,function(err,user_row){
            if(err){
              // throw err;
              let response_data = status_codes.db_error_0001;
              // console.log(response_data);
              let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
              res.end(enc);
            }else{
                if(user_row.length<=0){
                  let refer_infoData = {};
                  let curr_date_time = inputValidation.currentDateTime();
                  refer_infoData.referred_by_userid =   userid;
                  refer_infoData.referred_to_email =   email_id;
                  refer_infoData.createdDate =  curr_date_time;
                  insert_referral(req, res, refer_infoData, iv, userid, email_id, referred_by_friend);
                }else{
                  let response_data = status_codes.user_already_referred;
                  // console.log(response_data);
                  let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                  res.end(enc);
                }
              }
          });
        }else{
          let response_data = status_codes.already_register_user;
          // console.log(response_data);
          let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
          res.end(enc);
        }
      });

}

function insert_referral (req, res, refer_infoData, iv, userid, email_id, referred_by_friend){
  let hn_wo_port = inputValidation.hostnameSeparator(req.headers.host);
  // console.log(refer_infoData);
  var query = connection_db.query('INSERT INTO referral_log SET ?', refer_infoData, function (error, results, fields) {
    if (error){
      // throw error;
      let response_data = status_codes.db_error_0001;
      // console.log(response_data);
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }else{
      // inputValidation.send_referral_link_on_email(email_id);
      emailFunction.send_referral_link_on_email(email_id, referred_by_friend, hn_wo_port);
      let response_data = status_codes.user_referred;
      // console.log(response_data);
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }
  });
}


module.exports = referFriend;
