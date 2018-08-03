var crypto = require('crypto');
var dataBaseUtil = require("./mysql_data.js");
var emailUtil = require("./emailUtil.js");
var config = require('./config.json');
var status_codes = require('.././status_codes/status_codes.json');
var encrypt_decrypt = require('.././encrypt_decrypt/encryption-decryption.js');
var inputValidation = require('.././validation/input-validation.js');
// var headerValidation = require('.././validation/headersValidation.js');
var nullKeyValidation = require('.././validation/null-key-validation.js');


var connection_db = dataBaseUtil;

var cryptkey = encrypt_decrypt.generate_crypt_key();

var measurement = {

  save_baseline_measure: function(req, res, next){
    // let headerValid = headerValidation.chkheadersConnection(req);
    let iv = encrypt_decrypt.generate_randomIV();
    // if(headerValid!=true){
    //    headerValidation.headerInValidMessage(req, res, iv);
    // }else{
       //
      //  headerValidation.chkHeaderAccessToken(req, res, iv, function(callback_data){
      //    console.log(callback_data )
      //    if(callback_data){
           let isUserId = inputValidation.isValid(req.params.userid);
           if(isUserId!=true){
             let response_data = status_codes.userId_not_found;
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
                   save_baseline_measurement_next(req, res, next, iv);
               });
             }
      //    }else{
      //      console.log('coming to else');
      //    }
      //  });


    // } // end of headerValid else

  },

  get_baseline_measure: function(req, res, next){
    let isUserId = inputValidation.isValid(req.params.userid);
    console.log(isUserId);
    let iv = encrypt_decrypt.generate_randomIV();
    if(isUserId!=true){
      let response_data = status_codes.userId_not_found;
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
            get_baseline_measurement_next(req, res, next, iv);
        });
    }
  },

  // Measurement_History Details
  get_measure_info: function(req, res, next){
    let isUserId = inputValidation.isValid(req.params.userid);
    let iv = encrypt_decrypt.generate_randomIV();
    if(isUserId!=true){
      let response_data = status_codes.userId_not_found;
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }
    else{
      let isMeasurementId = inputValidation.isValid(req.params.measurement_hist_id);
      if(isMeasurementId!=true){
        let response_data = status_codes.measureHistId_not_found;
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
      }else{
          get_measure_info_next(req, res, next, iv);
      }
    }
  },

  add_measurement: function(req, res, next){
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
              add_measurement_next(req, res, next, iv);
          });
      }
  },

  update_measurement: function(req, res, next){
    let isUserId = inputValidation.isValid(req.params.userid);
    let iv = encrypt_decrypt.generate_randomIV();
    if(isUserId!=true){
      let response_data = status_codes.userId_not_found;
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }
    else{
      let isMeasurementId = inputValidation.isValid(req.params.measurement_hist_id);
      if(isMeasurementId!=true){
        let response_data = status_codes.measureHistId_not_found;
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
                  update_measurement_next(req, res, next, iv);
              });
      }
    }
  },

  delete_measurement: function(req, res, next){
    // let paramsValues = {};
    // paramsValues = req.params;
    // QueryValuesCheck = [req.params.userid,req.params.deleteid];
    let isUserId = inputValidation.isValid(req.params.userid);
    let iv = encrypt_decrypt.generate_randomIV();
    if(isUserId!=true){
      let response_data = status_codes.userId_not_found;
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }
    else{
      let isMeasurementId = inputValidation.isValid(req.params.measurement_hist_id);
      if(isMeasurementId!=true){
        let response_data = status_codes.measureHistId_not_found;
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
      }else{
            del_measurement_next(req, res, next, iv);
      }
    }
  },

  latest_measurement: function(req, res, next){
    let isUserId = inputValidation.isValid(req.params.userid);
    let iv = encrypt_decrypt.generate_randomIV();
    if(isUserId!=true){
      let response_data = status_codes.userId_not_found;
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }
    else{
        latest_measurement_next(req, res, next, iv);
    }
  }

} // End of measurement object


function save_baseline_measurement_next(req, res, next, iv){
  let userid   = encrypt_decrypt.decode_base64(req.params.userid);
  var get_string = req.rawBody || null;
  // console.log(get_string+" get_string");
  if(get_string!=null){
    try{
      var de_cryptdata = encrypt_decrypt.decrypt_new(cryptkey, get_string);
      de_cryptdata = JSON.parse(de_cryptdata);
      let base_meas_query = "select * from member_measurement where user='"+userid+"';";
      connection_db.query(base_meas_query,function(err,user_row){
        if(err){
          // throw err;
          let response_data = status_codes.db_error_0001;
          let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
          res.end(enc);
        }else {
          let insertmeasure = {};
          insertmeasure = de_cryptdata;
          let curr_date_time = inputValidation.currentDateTime();
          insertmeasure.user =   userid;
          insertmeasure.updatedAt =   curr_date_time;// Only in Baseline Measurememnt
          insertmeasure.createdAt =   curr_date_time;// Only in Baseline Measurememnt

          if(user_row.length<=0){
            // Insert Data and Save
            insert_baseline(req, res, iv, insertmeasure, userid);
          }else{
            var user_data = user_row[0];
            // Update Data and Save
            let measurement_data = {};
            // measurement_data = de_cryptdata;
            measurement_data.user =   userid;
            measurement_data.updatedAt =   curr_date_time;// Only in Baseline Measurememnt
            // measurement_data.createdAt =   curr_date_time;// Only in Baseline Measurememnt
            console.log(user_data);

            //
            //
            // if(de_cryptdata.activityLevel==""){
            //   measure_histData.activityLevel = "";
            // }else{
            //   let isActivity = inputValidation.isValid(de_cryptdata.activityLevel);
            //   if(isActivity!=true){
            //     measurement_data.activityLevel =   user_data.activityLevel;
            //   }else{
            //     measurement_data.activityLevel =   de_cryptdata.activityLevel;
            //   }
            // }
            // if(de_cryptdata.weight==""){
            //   measurement_data.weight =   de_cryptdata.weight;
            // }else{
            //   let isWeight = inputValidation.isValid(de_cryptdata.weight);
            //   if(isWeight!=true){
            //     measurement_data.weight =   user_data.weight;
            //   }else{
            //     measurement_data.weight =   de_cryptdata.weight;
            //   }
            // }
            // if(de_cryptdata.height==""){
            //   measurement_data.height =   de_cryptdata.height;
            // }else{
            //   let isHeight = inputValidation.isValid(de_cryptdata.height);
            //   if(isHeight!=true){
            //     measurement_data.height =   user_data.height;
            //   }else{
            //     measurement_data.height =   de_cryptdata.height;
            //   }
            // }
            // if(de_cryptdata.bodyFat==""){
            //   measurement_data.bodyFat =   de_cryptdata.bodyFat;
            // }else{
            //   let isBFat = inputValidation.isValid(de_cryptdata.bodyFat);
            //   if(isBFat!=true){
            //     measurement_data.bodyFat =   user_data.bodyFat;
            //   }else{
            //     measurement_data.bodyFat =   de_cryptdata.bodyFat;
            //   }
            // }
            // let isWaterWt = inputValidation.isValid(de_cryptdata.waterWeight);
            // if(isWaterWt!=true){
            //   measurement_data.waterWeight =   user_data.waterWeight;
            // }else{
            //   measurement_data.waterWeight =   de_cryptdata.waterWeight;
            // }
            // let isLBMass = inputValidation.isValid(de_cryptdata.leanBodyMass);
            // if(isLBMass!=true){
            //   measurement_data.leanBodyMass =   user_data.leanBodyMass;
            // }else{
            //   measurement_data.leanBodyMass =   de_cryptdata.leanBodyMass;
            // }
            // let isBDensity = inputValidation.isValid(de_cryptdata.boneDensity);
            // if(isBDensity!=true){
            //   measurement_data.boneDensity =   user_data.boneDensity;
            // }else{
            //   measurement_data.boneDensity =   de_cryptdata.boneDensity;
            // }
            // let isCBicep = inputValidation.isValid(de_cryptdata.caliperBicep);
            // if(isCBicep!=true){
            //   measurement_data.caliperBicep =   user_data.caliperBicep;
            // }else{
            //   measurement_data.caliperBicep =   de_cryptdata.caliperBicep;
            // }
            // let isTricep = inputValidation.isValid(de_cryptdata.triceps);
            // if(isTricep!=true){
            //   measurement_data.triceps =   user_data.triceps;
            // }else{
            //   measurement_data.triceps =   de_cryptdata.triceps;
            // }
            // let isSCapular = inputValidation.isValid(de_cryptdata.subscapular);
            // if(isSCapular!=true){
            //   measurement_data.subscapular =   user_data.subscapular;
            // }else{
            //   measurement_data.subscapular =   de_cryptdata.subscapular;
            // }
            // let isICrest = inputValidation.isValid(de_cryptdata.iliacCrest);
            // if(isICrest!=true){
            //   measurement_data.iliacCrest =   user_data.iliacCrest;
            // }else{
            //   measurement_data.iliacCrest =   de_cryptdata.iliacCrest;
            // }
            // let isNeck = inputValidation.isValid(de_cryptdata.neck);
            // if(isNeck!=true){
            //   measurement_data.neck =   user_data.neck;
            // }else{
            //   measurement_data.neck =   de_cryptdata.neck;
            // }
            // let isChest = inputValidation.isValid(de_cryptdata.chest);
            // if(isChest!=true){
            //   measurement_data.chest =   user_data.chest;
            // }else{
            //   measurement_data.chest =   de_cryptdata.chest;
            // }
            // let isCirBicep = inputValidation.isValid(de_cryptdata.circumferenceBicep);
            // if(isCirBicep!=true){
            //   measurement_data.circumferenceBicep =   user_data.circumferenceBicep;
            // }else{
            //   measurement_data.circumferenceBicep =   de_cryptdata.circumferenceBicep;
            // }
            // let isForearm = inputValidation.isValid(de_cryptdata.forearm);
            // if(isForearm!=true){
            //   measurement_data.forearm =   user_data.forearm;
            // }else{
            //   measurement_data.forearm =   de_cryptdata.forearm;
            // }
            // let isWaist = inputValidation.isValid(de_cryptdata.waist);
            // if(isWaist!=true){
            //   measurement_data.waist =   user_data.waist;
            // }else{
            //   measurement_data.waist =   de_cryptdata.waist;
            // }
            // let isHip = inputValidation.isValid(de_cryptdata.hip);
            // if(isHip!=true){
            //   measurement_data.hip =   user_data.hip;
            // }else{
            //   measurement_data.hip =   de_cryptdata.hip;
            // }
            // let isThigh = inputValidation.isValid(de_cryptdata.thigh);
            // if(isThigh!=true){
            //   measurement_data.thigh =   user_data.thigh;
            // }else{
            //   measurement_data.thigh =   de_cryptdata.thigh;
            // }
            // let isCalf = inputValidation.isValid(de_cryptdata.calf);
            // if(isCalf!=true){
            //   measurement_data.calf =   user_data.calf;
            // }else{
            //   measurement_data.calf =   de_cryptdata.calf;
            // }
            // let isCirSum = inputValidation.isValid(de_cryptdata.circumferencesSum);
            // if(isCirSum!=true){
            //   measurement_data.circumferencesSum =   user_data.circumferencesSum;
            // }else{
            //   measurement_data.circumferencesSum =   de_cryptdata.circumferencesSum;
            // }
            // measurement_data.activityLevel =   de_cryptdata.activityLevel || user_data.activityLevel;
            // measurement_data.weight =   de_cryptdata.weight || user_data.activityLevel;
            // measurement_data.height =   de_cryptdata.height || user_data.activityLevel;
            // measurement_data.bodyFat =   de_cryptdata.bodyFat || user_data.activityLevel;
            // measurement_data.waterWeight =   de_cryptdata.waterWeight || user_data.activityLevel;
            // measurement_data.leanBodyMass =   de_cryptdata.leanBodyMass || user_data.activityLevel;
            // measurement_data.boneDensity =   de_cryptdata.boneDensity || user_data.activityLevel;
            // measurement_data.caliperBicep =   de_cryptdata.caliperBicep || user_data.activityLevel;
            // measurement_data.triceps =   de_cryptdata.triceps || user_data.activityLevel;
            // measurement_data.subscapular =   de_cryptdata.subscapular || user_data.activityLevel;
            // measurement_data.iliacCrest =   de_cryptdata.iliacCrest || user_data.activityLevel;
            // measurement_data.neck =   de_cryptdata.neck || user_data.activityLevel;
            // measurement_data.chest =   de_cryptdata.chest || user_data.activityLevel;
            // measurement_data.circumferenceBicep =   de_cryptdata.circumferenceBicep || user_data.activityLevel;
            // measurement_data.forearm =   de_cryptdata.forearm || user_data.activityLevel;
            // measurement_data.waist =   de_cryptdata.waist || user_data.activityLevel;
            // measurement_data.hip =   de_cryptdata.hip || user_data.activityLevel;
            // measurement_data.thigh =   de_cryptdata.thigh || user_data.activityLevel;
            // measurement_data.calf =   de_cryptdata.calf || user_data.activityLevel;
            // measurement_data.circumferencesSum =   de_cryptdata.circumferencesSum || user_data.activityLevel;
            update_baseline(req, res, iv, measurement_data, de_cryptdata, userid);
          }
        }
      });
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



function insert_baseline(req, res, iv, measurement_data, userid){
    var query = connection_db.query('INSERT INTO member_measurement SET ?', measurement_data, function (error, results, fields) {
    if (error){
      // throw error;
      let response_data = status_codes.db_error_0001;
      console.log(response_data);
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }else{
      let response_data = status_codes.baseline_measure_added;
      console.log(response_data);
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }
  });
}


function update_baseline(req, res, iv, measurement_data, de_cryptdata, userid){


  let set_update_query = 'update member_measurement set';
  for(property in de_cryptdata ){
    // console.log(property);
    //  console.log(objectData[property]);
    set_update_query = set_update_query + ' '+ property + '="' + de_cryptdata[property] + '", ';
  }
  set_update_query = set_update_query + ' updatedAt="'+measurement_data.updatedAt+ '" ';
  let condition = ' where user="'+userid+'";';
  let update_status_query =  set_update_query + condition;

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  // let update_status_query = 'update member_measurement set activityLevel="'+measurement_data.activityLevel+
  // '", weight="'+measurement_data.weight+'", height="'+measurement_data.height+'", bodyFat="'+measurement_data.bodyFat+
  // '", waterWeight="'+measurement_data.waterWeight+'", leanBodyMass="'+measurement_data.leanBodyMass +'", boneDensity="'+
  // measurement_data.boneDensity+'", updatedAt="'+measurement_data.updatedAt+'", caliperBicep="'+measurement_data.caliperBicep+
  // '", triceps="'+ measurement_data.triceps+ '", subscapular="'+measurement_data.subscapular+'", iliacCrest="'+measurement_data.iliacCrest+
  // '", neck="'+ measurement_data.neck+ '", chest="'+measurement_data.chest+'", circumferenceBicep="'+measurement_data.circumferenceBicep+
  // '", forearm="'+ measurement_data.forearm+ '", waist="'+measurement_data.waist+'", hip="'+measurement_data.hip +
  // '", thigh="'+ measurement_data.thigh+'", calf="'+measurement_data.calf+'", circumferencesSum="'+measurement_data.circumferencesSum+
  // '" where user="'+userid+'";';
  // console.log(update_status_query);
  connection_db.query(update_status_query,function(err,user_mem_row){
    if(err){
      // throw err;
      // console.log(err);
      let response_data = status_codes.db_error_0001;
      // console.log(response_data);
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }else {
      let response_data = status_codes.baseline_measure_updated;
      // console.log(response_data);
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }
  });
}


function get_baseline_measurement_next (req, res, next, iv){
  let userid   = encrypt_decrypt.decode_base64(req.params.userid);
  let get_base_query = 'select * from member_measurement where user="'+userid+'";';
  connection_db.query(get_base_query,function(err,user_row){
    if(err){
      // throw err;
      let response_data = status_codes.db_error_0001;
      // console.log(response_data);
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }else {
      if(user_row.length<=0){
        // No Baseline Measurement Data
        let response_data = status_codes.no_baseline_measure;
        // console.log(response_data);
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
      }else{
        var user_data = user_row[0];
        // Send Baseline Measurement Data
        // console.log(user_data);
        let response_data = {}
        response_data = status_codes.baseline_measure_data;
        response_data.output = user_data;

        let responseOutput = nullKeyValidation.iosNullValidation(response_data.output);
        response_data.output = responseOutput;


        // console.log(response_data);
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
      }
    }
  });
}


function get_measure_info_next(req, res, next, iv){
  let userid   = encrypt_decrypt.decode_base64(req.params.userid);
  let id   = encrypt_decrypt.decode_base64(req.params.measurement_hist_id);
  let get_measure_query = 'select * from member_measurement_history where id = "'+id +'"' +
      'and user = "'+userid+'" and is_deleted = 0;';
  // console.log(get_measure_query);
  connection_db.query(get_measure_query,function(err,user_row){
    if(err){
      // throw err;
      let response_data = status_codes.db_error_0001;
      // console.log(response_data);
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }else {
      if(user_row.length<=0){
        // No Measurement data in Measurement History
        let response_data = status_codes.no_measure_history;
        console.log(response_data);
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
      }else{
        var user_data = user_row[0];
        // Send Measurement data from Measurement History
        // console.log(user_data);

        try{
          let measurementDateFormat = user_data.measurementDate;
          if(typeof (measurementDateFormat)!= 'undefined' && measurementDateFormat!=null
              && measurementDateFormat!="" && measurementDateFormat!=undefined ){
            // console.log(birth_date);
            measurementDateFormat = new Date(measurementDateFormat).toISOString();
            // console.log(birth_date+'toISOString');
            // console.log('date toISOString');
            // var time = '2012-11-04T14:51:06.157Z';
            // time = time.replace(/T/, ' ').      // replace T with a space
            //   replace(/\..+/, '')     // delete the dot and everything after

            measurementDateFormat = measurementDateFormat.replace(/T/, ' '). // replace T with a space
                                      replace(/\..+/, '')     // delete the dot and everything after


            user_data.measurementDate = measurementDateFormat;
          }
        }catch(ex){
          user_data.measurementDate = '';
        }
        finally{
          let response_data = {}

          response_data = status_codes.measure_history_data;
          response_data.output = user_data;

          let responseOutput = nullKeyValidation.iosNullValidation(response_data.output);
          response_data.output = responseOutput;

          // console.log(response_data);
          let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
          res.end(enc);
        }
      }
    }
  });
}


function add_measurement_next(req, res, next, iv){
  let userid   = encrypt_decrypt.decode_base64(req.params.userid);
  var get_string = req.rawBody || null;
  // console.log(get_string+" get_string");
  if(get_string!=null){
    try{
      var de_cryptdata = encrypt_decrypt.decrypt_new(cryptkey, get_string);
      de_cryptdata = JSON.parse(de_cryptdata);
      let measure_histData = {};
      let curr_date_time = inputValidation.currentDateTime();
      measure_histData = de_cryptdata;
      measure_histData.user =   userid;
      // measure_histData.measurementDate =  curr_date_time;
      let currDateStartTime;
      let currDateEndTime, measurementDate ;
      let isMDate = inputValidation.isValid(de_cryptdata.measurementDate);
      if(isMDate!=true){
        measure_histData.measurementDate =   curr_date_time;
        currDateStartTime = inputValidation.currDateStartTime();
        currDateEndTime = inputValidation.currDateEndTime();
      }else{
        measurementDate = measure_histData.measurementDate;
        // console.log(measurementDate);
        // console.log('I am at else');
        // currDateStartTime = inputValidation.defaultStartTime(measurementDate);
        // currDateEndTime = inputValidation.defaultEndTime(measurementDate);
        // console.log(currDateStartTime + ' currDateStartTime');
        // console.log(currDateEndTime + ' currDateEndTime');
        }

      // console.log(req.query.createdDateTime+" req.query.createdDateTime");
      let createdDateTimeOnly = req.query.createdDateTime || '';
      let isMDateTime = inputValidation.isValid(createdDateTimeOnly);
      if(isMDateTime!=true){
          // don't change old value of old app users
      }else{
        measure_histData.measurementDate = createdDateTimeOnly;
      }







      measure_histData.updatedAt =  curr_date_time; // Only in Measurememnt History

      // console.log(measure_histData);
      let get_meas_hist_query = 'select * from member_measurement_history where user = "'+ userid +
      '" and is_deleted = 0 and measurementDate like "%'+ measurementDate + '%";';
      // '" and is_deleted = 0 having measurementDate between "'+ currDateStartTime + '" and "' +
      // currDateEndTime + '";';
      // console.log(get_meas_hist_query);
      connection_db.query(get_meas_hist_query,function(err,user_row){
        if(err){
          // throw err;
          let response_data = status_codes.db_error_0001;
          let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
          res.end(enc);
        }else {
          if(user_row.length<=0){
              var query = connection_db.query('INSERT INTO member_measurement_history SET ?', measure_histData, function (error, results, fields) {
              if (error){
                // throw error;
                let response_data = status_codes.db_error_0001;
                // console.log(response_data);
                let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                res.end(enc);
              }else{
                let response_data = status_codes.measure_history_added;
                // console.log(response_data);
                let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                res.end(enc);
              }
            });
          }else{
            var user_data = user_row[0];
            // Update Data and Save
            // console.log(user_data);
            let id = user_data.id
            update_measurementHistory(req, res, iv, userid, id, user_data, de_cryptdata);
          }
        }
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


function update_measurement_next(req, res, next, iv){
  let userid   = encrypt_decrypt.decode_base64(req.params.userid);
  let id   = encrypt_decrypt.decode_base64(req.params.measurement_hist_id);
  var get_string = req.rawBody || null;
  //  console.log(get_string+" get_string");
  if(get_string!=null){
    try{
      var de_cryptdata = encrypt_decrypt.decrypt_new(cryptkey, get_string);
      de_cryptdata = JSON.parse(de_cryptdata);
      let get_meas_hist_query = 'select * from member_measurement_history where user = "'+userid +
        '" and id = "'+id+'" and is_deleted = 0;';
      // console.log(get_meas_hist_query);
      connection_db.query(get_meas_hist_query,function(err,user_row){
        if(err){
          // throw err;
          let response_data = status_codes.db_error_0001;
          let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
          res.end(enc);
        }else {
          if(user_row.length<=0){
            // No_measure_history for that id
            let response_data = status_codes.no_measure_history;
            // console.log(response_data);
            let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
            res.end(enc);
          }else{
            var user_data = user_row[0];
            // Update Data and Save
            // console.log(user_data);
            update_measurementHistory(req, res, iv, userid, id, user_data, de_cryptdata);
          }
        }
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


function update_measurementHistory(req, res, iv, userid, id, user_data, de_cryptdata){
    let measure_histData = {};
    let curr_date_time = inputValidation.currentDateTime();
    // console.log('de_cryptdata update');
    // console.log(de_cryptdata);
    // measure_histData = de_cryptdata;
    measure_histData.user =   userid;
    measure_histData.updatedAt =  curr_date_time; // Only in Measurememnt History
    let isActivity = inputValidation.isValid(de_cryptdata.activityLevel);
    if(isActivity!=true){
      measure_histData.activityLevel =   user_data.activityLevel;
    }else{
      measure_histData.activityLevel =   de_cryptdata.activityLevel;
    }
    let isWeight = inputValidation.isValid(de_cryptdata.weight);
    if(isWeight!=true){
      measure_histData.weight =   user_data.weight;
    }else{
      measure_histData.weight =   de_cryptdata.weight;
    }
    let isHeight = inputValidation.isValid(de_cryptdata.height);
    if(isHeight!=true){
      measure_histData.height =   user_data.height;
    }else{
      measure_histData.height =   de_cryptdata.height;
    }
    let isBFat = inputValidation.isValid(de_cryptdata.bodyFat);
    if(isBFat!=true){
      measure_histData.bodyFat =   user_data.bodyFat;
    }else{
      measure_histData.bodyFat =   de_cryptdata.bodyFat;
    }
    let isWaterWt = inputValidation.isValid(de_cryptdata.waterWeight);
    if(isWaterWt!=true){
      measure_histData.waterWeight =   user_data.waterWeight;
    }else{
      measure_histData.waterWeight =   de_cryptdata.waterWeight;
    }
    let isLBMass = inputValidation.isValid(de_cryptdata.leanBodyMass);
    if(isLBMass!=true){
      measure_histData.leanBodyMass =   user_data.leanBodyMass;
    }else{
      measure_histData.leanBodyMass =   de_cryptdata.leanBodyMass;
    }
    let isBDensity = inputValidation.isValid(de_cryptdata.boneDensity);
    if(isBDensity!=true){
      measure_histData.boneDensity =   user_data.boneDensity;
    }else{
      measure_histData.boneDensity =   de_cryptdata.boneDensity;
    }
    let isCBicep = inputValidation.isValid(de_cryptdata.caliperBicep);
    if(isCBicep!=true){
      measure_histData.caliperBicep =   user_data.caliperBicep;
    }else{
      measure_histData.caliperBicep =   de_cryptdata.caliperBicep;
    }
    let isTricep = inputValidation.isValid(de_cryptdata.triceps);
    if(isTricep!=true){
      measure_histData.triceps =   user_data.triceps;
    }else{
      measure_histData.triceps =   de_cryptdata.triceps;
    }
    let isSCapular = inputValidation.isValid(de_cryptdata.subscapular);
    if(isSCapular!=true){
      measure_histData.subscapular =   user_data.subscapular;
    }else{
      measure_histData.subscapular =   de_cryptdata.subscapular;
    }
    let isICrest = inputValidation.isValid(de_cryptdata.iliacCrest);
    if(isICrest!=true){
      measure_histData.iliacCrest =   user_data.iliacCrest;
    }else{
      measure_histData.iliacCrest =   de_cryptdata.iliacCrest;
    }
    let isNeck = inputValidation.isValid(de_cryptdata.neck);
    if(isNeck!=true){
      measure_histData.neck =   user_data.neck;
    }else{
      measure_histData.neck =   de_cryptdata.neck;
    }
    let isChest = inputValidation.isValid(de_cryptdata.chest);
    if(isChest!=true){
      measure_histData.chest =   user_data.chest;
    }else{
      measure_histData.chest =   de_cryptdata.chest;
    }
    let isCirBicep = inputValidation.isValid(de_cryptdata.circumferenceBicep);
    if(isCirBicep!=true){
      measure_histData.circumferenceBicep =   user_data.circumferenceBicep;
    }else{
      measure_histData.circumferenceBicep =   de_cryptdata.circumferenceBicep;
    }
    let isForearm = inputValidation.isValid(de_cryptdata.forearm);
    if(isForearm!=true){
      measure_histData.forearm =   user_data.forearm;
    }else{
      measure_histData.forearm =   de_cryptdata.forearm;
    }
    let isWaist = inputValidation.isValid(de_cryptdata.waist);
    if(isWaist!=true){
      measure_histData.waist =   user_data.waist;
    }else{
      measure_histData.waist =   de_cryptdata.waist;
    }
    let isHip = inputValidation.isValid(de_cryptdata.hip);
    if(isHip!=true){
      measure_histData.hip =   user_data.hip;
    }else{
      measure_histData.hip =   de_cryptdata.hip;
    }
    let isThigh = inputValidation.isValid(de_cryptdata.thigh);
    if(isThigh!=true){
      measure_histData.thigh =   user_data.thigh;
    }else{
      measure_histData.thigh =   de_cryptdata.thigh;
    }
    let isCalf = inputValidation.isValid(de_cryptdata.calf);
    if(isCalf!=true){
      measure_histData.calf =   user_data.calf;
    }else{
      measure_histData.calf =   de_cryptdata.calf;
    }
    let isCirSum = inputValidation.isValid(de_cryptdata.circumferencesSum);
    if(isCirSum!=true){
      measure_histData.circumferencesSum =   user_data.circumferencesSum;
    }else{
      measure_histData.circumferencesSum =   de_cryptdata.circumferencesSum;
    }
    let isPhotoId = inputValidation.isValid(de_cryptdata.photoId); // Only in Measurememnt History
    if(isPhotoId!=true){
      measure_histData.photoId =   user_data.photoId;
    }else{
      measure_histData.photoId =   de_cryptdata.photoId;
    }
    // console.log(de_cryptdata.photoId + 'de_cryptdata.photoId');
    if(de_cryptdata.photoId==""){
      measure_histData.photoId = "";
    }
    // console.log(measure_histData);
    let update_status_query = 'update member_measurement_history set activityLevel="'+measure_histData.activityLevel+
    '", weight="'+measure_histData.weight+'", height="'+measure_histData.height+'", bodyFat="'+measure_histData.bodyFat+
    '", waterWeight="'+measure_histData.waterWeight+'", leanBodyMass="'+measure_histData.leanBodyMass +'", boneDensity="'+
    measure_histData.boneDensity+'", photoId="'+measure_histData.photoId+'", caliperBicep="'+measure_histData.caliperBicep+
    '", triceps="'+ measure_histData.triceps+ '", subscapular="'+measure_histData.subscapular+'", iliacCrest="'+measure_histData.iliacCrest+
    '", neck="'+ measure_histData.neck+ '", chest="'+measure_histData.chest+'", circumferenceBicep="'+measure_histData.circumferenceBicep+
    '", forearm="'+ measure_histData.forearm+ '", waist="'+measure_histData.waist+'", hip="'+measure_histData.hip +
    '", thigh="'+ measure_histData.thigh+'", calf="'+measure_histData.calf+'", circumferencesSum="'+measure_histData.circumferencesSum+
    '" , updatedAt="'+ measure_histData.updatedAt+'" where user="'+ userid + '" and id="'+id+'";';
    // console.log(update_status_query);
    connection_db.query(update_status_query, function(err, user_mem_row){
    if (err){
      // throw error;
      let response_data = status_codes.db_error_0001;
      // console.log(response_data);
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }else{
      let response_data = status_codes.measure_history_updated;
      // console.log(response_data);
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }
    });
}


function del_measurement_next(req, res, next, iv){
  let userid   = encrypt_decrypt.decode_base64(req.params.userid);
  let id   = encrypt_decrypt.decode_base64(req.params.measurement_hist_id);
  let get_meas_hist_query = 'select * from member_measurement_history where user = "'+userid +
    '" and id = "'+id+'" and is_deleted = 0;';
  // console.log(get_meas_hist_query);
  connection_db.query(get_meas_hist_query,function(err,user_row){
    if(err){
      // throw err;
      let response_data = status_codes.db_error_0001;
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }else {
      if(user_row.length<=0){
        // No_measure_history for that id
        let response_data = status_codes.no_measure_history;
        // console.log(response_data);
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
      }else{
        var del_status_query = 'update member_measurement_history SET is_deleted= 1 where user= '+userid +' and id='+id;
        // console.log(del_status_query);
          connection_db.query(del_status_query,function(err,user_mem_row){
            if(err){
              // throw err;
              let response_data = status_codes.db_error_0001;
              // console.log(response_data);
              let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
              res.end(enc);
            }else {
              let response_data = status_codes.measure_history_deleted;
              // console.log(response_data);
              let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
              res.end(enc);
            }
          });
        }
      }
    });
}


function latest_measurement_next (req, res, next, iv){
  let userid   = encrypt_decrypt.decode_base64(req.params.userid);
  let get_latest_query = "select * from member_measurement_history where user='"+userid+"' and is_deleted=0 order by measurementDate desc;";
  // console.log(get_latest_query);
  connection_db.query(get_latest_query,function(err,user_row){
    if(err){
      // throw err;
      let response_data = status_codes.db_error_0001;
      // console.log(response_data);
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }else {
      if(user_row.length<=0){
        // No Measurement History Data so sending baseline info for that user;
        get_baseline_measurement_next(req, res, next, iv);
      }else{
        var user_data = user_row[0];
        // Send Latest Measurement History Data
        let response_data = {}
        response_data = status_codes.latest_measure_data;
        response_data.output = user_data;

        let responseOutput = nullKeyValidation.iosNullValidation(response_data.output);
        response_data.output = responseOutput;
        // console.log(response_data);
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
      }
    }
  });
}


module.exports = measurement;
