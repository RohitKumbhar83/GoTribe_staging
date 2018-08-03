var crypto = require('crypto');
var dataBaseUtil = require("./mysql_data.js");
var emailUtil = require("./emailUtil.js");
var config = require('./config.json');
var status_codes = require('.././status_codes/status_codes.json');
var encrypt_decrypt = require('.././encrypt_decrypt/encryption-decryption.js');
var inputValidation = require('.././validation/input-validation.js')

var connection_db = dataBaseUtil;

var cryptkey = encrypt_decrypt.generate_crypt_key();

var overhead = {

  // Overhead Squat Details
  get_overhead_info: function(req, res, next){
    let isUserId = inputValidation.isValid(req.params.userid);
    let iv = encrypt_decrypt.generate_randomIV();
    if(isUserId!=true){
      let response_data = status_codes.userId_not_found;
      console.log(response_data);
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }
    else{
          get_overhead_info_next(req, res, next, iv);
    }
  },

  save_overhead_info: function(req, res, next){

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
              save_overhead_info_next(req, res, next, iv);
          });
    }
  }


} // End of bug object


function get_overhead_info_next (req, res, next, iv){
  let userid   = encrypt_decrypt.decode_base64(req.params.userid);
  let get_base_query = 'select * from member_overhead_squat where user="'+userid+'";';
  connection_db.query(get_base_query,function(err,user_row){
    if(err){
      // throw err;
      let response_data = status_codes.db_error_0001;
      console.log(response_data);
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }else {
      if(user_row.length<=0){
        // No Overhead Squat Data
        let response_data = status_codes.no_overhead_squat;
        console.log(response_data);
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
      }else{
        var user_data = user_row[0];
        // Send Overhead Squat Data
        let response_data = {}
        response_data = status_codes.overhead_squat_data;
        response_data.output = user_data;
        console.log(response_data);
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
      }
    }
  });
}


function save_overhead_info_next(req, res, next, iv){
  let userid   = encrypt_decrypt.decode_base64(req.params.userid);
  var get_string = req.rawBody || null;
  // console.log(get_string+" get_string");
  if(get_string!=null){
    try{
      var de_cryptdata = encrypt_decrypt.decrypt_new(cryptkey, get_string);
      de_cryptdata = JSON.parse(de_cryptdata);
      var isTestRes = inputValidation.isValid(de_cryptdata.testResults);
      if(isTestRes!=true){
          let response_data = status_codes.no_testResult;
          console.log(response_data);
          let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
          res.end(enc);
      }else{
          let get_overhead_query = 'select * from member_overhead_squat where user="'+userid+'";';
          connection_db.query(get_overhead_query,function(err,user_row){
            if(err){
              // throw err;
              let response_data = status_codes.db_error_0001;
              let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
              res.end(enc);
            }else {
              let overhead_data = {};
              overhead_data.user = userid;
              overhead_data.testResults = de_cryptdata.testResults;
              console.log(overhead_data);
              if(user_row.length<=0){
                // Insert Data and Save
                insert_overhead(req, res, iv, overhead_data, userid);
              }else{
                var user_data = user_row[0];
                // Update Data and Save
                // console.log(user_data);
                // console.log('user_data for overhead_squat data');
                update_overhead(req, res, iv, overhead_data, userid);
              }
            }
          });
      }
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


function insert_overhead(req, res, iv, overhead_data, userid){
    var query = connection_db.query('INSERT INTO member_overhead_squat SET ?', overhead_data, function (error, results, fields) {
    if (error){
      // throw error;
      let response_data = status_codes.db_error_0001;
      console.log(response_data);
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }else{
      let response_data = status_codes.overhead_squat_added;
      console.log(response_data);
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }
  });
}


function update_overhead(req, res, iv, overhead_data, userid){
  let testResultData;
  try{
  // console.log('I m going to stringify');
  // testResultData = JSON.stringify(overhead_data.testResults);
  testResultData = overhead_data.testResults;
  console.log(testResultData);
  // console.log('I stringify successfully');
  }catch(e){
  testResultData = overhead_data.testResults;
  }
  finally{
    let update_status_query = "update member_overhead_squat set testResults='"+testResultData+
    "' where user='"+userid+"';";
    console.log(update_status_query);
    connection_db.query(update_status_query,function(err,user_mem_row){
      if(err){
        // throw err;
        let response_data = status_codes.db_error_0001;
        console.log(response_data);
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
      }else {
        let response_data = status_codes.overhead_squat_updated;
        console.log(response_data);
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
      }
    });
  }
}


module.exports = overhead;
