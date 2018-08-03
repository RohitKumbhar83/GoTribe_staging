var crypto = require('crypto');
var dataBaseUtil = require("./mysql_data.js");
var emailUtil = require("./emailUtil.js");
var config = require('./config.json');
var status_codes = require('.././status_codes/status_codes.json');
var encrypt_decrypt = require('.././encrypt_decrypt/encryption-decryption.js');
var inputValidation = require('.././validation/input-validation.js');
var nullKeyValidation = require('.././validation/null-key-validation.js');


var connection_db = dataBaseUtil;


var cryptkey = encrypt_decrypt.generate_crypt_key();


var CronJob = require('cron').CronJob;
var cron = require('cron');



try{
  var job3 = new cron.CronJob({
    cronTime: '09 1 * *  *',
    onTick: function(){
      console.log('Every day at 01:09th minute');
      dailyCronGoal();
    },
    start: false,
    timeZone: 'America/Los_Angeles'
  });
}catch(ex){
  // console.log('Every day at 01:09th minutecrone');
}


// console.log('job3 status', job3.running); // job3 status undefined

job3.start(); // job 3 started

// console.log('job3 status', job3.running); // job3 status true

dailyCronGoal();

function fixDigit(val){
        return val.toString().length === 1 ? "0" + val : val;
      }








function dailyCronGoal(){

  let curr_date_time = inputValidation.currentDateTime();
  let curr_Date = inputValidation.YMDformat(curr_date_time);

  let new_curr_date = inputValidation.YMD2digitFormat(curr_date_time);




  // let curr_Date = "2017-07-08";
  // let fetch_goal =  'SELECT distinct (g.id) as g_id, g.user as g_user,'+
  //                   ' g.status as g_status, g.target as g_target, '+
  //                   ' g.startDate as g_startDate, g.endDate as g_EndDate,'+
  //                   ' mmh.id as mmh_id,'+
  //                   ' mmh.measurementDate,'+
  //                   ' mmh.weight as mmh_weight, mmh.bodyFat as mmh_bodyFat,'+
  //                   ' mmh.leanBodyMass as mmh_leanBodyMass,'+
  //                   ' mmh.waterWeight as mmh_waterWeight, mmh.boneDensity as mmh_boneDensity,'+
  //                   ' mmh.circumferencesSum as mmh_circumferencesSum,'+
  //
  //                   ' mm.weight as mm_weight, mm.bodyFat as mm_bodyFat,'+
  //                   ' mm.leanBodyMass as mm_leanBodyMass,'+
  //                   ' mm.waterWeight as mm_waterWeight, mm.boneDensity as mm_boneDensity,'+
  //                   ' mm.circumferencesSum as mm_circumferencesSum'+
  //
  //                   // ' *'+
  //                   ' FROM gym_member_goal g'+
  //                   ' LEFT JOIN member_measurement_history mmh ON'+
  //                   ' mmh.user=g.user and (measurementDate between g.startDate and g.endDate)' +
  //
  //                   ' LEFT JOIN member_measurement mm on mm.user = g.user ' +
  //                   ' WHERE (g.endDate="'+curr_Date+'")'+
  //                   ' and g.is_deleted=0 and'+
  //                   '(g.status = "active" || g.status="failed")'+
  //                   ' order by mmh.measurementDate desc';

  let fetch_goal =  'SELECT distinct (g.id) as g_id, g.user as g_user,'+
                    ' g.status as g_status, '+
                    ' g.initValues as g_initValues,   g.target as g_target,' +
                    ' g.startDate as g_startDate, g.endDate as g_EndDate,'+

                    ' mmh.id as mmh_id,'+
                    ' mmh.measurementDate,'+
                    ' mmh.weight as mmh_weight, mmh.bodyFat as mmh_bodyFat,'+
                    ' mmh.leanBodyMass as mmh_leanBodyMass,'+
                    ' mmh.waterWeight as mmh_waterWeight, mmh.boneDensity as mmh_boneDensity,'+
                    ' mmh.circumferencesSum as mmh_circumferencesSum,'+

                    ' mm.weight as mm_weight, mm.bodyFat as mm_bodyFat,'+
                    ' mm.leanBodyMass as mm_leanBodyMass,'+
                    ' mm.waterWeight as mm_waterWeight, mm.boneDensity as mm_boneDensity,'+
                    ' mm.circumferencesSum as mm_circumferencesSum'+

                    ' From '+
                    ' (select * from member_measurement_history order by measurementDate desc) as mmh '+
                    ' RIGHT JOIN gym_member_goal g ON (mmh.user=g.user'+
                    ' and  mmh.measurementDate between g.startDate and g.endDate)' +
                    ' LEFT JOIN member_measurement mm on mm.user = g.user'+
                    ' WHERE (g.endDate like "%'+new_curr_date+'%")'+
                    ' and g.is_deleted=0'+
                    ' and (g.status = "active")'+
                    // ' '+
                    // ' group by g.id;'
                    ' order by g.id,mmh.measurementDate asc;';

  // console.log(dailyCronGoal);
  // console.log(fetch_goal);
  connection_db.query(fetch_goal,function(err,user_row){
    if(err){
      // throw err;
    }else {
        // console.log("Goal Length is %d. checking length",user_row.length);
        // console.log(user_row);
        if(user_row.length>0){
          checkGoalValues(user_row);
        }
    }
  });

}



function checkGoalValues(user_row){
  let goalFinishedIds = new Array(), goalInCompleteIds = new Array();
  var arr = user_row;
  var arrResult = {};
  for (var i = 0, n = arr.length; i < n; i++) {
      var item = arr[i];
      arrResult[ item.g_id ] = item;
  }
  var h = 0;
  var nonDuplicatedArray = [];
  for(var item in arrResult) {
      nonDuplicatedArray[h++] = arrResult[item];
  }
  // console.log(nonDuplicatedArray);

  user_row = nonDuplicatedArray;
  for(var i=0;i<user_row.length;i++){
    let goalTarget = {},goalInitValues = {};
    let responseUser_row = nullKeyValidation.iosNullValidation(user_row[i]);
    user_row[i] = responseUser_row;
    try{

      goalInitValues = JSON.parse(user_row[i].g_initValues);
      let responseInitValues = nullKeyValidation.iosNullValidation(goalInitValues);
      goalInitValues = (responseInitValues);

      goalTarget = JSON.parse(user_row[i].g_target);
      let responseTarget = nullKeyValidation.iosNullValidation(goalTarget);
      goalTarget = (responseTarget);

    }catch(ex){
      goalTarget = {};
      goalInitValues = {};
    }
    finally{
      let isGoalFullfill = false;
      // console.log(goalTarget);
      // console.log(goalInitValues);

      if(goalInitValues.weight!=undefined
        && (goalInitValues.weight!="" || goalInitValues.weight==0)
        && goalInitValues.weight!= null && goalTarget.weight!=undefined
        && (goalTarget.weight!="" || goalTarget.weight==0)
        && goalTarget.weight!= null){
          if(goalInitValues.weight>=goalTarget.weight){
            isGoalFullfill = lossTarget(goalInitValues.weight, goalTarget.weight,
                              user_row[i].mmh_weight, user_row[i].mm_weight);
          }else{
            isGoalFullfill = gainTarget(goalInitValues.weight, goalTarget.weight,
                              user_row[i].mmh_weight, user_row[i].mm_weight);
          }
      }


      // if(goalTarget.weight!=undefined && goalTarget.weight!="" && goalTarget.weight!= null){//i.e user filled his weight weight
      //   if(user_row[i].mmh_weight!="" &&  goalTarget.weight == user_row[i].mmh_weight){
      //     isGoalFullfill = true;
      //   }else{
      //     if(user_row[i].mm_weight!="" &&  goalTarget.weight == user_row[i].mm_weight){
      //       isGoalFullfill = true;
      //     }else{
      //       isGoalFullfill =false;
      //     }
      //   }
      // }



      if(goalInitValues.bodyFat!=undefined
        && (goalInitValues.bodyFat!="" || goalInitValues.bodyFat==0)
        && goalInitValues.bodyFat!= null && goalTarget.bodyFat!=undefined
        && (goalTarget.bodyFat!="" || goalTarget.bodyFat==0)
        && goalTarget.bodyFat!= null){
          if(goalInitValues.bodyFat>=goalTarget.bodyFat){
            isGoalFullfill = lossTarget(goalInitValues.bodyFat, goalTarget.bodyFat,
                              user_row[i].mmh_bodyFat, user_row[i].mm_bodyFat);
          }else{
            isGoalFullfill = gainTarget(goalInitValues.bodyFat, goalTarget.bodyFat,
                              user_row[i].mmh_bodyFat, user_row[i].mm_bodyFat);
          }
      }


      // if(goalTarget.bodyFat!=undefined && goalTarget.bodyFat!="" && goalTarget.bodyFat!= null){//i.e user filled his bodyFat bodyFat
      //   if(user_row[i].mmh_bodyFat!="" &&  goalTarget.bodyFat == user_row[i].mmh_bodyFat){
      //     isGoalFullfill = true;
      //   }else{
      //     if(user_row[i].mm_bodyFat!="" &&  goalTarget.bodyFat == user_row[i].mm_bodyFat){
      //       isGoalFullfill = true;
      //     }else{
      //       isGoalFullfill =false;
      //     }
      //   }
      // }


      if(goalInitValues.leanBodyMass!=undefined
          && (goalInitValues.leanBodyMass!="" || goalInitValues.leanBodyMass==0)
          && goalInitValues.leanBodyMass!= null && goalTarget.leanBodyMass!=undefined
          && (goalTarget.leanBodyMass!="" || goalTarget.leanBodyMass==0)
          && goalTarget.leanBodyMass!= null){
            if(goalInitValues.leanBodyMass>=goalTarget.leanBodyMass){
              isGoalFullfill = lossTarget(goalInitValues.leanBodyMass, goalTarget.leanBodyMass,
                                user_row[i].mmh_leanBodyMass, user_row[i].mm_leanBodyMass);
            }else{
              isGoalFullfill = gainTarget(goalInitValues.leanBodyMass, goalTarget.leanBodyMass,
                                user_row[i].mmh_leanBodyMass, user_row[i].mm_leanBodyMass);
            }
      }



      // if(goalTarget.leanBodyMass!=undefined && goalTarget.leanBodyMass!="" && goalTarget.leanBodyMass!= null){//i.e user filled his leanBodyMass leanBodyMass
      //   if(user_row[i].mmh_leanBodyMass!="" &&  goalTarget.leanBodyMass == user_row[i].mmh_leanBodyMass){
      //     isGoalFullfill = true;
      //   }else{
      //     if(user_row[i].mm_leanBodyMass!="" &&  goalTarget.leanBodyMass == user_row[i].mm_leanBodyMass){
      //       isGoalFullfill = true;
      //     }else{
      //       isGoalFullfill =false;
      //     }
      //   }
      // }



      if(goalInitValues.waterWeight!=undefined
          && (goalInitValues.waterWeight!="" || goalInitValues.waterWeight ==0)
          && goalInitValues.waterWeight!= null && goalTarget.waterWeight!=undefined
          && (goalTarget.waterWeight!="" || goalTarget.waterWeight ==0)
          && goalTarget.waterWeight!= null){
            if(goalInitValues.waterWeight>=goalTarget.waterWeight){
              isGoalFullfill = lossTarget(goalInitValues.waterWeight, goalTarget.waterWeight,
                                user_row[i].mmh_waterWeight, user_row[i].mm_waterWeight);
            }else{
              isGoalFullfill = gainTarget(goalInitValues.waterWeight, goalTarget.waterWeight,
                                user_row[i].mmh_waterWeight, user_row[i].mm_waterWeight);
            }
      }



      // if(goalTarget.waterWeight!=undefined && goalTarget.waterWeight!=""
      //     && goalTarget.waterWeight!= null){//i.e user filled his waterWeight waterWeight
      //   if(user_row[i].mmh_waterWeight!="" &&  goalTarget.waterWeight == user_row[i].mmh_waterWeight){
      //     isGoalFullfill = true;
      //   }else{
      //     if(user_row[i].mm_waterWeight!="" &&  goalTarget.waterWeight == user_row[i].mm_waterWeight){
      //       isGoalFullfill = true;
      //     }else{
      //       isGoalFullfill =false;
      //     }
      //   }
      // }
      //
      // console.log(goalInitValues.boneDensity);
      // console.log(goalTarget.boneDensity);
      // console.log(user_row[i].mmh_boneDensity);
      // console.log(user_row[i].mm_boneDensity);

      if(goalInitValues.boneDensity!=undefined
          && (goalInitValues.boneDensity!="" || goalInitValues.boneDensity == 0)
          && goalInitValues.boneDensity!= null && goalTarget.boneDensity!=undefined
          && (goalTarget.boneDensity!="" || goalTarget.boneDensity == 0)
          && goalTarget.boneDensity!= null){
            // console.log('outer');
            if(goalInitValues.boneDensity>=goalTarget.boneDensity){
              isGoalFullfill = lossTarget(goalInitValues.boneDensity, goalTarget.boneDensity,
                                user_row[i].mmh_boneDensity, user_row[i].mm_boneDensity);
            }else{
              // console.log('Gaining');
              isGoalFullfill = gainTarget(goalInitValues.boneDensity, goalTarget.boneDensity,
                                user_row[i].mmh_boneDensity, user_row[i].mm_boneDensity);
            }
      }


      // if(goalTarget.boneDensity!=undefined && goalTarget.boneDensity!=""
      //     && goalTarget.boneDensity!= null){//i.e user filled his boneDensity boneDensity
      //   if(user_row[i].mmh_boneDensity!="" &&  goalTarget.boneDensity == user_row[i].mmh_boneDensity){
      //     isGoalFullfill = true;
      //   }else{
      //     if(user_row[i].mm_boneDensity!="" &&  goalTarget.boneDensity == user_row[i].mm_boneDensity){
      //       isGoalFullfill = true;
      //     }else{
      //       isGoalFullfill = false;
      //     }
      //   }
      // }


      if(goalInitValues.circumferencesSum!=undefined
          && (goalInitValues.circumferencesSum!="" || goalInitValues.circumferencesSum==0)
          && goalInitValues.circumferencesSum!= null && goalTarget.circumferencesSum!=undefined
          && (goalTarget.circumferencesSum!="" || goalTarget.circumferencesSum==0)
          && goalTarget.circumferencesSum!= null){
            if(goalInitValues.circumferencesSum>=goalTarget.circumferencesSum){
              isGoalFullfill = lossTarget(goalInitValues.circumferencesSum, goalTarget.circumferencesSum,
                                user_row[i].mmh_circumferencesSum, user_row[i].mm_circumferencesSum);
            }else{
              isGoalFullfill = gainTarget(goalInitValues.circumferencesSum, goalTarget.circumferencesSum,
                                user_row[i].mmh_circumferencesSum, user_row[i].mm_circumferencesSum);
            }
      }



      // if(goalTarget.circumferencesSum!=undefined && goalTarget.circumferencesSum!=""
      //     && goalTarget.circumferencesSum!= null){//i.e user filled his circumferencesSum circumferencesSum
      //   if(user_row[i].mmh_circumferencesSum!="" &&  goalTarget.circumferencesSum == user_row[i].mmh_circumferencesSum){
      //     isGoalFullfill = true;
      //   }else{
      //     if(user_row[i].mm_circumferencesSum!="" &&  goalTarget.circumferencesSum == user_row[i].mm_circumferencesSum){
      //       isGoalFullfill = true;
      //     }else{
      //       isGoalFullfill =false;
      //     }
      //   }
      // }

      if(isGoalFullfill) // pushing id of finished goals
        goalFinishedIds.push('"' + user_row[i].g_id + '"');
      else
        goalInCompleteIds.push('"' + user_row[i].g_id + '"');

    }
  }

  updateGoalStatus(goalFinishedIds,goalInCompleteIds);



}


function gainTarget(initData, targetData, mmhData, mmData){
  // console.log(initData);
  // console.log(targetData);
  // console.log(mmhData);
  // console.log(mmData);
  let isGoalFilled = false;
  if(mmhData!="" && mmhData >= targetData ){
    isGoalFilled = true;
  }else{
    if(mmData!="" && mmData >= targetData ){
      isGoalFilled = true;
    }else{
      isGoalFilled =false;
    }
  }
  return isGoalFilled;
}

function lossTarget(initData, targetData, mmhData, mmData){
  // console.log(initData);
  // console.log(targetData);
  // console.log(mmhData);
  // console.log(mmData);
  let isGoalFilled = false;
  if(mmhData!="" && mmhData <= targetData ){
    isGoalFilled = true;
  }else{
    if(mmData!="" && mmData <= targetData ){
      isGoalFilled = true;
    }else{
      isGoalFilled =false;
    }
  }
  return isGoalFilled;
}



function updateGoalStatus(goalFinishedIds, goalInCompleteIds){

  let wait_exec_time = 9000;
   if(goalFinishedIds.length>0){
     goalFinishedIds = goalFinishedIds.toString();
     let updateSuccessQuery =  'update gym_member_goal set status = "succeed"'+
                               ' where id IN('+goalFinishedIds+')';
    //  console.log(updateSuccessQuery + ' Success Status Query');
     connection_db.query(updateSuccessQuery,function(err,user_row){

       if(err){
         // throw err;
       }else{
         // goal succeed status updated successfully.
       }

     });
   }else{
     wait_exec_time = 0;
   }

   if(goalInCompleteIds.length>0){
      goalInCompleteIds = goalInCompleteIds.toString();
      let updateFailQuery = 'update gym_member_goal set status = "failed"'+
                              ' where id IN('+goalInCompleteIds+')';
      // console.log(updateFailQuery + ' Fail Status Query');
      setTimeout(function () {
        connection_db.query(updateFailQuery, function(err, user_row){

          if(err){
            // throw err;
          }else{
            // goal failed status update successfully.
          }
        });
      },wait_exec_time);
   }

}
