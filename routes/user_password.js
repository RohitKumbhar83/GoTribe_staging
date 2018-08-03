var crypto = require('crypto');
var dataBaseUtil = require("./mysql_data.js");
var emailUtil = require("./emailUtil.js");
var config = require('./config.json');
var status_codes = require('.././status_codes/status_codes.json');
var encrypt_decrypt = require('.././encrypt_decrypt/encryption-decryption.js');
var inputValidation = require('.././validation/input-validation.js');
var httpClient = require('./httpUtil.js');
var emailFunction = require('.././email-functions-html/emailsFunctions');

var connection_db = dataBaseUtil;

var cryptkey = encrypt_decrypt.generate_crypt_key();

var password = {

  pass_update: function(req, res, next){
    let isUserId = inputValidation.isValid(req.params.userid);
    let iv = encrypt_decrypt.generate_randomIV();
    if(isUserId!=true){
      let response_data = status_codes.userId_not_found;
      console.log(response_data);
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }else{
      var data='';
        req.setEncoding('utf8');
        req.on('data', function(chunk) {
           data += chunk;
        });
        req.on('end', function() {
            req.rawBody = data;
            // console.log(req.rawBody+'data');
            // console.log(req.rawBody+'data');
            pass_update_next(req, res, next, iv);
        });
    }
  },

  passsword_recovery: function(req, res, next){
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
              pass_recovery_next(req, res, next, iv);
          });
  },

  match_token_save_password: function(req, res, next){
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
              matchToken_savePass_next(req, res, next, iv);
          });
  }

} // End of password object

function pass_update_next(req, res, next, iv){
  let userid   = encrypt_decrypt.decode_base64(req.params.userid);
   var get_string = req.rawBody || null;
   if(get_string!=null){
   var de_cryptdata = encrypt_decrypt.decrypt_new(cryptkey, get_string);
   try{
     de_cryptdata = JSON.parse(de_cryptdata);
    //  var checkValidData = [de_cryptdata.identity,de_cryptdata.token,de_cryptdata.new_token];
     let token_val = de_cryptdata.token;
     let new_token_val = de_cryptdata.new_token;
     var isToken = inputValidation.isValid(token_val);
     if(isToken!=true){
       let response_data = status_codes.tokenpass_not_found;
       console.log(response_data);
       let enc  = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
       res.end(enc);
     }else{
       var isNewToken = inputValidation.isValid(new_token_val);
       if(isNewToken!=true){
         let response_data = status_codes.newtokenpass_not_found;
         console.log(response_data);
         let enc  = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
         res.end(enc);
       }else{
         let old_pass_enc = inputValidation.encryptPassword(token_val);
         let new_pass_enc = inputValidation.encryptPassword(new_token_val);
         if(old_pass_enc==new_pass_enc){
           let response_data = status_codes.old_new_pass_same;
           console.log(response_data);
           let enc  = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
           res.end(enc);
         }else{
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
                var isPassExist = inputValidation.isValid(user_data.app_password);
                if(isPassExist!=true){
                  let response_data = status_codes.use_social_login;
                  console.log(response_data);
                  let enc  = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                  res.end(enc);
                }else{
                  if(old_pass_enc!=user_data.app_password){
                    let response_data = status_codes.pass_not_match;
                    console.log(response_data);
                    let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                    res.end(enc);
                  }else{
                     let update_pass_user_query = 'UPDATE gym_member set app_password="'+new_pass_enc+'" where id="'+  user_data.id+'";';
                     console.log(update_pass_user_query);
                     connection_db.query(update_pass_user_query,function(err,user_data1){
                      if(err){
                        // throw err;
                        let response_data = status_codes.db_error_0001;
                        console.log(response_data);
                        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                        res.end(enc);
                      }else{
                        // console.log(user_data.id);console.log(new_token_val);
                        let send_id = (user_data.id ).toString();
                        let send_new_token_val =(new_token_val).toString();
                         console.log(encrypt_decrypt.encode_base64(send_id) + ' send_id' );
                         console.log(encrypt_decrypt.encode_base64(send_new_token_val) + ' send_new_token_val');
                        // console.log(encrypt_decrypt.encode_base64(send_id) +' send_id');
                        // console.log(encrypt_decrypt.encode_base64(send_new_token_val)+' send_new_token_val');
                        // let decodeVal1 = encrypt_decrypt.encode_base64(send_id);
                        // let decodeVal2 = encrypt_decrypt.encode_base64(send_new_token_val);
                        // console.log(encrypt_decrypt.decode_base64(decodeVal1) + 'send_id');
                        // console.log(encrypt_decrypt.decode_base64(decodeVal2) +'send_new_token_val');
                        var pass_data1 = {
                          'id':encrypt_decrypt.encode_base64(send_id),
                          'token': encrypt_decrypt.encode_base64(send_new_token_val)
                        }
                        httpClient.makePostRequest(pass_data1);
                        let response_data = status_codes.pass_updated;
                        console.log(response_data);
                        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                        res.end(enc);
                      }
                    });
                  }
                }
              }
            }
           });
         }
       }
     }

    //  let isValidData = inputValidation.validateAllRequiredFields(checkValidData);
    //  if(isValidData!=true){
    //    let response_data = status_codes.get_params_missing;
    //    let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
    //    res.end(enc);
    //  }else{
    //  } // End of if isValidData
   }catch(e){
     let response_data = status_codes.wrong_string;
     console.log(response_data);
     let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
     res.end(enc);
   }

   }else{
     let response_data = status_codes.raw_data_missing;
     console.log(response_data);
     let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
     res.end(enc);
   }
}


function pass_recovery_next(req, res, next, iv){
  let hn_wo_port = inputValidation.hostnameSeparator(req.headers.host);

    var get_string = req.rawBody || null;
    if(get_string!=null){
        var de_cryptdata = encrypt_decrypt.decrypt_new(cryptkey, get_string);
           console.log(de_cryptdata+'de_cryptdata');
        try{
          de_cryptdata = JSON.parse(de_cryptdata);
          let email_id = de_cryptdata.identity;
          let reset_token = de_cryptdata.reset_token; // Not used
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
              let pass_rec_mail = "select * from gym_member where email='"+email_id+"';";
              console.log(pass_rec_mail);
              connection_db.query(pass_rec_mail,function(err,user_row){
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
                    let link_url_data = {};
                    let pass_token = inputValidation.generate_accessToken();
                    let curr_date_time = inputValidation.currentDateTime();
                    link_url_data.reset_token = pass_token;
                    link_url_data.identity = email_id;
                    let update_rand_code_query = 'update gym_member set reset_password_token ="'+pass_token +'", token_created_at ="'+curr_date_time+'" where id="'+user_data.id+'";';
                    console.log(update_rand_code_query);
                    connection_db.query(update_rand_code_query,function(err,user_row){
                      if(err){
                        // throw err;
                        let response_data = status_codes.db_error_0001;
                        console.log(response_data);
                        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                        res.end(enc);
                      }else{
                        console.log(link_url_data);
                        console.log('link_url_data');
                        let link_enc = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(link_url_data));
                        let send_url   = config.forgot_pass_url + link_enc;
                        let ios_url   = config.ios_forgot_pass_url + link_enc;
                        let web_url =  config.website_forgot_pass_url + pass_token;
                        // inputValidation.send_pass_link_on_email(send_url,email_id,ios_url,web_url);
                        //  emailFunction.send_pass_link_on_email(email_id, send_url, ios_url, hn_wo_port);
                        emailFunction.send_pass_link_on_email(send_url, email_id, ios_url, web_url, hn_wo_port, user_data);
                        let response_data = status_codes.pass_recovered_mail;
                        // var de_cryptdata1 = encrypt_decrypt.decrypt_new(cryptkey, link_enc);
                        //    console.log(de_cryptdata1+'de_cryptdata1');
                        console.log(response_data);
                        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                        res.status(200).json(enc);
                      }
                    });
                  }
                }
              });
            } // End of valid email else
          }// End of email found else
        }catch(e){
          let response_data = status_codes.wrong_string;
          console.log(response_data);
          let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
          res.end(enc);
        }
    }else{
      let response_data = status_codes.raw_data_missing;
      console.log(response_data);
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }

}


function matchToken_savePass_next(req, res, next, iv){
  var get_string = req.rawBody || null;
  if(get_string!=null){
      var de_cryptdata = encrypt_decrypt.decrypt_new(cryptkey, get_string);
         console.log(de_cryptdata+'de_cryptdata');
      try{
        de_cryptdata = JSON.parse(de_cryptdata);
        let email_id = de_cryptdata.identity;
        let reset_token = de_cryptdata.reset_token;
        let token_val = de_cryptdata.token;
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
            let pass_rec_mail = "select * from gym_member where email='"+email_id+"';";
            console.log(pass_rec_mail);
            connection_db.query(pass_rec_mail,function(err,user_row){
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
                  var isResetToken = inputValidation.isValid(reset_token);
                  if(isResetToken!=true){
                      let response_data = status_codes.pass_token_not_found;
                      console.log(response_data);
                      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                      res.end(enc);
                  }else{

                    var isToken = inputValidation.isValid(token_val);
                    if(isToken!=true){
                        let response_data = status_codes.tokenpass_not_found;
                        console.log(response_data);
                        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                        res.end(enc);
                    }else{
                          console.log('my'+user_data.reset_password_token+'data');
                          var isUserResetToken = inputValidation.isValid(user_data.reset_password_token);
                          if(isUserResetToken!=true){
                            let response_data = status_codes.pass_token_not_generated;
                            console.log(response_data);
                            let enc  = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                            res.end(enc);
                          }else{
                              if(reset_token!=user_data.reset_password_token){
                                let response_data = status_codes.pass_token_not_match;
                                console.log(response_data);
                                let enc  = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                                res.end(enc);
                              }else{
                                console.log(token_val);
                                var encrypt_pass = inputValidation.encryptPassword(token_val);
                                let set_new_pass = 'update gym_member set app_password="'+ encrypt_pass+'", reset_password_token="" WHERE id='+user_data.id +' and email ="'+user_data.email+'";';
                                 console.log(set_new_pass);
                                connection_db.query(set_new_pass,function(err,user_row){
                                  if(err){
                                    // throw err;
                                    let response_data = status_codes.db_error_0001;
                                    console.log(response_data);
                                    let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                                    res.end(enc);
                                  }else {
                                    let send_id = (user_data.id ).toString();
                                    let send_new_token_val =(token_val).toString();
                                    var pass_data1 = {
                                      'id':encrypt_decrypt.encode_base64(send_id),
                                      'token': encrypt_decrypt.encode_base64(send_new_token_val)
                                    };
                                    httpClient.makePostRequest(pass_data1);
                                    let response_data = status_codes.forgot_pass_done;
                                    console.log(response_data);
                                    let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                                    res.end(enc);
                                  }
                                });
                              }
                          }
                    }
                  }
                }
              }
            });
          } // End of valid email else
        }// End of email found else
      }catch(e){
        let response_data = status_codes.wrong_string;
        console.log(response_data);
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
      }
  }else{
    let response_data = status_codes.raw_data_missing;
    console.log(response_data);
    let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
    res.end(enc);
  }
}


module.exports = password;
