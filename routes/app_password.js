var crypto = require('crypto');
var dataBaseUtil = require("./mysql_data.js");
var emailUtil = require("./emailUtil.js");
var config = require('./config.json');
var status_codes = require('.././status_codes/status_codes.json');
var encrypt_decrypt = require('.././encrypt_decrypt/encryption-decryption.js');
var inputValidation = require('.././validation/input-validation.js')

var connection_db = dataBaseUtil;

var cryptkey = encrypt_decrypt.generate_crypt_key();

// var scheduleEmail = require('.././email-functions-html/email-schedule.js');
// scheduleEmail.cancel_schedule_by_staff( {}, {}, {}, 1, 1);


var appPassword = {

  save_app_pass: function(req, res, next){
    let isUserId = inputValidation.isValid(req.params.userid);
    let isAppPassword = inputValidation.isValid(req.params.token);
    let iv = encrypt_decrypt.generate_randomIV();
    if(isUserId!=true){
      let response_data = status_codes.userId_not_found;
      console.log(response_data);
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }else{
      if(isAppPassword!=true){
        let response_data = status_codes.tokenpass_not_found;
        console.log(response_data);
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
      }else{
        save_app_pass_next(req, res, next, iv);
      }
    }
  }


}


function save_app_pass_next(req, res, next, iv) {
  let userid =  encrypt_decrypt.decode_base64(req.params.userid);
  let token_val =  encrypt_decrypt.decode_base64(req.params.token);
  let pass_data_query = "select * from gym_member where id='"+userid+"';";
  console.log(pass_data_query);
  connection_db.query(pass_data_query,function(err,user_row){
    if(err){
     // throw err;
     let response_data = status_codes.db_error_0001;
     console.log(response_data);
     let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
     res.end(enc);
   }else {
       if(user_row.length<=0){
             let response_data = status_codes.no_user_found;
             console.log(response_data);
             let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
             res.end(enc);
       }else{
         var user_data = user_row[0];
         let new_pass_enc = inputValidation.encryptPassword(token_val);
         let update_pass_user_query = 'UPDATE gym_member set app_password="'+new_pass_enc+'" where id='+  user_data.id;
         connection_db.query(update_pass_user_query,function(err,user_data){
          if(err){
            // throw err;
            let response_data = status_codes.db_error_0001;
            console.log(response_data);
            let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
            res.end(enc);
          }else{
            let response_data = status_codes.pass_updated;
            console.log(response_data);
            let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
            res.end(enc);
          }
        });
      }
    }
  });
}


module.exports = appPassword;
