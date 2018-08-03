var crypto = require('crypto');
var dataBaseUtil = require("./mysql_data.js");
var emailUtil = require("./emailUtil.js");
var config = require('./config.json');
var status_codes = require('.././status_codes/status_codes.json');
var encrypt_decrypt = require('.././encrypt_decrypt/encryption-decryption.js');
var inputValidation = require('.././validation/input-validation.js');
var connection_db = dataBaseUtil;

var cryptkey = encrypt_decrypt.generate_crypt_key();

var notificationAddress = {

  // User can see the schedules list
  save_notification_add: function(req, res, next){
    // console.log('save_notification_add');
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
            save_notification_add_next(req, res, next, iv);
        });

    }

  }


}



function save_notification_add_next(req, res, next, iv){

  let userid   = encrypt_decrypt.decode_base64(req.params.userid);
  var get_string = req.rawBody || null;
  // console.log(get_string+" get_string");
  if(get_string!=null){
    try{
      var de_cryptdata = encrypt_decrypt.decrypt_new(cryptkey, get_string);
      de_cryptdata = JSON.parse(de_cryptdata);

      var delete_old_add = 'DELETE FROM push_notification WHERE device_address = "' + de_cryptdata.device_address+ '"';
      // console.log(delete_old_add);
      connection_db.query(delete_old_add, function (error, results, fields) {
        // console.log(error);
        if (error){
          // throw error;
          let response_data = status_codes.db_error_0001;
          // console.log(response_data);
          let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
          res.end(enc);
        }
          // console.log('deleted ' + results.affectedRows + ' rows');
          var query_exec = 'SELECT * FROM push_notification where user="'+userid+'";';
          // console.log('v   '+query_exec);
          connection_db.query(query_exec,function(err,user_row){
          if(err){
            // throw err;
            let response_data = status_codes.db_error_0001;
            // console.log(response_data);
            let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
            res.end(enc);
          }else{
            let notification_data = {};
            notification_data = de_cryptdata;
            notification_data.user = userid;
            if(user_row.length<=0){
              insert_notification_add(req, res, iv, notification_data, userid);
            }else{
              var user_data = user_row[0];
              // Update Data and Save
              // console.log(user_data);
              let id = user_data.id;
              update_notification_add(req, res, iv, userid, id, user_data, de_cryptdata);
            }
          }
        });
      });
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


function insert_notification_add(req, res, iv, notification_data, userid){
  // console.log('insert_notification_add');
    var query = connection_db.query('INSERT INTO push_notification SET ?', notification_data, function (error, results, fields) {
    if (error){
      // throw error;
      let response_data = status_codes.db_error_0001;
      // console.log(response_data);
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }else{
      let response_data = status_codes.notification_added;
      // console.log(response_data);
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }
  });
}


function update_notification_add(req, res, iv, userid, id, user_data, de_cryptdata){
  // console.log('update_notification_add');
    let notification_data = {};
    notification_data = de_cryptdata;
    notification_data.user =   userid;
    let isDevType = inputValidation.isValid(de_cryptdata.device_type);
    if(isDevType!=true){
      notification_data.device_type =   user_data.device_type||"";
    }else{
      notification_data.device_type =   de_cryptdata.device_type;
    }
    let isWeight = inputValidation.isValid(de_cryptdata.device_address);
    if(isWeight!=true){
      notification_data.device_address =   user_data.device_address||"";
    }else{
      notification_data.device_address =   de_cryptdata.device_address;
    }
    // console.log(notification_data);
    let update_status_query = 'update push_notification set device_type="'+ notification_data.device_type+
    '", device_address="'+notification_data.device_address+'" where user="'+ userid + '" and id= "'+id+'";';
    // console.log(update_status_query);
    connection_db.query(update_status_query, function(err, user_mem_row){
    if (err){
      // throw error;
      let response_data = status_codes.db_error_0001;
      // console.log(response_data);
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }else{
      let response_data = status_codes.notification_updated;
      // console.log(response_data);
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }
    });
}


module.exports = notificationAddress;
