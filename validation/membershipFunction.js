var dataBaseUtil = require(".././routes/mysql_data.js");
var status_codes = require('.././status_codes/status_codes.json');
var inputValidation = require('./input-validation.js');
var encrypt_decrypt = require('.././encrypt_decrypt/encryption-decryption.js');




var connection_db = dataBaseUtil;



var cryptkey = encrypt_decrypt.generate_crypt_key();


module.exports = {

  checkMembership: function checkUserMembership(req, res, iv, userid, callback){
    let client_status_query = 'SELECT * FROM membership_payment where `member_id` ="'+userid+'"'+
    ' and `payment_status` = 1;';
    console.log(client_status_query);
    connection_db.query(client_status_query,function(err,user_row){
      if(err){
        // throw err;
        let response_data = status_codes.db_error_0001;
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
      }else {
        if(user_row.length<=0){
          // No User Found for that id
          let response_data = status_codes.purchase_membership;
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
  }

}
