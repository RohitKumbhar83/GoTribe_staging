var crypto = require('crypto');
var dataBaseUtil = require("./mysql_data.js");
var emailUtil = require("./emailUtil.js");
var config = require('./config.json');
var status_codes = require('.././status_codes/status_codes.json');
var encrypt_decrypt = require('.././encrypt_decrypt/encryption-decryption.js');
var inputValidation = require('.././validation/input-validation.js')
var bugEmail = require('.././email-functions-html/email-bug-report.js');
var userRegister = require('.././validation/isUserRegister.js');
var connection_db = dataBaseUtil;

var cryptkey = encrypt_decrypt.generate_crypt_key();

var bug = {

  save_bug_info: function(req, res, next){

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
              save_bug_info_next(req, res, next, iv);
          });
    }
  }


} // End of bug object


function save_bug_info_next(req, res, next, iv){
  let userid   = encrypt_decrypt.decode_base64(req.params.userid);
  var get_string = req.rawBody || null;
  // console.log(get_string+" get_string");
  if(get_string!=null){
    try{
      var de_cryptdata = encrypt_decrypt.decrypt_new(cryptkey, get_string);
      de_cryptdata = JSON.parse(de_cryptdata);
      let bug_reportData = {};
      let bug_reportDataWithBugObject = {};
      let curr_date_time = inputValidation.currentDateTime();
      bug_reportData = de_cryptdata;
      bug_reportDataWithBugObject = de_cryptdata;
      bug_reportData = {
        comment:bug_reportDataWithBugObject.comment,
        operatingSystem:bug_reportDataWithBugObject.operatingSystem,
        osVersion:bug_reportDataWithBugObject.osVersion,
        phoneModel:bug_reportDataWithBugObject.phoneModel,
        appVersion:bug_reportDataWithBugObject.appVersion
      }
      bug_reportData.user =   userid;
      bug_reportData.createdDate =  curr_date_time;
      console.log(bug_reportData);
      userRegister.isUserRegister(req, res, iv, userid, function(callback1){
          var query = connection_db.query('INSERT INTO report_issue SET ?', bug_reportData, function (error, results, fields) {
          if (error){
            // throw error;
            let response_data = status_codes.db_error_0001;
            // console.log(response_data);
            let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
            res.end(enc);
          }else{
            let response_data = status_codes.report_issue_raised;
            // console.log(response_data);
            bugEmail.send_bug_report(bug_reportDataWithBugObject, callback1);
            let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
            res.end(enc);
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


module.exports = bug;
