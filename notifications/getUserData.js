var dataBaseUtil = require(".././routes/mysql_data.js");
var status_codes = require('.././status_codes/status_codes.json');
var encrypt_decrypt = require('.././encrypt_decrypt/encryption-decryption.js');



var connection_db = dataBaseUtil;



var cryptkey = encrypt_decrypt.generate_crypt_key();


module.exports = {

  getUserData: function getUserData(req, res, iv, userid, callback){
  
    var user_data_not_query = 'SELECT gm.*, pn.device_type, pn.device_address FROM gym_member gm '+
      ' LEFT JOIN push_notification pn ON pn.user = gm.id'+
      ' where gm.id="'+userid+'";';
    console.log('v   '+user_data_not_query);
    let send_data = {"user_found":false};
    connection_db.query(user_data_not_query,function(err,user_row){
      if(err){
        console.log('err');
        return callback(send_data);
        // throw err;
        // let response_data = status_codes.db_error_0001;
        // let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        // res.end(enc);
      }else {
        if(user_row.length<=0){
          console.log('length 0');
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
