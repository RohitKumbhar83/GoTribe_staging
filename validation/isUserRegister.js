var dataBaseUtil = require(".././routes/mysql_data.js");
var status_codes = require('.././status_codes/status_codes.json');
var inputValidation = require('./input-validation.js');
var encrypt_decrypt = require('.././encrypt_decrypt/encryption-decryption.js');




var connection_db = dataBaseUtil;



var cryptkey = encrypt_decrypt.generate_crypt_key();


module.exports = {

  isUserRegister: function checkUser(req, res, iv, userid, callback){
    let profile_query = 'select * from gym_member where id="'+userid+'";';
    connection_db.query(profile_query,function(err,user_row){
      if(err){
        // throw err;
        let response_data = status_codes.db_error_0001;
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
      }else {
        if(user_row.length<=0){
          // No User Found for that id
          let response_data = status_codes.no_user_found;
          console.log(response_data);
          let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
          res.end(enc);
          // res.status(200).json(response_data);
        }else{
          var user_data = user_row[0];
          return callback(user_data);
        }
      }
    });
  },

  getDataFromEmail: function dataFromEmail(req, res, iv, emailid, callback){

    let profile_email_query = 'select * from gym_member where email="'+emailid+'";';
    let send_data = {"user_found":false};
    console.log('profile_email_query '+profile_email_query);
    connection_db.query(profile_email_query,function(err,user_row){
      if(err){
        return callback(send_data);
        // throw err;
        // let response_data = status_codes.db_error_0001;
        // let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        // res.end(enc);
      }else {
        console.log('user_row.length'+user_row.length);
        if(user_row.length<=0){
          return callback(send_data);
          // No User Found for that id
          // let response_data = status_codes.no_user_found;
          // console.log(response_data);
          // let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
          // res.end(enc);
          // res.status(200).json(response_data);
        }else{
          var user_data = user_row[0];
          user_data.user_found = true;
          return callback(user_data);
        }
      }
    });
  }

}
