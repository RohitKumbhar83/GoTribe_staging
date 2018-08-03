var crypto = require('crypto');
var dataBaseUtil = require("./mysql_data.js");
var emailUtil = require("./emailUtil.js");
var config = require('./config.json');
var status_codes = require('.././status_codes/status_codes.json');
var encrypt_decrypt = require('.././encrypt_decrypt/encryption-decryption.js');
var inputValidation = require('.././validation/input-validation.js');
var emailFunction = require('.././email-functions-html/emailsFunctions');
var httpClient = require('./httpUtil.js');
var nullKeyValidation = require('.././validation/null-key-validation.js');
var userReferralData = require('.././validation/referred-Function.js');


var cryptkey = encrypt_decrypt.generate_crypt_key();


var connection_db = dataBaseUtil;


var new_users = {

  new_user_signup: function(req, res, next){
          var data='';
          req.setEncoding('utf8');
          req.on('data', function(chunk) {
             data += chunk;
          });
          req.on('end', function() {
              req.rawBody = data;
              // console.log(req.rawBody+'data');
              // console.log(req.rawBody+'data');
              let iv = encrypt_decrypt.generate_randomIV();
              console.log('new_user_signup_next');
              new_user_signup_next(req, res, next, iv);
          });
  }


}

function new_user_signup_next(req, res, next, iv){

  let hn_wo_port = inputValidation.hostnameSeparator(req.headers.host);
  let date_added_time = inputValidation.add_time();
  let timestamp = inputValidation.date_to_timestamp(date_added_time);
  let date = inputValidation.timestamp_to_date(timestamp);
  var get_string = req.rawBody || null;
  if(get_string!=null){
    try{
      var de_cryptdata = encrypt_decrypt.decrypt_new(cryptkey, get_string);
      de_cryptdata = JSON.parse(de_cryptdata);
      console.log(de_cryptdata);
        var email_id = de_cryptdata.identity;
        var token_val = de_cryptdata.token;
        var login_type = de_cryptdata.type;
        //added password field on 31st july 2018
        //var password = de_cryptdata.password;

        var activated = 1;
        if(login_type==null || login_type=="" || login_type ==undefined || login_type== "email" || login_type== "Email"){
          login_type = "email";
        // }else{
        //   activated = 1; // sign up using facebook, google
        //   let response_data = status_codes.other_than_email;
        //   console.log(response_data);
        //   let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        //   res.end(enc);
        // } // End of  sign up using facebook, google
        var isEmail = inputValidation.isValid(email_id);
        if(isEmail!=true){
          let response_data = status_codes.email_not_found;
          console.log(response_data);
          let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
          res.end(enc);
        }else{
          var isValidEmail = inputValidation.emailValidator(email_id);
          if(isValidEmail!=true){
            let response_data = status_codes.email_not_valid;
            console.log(response_data);
            let enc  = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
            res.end(enc);
          }else{
              // var userName = de_cryptdata.userName || email_id;
              email_id = email_id.toLowerCase();
              var userName = email_id;
              /* Generating random password for google sign in and facebook sign in */
              let random_password = encrypt_decrypt.generate_pass_social_user();
              let enc_rand_pass = inputValidation.encryptPassword(random_password);
              let enc_password =inputValidation.encryptPassword(token_val);
              // console.log(random_password+ ' random_password');
              /* End */
              var query_exec = 'SELECT * FROM gym_member where userName = "'+userName +'" or email="'+email_id+'";';
              connection_db.query(query_exec,function(err,rows){
                  if(err){
                    // throw err;
                    let response_data = status_codes.db_error_0001;
                    console.log(response_data);
                    let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                    res.end(enc);
                  }else{
                    if(rows.length>0){
                      let response_data = {};
                      let isActivated = rows[0].activated || 1;
                      let get_login_type = rows[0].login_type || null;
                        response_data = status_codes.user_exists;
                        response_data.activated = isActivated;
                        console.log(response_data);
                        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                        res.end(enc);
                    }else{
                        let created_date = inputValidation.currentTime();
                        var saveUserData  = {};

                              saveUserData  = {
                               email: email_id,login_type:login_type,reg_from:"Mobile App",
                               role_name: "member", role_id: 4, first_name: "",
                               weight:"",assign_group:6,
                               username:userName,password:"",app_password:enc_password,
                               created_date: created_date, activated:activated
                             };
                          var query = connection_db.query('INSERT INTO gym_member SET ?', saveUserData, function (error, results, fields) {
                            if (error){
                              // throw error;
                              let response_data = status_codes.not_able_register;
                              let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                              res.end(enc);
                            }else{
                              // Neat!
                            var emailBody = "Thank you for registration";
                              //htmlContent, textContent, subject, from_email, from_name, to_email, to_name, reply_to_email
                            //  emailUtil.sendMail(emailBody, "", "Registration", "jameel.ahmad@rnf.tech", "RNF Management", "vikas.kohli@rnf.tech", "");
                              //console.log(query.sql); // INSERT INTO posts SET `id` = 1, `title` = 'Hello MySQL'
                              //console.log(results); // INSERT INTO posts SET `id` = 1, `title` = 'Hello MySQL'
                              //console.log(fields); // INSERT INTO posts SET `id` = 1, `title` = 'Hello MySQL'
                              var isInsert = inputValidation.isValid(results.insertId);
                              if(isInsert!=true){
                                let response_data = status_codes.not_able_register;
                                console.log(response_data);
                                let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                                res.end(enc);
                              }else{

                                let send_id = (results.insertId ).toString();
                                let send_new_token_val =(random_password).toString();
                                var pass_data1 = {
                                  'id':encrypt_decrypt.encode_base64(send_id),
                                  'token': encrypt_decrypt.encode_base64(send_new_token_val)
                                };
                                httpClient.makePostRequest(pass_data1);
                                let created_date_time = inputValidation.currentDateTime();
                                let  saveMeasurementData  = {
                                   updatedAt:created_date_time, createdAt: created_date_time,
                                   user:results.insertId,weight:0,height:0,bodyFat:0,waterWeight:0,
                                   leanBodyMass:0,boneDensity:0,caliperBicep:0,triceps:0,
                                   subscapular:0,iliacCrest:0,neck:0,chest:0,forearm:0,waist:0,
                                   hip:0,thigh:0,calf:0,circumferencesSum:0,circumferenceBicep:0
                                 };
                                 console.log('INSERT INTO member_measurement SET ?', saveMeasurementData);
                                let query_meas = connection_db.query('INSERT INTO member_measurement SET ?', saveMeasurementData, function (error, result_meas, fields) {
                                if (error){
                                  // throw error;
                                  let response_data = status_codes.not_able_measurement;
                                  let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                                  res.end(enc);
                                }else{
                                      var fetch_query = "select * from gym_member where id="+results.insertId+";";
                                      // console.log(fetch_query);
                                      connection_db.query(fetch_query,function(err,rows_fetch){
                                          if(err){
                                            // throw err;
                                            let response_data = status_codes.db_error_0001;
                                            let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                                            res.end(enc);
                                          }else{
                                            // console.log(rows_fetch);
                                            var member_id_data;
                                            // console.log(member_id_data+'member_id_data');
                                            if(rows_fetch.length>0){
                                              memberData = rows_fetch[0];
                                              // console.log(memberData.id);
                                              var str = "" + memberData.id;
                                              var pad = "00000";
                                              var ans = "M"+pad.substring(0, pad.length - str.length) + str;
                                              member_id_data = ans;
                                              // console.log(member_id_data);
                                              let set_member_idQuery;
                                              // let rand_code = inputValidation.generate_OTP();
                                              // if(activated){
                                                set_member_idQuery = 'update gym_member set member_id="'+ member_id_data+'" WHERE id='+memberData.id+';';
                                              // }else{
                                                // set_member_idQuery = 'update gym_member set member_id="'+ member_id_data+'" ,random_OTP='+rand_code+' WHERE id='+memberData.id+';';
                                              // }
                                              // console.log(set_member_idQuery);
                                              connection_db.query(set_member_idQuery,function(err,user_mem_row){
                                              if(err){
                                                // throw err;
                                                let response_data = status_codes.db_error_0001;
                                                console.log(response_data);
                                                let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                                                res.end(enc);
                                              }else {
                                                 let activate_status = rows_fetch[0].activated || 1;
                                                 console.log(activate_status+'activate_status');
                                                  let response_data = {};
                                                  response_data = status_codes.reg_code_0000;
                                                  // response_data.access_token = rows_fetch[0].access_token;
                                                  let user_output = rows_fetch[0];
                                                  // response_data.output = rows_fetch[0];
                                                  let random_password = token_val;
                                                  console.log(random_password);
                                                  emailFunction.send_pass_social_user(user_output,random_password, hn_wo_port);
                                                  userReferralData.isUserReferred(req, res, iv, memberData.id, email_id, function(user_reference){
                                                    // doing user refernce proccesing
                                                  });
                                                  console.log(response_data);
                                                  //console.log(response_data);
                                                    let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                                                    //res.status(200).json(response_data);
                                                    res.end(enc);
                                                    //console.log(rows_fetch);
                                              }
                                                });
                                              }else{
                                                let response_data = status_codes.db_error_0001;
                                                console.log(response_data);
                                                let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                                                res.end(enc);
                                              }

                                            }
                                          });
                                }
                              });
                              }
                            }
                          });

                      //  }
                      // }); // End of last existing user in database
                    }
                  }
                });
            // } // End of First Name
          }
        }
      }else{
        activated = 1; // sign up using facebook, google
        let response_data = status_codes.other_than_email;
        console.log(response_data);
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
      } // End of  sign up using facebook, google
    }catch(e){
      let response_data = status_codes.wrong_string;
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }

  }else{
    let response_data = status_codes.raw_data_missing;
    let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
    res.end(enc);
  }

}



module.exports = new_users;
