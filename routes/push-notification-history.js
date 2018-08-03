var crypto = require('crypto');
var dataBaseUtil = require("./mysql_data.js");
var emailUtil = require("./emailUtil.js");
var config = require('./config.json');
var status_codes = require('.././status_codes/status_codes.json');
var encrypt_decrypt = require('.././encrypt_decrypt/encryption-decryption.js');
var inputValidation = require('.././validation/input-validation.js');
var connection_db = dataBaseUtil;

var cryptkey = encrypt_decrypt.generate_crypt_key();

var pushNotifHistory = {

  // User can see the schedules list
  get_notification_history: function(req, res, next){
    // console.log('get_notification_history');
    let isUserId = inputValidation.isValid(req.params.userid);
    let iv = encrypt_decrypt.generate_randomIV();
    if(isUserId!=true){
      let response_data = status_codes.userId_not_found;
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }
    else{
      get_notification_history_next(req, res, next, iv);
    }

  }


}



function get_notification_history_next(req, res, next, iv){
  // console.log(req.query);
  let userid   = encrypt_decrypt.decode_base64(req.params.userid);
  // console.log(req.query);
  // console.log(req.originalUrl);
  let queryData = req.query||null;
  var query_string;
  // console.log(queryData);
  let isQuery = inputValidation.isValid(queryData);
  let isQueryOb = inputValidation.isEmptyObj(queryData);
  // console.log(isQueryOb+'isQueryOb');
  if(isQuery!=true || isQueryOb){

    let dateUpto, prevDate,subDays = -7;
    dateUpto = inputValidation.currDateStartTime();
    prevDate = inputValidation.addDaysToDate(dateUpto,subDays);
    dateUpto = inputValidation.YMDformat(dateUpto);
    prevDate = inputValidation.YMDformat(prevDate);
    get_pushNotification_history(req, res, iv, userid, prevDate, dateUpto);
  }else{
      try{
        for ( property in queryData ) {
            // console.log( property ); // Outputs: foo, fiz or fiz, foo
            query_string = property;
            break;
        }
        // console.log( 'property queryData' );
      }catch(e){
        let response_data = status_codes.query_string_missing;
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
      }
      try{
        var de_cryptdata = encrypt_decrypt.decrypt_new(cryptkey, query_string);
        de_cryptdata = JSON.parse(de_cryptdata);
        // console.log(de_cryptdata);
        var prevDate = de_cryptdata.prevDate;
        var dateUpto = de_cryptdata.dateUpto;
        var dateData = [prevDate, dateUpto];
        let isDateData = inputValidation.validateAllRequiredFields(dateData);
        if(isDateData!=true){
          let response_data = status_codes.date_data_missing;
          // console.log(response_data);
          let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
          res.end(enc);
        }else{
          get_pushNotification_history(req, res, iv, userid, prevDate, dateUpto);
        }
      }catch(e){
      let response_data = status_codes.wrong_string;
      // console.log(response_data);
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
      }
    }
}


function get_pushNotification_history(req, res, iv, userid, prevDate, dateUpto){
  var get_notif_hist_query = 'SELECT pnh.id as id, SUBSTRING_INDEX(pnh.datetime, "T",-1 ) '+
  ' as datetime, pnh.user as user, pnh.device_address as device_address,'+
  ' pnh.message as message, pnh.type as type'+
  ' FROM push_notification_history as pnh where pnh.datetime'+
  ' BETWEEN "'+prevDate +'" and "'+dateUpto+'" and pnh.user=" '+userid+'"';
  // ' group by history.measurementDate';
  // console.log(get_notif_hist_query);
  connection_db.query(get_notif_hist_query, function(err, user_row){
    if (err){
      // throw error;
      let response_data = status_codes.db_error_0001;
      // console.log(response_data);
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }else{
      let send_pushNot_history_data = [];
      // Send data to function
       send_pushNot_history_data = user_row;
      try{
        for(let i=0;i<send_pushNot_history_data.length;i++){
          let datetime = send_pushNot_history_data[i].datetime || "";
          if(datetime!=undefined && datetime!=null && datetime!="" && datetime.indexOf(' ')!=-1){
               let str = (datetime).split(' ');
                //  console.log(str);
               send_pushNot_history_data[i].date = (str[0]);
               send_pushNot_history_data[i].time = (str[1]);
               delete send_pushNot_history_data[i].datetime;
          }
        }
      }catch(e){
        send_pushNot_history_data = user_row;
      }finally{
        let response_data = {};
        response_data = status_codes.push_not_history;
        response_data.push_notf_history = send_pushNot_history_data;
        // console.log(response_data);
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
      } // end of finally
    } // end of else
  });
}


module.exports = pushNotifHistory;
