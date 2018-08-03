var crypto = require('crypto');
var dataBaseUtil = require("./mysql_data.js");
var emailUtil = require("./emailUtil.js");
var config = require('./config.json');
var status_codes = require('.././status_codes/status_codes.json');
var encrypt_decrypt = require('.././encrypt_decrypt/encryption-decryption.js');
var inputValidation = require('.././validation/input-validation.js')
var nullKeyValidation = require('.././validation/null-key-validation.js');

var connection_db = dataBaseUtil;

var cryptkey = encrypt_decrypt.generate_crypt_key();

var goals = {

  // All USer Goals Details
  user_goals: function(req, res, next){
    let isUserId = inputValidation.isValid(req.params.userid);
    let iv = encrypt_decrypt.generate_randomIV();
    if(isUserId!=true){
      let response_data = status_codes.userId_not_found;
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }
    else{
        get_user_goals_next(req, res, next, iv);
      }
    },

      // User Active or succed Goals Details
    active_succeed_Goals: function(req, res, next){
      let isUserId = inputValidation.isValid(req.params.userid);
      let iv = encrypt_decrypt.generate_randomIV();
      if(isUserId!=true){
        let response_data = status_codes.userId_not_found;
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
      }
      else{
          get_active_succeed_Goals_next(req, res, next, iv);
        }
      },

  // User Goals Details
  single_goal: function(req, res, next){
    let isUserId = inputValidation.isValid(req.params.userid);
    let iv = encrypt_decrypt.generate_randomIV();
    if(isUserId!=true){
      let response_data = status_codes.userId_not_found;
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }
    else{
      let isgoalId = inputValidation.isValid(req.params.goal_id);
      if(isgoalId!=true){
        let response_data = status_codes.goalId_not_found;
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
      }else{
          get_goal_info_next(req, res, next, iv);
      }
    }
  },

  create_goal: function(req, res, next){
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
              add_goal_next(req, res, next, iv);
          });
      }
  },

  update_goal: function(req, res, next){
    let isUserId = inputValidation.isValid(req.params.userid);
    let iv = encrypt_decrypt.generate_randomIV();
    if(isUserId!=true){
      let response_data = status_codes.userId_not_found;
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }
    else{
      let isgoalId = inputValidation.isValid(req.params.goal_id);
      if(isgoalId!=true){
        let response_data = status_codes.goalId_not_found;
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
              update_goal_next(req,res, next, iv);
          });
      }
    }
  },

  delete_goal: function(req, res, next){
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
      let isgoalId = inputValidation.isValid(req.params.goal_id);
      if(isgoalId!=true){
        let response_data = status_codes.goalId_not_found;
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
      }else{
            delete_goal_next(req, res, next, iv);
      }
    }
  },

} // End of Goal Object


function get_user_goals_next(req, res, next, iv){
  let userid   = encrypt_decrypt.decode_base64(req.params.userid);
  let pageNo, pageOffset = 0, limitPage = 20;
  let isPageNo = inputValidation.isValid(req.query.page_no);
  // console.log(req.originalUrl);
  // console.log(req.query);
  // console.log(req.query.page_no);
  if(isPageNo!=true){
    pageNo = 1;
  }else{
    pageNo = req.query.page_no;
  }
  try{
    if(!isNaN(pageNo)){
      if(pageNo<=1){
        pageOffset = 0;
        // pageNo = 1;
      }else{
        pageOffset = ( (pageNo-1) * limitPage);
      }
    }
  }
  catch(e){
    // pageNo=1;
    pageOffset = 0;
  }
  finally{
    let get_user_goals_query = 'select  goal.id as id, goal.user, SUBSTRING_INDEX(goal.startDate, "T",-1 ) as startDate, '+
    ' SUBSTRING_INDEX(goal.endDate, "T",-1 ) as endDate, goal.status, goal.target as target, goal.initValues'+
    ' as initValues, goal.is_deleted as is_deleted'+
    // ' from gym_member_goal as goal where goal.user = "'+userid+'" and goal.is_deleted = 0 order by goal.startDate desc'+
    ' from gym_member_goal as goal where goal.user = "'+userid+'" and goal.is_deleted = 0  order by goal.id asc '+
    ' limit ' + limitPage + ' offset '+pageOffset;
    // console.log(get_user_goals_query);
    connection_db.query(get_user_goals_query,function(err,user_row){
      if(err){
        // throw err;
        let response_data = status_codes.db_error_0001;
        console.log(response_data);
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
      }else {
        if(user_row.length<=0){
          // No User goal data in gym_member_goal
          let response_data = status_codes.no_goal;
          // console.log(response_data);
          let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
          res.end(enc);
        }else{
          var user_data = new Array();
          user_data = user_row;
          for(let i=0;i<user_data.length;i++){
            let startDate = (user_data[i].startDate);
            let endDate = (user_data[i].endDate);


            user_data[i].newstartDate = user_data[i].startDate;
            user_data[i].newendDate = user_data[i].endDate;

            try{
              if(startDate!=undefined && startDate!=null && startDate!=""){
                if(startDate!=undefined && startDate.indexOf(' ')!=-1){
                   let str = (startDate).split(' ');
                    //  console.log(historyDate);
                   user_data[i].startDate = (str[0]);
                }
              }
              if(endDate!=undefined && endDate!=null && endDate!=""){
                if(endDate!=undefined && endDate.indexOf(' ')!=-1){
                   let str = (endDate).split(' ');
                    //  console.log(historyDate);
                   user_data[i].endDate = (str[0]);
                }
              }

              let responseInitial = JSON.parse(user_data[i].initValues);
              responseInitial = nullKeyValidation.iosNullValidation(responseInitial);
              user_data[i].initValues = JSON.stringify(responseInitial);

              let responseTarget = JSON.parse(user_data[i].target);
              responseTarget = nullKeyValidation.iosNullValidation(responseTarget);
              user_data[i].target = JSON.stringify(responseTarget);





            }catch(ex){

            }


          }

          // for(var i=0;i<user_row.length;i++){
          //   user_data[i] = user_row[i];
          //   // try{
          //   //   console.log(user_data[i].target);
          //   //   user_data[i].target = (user_row[i].target!=null && user_row[i].target!=null && user_row[i].target!=null !=undefined)?(JSON.parse(user_row[i].target)):"";
          //   //   user_data[i].initValues = (user_row[i].initValues && user_row[i].initValues!=null && user_row[i].initValues!=null !=undefined)?(JSON.parse(user_row[i].initValues)):"";
          //   // }catch(e){
          //   //   console.log('target');
          //   // }
          //   // finally{
          //   //
          //   // }
          // }
          // Send User goal data from gym_member_goal
          // console.log(user_data);
          let response_data = {}
          response_data = status_codes.user_goal_data;
          response_data.output = user_data;
          let responseOutput = nullKeyValidation.iosNullValidation(response_data.output);
          response_data.output = responseOutput;
          // console.log(response_data);
          let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
          res.end(enc);
        }
      }
    });
  }// end of final method
}

function get_active_succeed_Goals_next(req, res, next, iv){
  let userid   = encrypt_decrypt.decode_base64(req.params.userid);
  let get_active_Finished_query = 'select  goal.id as id, goal.user, SUBSTRING_INDEX(goal.startDate, "T",-1 ) as startDate, '+
  ' SUBSTRING_INDEX(goal.endDate, "T",-1 ) as endDate, goal.status, goal.target as target, goal.initValues'+
  ' as initValues, goal.is_deleted as is_deleted'+
  ' from gym_member_goal as goal where goal.user = "'+userid+'"  and (goal.status="active"'+
  ' or goal.status="succeed") and goal.is_deleted = 0;';
  // console.log(get_active_Finished_query);
  connection_db.query(get_active_Finished_query,function(err,user_row){
    if(err){
      // throw err;
      let response_data = status_codes.db_error_0001;
      // console.log(response_data);
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }else {
      if(user_row.length<=0){
        // No User goal data in gym_member_goal
        let response_data = status_codes.no_active_finish_goal;
        // console.log(response_data);
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
      }else{
        var user_data = new Array();
        for(var i=0;i<user_row.length;i++){
          user_data[i] = user_row[i];
        }
        // Send User goal data from gym_member_goal
        // console.log(user_data);
        let response_data = {}
        response_data = status_codes.user_goal_data;
        response_data.output = user_data;
        // console.log(response_data);
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
      }
    }
  });
}

function get_goal_info_next(req, res, next, iv){
  let userid   = encrypt_decrypt.decode_base64(req.params.userid);
  let id   = encrypt_decrypt.decode_base64(req.params.goal_id);
      let get_goal_query =  ' select g.id as id,g.user as user, SUBSTRING_INDEX(g.startDate, "T",-1 )  as startDate,'+
      ' SUBSTRING_INDEX(g.endDate, "T",-1 )  as endDate,g.status as status,g.target as target,'+
      ' g.initValues as initValues, g.is_deleted as is_deleted, '+
      ' mmh.id as mmh_id, mmh.user as mmh_user, mmh.weight as mmh_weight, mmh.height as mmh_height, '+
      ' mmh.caliperBicep as mmh_caliperBicep,'+
      ' mmh.triceps as mmh_triceps, mmh.subscapular as mmh_subscapular,'+
      ' mmh.iliacCrest as mmh_iliacCrest, mmh.neck as mmh_neck, mmh.chest as mmh_chest,'+
      ' mmh.circumferenceBicep as mmh_circumferenceBicep, mmh.forearm as mmh_forearm, mmh.waist as mmh_waist,'+
      ' mmh.hip as mmh_hip, mmh.thigh as mmh_thigh, mmh.calf as mmh_calf, SUBSTRING_INDEX(mmh.measurementDate, "T",-1 ) '+
      ' as mmh_measurementDate, SUBSTRING_INDEX(mmh.updatedAt, "T",-1 ) as mmh_updatedAt, mmh.photoId as mmh_photoId,'+
      ' mmh.activityLevel as mmh_activityLevel, mmh.bodyFat as mmh_bodyFat,'+
      ' mmh.waterWeight as mmh_waterWeight, mmh.leanBodyMass as mmh_leanBodyMass, mmh.boneDensity as mmh_boneDensity,'+
      ' mmh.circumferencesSum as mmh_circumferencesSum, mmh.is_deleted as mmh_is_deleted '+
      ' from gym_member_goal as g '+
      ' left join  member_measurement_history as mmh on g.user = mmh.user and mmh.is_deleted=0 '+
      ' and mmh.measurementDate BETWEEN g.startDate and g.endDate '+
      ' where g.id ="'+ id	+'" and g.user = "'+userid +'" and g.is_deleted = 0 order by g.startDate DESC;';
      // let get_goal_query = "select * from gym_member_goal where id = "+id +" and user = "+userid+" and is_deleted = 0;";
      // console.log(get_goal_query);
      connection_db.query(get_goal_query,function(err,user_row){
        if(err){
          // throw err;
          let response_data = status_codes.db_error_0001;
          // console.log(response_data);
          let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
          res.end(enc);
        }else {
          if(user_row.length<=0){
            // No User goal data in gym_member_goal
            let response_data = status_codes.no_user_goal;
            // console.log(response_data);
            let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
            res.end(enc);
          }else{
            var user_data = user_row;
            // Send User goal data from gym_member_goal
            // console.log(user_data);
            let response_data = {};
            let goalData = {};
            let measure_history_data = new Array();
            let goalStartDate, goalEndDate;

            try{
              goalStartDate = user_row[0].startDate;
              goalEndDate = user_row[0].endDate;
              user_row[0].startDate1 = user_row[0].startDate;
              user_row[0].endDate1 = user_row[0].endDate;
              if(goalStartDate!=undefined && goalStartDate!=null && goalStartDate!=""){
                if(goalStartDate!=undefined && goalStartDate.indexOf(' ')!=-1){
                   let str = (goalStartDate).split(' ');
                   user_row[0].startDate = (str[0]);
                }
              }
              if(goalEndDate!=undefined && goalEndDate!=null && goalEndDate!=""){
                if(goalEndDate!=undefined && goalEndDate.indexOf(' ')!=-1){
                   let str = (goalEndDate).split(' ');
                   user_row[0].endDate = (str[0]);
                }
              }
            }
            catch(e){
              // console.log('Running in catch goalData');
            }

            finally{
              goalData ={
                "id" : user_row[0].id,
                "user"  : user_row[0].user,
                "startDate" : user_row[0].startDate,
                "endDate" : user_row[0].endDate,
                "status": user_row[0].status,
                "target": user_row[0].target,
                "initValues": user_row[0].initValues,
                "newstartDate":user_row[0].startDate1,
                "newendDate":user_row[0].endDate1
              }

            }


            try{
              let responseInitial = JSON.parse(goalData.initValues);
              responseInitial = nullKeyValidation.iosNullValidation(responseInitial);
              goalData.initValues = JSON.stringify(responseInitial);

              let responseTarget = JSON.parse(goalData.target);
              responseTarget = nullKeyValidation.iosNullValidation(responseTarget);
              goalData.target = JSON.stringify(responseTarget);
            }catch(ex){

            }
            finally{

                          response_data = status_codes.user_goalid_data;
                          // response_data.output = user_data;
                          let j=0;
                          for(var i=0;i<user_data.length;i++){

                            if(user_row[i].mmh_id!=null && user_row[i].mmh_id!="" && user_row[i].mmh_id!=undefined){


                              let mhCDate, mhUDate;

                              try{
                                mhCDate = user_row[i].mmh_measurementDate;
                                mhUDate = user_row[i].mmh_updatedAt;
                                user_row[i].mmh_measurementDate1 = user_row[i].mmh_measurementDate;
                                user_row[i].mmh_updatedAt1 = user_row[i].mmh_updatedAt;
                                if(mhCDate!=undefined && mhCDate!=null && mhCDate!=""){
                                  if(mhCDate!=undefined && mhCDate.indexOf(' ')!=-1){
                                     let str = (mhCDate).split(' ');
                                     user_row[i].mmh_measurementDate = (str[0]);
                                  }
                                }
                                if(mhUDate!=undefined && mhUDate!=null && mhUDate!=""){
                                  if(mhUDate!=undefined && mhUDate.indexOf(' ')!=-1){
                                     let str = (mhUDate).split(' ');
                                     user_row[i].mmh_updatedAt = (str[0]);
                                  }
                                }
                              }
                              catch(e){
                                // console.log('Running in catch mmh_id measurementHistory Data');
                              }
                              finally{
                              measure_history_data.push({
                                "id" : user_row[i].mmh_id,"user"  : user_row[i].mmh_user,
                                "weight" : user_row[i].mmh_weight,"height" : user_row[i].mmh_height,
                                "caliperBicep": user_row[i].mmh_caliperBicep,
                                "triceps": user_row[i].mmh_triceps,"subscapular": user_row[i].mmh_subscapular,
                                "iliacCrest" : user_row[i].mmh_iliacCrest,"bodyFat":user_row[i].mmh_bodyFat,
                                "neck"  : user_row[i].mmh_neck, "chest" : user_row[i].mmh_chest,
                                "circumferenceBicep" : user_row[i].mmh_circumferenceBicep,
                                "forearm": user_row[i].mmh_forearm,
                                "waist": user_row[i].mmh_waist,"hip": user_row[i].mmh_hip,
                                "thigh": user_row[i].mmh_thigh,"calf": user_row[i].mmh_calf,
                                "measurementDate": user_row[i].mmh_measurementDate,
                                "updatedAt" : user_row[i].mmh_updatedAt, "photoId": user_row[i].mmh_photoId,
                                "waterWeight": user_row[i].mmh_waterWeight,"leanBodyMass": user_row[i].mmh_leanBodyMass,
                                "boneDensity": user_row[i].mmh_boneDensity,
                                "circumferencesSum": user_row[i].mmh_circumferencesSum,
                                "newMeasurementDate": user_row[i].mmh_measurementDate1,
                                "newUpdatedAt": user_row[i].mmh_updatedAt1
                              });

                              let responseMeasure = nullKeyValidation.iosNullValidation(measure_history_data[j]);
                              measure_history_data[j] = responseMeasure;
                              j++;

                            }


                            }

                          }
                          response_data.output ={};
                          response_data.output.goalData = goalData;
                          response_data.output.measure_history_data = measure_history_data;
                          let responseOutput = nullKeyValidation.iosNullValidation(goalData);
                          response_data.output.goalData = responseOutput;

                          // console.log(response_data);
                          //  console.log(response_data.output.goalData );
                          //  console.log(response_data.output.measure_history_data);
                          let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                          res.end(enc);
            }
          }
        }
      });
}


function add_goal_next(req, res, next, iv){
  let userid   = encrypt_decrypt.decode_base64(req.params.userid);
  var get_string = req.rawBody || null;
  // console.log(get_string+" get_string");
  if(get_string!=null){
    try{
      var de_cryptdata = encrypt_decrypt.decrypt_new(cryptkey, get_string);
      de_cryptdata = JSON.parse(de_cryptdata);
      let goalData = {};
      let curr_date_time = inputValidation.currentDateTime();
      goalData = de_cryptdata;
      goalData.user =   userid;
      goalData.target = de_cryptdata.target;
      goalData.initValues = de_cryptdata.initValues;
      // try{
      //   // console.log('I m going to stringify');
      //   goalData.target = JSON.stringify(goalData.target);
      //   goalData.initValues = JSON.stringify(goalData.initValues);
      //   // console.log(testResultData);
      //   // console.log('I stringify successfully');
      // }catch(e){
      // goalData.target = goalData.target;
      // goalData.initValues = goalData.initValues;
      // }
      // goalData.createdAt =  curr_date_time;
      // console.log(goalData);
      var query = connection_db.query('INSERT INTO gym_member_goal SET ?', goalData, function (error, results, fields) {
      if (error){
        // throw error;
        // console.log(error);
        let response_data = status_codes.db_error_0001;
        // console.log(response_data);
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
      }else{
        let response_data = status_codes.user_goal_added;
        // console.log(response_data);
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
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


function update_goal_next(req, res, next, iv){
  let userid   = encrypt_decrypt.decode_base64(req.params.userid);
  let id   = encrypt_decrypt.decode_base64(req.params.goal_id);
  var get_string = req.rawBody || null;
  //  console.log(get_string+" get_string");
  if(get_string!=null){
    try{
      var de_cryptdata = encrypt_decrypt.decrypt_new(cryptkey, get_string);
      de_cryptdata = JSON.parse(de_cryptdata);
      let get_user_goal_query = 'select * from gym_member_goal where user = "'+userid +
          '" and id = "' + id + '" and is_deleted = 0;';
      // console.log(get_user_goal_query);
      connection_db.query(get_user_goal_query,function(err,user_row){
        if(err){
          // throw err;
          let response_data = status_codes.db_error_0001;
          let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
          res.end(enc);
        }else {
          if(user_row.length<=0){
            // No User goal for that id
            let response_data = status_codes.no_user_goal;
            // console.log(response_data);
            let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
            res.end(enc);
          }else{
            var user_data = user_row[0];
            // Update Data and Save
            // console.log(user_data);
            let goalData = {};
            let curr_date_time = inputValidation.currentDateTime();
            goalData = de_cryptdata;
            goalData.user =   userid;
            let isStartDate = inputValidation.isValid(de_cryptdata.startDate);
            if(isStartDate!=true){
              goalData.startDate =   user_data.startDate;
            }else{
              goalData.startDate =   de_cryptdata.startDate;
            }
            let isEndDate = inputValidation.isValid(de_cryptdata.endDate);
            if(isEndDate!=true){
              goalData.endDate =   user_data.endDate;
            }else{
              goalData.endDate =   de_cryptdata.endDate;
            }
            let isStatus = inputValidation.isValid(de_cryptdata.status);
            if(isStatus!=true){
              goalData.status =   user_data.status;
            }else{
              goalData.status =   de_cryptdata.status;
            }
            let isTarget = inputValidation.isValid(de_cryptdata.target);
            if(isTarget!=true){
              goalData.target =   user_data.target;
            }else{
              goalData.target =   de_cryptdata.target;
            }
            let isInitValues = inputValidation.isValid(de_cryptdata.initValues);
            if(isInitValues!=true){
              goalData.initValues =   user_data.initValues;
            }else{
              goalData.initValues =   de_cryptdata.initValues;
            }
            // console.log(goalData);
            let update_status_query = "update gym_member_goal set startDate= '"+goalData.startDate+
            "', endDate='"+goalData.endDate+"', status='"+goalData.status+"', target='"+goalData.target+
            "', initValues='"+ goalData.initValues+"' where user='"+ userid + "' and id='"+id+"';'";
            // console.log(update_status_query);
            connection_db.query(update_status_query, function(err, user_mem_row){
            if (err){
              // throw error;
              let response_data = status_codes.db_error_0001;
              // console.log(response_data);
              let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
              res.end(enc);
            }else{
              let response_data = status_codes.user_goal_updated;
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

function delete_goal_next(req, res, next, iv){
  let userid   = encrypt_decrypt.decode_base64(req.params.userid);
  let id   = encrypt_decrypt.decode_base64(req.params.goal_id);
  let get_user_goal_query = 'select * from gym_member_goal where user = "'+userid +
      '" and id = "'+id+'" and is_deleted = 0;';
  // console.log(get_user_goal_query);
  connection_db.query(get_user_goal_query,function(err,user_row){
    if(err){
      // throw err;
      let response_data = status_codes.db_error_0001;
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }else {
      if(user_row.length<=0){
        // No User goal for that id
        let response_data = status_codes.no_user_goal;
        // console.log(response_data);
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
      }
      else{
        var del_status_query = 'update gym_member_goal SET is_deleted= 1 where user= "'+
          userid +'" and id="'+id+'";';
        // console.log(del_status_query);
          connection_db.query(del_status_query,function(err,user_mem_row){
            if(err){
              // throw err;
              let response_data = status_codes.db_error_0001;
              // console.log(response_data);
              let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
              res.end(enc);
            }else {
              let response_data = status_codes.user_goal_deleted;
              // console.log(response_data);
              let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
              res.end(enc);
            }
          });
      }
    }
  });
}


module.exports = goals;
