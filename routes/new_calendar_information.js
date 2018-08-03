var crypto = require('crypto');
var dataBaseUtil = require("./mysql_data.js");
var emailUtil = require("./emailUtil.js");
var config = require('./config.json');
var status_codes = require('.././status_codes/status_codes.json');
var encrypt_decrypt = require('.././encrypt_decrypt/encryption-decryption.js');
var inputValidation = require('.././validation/input-validation.js')

var connection_db = dataBaseUtil;

var cryptkey = encrypt_decrypt.generate_crypt_key();

var calendar = {

  calendar_info: function(req, res, next){

    let isUserId = inputValidation.isValid(req.params.userid);
    let iv = encrypt_decrypt.generate_randomIV();
    if(isUserId!=true){
      let response_data = status_codes.userId_not_found;
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }
    else{
        calendar_info_next(req, res, next, iv);
    }

    // try{
    //         // console.log(req.params.userid);
    //         let isUserId = inputValidation.isValid(req.params.userid);
    //         let iv = encrypt_decrypt.generate_randomIV();
    //         if(isUserId!=true){
    //           let response_data = status_codes.userId_not_found;
    //           let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
    //           res.end(enc);
    //         }else{
    //         let QueryValues = {};
    //         QueryValues = req.query;
    //         QueryValuesCheck = [QueryValues.start,QueryValues.end,QueryValues.timeZone];
    //         let isValidData = inputValidation.validateAllRequiredFields(QueryValuesCheck);
    //         if(isValidData!=true){
    //           let response_data = status_codes.get_params_missing;
    //           let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
    //           res.end(enc);
    //         }else{
    //           let start_time = add_timezone_in_time(QueryValues.start,QueryValues.timeZone);
    //           console.log(start_time+' start_time');
    //           let end_time = add_timezone_in_time(QueryValues.end,QueryValues.timeZone);
    //           console.log(end_time+' end time');
    //           let calendar_info_query = "select * from gym_member where id=1";
    //           connection_db.query(calendar_info_query,function(err,user_calendar){
    //             if(err){
    //               // throw err;
    //               let response_data = status_codes.db_error_0001;
    //               let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
    //               res.end(enc);
    //             }else {
    //               let response_data = status_codes.user_cal_info;
    //               let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
    //               res.end(enc);
    //             }
    //           });
    //         }
    //       }
    // }catch(e){
    //   let response_data = status_codes.error_occur;
    //   let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
    //   res.end(enc);
    // }

  },

  workout_info: function(req, res, next){

    try{
      // console.log(req.params.userid);
      let isUserId = inputValidation.isValid(req.params.userid);
      let iv = encrypt_decrypt.generate_randomIV();
      if(isUserId!=true){
        let response_data = status_codes.userId_not_found;
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
      }else{
        let workout_info_query = "select * from gym_member where id=1";
        connection_db.query(workout_info_query,function(err,user_calendar){
          if(err){
            // throw err;
            let response_data = status_codes.db_error_0001;
            let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
            res.end(enc);
          }
          else{
            let response_data = status_codes.workout_info_from_cal;
            let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
            res.end(enc);
          }
        });
      }
    }catch(e){
      let response_data = status_codes.error_occur;
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }
  }






} // End of calendar object


// function isValid (isFound){
//     var isValue = true;
//     if(isFound==null || isFound=="" || isFound ==undefined){
//       isValue = false;
//     }
//     return isValue;
// }
//
//
// function validateAllRequiredFields(inputToValidate) {
//   var result = true;
//   for(var i=0;i<inputToValidate.length;i++){
//       result=isValid(inputToValidate[i]);
//       if(result==false){
//         return result;
//       }
//   }
//   return result;
// }


function calendar_info_next(req, res, next, iv){
    // console.log(req.query);
    let userid   = encrypt_decrypt.decode_base64(req.params.userid);
    // console.log(userid);
    let user_params = req.query||null;
    // console.log(req.query);
    // console.log(req.originalUrl);
    let queryData = req.query||null;
    var query_string;
    let isQuery = inputValidation.isValid(queryData);
    if(isQuery!=true){
      let response_data = status_codes.query_string_missing;
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
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
          // console.log(de_cryptdata+' de_cryptdata Object');
          var start_date = de_cryptdata.start;
          var end_date = de_cryptdata.end;
          let workoutPromise = new Promise((resolve, reject) => {
            // We call resolve(...) when what we were doing async succeeded, and reject(...) when it failed.
            // In this example, we use setTimeout(...) to simulate async code.
            // In reality, you will probably be using something like XHR or an HTML5 API.
            workout_data(req, res, iv, userid, start_date, end_date, function(cb_get_workouts){
                // console.log(cb_get_workouts);
                // console.log("cb_get_workouts callback");
                resolve(cb_get_workouts);
            }); // Yay! Everything went well!

          });

          var goalPromise = new Promise((resolve, reject) => {
            goal_data(req, res, iv, userid, start_date, end_date, function(cb_goals){
                // console.log(cb_goals);
                // console.log("cb_goals callback");
                resolve(cb_goals);
            }); // Yay! Everything went well!
          });
          var measurement_Hist_Promise = new Promise((resolve, reject) => {
              measurement_hist_data(req, res, iv, userid, start_date, end_date, function(cb_histories){
                // console.log(cb_histories);
                // console.log("cb_histories callback");
                resolve(cb_histories);
            }); // Yay! Everything went well!
          });
          var nutrition_Promise = new Promise((resolve, reject) => {
              nutrition_data(req, res, iv, userid, start_date, end_date, function(cb_nutrition){
                // console.log(cb_nutrition);
                // console.log("cb_nutrition callback");
                resolve(cb_nutrition);
            }); // Yay! Everything went well!
          });
          Promise.all([workoutPromise, goalPromise, measurement_Hist_Promise,nutrition_Promise]).then(function(parsedData) {
              // data here
              //   console.log(parsedData[0]);
              // console.log('parsedData');
              //   console.log(parsedData[1]);
              // console.log('parsedData');
              //   console.log(parsedData[2]);
              // console.log('parsedData');
              //   console.log(parsedData[3]);
              // console.log('parsedData');
              var myData = makeJSONArray(parsedData[0], parsedData[2], parsedData[3]);
              // console.log(myData);
              // console.log('myData');
              let response_data = {};
              response_data =  status_codes.user_cal_info;
              response_data.measure_workout = myData; // Workout and Measurement History Data
              response_data.goals_data = parsedData[1]; // Goal Data
              // console.log(response_data);
              // console.log(response_data+'ivr');
              let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
              // console.log(enc+'');
              res.end(enc);
          },
           reason => {
            // console.log(reason);
              let response_data = status_codes.db_error_0001;
              // console.log(response_data);
              let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
              res.end(enc);
          });

          // Promise.catch(function(e) {
          //   console.log(e); // This is never called
          //   console.log("// This is never called\b"); // This is never called
          // });
        }catch(e){
        let response_data = status_codes.wrong_string;
        // console.log(response_data);
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
        }
      }
  }




  function workout_data (req, res, iv, userid, start_date, end_date,callback){
    // SUBSTRING_INDEX(workout.createdAt, "T",-1 )
      var workout_query = 'SELECT workout.id as workout_id, SUBSTRING_INDEX(workout.createdAt, "T",-1 ) as workout_Date'+
        ', SUBSTRING_INDEX(workout.createdAt, "T",-1 ) as wDate'+
        ' FROM gym_user_workout as workout where workout.createdAt'+
        ' BETWEEN "'+start_date +'" and "'+end_date+'" and workout.user="'+userid+'" and workout.is_deleted=0;';
      // console.log(workout_query);
      connection_db.query(workout_query, function(err, user_row){
        if (err){
          // throw error;
          let response_data = status_codes.db_error_0001;
          // console.log(response_data);
          let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
          res.end(enc);
        }else{
          let send_workout_data = [];
          if(user_row.length<=0){
            // Send Empty data to function
          }else{
            // Send data to function
             send_workout_data = user_row;
            for(let i=0;i<send_workout_data.length;i++){
              let workoutDate = (send_workout_data[i].workout_Date);
              if(workoutDate!=undefined && workoutDate!=null && workoutDate!=""){
                //workoutDate = workoutDate.toString();
                if(workoutDate!=undefined && workoutDate.indexOf(' ')!=-1){
                   let str = (workoutDate).split(' ');
                    //  console.log(str);
                   send_workout_data[i].workout_Date = (str[0]);
                }
              }
            }
            // console.log(send_workout_data);
          }
          return callback(send_workout_data);
        }
      });

  }

  function goal_data (req, res, iv, userid, start_date, end_date, callback){

      var goal_query = 'SELECT goal.id as goal_id, SUBSTRING_INDEX(goal.startDate, "T",-1 ) as goal_Date'+
      ',  SUBSTRING_INDEX(goal.endDate, "T",-1 ) as goal_endDate, goal.status as status, goal.target as target'+
      ', SUBSTRING_INDEX(goal.startDate, "T",-1 ) as gDate'+
      ', goal.initValues as initValues FROM gym_member_goal as goal where goal.startDate'+
      ' BETWEEN "'+start_date +'" and "'+end_date+'" and goal.user=" '+userid+'" and (goal.status="active"'+
      // ' or goal.status="succeed") and goal.is_deleted=0;';
      ') and goal.is_deleted=0 order by goal.startDate desc;';
      // console.log(goal_query);
      connection_db.query(goal_query, function(err, user_row){
        if (err){
          // throw error;
          let response_data = status_codes.db_error_0001;
          // console.log(response_data);
          let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
          res.end(enc);
        }else{
          let send_goal_data = new Array();
          if(user_row.length<=0){
            // Send Empty data to function
          }else{
            // Send data to function
            // var send_goal_data = user_row;
            send_goal_data = new Array();
            for(let i=0;i<user_row.length;i++){
              let goalDate = (user_row[i].goal_Date);
              let goalendDate = (user_row[i].goal_endDate);
              try{
                if(goalDate!=undefined && goalDate!=null && goalDate!="" && goalDate.indexOf(' ')!=-1  &&
                  (goalendDate!=undefined && goalendDate!=null && goalendDate!="" && goalendDate.indexOf(' ')!=-1) ){
                     let str = (goalDate).split(' ');
                     let str1 = (goalendDate).split(' ');
                      //  console.log(goalDate);
                     send_goal_data.push({
                       "id" : user_row[i].goal_id,
                       "startDate"  : (str[0]),
                       "endDate" : (str1[0]),
                       "status" : user_row[i].status,
                       "target": user_row[i].target,
                       "initValues": user_row[i].initValues
                     });
                }
                else if(  (goalDate!=undefined && goalDate!=null && goalDate!="" && goalDate.indexOf(' ')!=-1 ) &&
                          (goalendDate==undefined ||  goalendDate==null || goalendDate=="") ){
                     let str = (goalDate).split(' ');
                      //  console.log(goalDate);
                     send_goal_data.push({
                       "id" : user_row[i].goal_id,
                       "startDate"  : (str[0]),
                       "endDate" : user_row[i].goal_endDate,
                       "status" : user_row[i].status,
                       "target": user_row[i].target,
                       "initValues": user_row[i].initValues
                     });
                }
                else if(  (goalendDate!=undefined && goalendDate!=null && goalendDate!="" && goalendDate.indexOf(' ')!=-1) &&
                          (goalDate==undefined || goalDate==null || goalDate=="") ){
                     let str1 = (goalendDate).split(' ');
                      //  console.log(goalDate);
                     send_goal_data.push({
                       "id" : user_row[i].goal_id,
                       "startDate"  : (user_row[i].goal_Date),
                       "endDate" : (str1[0]),
                       "status" : user_row[i].status,
                       "target": user_row[i].target,
                       "initValues": user_row[i].initValues
                     });
                }
                else{
                  send_goal_data.push({
                    "id" : user_row[i].goal_id,
                    "startDate"  : (user_row[i].goal_Date),
                    "endDate" : user_row[i].goal_endDate,
                    "status" : user_row[i].status,
                    "target": user_row[i].target,
                    "initValues": user_row[i].initValues
                  });
                }
              }catch(e){
                send_goal_data.push({
                  "id" : user_row[i].goal_id,
                  "startDate"  : (user_row[i].goal_Date),
                  "endDate" : user_row[i].goal_endDate,
                  "status" : user_row[i].status,
                  "target": user_row[i].target,
                  "initValues": user_row[i].initValues
                });
              }
            }
            // console.log(send_goal_data);
          }
          return callback(send_goal_data);
        }
      });
  }

  function measurement_hist_data (req, res, iv, userid, start_date, end_date, callback){

      var measurement_hist_query = 'SELECT history.id as history_id, SUBSTRING_INDEX(history.measurementDate, "T",-1 )  as history_Date'+
      ' , SUBSTRING_INDEX(history.measurementDate, "T",-1 ) as mmhDate FROM member_measurement_history as history where history.measurementDate'+
      ' BETWEEN "'+start_date +'" and "'+end_date+'" and history.user=" '+userid+'" and history.is_deleted=0'+
      ' group by history.measurementDate';
      // console.log(measurement_hist_query);
      connection_db.query(measurement_hist_query, function(err, user_row){
        if (err){
          // throw error;
          let response_data = status_codes.db_error_0001;
          // console.log(response_data);
          let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
          res.end(enc);
        }else{
          let send_measure_history_data = [];
          if(user_row.length<=0){
            // Send Empty data to function
             send_measure_history_data = [];
          }else{
            // Send data to function
             send_measure_history_data = user_row;
            for(let i=0;i<send_measure_history_data.length;i++){
              let historyDate = (send_measure_history_data[i].history_Date);
              if(historyDate!=undefined && historyDate!=null && historyDate!=""){
                if(historyDate!=undefined && historyDate.indexOf(' ')!=-1){
                   let str = (historyDate).split(' ');
                    //  console.log(historyDate);
                   send_measure_history_data[i].history_Date = (str[0]);
                }
              }
              //send_measure_history[i].history_id = send_measure_history_data[i].history_id;
            }
            //  console.log('send_measure_history_data');
            //  console.log(send_measure_history_data);
          }
          return callback(send_measure_history_data);
        }
      });
  }


  function nutrition_data (req, res, iv, userid, start_date, end_date, callback){

      var nutrition_data_query = 'SELECT nutrition.id as nutrition_id,'+
      ' SUBSTRING_INDEX(nutrition.created_date,"T",-1 )  as nutrition_Date'+
      ', SUBSTRING_INDEX(nutrition.created_date,"T",-1 )  as nDate'+
      ' FROM gym_nutrition as nutrition where nutrition.created_date'+
      ' BETWEEN "'+start_date +'" and "'+end_date+'" and nutrition.user_id=" '+userid+'";'
      // ' group by nutrition.created_date';
      // console.log(nutrition_data_query);
      connection_db.query(nutrition_data_query, function(err, user_row){
        if (err){
          // throw error;
          let response_data = status_codes.db_error_0001;
          // console.log(response_data);
          let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
          res.end(enc);
        }else{
          let send_nutrition_data = [];
          if(user_row.length<=0){
            // Send Empty data to function
             send_nutrition_data = [];
          }else{
            // Send data to function
             send_nutrition_data = user_row;
            for(let i=0;i<send_nutrition_data.length;i++){
              let nutritionDate = (send_nutrition_data[i].nutrition_Date) || "";
              if(nutritionDate!=undefined && nutritionDate!=null && nutritionDate!=""){
                if(nutritionDate!=undefined && nutritionDate.indexOf(' ')!=-1){
                   let str = (nutritionDate).split(' ');
                    //  console.log(nutritionDate);
                   send_nutrition_data[i].nutrition_Date = (str[0]);
                }
              }
              //send_nutrition_data[i].nutrition_id = send_nutrition_data[i].nutrition_id;
            }
            //  console.log('send_nutrition_data');
            //  console.log(send_nutrition_data);
          }
          return callback(send_nutrition_data);
        }
      });
  }


  function makeJSONArray(workoutPromise, measurement_Hist_Promise, nutrition_Promise){

      let finalString = new Array();
      //  console.log((workoutPromise.length ));
      //  console.log((measurement_Hist_Promise.length ));
      //  console.log((workoutPromise.length >= measurement_Hist_Promise.length));
      try{
          if(workoutPromise.length >= measurement_Hist_Promise.length){
            for(var i=0;i<workoutPromise.length;i++){
              var flag = false;
                for(var j=0;j<measurement_Hist_Promise.length;j++){

                  // console.log((workoutPromise[i].workout_Date == measurement_Hist_Promise[j].history_Date));

                    if(workoutPromise[i].workout_Date == measurement_Hist_Promise[j].history_Date){
                      finalString.push({
                        "workout_id" : workoutPromise[i].workout_id,
                        "workout_DateTime" : workoutPromise[i].wDate,
                        "history_id"  : measurement_Hist_Promise[j].history_id,
                        "history_DateTime" : measurement_Hist_Promise[j].mmhDate,
                        "date"       : measurement_Hist_Promise[j].history_Date,
                        "nutrition_id" : "",
                        "nutrition_DateTime" : ""
                      });
                      flag = true;
                    }
                }
                // console.log(!flag+'!flag');
                if(!flag){

                  finalString.push({
                    "workout_id" : workoutPromise[i].workout_id,
                    "workout_DateTime" : workoutPromise[i].wDate,
                    "history_id"  : "",
                    "history_DateTime" : measurement_Hist_Promise[j].mmhDate,
                    "date"       : workoutPromise[i].workout_Date,
                    "nutrition_id" : "",
                    "nutrition_DateTime" : ""
                  });
                  // console.log(finalString);
                  // console.log('finalString');
                }
            }
            length = finalString.length;
            if(measurement_Hist_Promise.length && finalString.length){
              for(var i=0;i<measurement_Hist_Promise.length;i++){
                var flag = false;
                  for(var j=0;j<finalString.length;j++){
                      if(finalString[j].history_id == measurement_Hist_Promise[i].history_id){
                        flag = true;
                      }
                  }
                  if(!flag){
                    length++;
                    finalString.push({
                      "workout_id" : "",
                      "workout_DateTime" : "",
                      "history_id"  : measurement_Hist_Promise[i].history_id,
                      "history_DateTime" : measurement_Hist_Promise[i].mmhDate,
                      "date"       : measurement_Hist_Promise[i].history_Date,
                      "nutrition_id" : "",
                      "nutrition_DateTime" : ""
                    });
                  }
              }
            }
          }else{
            for(var i=0;i<measurement_Hist_Promise.length;i++){
              var flag = false;
                for(var j=0;j<workoutPromise.length;j++){
                    if(measurement_Hist_Promise[i].history_Date == workoutPromise[j].workout_Date){
                      finalString.push({
                        "workout_id" :  workoutPromise[j].workout_id,
                        "workout_DateTime" : workoutPromise[j].wDate,
                        "history_id"  : measurement_Hist_Promise[i].history_id,
                        "history_DateTime" : measurement_Hist_Promise[i].mmhDate,
                        "date"       : workoutPromise[j].workout_Date,
                        "nutrition_id" : "",
                        "nutrition_DateTime" : ""
                      });
                      flag = true;
                    }
                }
                if(!flag){
                  finalString.push({
                    "workout_id" :  "",
                    "workout_DateTime" : "",
                    "history_id"  : measurement_Hist_Promise[i].history_id,
                    "date"       : measurement_Hist_Promise[i].history_Date,
                    "history_DateTime" : measurement_Hist_Promise[i].mmhDate,
                    "nutrition_id" : "",
                    "nutrition_DateTime" : ""
                  });
                }
            }
              length = finalString.length;
            if(workoutPromise.length && finalString.length){
              for(var i=0;i<workoutPromise.length;i++){
                var flag = false;
                  for(var j=0;j<finalString.length;j++){
                      if(finalString[j].workout_id == workoutPromise[i].workout_id){
                        flag = true;
                      }
                  }
                  if(!flag){
                    length++;
                    finalString.push({
                      "workout_id" :  workoutPromise[i].workout_id,
                      "workout_DateTime" : workoutPromise[i].wDate,
                      "history_id"  : "",
                      "history_DateTime" : "",
                      "date"       :  workoutPromise[i].workout_Date,
                      "nutrition_id" : "",
                      "nutrition_DateTime" : ""
                    });
                  }
              }
            }
          }


          /* // For Nutrition Data
           Handle the nutrition */

           if(finalString.length>0 && nutrition_Promise.length<=0){
             for(var i=0;i<finalString.length;i++){
                 finalString[i].nutrition_id = "";
                 finalString[i].nutrition_DateTime = "";
               }
           } // If no nutrition, but other data available then add nutrition id as empty
           else if(finalString.length>0){
                var tempNutrition = [];
                  for(var i=0;i<nutrition_Promise.length;i++){
                    var flag = false;
                    for(var j=0;j<finalString.length;j++){
                      if(nutrition_Promise[i].nutrition_Date == finalString[j].date){
                        if(flag){
                          tempNutrition.push({
                            "workout_id" :  finalString[j].workout_id,
                            "workout_DateTime" : finalString[i].wDate,
                            "history_id"  : finalString[j].history_id,
                            "history_DateTime" : finalString[j].history_DateTime,
                            "nutrition_id" : nutrition_Promise[i].nutrition_id,
                            "nutrition_DateTime" : nutrition_Promise[i].nDate,
                            "date"       :  finalString[j].date
                          });
                        }else{
                          flag = true;
                          finalString[j].nutrition_id = nutrition_Promise[i].nutrition_id;
                          finalString[j].nutrition_DateTime = nutrition_Promise[i].nDate;
                        }
                      }
                    }
                    if(!flag){
                      tempNutrition.push({
                        "workout_id" :  "",
                        "workout_DateTime" : "",
                        "history_id"  : "",
                        "history_DateTime" : "",
                        "nutrition_id" : nutrition_Promise[i].nutrition_id,
                        "nutrition_DateTime" : nutrition_Promise[i].nDate,
                        "date"       :  nutrition_Promise[i].nutrition_Date
                      });
                    }
                  }

                  // if(nutrition_Promise.length>finalString.length){
                  //     for(var i=0;i<finalString.length;i++){
                  //       // !("key" in obj) // true if "key" doesn't exist in object
                  //       if(!("nutrition_id" in finalString[i])){
                  //         finalString[i].nutrition_id = "";
                  //       }
                  //     }
                  // }

                  var mylength = finalString.length;
                  for(var i=0;i<tempNutrition.length;i++){
                    finalString[mylength] = tempNutrition[i];
                    mylength++;
                  }

            }else{
              if(nutrition_Promise.length){
                for(var i=0;i<nutrition_Promise.length;i++){
                  finalString.push({
                    "workout_id" :  "",
                    "workout_DateTime" : "",
                    "history_id"  : "",
                    "history_DateTime" : "",
                    "nutrition_id" : nutrition_Promise[i].nutrition_id,
                    "nutrition_DateTime" : nutrition_Promise[i].nutrition_DateTime,
                    "date"       :  nutrition_Promise[i].nutrition_Date
                  });
              }
            }
          }


    // console.log(finalString);
    // console.log('finalString');

        return finalString;
      }catch(e){
        return finalString;
      }





}



function add_timezone_in_time(timeData,timeZone){
  let new_add_Date = new Date(timeData);
  // //get the timezone offset from local time in minutes
  // var tzDifference = timeZone * 60 + new_add_Date.getTimezoneOffset();
  // //convert the offset to milliseconds, add to targetTime, and make a new Date
  // var offsetTime = new Date(new_add_Date.getTime() + tzDifference * 60 * 1000);
  // return offsetTime;
  return new_add_Date;
}



module.exports = calendar;
