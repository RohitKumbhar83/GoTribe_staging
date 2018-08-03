var crypto = require('crypto');
var dataBaseUtil = require("./mysql_data.js");
var emailUtil = require("./emailUtil.js");
var config = require('./config.json');
var status_codes = require('.././status_codes/status_codes.json');
var encrypt_decrypt = require('.././encrypt_decrypt/encryption-decryption.js');
var inputValidation = require('.././validation/input-validation.js');
var dateFormat = require('.././validation/sql-date-format.js');
var nullKeyValidation = require('.././validation/null-key-validation.js');

var connection_db = dataBaseUtil;

var cryptkey = encrypt_decrypt.generate_crypt_key();

var workout = {

    // User Workout Details
    get_workout_info: function(req, res, next){
      // console.log('get');
      let isUserId = inputValidation.isValid(req.params.userid);
      let iv = encrypt_decrypt.generate_randomIV();
      if(isUserId!=true){
        let response_data = status_codes.userId_not_found;
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
      }
      else{
        let queryData = req.query||null;
        let isQuery = inputValidation.isValid(queryData);
        if(isQuery!=true){
          let response_data = status_codes.query_string_missing;
          let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
          res.end(enc);
        }
        else{
            get_workout_info_next(req, res, next, iv);
        }
        // let isWorkoutId = inputValidation.isValid(req.params.workout_id);
        // if(isWorkoutId!=true){
        //   let response_data = status_codes.userWorkoutId_not_found;
        //   let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        //   res.end(enc);
        // }else{
        //     get_workout_info_next(req, res, next, iv);
        // }
      }
    },

    add_workout: function(req, res, next){
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
                add_workout_next(req, res, next, iv);
            });
        }
    },

    update_workout: function(req, res, next){
      let isUserId = inputValidation.isValid(req.params.userid);
      let iv = encrypt_decrypt.generate_randomIV();
      if(isUserId!=true){
        let response_data = status_codes.userId_not_found;
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
      }
      else{
        let isWorkoutId = inputValidation.isValid(req.params.workout_id);
        if(isWorkoutId!=true){
          let response_data = status_codes.userWorkoutId_not_found;
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
                update_workout_next(req, res, next, iv);
            });
        }
      }
    },

    delete_workout: function(req, res, next){
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
        let isWorkoutId = inputValidation.isValid(req.params.workout_id);
        if(isWorkoutId!=true){
          let response_data = status_codes.userWorkoutId_not_found;
          let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
          res.end(enc);
        }else{
              delete_workout_next(req, res, next, iv);
        }
      }
    }

} // End of workout object


function get_workout_info_next(req, res, next, iv){
  let userid   = encrypt_decrypt.decode_base64(req.params.userid);
  let queryData = req.query, query_string;
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
          // console.log('try '+query_string);
        var de_cryptdata = encrypt_decrypt.decrypt_new(cryptkey, query_string);
        // console.log(de_cryptdata)
        de_cryptdata = JSON.parse(de_cryptdata);
        // console.log(de_cryptdata);
        //  console.log(de_cryptdata+' de_cryptdata Object');
        var workout_Date = de_cryptdata.workout_Date;
        let isWorkoutDate = inputValidation.isValid(de_cryptdata.workout_Date);
        if(isWorkoutDate!=true){
          let response_data = status_codes.workoutDate_not_found;
          // console.log(response_data);
          let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
          res.end(enc);
        }else{
          let isValidDate = inputValidation.isValid(workout_Date);
          if(isValidDate!=true){
            let response_data = status_codes.date_not_valid;
            // console.log(response_data);
            let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
            res.end(enc);
          }else{
              let oneDayBefore, oneDayAfter
              try{
                oneDayBefore = inputValidation.addDaysToDate(workout_Date,-1);
                oneDayAfter = inputValidation.addDaysToDate(workout_Date,1);
                oneDayBefore = dateFormat.birthdayCheck(oneDayBefore);
                oneDayAfter = dateFormat.birthdayCheck(oneDayAfter);
              }catch(ex){

              }

            // let workoutStartTime = inputValidation.defaultStartTime(workout_Date);
            // let workoutEndTime = inputValidation.defaultEndTime(workout_Date);
            //let id   = encrypt_decrypt.decode_base64(req.params.workout_id); validateDate
            // let get_workout_query = "select * from gym_user_workout where id = "+id +" and user = "+userid+" and is_deleted = 0;";
            let get_workout_query = 'select w.id,  w.user, w.id, w.duration, w.zonesDuration, w.averageHr , w.maxHr,'+
            ' w.averageMaxHr, w.calorie, w.points, w.status, SUBSTRING_INDEX(w.finishedAt, "T",-1 )  as finishedAt,'+
            ' SUBSTRING_INDEX(w.createdAt, "T",-1 )  as createdAt, w.is_deleted from gym_user_workout as w where w.user = "'+ userid +
            ' " and w.is_deleted = 0 '+
            ' AND w.createdAt >= "'+ oneDayBefore +'" AND w.createdAt <= "'+ oneDayAfter+  '"';
            // ' and w.createdAt like"%'+ workout_Date + '%" order by w.createdAt desc;';
            // ' and w.createdAt between"'+ workoutStartTime + '" and "'+ workoutEndTime + '";';
            // console.log(get_workout_query);
            connection_db.query(get_workout_query,function(err,user_row){
              if(err){
                // throw err;
                let response_data = status_codes.db_error_0001;
                // console.log(response_data);
                let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                res.end(enc);
              }else {
                if(user_row.length<=0){
                  // No User Workout data in gym_user_workout
                  let response_data = status_codes.no_user_workout_date;
                  // console.log(response_data);
                  let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                  res.end(enc);
                }else{
                  // var user_data = user_row[0];
                  var user_data = user_row;
                  // Send User Workout data from gym_user_workout
                  // console.log(user_data);
                  let response_data = {};
                  response_data.output = {};
                  response_data = status_codes.user_workout_data;
                  for(var i=0;i<user_data.length;i++){
                    let responseOutput = nullKeyValidation.iosNullValidation(user_data[i]);
                    user_data[i] = responseOutput;
                  }
                  try{
                    user_data.sort(function(a, b) {
                         return (new Date(b.createdAt)) - (new Date(a.createdAt));
                    });
                  }catch(ex){
                    user_data = [];
                  }finally{
                    response_data.output = user_data;
                    // console.log(response_data);
                    let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                    res.end(enc);
                  }
                }
              }
            }); // select query ends
          }
        }
      }
      catch(e){
      let response_data = status_codes.wrong_string;
      // console.log(response_data);
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
      }
}


function add_workout_next(req, res, next, iv){
  let userid   = encrypt_decrypt.decode_base64(req.params.userid);
  var get_string = req.rawBody || null;
  // console.log(get_string+" get_string");
  if(get_string!=null){
    try{
      var de_cryptdata = encrypt_decrypt.decrypt_new(cryptkey, get_string);
      de_cryptdata = JSON.parse(de_cryptdata);
      let workoutData = {};
      let curr_date_time = inputValidation.currentDateTime();
      workoutData = de_cryptdata;
      workoutData.user =   userid;
      workoutData.createdAt =  curr_date_time;
      // workoutData.averageHr = workoutData.averageHr || 0;
      // console.log(workoutData);
      var query = connection_db.query('INSERT INTO gym_user_workout SET ?', workoutData, function (error, results, fields) {
      if (error){
        // throw error;
        // console.log(error);
        let response_data = status_codes.db_error_0001;
        // console.log(response_data);
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
      }else{
          let isMHr = inputValidation.isValid(de_cryptdata.maxHr);
          if(isMHr!=true){
            // do nothing
            let response_data = status_codes.user_workout_added;
            // console.log(response_data);
            let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
            res.end(enc);
          }else{
            let  update_maxHr_query = 'update gym_member set maxHeartRate="'+workoutData.maxHr+'" where id ="'+userid+'"';
            // console.log(update_maxHr_query);
            connection_db.query(update_maxHr_query, function(err, user_mem_row){
              if (err){
                // throw error;
                let response_data = status_codes.db_error_0001;
                response_data.error_msg = "Workout added but maxHR not updated";
                // console.log(response_data);
                let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                res.end(enc);
              }else{
                let response_data = status_codes.user_workout_added;
                // console.log(response_data);
                let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                res.end(enc);
              }
            });
          } // end of inner else of update maxHr query
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


function update_workout_next(req, res, next, iv){
  let userid   = encrypt_decrypt.decode_base64(req.params.userid);
  let id   = encrypt_decrypt.decode_base64(req.params.workout_id);
  var get_string = req.rawBody || null;
  //  console.log(get_string+" get_string");
  if(get_string!=null){
    try{
      var de_cryptdata = encrypt_decrypt.decrypt_new(cryptkey, get_string);
      de_cryptdata = JSON.parse(de_cryptdata);
      let get_user_workout_query = "select * from gym_user_workout where user = "+userid +" and id = "+id+" and is_deleted = 0;";
      // console.log(get_user_workout_query);
      connection_db.query(get_user_workout_query,function(err,user_row){
        if(err){
          // throw err;
          let response_data = status_codes.db_error_0001;
          let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
          res.end(enc);
        }else {
          if(user_row.length<=0){
            // No User Workout for that id
            let response_data = status_codes.no_user_workout;
            // console.log(response_data);
            let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
            res.end(enc);
          }else{
            var user_data = user_row[0];
            // Update Data and Save
            // console.log(user_data);
            let workoutData = {};
            let curr_date_time = inputValidation.currentDateTime();
            workoutData = de_cryptdata;
            workoutData.user =   userid;
            let isDuration = inputValidation.isValid(de_cryptdata.duration);
            if(isDuration!=true){
              workoutData.duration =   user_data.duration;
            }else{
              workoutData.duration =   de_cryptdata.duration;
            }
            let isZoneDuration = inputValidation.isValid(de_cryptdata.zonesDuration);
            if(isZoneDuration!=true){
              workoutData.zonesDuration =   user_data.zonesDuration;
            }else{
              workoutData.zonesDuration =   de_cryptdata.zonesDuration;
            }
            let isAvgHr = inputValidation.isValid(de_cryptdata.averageHr);
            if(isAvgHr!=true){
              workoutData.averageHr =   user_data.averageHr;
            }else{
              workoutData.averageHr =   de_cryptdata.averageHr;
            }
            let isMHr = inputValidation.isValid(de_cryptdata.maxHr);
            if(isMHr!=true){
              workoutData.maxHr =   user_data.maxHr;
            }else{
              workoutData.maxHr =   de_cryptdata.maxHr;
            }
            let isAvgMHr = inputValidation.isValid(de_cryptdata.averageMaxHr);
            if(isAvgMHr!=true){
              workoutData.averageMaxHr =   user_data.averageMaxHr;
            }else{
              workoutData.averageMaxHr =   de_cryptdata.averageMaxHr;
            }
            let isCalorie = inputValidation.isValid(de_cryptdata.calorie);
            if(isCalorie!=true){
              workoutData.calorie =   user_data.calorie;
            }else{
              workoutData.calorie =   de_cryptdata.calorie;
            }
            let isPoints = inputValidation.isValid(de_cryptdata.points);
            if(isPoints!=true){
              workoutData.points =   user_data.points;
            }else{
              workoutData.points =   de_cryptdata.points;
            }
            let isStatus = inputValidation.isValid(de_cryptdata.status);
            if(isStatus!=true){
              workoutData.status =   user_data.status;
            }else{
              workoutData.status =   de_cryptdata.status;
            }
            let isFinished = inputValidation.isValid(de_cryptdata.finishedAt);
            if(isFinished!=true){
              workoutData.finishedAt =   user_data.finishedAt;
            }else{
              workoutData.finishedAt =   de_cryptdata.finishedAt;
            }
            // console.log(workoutData);
            let update_status_query = 'update gym_user_workout set duration="'+workoutData.duration+
            '", zonesDuration="'+workoutData.zonesDuration+'", averageHr="'+workoutData.averageHr+'", maxHr="'+workoutData.maxHr+
            '", averageMaxHr="'+workoutData.averageMaxHr+'", calorie="'+workoutData.calorie +'", points="'+
            workoutData.points+'", status="'+workoutData.status+'", finishedAt="'+workoutData.finishedAt+
            '" where user='+ userid + ' and id='+id+';';
            // console.log(update_status_query);
            connection_db.query(update_status_query, function(err, user_mem_row){
            if (err){
              // throw error;
              let response_data = status_codes.db_error_0001;
              // console.log(response_data);
              let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
              res.end(enc);
            }else{
              let response_data = status_codes.user_workout_updated;
              // console.log(response_data);
              let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
              res.end(enc);
            }
          });
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

function delete_workout_next(req, res, next, iv){
  let userid   = encrypt_decrypt.decode_base64(req.params.userid);
  let id   = encrypt_decrypt.decode_base64(req.params.workout_id);
  let get_user_workout_query = "select * from gym_user_workout where user = "+userid +" and id = "+id+" and is_deleted = 0;";
  // console.log(get_user_workout_query);
  connection_db.query(get_user_workout_query,function(err,user_row){
    if(err){
      // throw err;
      let response_data = status_codes.db_error_0001;
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }else {
      if(user_row.length<=0){
        // No User Workout for that id
        let response_data = status_codes.no_user_workout;
        // console.log(response_data);
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
      }
      else{
        var del_status_query = 'update gym_user_workout SET is_deleted= 1 where user= '+userid +' and id='+id+';';
        // console.log(del_status_query);
          connection_db.query(del_status_query,function(err,user_mem_row){
            if(err){
              // throw err;
              let response_data = status_codes.db_error_0001;
              // console.log(response_data);
              let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
              res.end(enc);
            }else {
              let response_data = status_codes.user_workout_deleted;
              // console.log(response_data);
              let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
              res.end(enc);
            }
          });
      }
    }
  });
}


module.exports = workout;
