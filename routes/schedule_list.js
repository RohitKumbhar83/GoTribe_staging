var crypto = require('crypto');
var dataBaseUtil = require("./mysql_data.js");
var emailUtil = require("./emailUtil.js");
var config = require('./config.json');
var status_codes = require('.././status_codes/status_codes.json');
var encrypt_decrypt = require('.././encrypt_decrypt/encryption-decryption.js');
var inputValidation = require('.././validation/input-validation.js');
var notifications = require('.././notifications/send-notifications.js');
var userDataNotifications = require('.././notifications/getUserData.js');
var deviceValid = require('.././validation/deviceValidation.js');
var moment = require('moment'); // for time
var scheduleEmail = require('.././email-functions-html/email-schedule.js');
var nullKeyValidation = require('.././validation/null-key-validation.js');
var userRegister = require('.././validation/isUserRegister.js');
var sqlDateFormat = require('.././validation/sql-date-format.js');

// var asyncLoop = require('node-async-loop');

var connection_db = dataBaseUtil;

var cryptkey = encrypt_decrypt.generate_crypt_key();

var schedule = {

  // User can see all the schedules  list (in which he enrolled or not)
  view_schedules: function(req, res, next){
    console.log('HERE');
    console.log(req);
    let isUserId = inputValidation.isValid(req.params.userid);
    let iv = encrypt_decrypt.generate_randomIV();
    if(isUserId!=true){
      let response_data = status_codes.userId_not_found;
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }
    else{
        view_schedules_next(req, res, next, iv);
    }

  },

  // User enroll to a particular class from a list of schedules
  enroll_class: function(req, res, next){
    let isUserId = inputValidation.isValid(req.params.userid);
    let iv = encrypt_decrypt.generate_randomIV();
    if(isUserId!=true){
      let response_data = status_codes.userId_not_found;
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }
    else{ // scheduleid
      let isScheduleId = inputValidation.isValid(req.params.scheduleid);
      // Check whether requesting schedule is valid
      if(isScheduleId!=true){
        let response_data = status_codes.scheduleId_not_found;
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
      }else{
        enroll_class_next(req, res, next, iv);
      }
    }

  },

  // User can view his/her schedules that he enrolled
  my_schedules: function(req, res, next){
    let isUserId = inputValidation.isValid(req.params.userid);
    let iv = encrypt_decrypt.generate_randomIV();
    if(isUserId!=true){
      let response_data = status_codes.userId_not_found;
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }
    else{
        my_schedules_next(req, res, next, iv);
    }

  },


  // User can can cancel his enrolled schedule
  cancel_sgtPTOPT_schedule: function(req, res, next){
    let isUserId = inputValidation.isValid(req.params.userid);
    let iv = encrypt_decrypt.generate_randomIV();
    if(isUserId!=true){
      let response_data = status_codes.userId_not_found;
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }
    else{
      let isScheduleId = inputValidation.isValid(req.params.scheduleid);
      // Check whether requesting schedule is valid
      if(isScheduleId!=true){
        let response_data = status_codes.scheduleId_not_found;
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
      }else{
        cancel_sgtPTOPT_schedule_next(req, res, next, iv);
      }
    }

  }


}


function view_schedules_next(req, res, next, iv){

  let userid   = encrypt_decrypt.decode_base64(req.params.userid);
  // let pageNo, pageOffset = 0, limitPage = 20;
  // console.log(req.query.page_no+' req.query.page_no');
  var query_exec = 'SELECT * FROM gym_member where id="'+userid+'";';
  // let isPageNo = inputValidation.isValid(req.query.page_no);
  // if(isPageNo!=true){
  //   pageNo = 1;
  // }else{
  //   pageNo = req.query.page_no;
  //   console.log(pageNo+' param');
  // }

    // try{
    //
    //   if(!isNaN(pageNo)){
    //     if(pageNo<=1){
    //       pageOffset = 0;
    //       // pageNo = 1;
    //     }else{
    //       pageOffset = (pageNo * limitPage);
    //     }
    //   }
    // }
    // catch(e){
    //   // pageNo=1;
    //   pageOffset = 0;
    // }
    // finally{

    // } // End of outer final method

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
      // console.log(query_string);
      var de_cryptdata = encrypt_decrypt.decrypt_new(cryptkey, query_string);
      de_cryptdata = JSON.parse(de_cryptdata);
      console.log('HERE');
      //console.log(de_cryptdata);
      // console.log(de_cryptdata+' de_cryptdata Object');
      var start_date = de_cryptdata.start;
      var end_date = de_cryptdata.end;
      // console.log('v   '+query_exec);
var new_end_date = new Date(start_date);
      console.log(new_end_date.setDate(new_end_date.getDate() + 30));
console.log(new_end_date.toISOString().slice(0, 10));
end_date = new_end_date.toISOString().slice(0, 10);
       connection_db.query(query_exec,function(err,user_row){
       if(err){
         // throw err;
         let response_data = status_codes.db_error_0001;
        //  console.log(response_data);
         let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
         res.end(enc);
       }else {
          //  console.log("User Data");
         if(user_row.length<=0){
           let response_data = status_codes.no_user_found;
          //  console.log(response_data);
           let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
           res.end(enc);
         }else{

           let upcoming_query = 'SELECT gc.name as class_name, cs.schedule_type, cs.schedule_title, cs.member_for, cs.assign_staff_mem,'+
                       ' cs.licensee_id, cs.total_capacity, cs.wait_list, csl.id as class_schedule_list_id, csl.class_id as'+
                       ' schedule_id, csl.days, SUBSTRING_INDEX(csl.schedule_date, "T",-1 ) as schedule_date,'+
                       ' csl.start_time as start_time, csl.end_time as'+
                       ' end_time, gm.first_name as first_name, gm.last_name as last_name,'+
                       ' gatt.attendance_id as gatt_attendance_id, gatt.class_id as gatt_class_id,'+
                       ' gatt.user_id as gatt_user_id, SUBSTRING_INDEX(gatt.attendance_date, "T",-1 ) as gatt_attendance_date,'+
                       ' gatt.status as gatt_status, gatt.attendance_by as gatt_attendance_by,'+
                       ' gatt.role_name as gatt_role_name, gatt.schedule_id as gatt_schedule_id,'+
                       ' gatt.waiting as gatt_waiting'+
                       ' FROM gym_attendance gatt'+
                       ' LEFT JOIN class_schedule_list csl ON csl.id = gatt.schedule_id' +
                       ' LEFT JOIN class_schedule cs on cs.id = gatt.schedule_id'+
                       ' LEFT JOIN gym_class gc ON gc.id = cs.class_name'+
                       ' INNER JOIN gym_member gm ON gm.id = cs.assign_staff_mem'+
                       ' where gatt.user_id ="' + userid + '" and gatt.status = "Taken"';
          //  console.log(upcoming_query);
           connection_db.query(upcoming_query,function(err,up_user_row){
             if(err){
               // throw err;
               let response_data = status_codes.db_error_0001;
              //  console.log(response_data);
               let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
               res.end(enc);
             }else {

               let user_up_data = up_user_row;


               let  schedule_list_query = 'SELECT gc.name as class_name, cs.schedule_type, cs.schedule_title, cs.member_for, cs.assign_staff_mem,'+
                           ' cs.licensee_id, cs.total_capacity, cs.wait_list, csl.id as class_schedule_list_id, csl.class_id as'+
                           ' schedule_id, csl.days, SUBSTRING_INDEX(csl.schedule_date, "T",-1 ) as schedule_date,'+
                           ' csl.start_time as start_time, csl.end_time as'+
                           ' end_time, gm.first_name as first_name, gm.last_name as last_name,'+
                           ' gatt.attendance_id as gatt_attendance_id, gatt.class_id as gatt_class_id,'+
                           ' gatt.user_id as gatt_user_id, SUBSTRING_INDEX(gatt.attendance_date, "T",-1 ) as gatt_attendance_date,'+
                           ' gatt.status as gatt_status, gatt.attendance_by as gatt_attendance_by,'+
                           ' gatt.role_name as gatt_role_name, gatt.schedule_id as gatt_schedule_id,'+
                           ' gatt.waiting as gatt_waiting'+
                           ' FROM class_schedule cs'+
                           ' LEFT JOIN class_schedule_list csl ON csl.class_id = cs.id' +
                           ' LEFT JOIN gym_class gc ON gc.id = cs.class_name'+
                           ' INNER JOIN gym_member gm ON gm.id = cs.assign_staff_mem' +
                          //  ' LEFT JOIN gym_member gm ON gm.id = "' + userid + '"' +
                           ' LEFT JOIN gym_attendance gatt on csl.id = gatt.schedule_id';
                // let addUserinQuery =  ' and gatt.user_id = "' + userid + '"' ;
                 let addUserinQuery =  '';
                  let whereCla = ' WHERE 1 ';
                  var user_data = user_row[0];
                  let condition = "";
                  let staff_id_search, licensee_id_search ;
                  // console.log("Before Condition:\n"+schedule_list_query);
                  let role_name = user_data.role_name;
                  // console.log(user_data.role_name +' role_name');
                    switch(role_name) {
                      case "administrator":
                          staff_id_search = '',licensee_id_search = '';
                          break;

                      case "licensee":
                          staff_id_search = '';
                          licensee_id_search = user_data.id;
                          condition = condition + ' AND cs.licensee_id = "'+user_data.id+'"';
                          break;

                      case "manager" :
                        staff_id_search = '';
                        licensee_id_search = user_data.id;
                        condition = condition + ' AND cs.licensee_id = "' + user_data.id +'" AND cs.assign_staff_mem = "'+
                                    user_data.id + '"';
                        break;


                      case "staff_member":
                          // code block  associated_licensee
                          addUserinQuery = '';
                          staff_id_search = user_data.id;
                          licensee_id_search = user_data.associated_licensee;
                          condition = condition + ' AND cs.licensee_id = "' + licensee_id_search +'" AND cs.assign_staff_mem = "'+
                                      user_data.id + '"';
                          break;

                      case "subadmin" :
                          // condition = ' AND cs.licensee_id = "' + user_data.id +'"';
                          staff_id_search = '';
                          licensee_id_search = '';
                          break;

                      case "admin" :
                        // condition = ' AND cs.licensee_id = "' + user_data.id +'"';
                        staff_id_search = '';
                        licensee_id_search = '';
                        break;

                       case "member":
                        // console.log('member Case');
                            staff_id_search = user_data.assign_staff_mem;
                            licensee_id_search = user_data.associated_licensee;
                            condition = condition + ' AND cs.licensee_id = "' + licensee_id_search +'"';

                          // condition = condition + ' AND '+
                          //   ' CASE WHEN (cs.schedule_type = "OPT" or cs.schedule_type = "PT") AND'+
                          //             ' (cs.schedule_type = "OPT" or cs.schedule_type = "PT")'+
                          //             ' THEN'+
                          //     ' @cs.member_for ="'+ user_data.id +'"  AND gatt.attendance_id="'+user_data.id+'"'+
                          //     ' END';
                          //
                          //
                          //
                          //

                          break;
                      default:
                        let response_data = status_codes.no_role_name;
                        // console.log(response_data);
                        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                        res.end(enc);
                      }
                     let schedule_type = 'SGT', dateFrom, dateTo, class_id = '',addDays = 7;
                     dateFrom = inputValidation.currDateStartTime();
                    //  dateTo = inputValidation.addDaysToDate(dateFrom,addDays);
                    //  dateTo = inputValidation.defaultStartTime(dateTo);
                    //  condition = condition + ' AND csl.schedule_date >= "'+ dateFrom +'" AND csl.schedule_date <= "'+dateTo+ '"'+
                    //             ' AND cs.schedule_type = "'+schedule_type+'"';
                    //
                    // //  condition = condition + ' ORDER BY csl.schedule_date ASC, STR_TO_DATE(csl.start_time, "%h:%i:%a") ASC';
                    // condition = condition + ' AND '
                    // condition = condition + ' AND gatt.status!="cancelled_by_trainer"';
                    condition = condition + ' AND csl.schedule_date >= "'+ start_date +'" AND csl.schedule_date <= "'+ end_date+  '"';
                     condition = condition + ' ORDER BY csl.id ASC, csl.schedule_date ASC, csl.start_time, "%h:%i:%a"  DESC';
                                 // ' limit ' + limitPage + ' offset '+pageOffset;
                     schedule_list_query = schedule_list_query  + addUserinQuery + whereCla;
                     schedule_list_query = schedule_list_query  + condition;
                    //  console.log("After Condition:\n"+schedule_list_query);
                       console.log(schedule_list_query);
                       connection_db.query(schedule_list_query,function(err,sche_row){
                       if(err){
                         // throw err;
                         let response_data = status_codes.db_error_0001;
                        //  console.log(response_data);
                         let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                         res.end(enc);
                       }else {
                        //  console.log("Schedule Data");


                         if(sche_row.length<=0 && user_up_data.length<=0){
                           let response_data = status_codes.no_schedule_list;
                          //  console.log(response_data);
                           let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                           res.end(enc);
                         }else{
                           let view_sche_data = sche_row;
                           let send_view_data = new Array();
                           let new_sched = new Array();
                           let response_data = status_codes.view_schedule_list;
                          //  console.log('view schedulist_list available');
                           try{


                            for(let i=0;i<user_up_data.length;i++){
                               view_sche_data.push(user_up_data[i]);
                            }


                             for(let i=0;i<view_sche_data.length;i++){


                               let scheduleDate = (view_sche_data[i].schedule_date);
                               if(scheduleDate!=undefined && scheduleDate!=null && scheduleDate!=""){
                                 if(scheduleDate!=undefined && scheduleDate.indexOf(' ')!=-1){
                                    let str = (scheduleDate).split(' ');
                                    view_sche_data[i].schedule_date = (str[0]);
                                    // view_sche_data[i].concatDateTime =  view_sche_data[i].schedule_date + ' '+
                                    //                                     view_sche_data[i].start_time  ;
                                    view_sche_data[i].concatDateTime = view_sche_data[i].schedule_date + ' '+
                                      moment(view_sche_data[i].start_time, 'h:mm a').format('H:mm:ss');

                                 }
                               }
                              //  console.log(view_sche_data[i].schedule_date);
                              //  console.log(view_sche_data[i].concatDateTime);
                               let temp_view_sche_data = nullKeyValidation.iosNullValidation(view_sche_data[i]);
                               view_sche_data[i] = temp_view_sche_data;
                              //  console.log('huihuhuihuuiiuty');
                              //  //userid
                               if(view_sche_data[i].gatt_user_id!="" && view_sche_data[i].gatt_user_id!=null &&
                                  view_sche_data[i].gatt_user_id!=undefined){

                                    // console.log('Userid not defined');
                                    if(view_sche_data[i].gatt_user_id == userid ){
                                      send_view_data.push(view_sche_data[i]);
                                    }else if(view_sche_data[i].gatt_status == "cancelled_by_trainer"){
                                      // remove cancelled
                                    }else{
                                      // do nothing
                                      // console.log('else');
                                      // console.log('gatt_status.schedule_type'+view_sche_data[i].schedule_type);
                                      let push_FullData = false, dontPushData = false;
                                      if(view_sche_data[i].schedule_type == 'PT' ||
                                          view_sche_data[i].schedule_type == 'OPT'
                                        ){
                                          // console.log('I entered');
                                          if(view_sche_data[i].member_for == userid){
                                            push_FullData = true;
                                            // console.log('My entered PT OPT');
                                          }else{
                                            dontPushData = true;
                                            // console.log('Not my entered PT OPT');
                                          }
                                        }

                                        if(push_FullData){
                                          send_view_data.push(view_sche_data[i]);
                                        }else{

                                          if(dontPushData){
                                            // don't do anything
                                          }else{
                                            view_sche_data[i].gatt_attendance_id = "";
                                            view_sche_data[i].gatt_class_id = "";
                                            view_sche_data[i].gatt_user_id = "";
                                            view_sche_data[i].gatt_attendance_date = "";
                                            view_sche_data[i].gatt_status = "";
                                            view_sche_data[i].gatt_attendance_by = "";
                                            view_sche_data[i].gatt_role_name = "";
                                            view_sche_data[i].gatt_schedule_id = "";
                                            view_sche_data[i].gatt_waiting = "";
                                            send_view_data.push(view_sche_data[i]);
                                          }


                                        }


                                    }
                                }else{
                                  send_view_data.push(view_sche_data[i]);
                                }

                             }

                             let n= send_view_data.length, swap;

                             for (let c = 0 ; c < ( n - 1 ); c++)
                            {
                              for (let d = 0 ; d < n - c - 1; d++)
                              {
                                if (send_view_data[d].class_schedule_list_id > send_view_data[d+1].class_schedule_list_id) /* For decreasing order use < */
                                {
                                  swap       = send_view_data[d];
                                  send_view_data[d]   = send_view_data[d+1];
                                  send_view_data[d+1] = swap;
                                }
                              }
                            }


                             let i=0;
                             while(i<send_view_data.length){
                               var isDup = false, isStatus = false, loopVal, StatVal;
                               for(let j=i;j<send_view_data.length;j++){
                                 if(send_view_data[i].class_schedule_list_id == send_view_data[j].class_schedule_list_id){
                                   isDup = true;
                                   loopVal = j;
                                   if(send_view_data[j].gatt_status == 'Taken' || send_view_data[j].gatt_status == 'Cancelled'){
                                     isStatus = true;
                                     StatVal = j;
                                   }
                                 }
                               }
                               if(isDup){
                                  i = loopVal;
                                  if(isStatus){
                                    new_sched.push(send_view_data[StatVal]);
                                  }else{
                                    new_sched.push(send_view_data[i]);
                                  }
                               }else{
                                 new_sched.push(send_view_data[i]);
                               }
                               i++;
                             }

                            //  new_sched.sort(function(a, b) {
                            //     return (a.schedule_date < b.schedule_date) ? -1 : ((a.schedule_date > b.schedule_date) ? 1 : 0);
                            //   });





                            new_sched.sort(function(a, b) {

                              //  var dateA = moment(a.concatDateTime, 'h:mm a').format('H:mm');
                              //  var dateB = moment(b.concatDateTime, 'h:mm a').format('H:mm');
                              //  console.log(dateA);
                              // console.log(a.concatDateTime);
                              // var dateA = moment(new Date(a.concatDateTime)).format('YYYY-MM-DD hh:mm A');
                              // var dateB = moment(new Date(b.concatDateTime)).format('YYYY-MM-DD hh:mm A');
                              //
                                // return (dateA < dateB) ? -1 : ((dateA > dateB) ? 1 : 0);

                                //  return (new Date(b.concatDateTime)) - (new Date(a.concatDateTime));  // descending operator
                                 return (new Date(a.concatDateTime)) - (new Date(b.concatDateTime));  // ascending operator
                                // return (a.concatDateTime < b.concatDateTime) ? -1 : ((a.concatDateTime > b.concatDateTime) ? 1 : 0);


                              // return dateA.diff(dateB);
                            });

                            // var notif_time = (userData.notification_time);
                            // var my_notif_time = moment(notif_time);
                            //
                            //   new_sched.sort(function(a,b){
                            //     var c = new Date(a.date);
                            //     var d = new Date(b.date);
                            //     return c-d;
                            //   });
                            // console.log('fj'+new_sched.length);
                            // for(let j=0;j<new_sched.length;j++){
                            //   console.log(new_sched[j].concatDateTime);
                            // }



                           }
                           catch(e){
                            //  console.log(e);
                            //  console.log('Running in catch');
                             new_sched = [];
                           }
                           finally{
                            //  console.log('Final method');
                            //  console.log(new_sched.length);
                            //  console.log(new_sched);
                             response_data.output = new_sched;
                             let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                             res.end(enc);
                           }
                         }
                       }
                     });
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

  }




}

function enroll_class_next(req, res, next, iv) {
  let userid   = encrypt_decrypt.decode_base64(req.params.userid);
  let schedule_list_id = encrypt_decrypt.decode_base64(req.params.scheduleid);
  var query_exec = 'SELECT gm.*, pn.device_type, pn.device_address FROM gym_member gm '+
    ' LEFT JOIN push_notification pn ON pn.user = gm.id'+
    ' where gm.id="'+userid+'"';
  // console.log('v   enroll '+query_exec);
  connection_db.query(query_exec,function(err,user_row){
  if(err){
    // throw err;
    let response_data = status_codes.db_error_0001;
    // console.log(response_data);
    let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
    res.end(enc);
  }else {
      // console.log("User Data");
      if(user_row.length<=0){
        let response_data = status_codes.no_user_found;
        // console.log(response_data);
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
      }else{
        var user_data = user_row[0];
        let licensee_id = user_data.associated_licensee;
        let waitingnumber = 0, schedule_type = 'SGT';
        // Check whether requesting schedule belongs to logged user's licensee
        let schedule_list_query = 'SELECT csl.id as cslId, csl.class_id as csId, csl.days, csl.schedule_date, csl.start_time,'+
              ' csl.end_time , csl.days, cs.class_name as class_id, cs.assign_staff_mem, cs.licensee_id, cs.total_capacity,'+
              ' cs.wait_list, gc.name as classTitle'+
              ' FROM class_schedule_list csl'+
              ' LEFT JOIN class_schedule cs ON cs.id = csl.class_id'+
              ' LEFT JOIN gym_class gc ON gc.id = cs.class_name'+
              ' WHERE csl.id = "'+schedule_list_id+'" AND cs.licensee_id = "'+ licensee_id + '"'+
              ' AND cs.schedule_type="'+schedule_type+'";';
        // console.log('v   '+schedule_list_query);
        connection_db.query(schedule_list_query,function(err,sche_row){
        if(err){
          // throw err;
          let response_data = status_codes.db_error_0001;
          // console.log(response_data);
          let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
          res.end(enc);
        }else {
          // console.log("Schedule Data");
          if(sche_row.length<=0){
            let response_data = status_codes.no_schedule_list;
            // console.log(response_data);
            let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
            res.end(enc);
          }else{
            let sche_details = sche_row[0];


            try {
              let my_schh_date = new Date(sche_details.schedule_date).toISOString();
              // console.log(birth_date+'toISOString');
              // console.log('date toISOString');
              let str = (my_schh_date).split('T');
                // console.log(str+'str');
              sche_details.schedule_date = (str[0]);
            } catch (e) {

            } finally {
              // console.log(sche_details);


              // let response_data = status_codes.view_schedule_list;
              // response_data.output = user_data;
              // console.log(response_data);
              // let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
              // res.end(enc);

              // Check whether logged customer subscribed SGT.
              let check_sgt_sbscription = 'SELECT m.limit_days, m.classes_per_month, m.membership_cat_id,'+
                ' m.membership_label, mp.start_date, mp.end_date FROM membership_payment mp'+
                ' LEFT JOIN membership m ON m.id = mp.membership_id'+
                ' WHERE mp.member_id = "' + user_data.id +'"'+
                ' AND mp.payment_status = "1"'+
                ' AND mp.mem_plan_status = "1"'+
                ' AND ( m.membership_cat_id = "1" OR m.membership_cat_id = "4" )';
              // console.log('v check_sgt_sbscription  '+check_sgt_sbscription);
              connection_db.query(check_sgt_sbscription,function(err,subs_data){
                if(err){
                  // throw err;
                  let response_data = status_codes.db_error_0001;
                  // console.log(response_data);
                  let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                  res.end(enc);
                }else {
                  // console.log("Subscription Data"+subs_data.length);
                  // console.log(subs_data);
                  // console.log('subs_data');
                  if(subs_data.length<=0){
                    let response_data = status_codes.not_subscribe_sgt;
                    // console.log(response_data);
                    let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                    res.end(enc);
                  }else{
                    // let subs_data_details = subs_data;
                    let subs_data_details = subs_data[0];

                    // Check whether the schedule date is fall between cliet's membership period.

                    sche_details.schedule_date = sqlDateFormat.birthdayCheck(sche_details.schedule_date);
                    subs_data_details.end_date = sqlDateFormat.birthdayCheck(subs_data_details.end_date);

                      if(subs_data_details.end_date < sche_details.schedule_date){
                        let response_data = status_codes.subscription_ended;
                        response_data.sub_endDate = subs_data_details.end_date;
                        // console.log(response_data);
                        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                        res.end(enc);
                      }

                    //Check if waiting list is full
                    let waitingQuery = 'SELECT * FROM gym_attendance WHERE schedule_id = "'+schedule_list_id+'"'+
                    ' AND status != "Cancelled" AND status != "cancelled_by_trainer"';
                    // console.log('waitingQuery '+waitingQuery);
                    connection_db.query(waitingQuery,function(err,wait_data){
                      if(err){
                        // throw err;
                        let response_data = status_codes.db_error_0001;
                        // console.log(response_data);
                        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                        res.end(enc);
                      }else {
                        if(wait_data.length<=0){
                          // let response_data = status_codes.not_subscribe_sgt;
                          // console.log(response_data);
                          // let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                          // res.end(enc);
                          check_Limited_Membership(req, res, iv, subs_data_details, userid, schedule_list_id, schedule_type, waitingnumber, user_data, sche_details);
                        }else{
                          let wait_details = wait_data;
                          if( wait_details.length >= ( sche_details.total_capacity + sche_details.wait_list) ){
                            let response_data = status_codes.class_capacity_exceed;
                            // console.log(response_data);
                            let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                            res.end(enc);
                          }else if( wait_details.length >= sche_details.total_capacity ){
                            waitingQuery = waitingQuery + " AND waiting != 0;";
                            console.log(waitingQuery);
                            connection_db.query(waitingQuery,function(err,wait_data){
                              if(err){
                                // throw err;
                                let response_data = status_codes.db_error_0001;
                                // console.log(response_data);
                                let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                                res.end(enc);
                              }else {
                                waitingnumber = wait_data.length + 1;
                                check_Limited_Membership(req, res, iv, subs_data_details, userid, schedule_list_id, schedule_type, waitingnumber, user_data, sche_details);
                              }
                            }); // member will enroll in Waiting list of class
                          }else{
                            check_Limited_Membership(req, res, iv, subs_data_details, userid, schedule_list_id, schedule_type, waitingnumber, user_data, sche_details);
                          }
                        }
                      }
                    });
                  }
                }
              });
            }

          }
        }
      }); // End of schedule_query query
      }
    }
  }); // End of query_exec query
} // End of enroll_next function


  function check_Limited_Membership(req, res, iv, subs_data_details, userid, schedule_list_id, schedule_type, waitingnumber, user_data, sche_details){
   // Check weekly and monthly limit for limited SGT membership.
  //  console.log('check_Limited_Membership');
  //  console.log(sche_details);
   let isLimitDays = inputValidation.isValid(subs_data_details.limit_days);
   if(isLimitDays!=true){
     // UnLimited Membership
    //  console.log('UnLimited Membership');
   }

   subs_data_details.start_date = sqlDateFormat.birthdayCheck(subs_data_details.start_date);
   subs_data_details.end_date = sqlDateFormat.birthdayCheck(subs_data_details.end_date);

   if(subs_data_details.limit_days && subs_data_details.limit_days != ''){
     let check_avaibility_query = 'SELECT attendance_id FROM gym_attendance ga'+
                        ' LEFT JOIN class_schedule_list csl ON csl.id = ga.schedule_id'+
                        ' LEFT JOIN class_schedule cs ON cs.id = csl.class_id'+
                        ' WHERE ga.user_id = "' + userid + '"'+
                        ' AND cs.schedule_type = "' + schedule_type + '"'+
                        ' AND status != "Cancelled" AND status != "cancelled_by_trainer"' +
                        ' AND ga.attendance_date >= "'+ subs_data_details.start_date + '"' +
                        ' AND ga.attendance_date <= "'+subs_data_details.end_date + '"';
    console.log('check_avaibility_query' + check_avaibility_query);
    connection_db.query(check_avaibility_query,function(err,avaib_data){
      if(err){
        // throw err;
        let response_data = status_codes.db_error_0001;
        // console.log(response_data);
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
      }else {
        if(avaib_data.length>0 && avaib_data.length >= subs_data_details.classes_per_month){
          let response_data = status_codes.monthly_limit_exceed;
          // console.log(response_data);
          response_data.classes_per_month = subs_data_details.classes_per_month;
          let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
          res.end(enc);
        }

        // Add function
        // var schulDAtes = setScheDates (subs_data_details);
        var schulDAtes = setScheDates (sche_details);


        schulDAtes.week_start_date = sqlDateFormat.birthdayCheck(schulDAtes.week_start_date);
        schulDAtes.week_end_date = sqlDateFormat.birthdayCheck(schulDAtes.week_end_date);


        check_avaibility_query = check_avaibility_query + ' AND attendance_date >= "'+ schulDAtes.week_start_date +
              '" AND attendance_date <= "' + schulDAtes.week_end_date + '"';
        // console.log('Updated check_avaibility_query' + check_avaibility_query);
        connection_db.query(check_avaibility_query,function(err,week_avaib_data){
          if(err){
            // throw err;
            let response_data = status_codes.db_error_0001;
            // console.log(response_data);
            let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
            res.end(enc);
          }else {
            if(week_avaib_data.length>0 && (week_avaib_data.length >= subs_data_details.limit_days) ){
              let response_data = status_codes.weekely_limit_exceed;
              // console.log(response_data);
              let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
              res.end(enc);
            }else{
              check_schedule_previuosly_enrolled(req, res, iv, subs_data_details, userid, schedule_list_id, schedule_type, waitingnumber, user_data, sche_details);
            }
          }
        });
      }
    }); // member will enroll in Waiting list of class
  }else{
    check_schedule_previuosly_enrolled(req, res, iv, subs_data_details, userid, schedule_list_id, schedule_type, waitingnumber, user_data, sche_details);
  }
}

function check_schedule_previuosly_enrolled(req, res, iv, subs_data_details, userid, schedule_list_id, schedule_type, waitingnumber, user_data, sche_details){

  let hn_wo_port = inputValidation.hostnameSeparator(req.headers.host);
  // console.log(sche_details);
  // Check whether this schedule is previuosly enrolled and cancel or taken by customer
  // then only change status of that instead inserting new entry to attendance table.
  let isScheWithStatus = 'SELECT * FROM gym_attendance WHERE schedule_id = "' + schedule_list_id + '"' +
      ' AND (status = "Cancelled" or status = "Taken") AND user_id = "' + userid + '"';
  // console.log('isScheWithStatus' + isScheWithStatus);
  connection_db.query(isScheWithStatus,function(err,sch_satus_data){
    if(err){
      // throw err;
      let response_data = status_codes.db_error_0001;
      // console.log(response_data);
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }else {
      // Add function
      // console.log(subs_data_details);
      // console.log('Going to enroll');
      // console.log(sche_details.class_id);
      // console.log(sche_details.schedule_date);
      // console.log('Class id');
      var schulDAtes = setScheDates (subs_data_details);
      schulDAtes.scheduleDate = inputValidation.defaultStartTime(schulDAtes.schedule_date);
      let gym_attendanceData = {
      user_id:userid, class_id:sche_details.class_id,
      attendance_date: sche_details.schedule_date,status:"Taken",
      attendance_by:sche_details.assign_staff_mem,
      role_name: "staff_member",schedule_id:schedule_list_id
    }
    // console.log(gym_attendanceData);
    // console.log('gymAttendanceData');

    /* For email */
    // let staff_by = subs_data_details.assign_staff_mem;
    let enroll_DateTime = {
      "scheduleDate" : sche_details.schedule_date || "",
      "start_time" : sche_details.start_time|| "",
      "classTitle": sche_details.classTitle|| "",
      "days": sche_details.days|| ""

  };
  let enrollStatus = true;
    /* End of email */

      if(sch_satus_data.length<=0){
        var query = connection_db.query('INSERT INTO gym_attendance SET ?', gym_attendanceData, function (error, results, fields) {
          if (error){
            // throw error; not_able_enroll
            let response_data = status_codes.db_error_0001;
            // console.log(error);
            let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
            res.end(enc);
          }else{
            let response_data = status_codes.enroll;
            // userDataNotifications.getUserData(req, res, iv, sche_details.assign_staff_mem, function(train_cb){
              // train_cb.schedule_type = "SGT";
              // deviceValid.checkDeviceType(user_data,"enroll",train_cb);
              // userDataNotifications.getUserData(req, res, iv, train_cb.associated_licensee, function(license_cb){
              //   scheduleEmail.send_schedule_sgt_client(user_data, train_cb, license_cb, enroll_DateTime, hn_wo_port, enrollStatus);
              //   scheduleEmail.send_schedule_sgt_staff(user_data, train_cb, license_cb, enroll_DateTime, hn_wo_port, enrollStatus);
              // });
              // inputValidation.send_enroll_msg_on_emailCus(user_data.email);
              // inputValidation.send_enroll_msg_on_emailSta(user_data.email);
              // console.log(response_data)
              let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
              res.end(enc);
            // });
          }
        });
      }else{
        // let wait_details = wait_data;
        let sch_satus = sch_satus_data[0];
        // console.log(sch_satus);
        // console.log('sch_satus');
        if(sch_satus.status == "Taken"){
          let response_data = status_codes.enroll_already_class;
          // console.log(response_data);
          let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
          res.end(enc);
        }else{
            let update_attendance_query = 'update gym_attendance set status="'+gym_attendanceData.status+'"'+
            ', waiting="'+ waitingnumber+'"  WHERE schedule_id = "' + schedule_list_id + '"'+
            ' AND status = "Cancelled" AND user_id ="' + userid + '"';
            // console.log(update_attendance_query);
            connection_db.query(update_attendance_query, function(err, user_mem_row){
            if (err){
              // throw error;
              let response_data = status_codes.db_error_0001;
              // console.log(response_data);
              let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
              res.end(enc);
            }else{
              let response_data = status_codes.enroll;
              // userDataNotifications.getUserData(req, res, iv, sche_details.assign_staff_mem, function(train_cb){
                // train_cb.schedule_type = "SGT";
                // deviceValid.checkDeviceType(user_data,"enroll",train_cb);
                // inputValidation.send_enroll_msg_on_emailCus(user_data.email);
                // userDataNotifications.getUserData(req, res, iv, train_cb.associated_licensee, function(license_cb){
                //   scheduleEmail.send_schedule_sgt_client(user_data, train_cb, license_cb, enroll_DateTime, hn_wo_port, enrollStatus);
                //   scheduleEmail.send_schedule_sgt_staff(user_data, train_cb, license_cb, enroll_DateTime, hn_wo_port, enrollStatus);
                // });
                response_data.waiting = waitingnumber;
                // console.log(response_data);
                let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                res.end(enc);
              // });
            }
          });
        }
      }
    }
  });
}


function setScheDates (sche_details){
  // check weekly limit
  // console.log(sche_details);
  //
  // console.log('weekly limit');


  try{

    sche_details.schedule_date = sqlDateFormat.birthdayCheck(sche_details.schedule_date);


    let schedule_date = sche_details.schedule_date;
    schedule_date = new Date(schedule_date);

    // console.log(schedule_date);


    let dateVal = schedule_date.getDay();
    let week_start_date, week_end_date;
    if(dateVal==0){ // Sunday
      week_end_date = schedule_date;
      week_start_date = inputValidation.addDaysToDate(schedule_date,-6);
    }else if(dateVal==1){ // Monday
        week_start_date = schedule_date;
        week_end_date = inputValidation.addDaysToDate(schedule_date,6);
    }else{
      let prefix1 = 0, prefix2 = 0;
      prefix2 = (6-dateVal);
      prefix1 = (6-prefix2);
      week_start_date = inputValidation.addDaysToDate(schedule_date,-(prefix1-1) );
      week_end_date = inputValidation.addDaysToDate(schedule_date,(prefix2+1) );
    }
    // console.log('jjt');
    // console.log(schedule_date);
    // console.log(week_start_date);
    // console.log(week_end_date);
    var schDates = {
      "schedule_date": schedule_date,
      "week_start_date": week_start_date,
      "week_end_date": week_end_date
    };
    return schDates;
  }catch(e){
    console.log(e);
    var schDates = {
      "schedule_date": "",
      "week_start_date": "",
      "week_end_date": ""
    };
    return schDates;
  }
}


function my_schedules_next(req, res, next, iv) {

}



function cancel_sgtPTOPT_schedule_next(req, res, next, iv) {
  let userid   = encrypt_decrypt.decode_base64(req.params.userid);
  let schedule_list_id = encrypt_decrypt.decode_base64(req.params.scheduleid);
  var query_exec = 'SELECT gm.*, pn.id as pn_id ,pn.user as user,'+
  ' pn.device_type as device_type, pn.device_address as device_address'+
  ' FROM gym_member gm '+
  ' LEFT JOIN push_notification pn ON pn.user = gm.id'+
  ' where gm.id="'+userid+'"';


  // console.log('v   cancel '+query_exec);
  connection_db.query(query_exec,function(err,user_row){
  if(err){
    // throw err;
    let response_data = status_codes.db_error_0001;
    console.log(response_data);
    let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
    res.end(enc);
  }else {
      // console.log("User Data");
      if(user_row.length<=0){
        let response_data = status_codes.no_user_found;
        // console.log(response_data);
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
      }else{
        let user_data = user_row[0], licensee_id ;
        let schedule_list_data, cancelled_by, cancel_extra_query;
        // console.log(user_data.role_id + 'user_data.role_id');
        // console.log(user_data );

        if(user_data.role_id == 2)
           licensee_id = user_data.id;
       else
           licensee_id = user_data.associated_licensee;

        let ValidRoleId = true;
        if(user_data.role_id == 1){
          let response_data = status_codes.admin_cannot_cancel;
          // console.log(response_data);
          let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
          res.end(enc);
        }else  if(user_data.role_id == 4){
         schedule_list_data = 'SELECT csl.id as class_schedule_list_id, csl.class_id as schedule_id, csl.days,'+
            ' SUBSTRING_INDEX(csl.schedule_date, "T",-1 ) as schedule_date, csl.start_time, csl.end_time, cs.class_name,'+
            ' cs.schedule_type, cs.member_for,'+
            ' cs.assign_staff_mem, cs.licensee_id, cs.total_capacity, cs.wait_list, ga.attendance_date, ga.status,'+
            ' ga.waiting,  gc.name as classTitle'+
            ' FROM class_schedule_list csl'+
            ' LEFT JOIN class_schedule cs ON cs.id = csl.class_id' +
            ' LEFT JOIN gym_attendance ga ON ga.schedule_id = csl.id' +
            ' LEFT JOIN gym_class gc ON gc.id = cs.class_name'+
            ' WHERE csl.id = "'+ schedule_list_id +'"'+
            ' AND cs.schedule_type = "SGT"'+
            ' AND ga.user_id = "'+userid+'"'+
            ' AND ga.status = "Taken"'+
            ' AND cs.licensee_id = "'+licensee_id+'"';
         cancelled_by = 'Cancelled';
         cancel_extra_query = ' AND user_id = "'+userid+'"';
      }
      else if(user_data.role_id == 3 || user_data.role_id == 2
              || user_data.role_id == 6 || user_data.role_id == 7
              || user_data.role_id == 8){

        let cnlSchedule_type = ' AND (cs.schedule_type = "SGT") ';
         if(user_data.role_id == 3 || user_data.role_id == 6 || user_data.role_id == 7
           || user_data.role_id == 8){
           cnlSchedule_type = ' AND (cs.schedule_type = "SGT" || cs.schedule_type = "PT" || cs.schedule_type = "OPT")';
         }

         schedule_list_data = 'SELECT csl.id as class_schedule_list_id, csl.class_id as schedule_id, csl.days,'+
            ' SUBSTRING_INDEX(csl.schedule_date, "T",-1 ) as schedule_date, csl.start_time, csl.end_time, cs.class_name,'+
            ' cs.schedule_type, cs.member_for, cs.assign_staff_mem, cs.licensee_id, cs.total_capacity, cs.wait_list,'+
            ' SUBSTRING_INDEX(ga.attendance_date, "T",-1 ) as schedule_date, ga.attendance_date, ga.status,'+
            ' ga.waiting,  gc.name as classTitle'+
            ' FROM class_schedule_list csl'+
            ' LEFT JOIN class_schedule cs ON cs.id = csl.class_id' +
            ' LEFT JOIN gym_attendance ga ON ga.schedule_id = csl.id' +
            ' LEFT JOIN gym_class gc ON gc.id = cs.class_name'+
            ' WHERE csl.id = "'+ schedule_list_id +'"'+
            // ' AND cs.schedule_type = "SGT"'+
            // ' AND ga.user_id = "'+userid+'"'+
            // ' AND ga.status = "Taken"'+
            ' AND cs.licensee_id = "'+licensee_id+'"';
         schedule_list_data  = schedule_list_data + cnlSchedule_type;
         cancelled_by = 'cancelled_by_trainer';
         cancel_extra_query = '';
        //  console.log('trainee');
       }else{
         ValidRoleId = false;
       }
       if(ValidRoleId){
      // console.log(schedule_list_data +' schedule_list_data');
      connection_db.query(schedule_list_data,function(err,sch_status_data){
        if(err){
          // throw err;
          let response_data = status_codes.db_error_0001;
          // console.log(response_data);
          let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
          res.end(enc);
        }else {
          if(sch_status_data.length<=0){
            let response_data = status_codes.no_record_found;
            // console.log(response_data);
            let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
            res.end(enc);
          }else{
            var schedule_list_data_details = sch_status_data[0];
            try {
              let my_schh_date = new Date(schedule_list_data_details.schedule_date).toISOString();
              // console.log(birth_date+'toISOString');
              // console.log('date toISOString');
              let str = (my_schh_date).split('T');
                // console.log(str+'str');
              schedule_list_data_details.schedule_date = (str[0]);
            } catch (e) {

            } finally {

              // console.log(schedule_list_data_details);
              if(user_data.role_id == 4){
                let cur_dateTime = inputValidation.currentDateTime();
                // let cur_def_dateTime = inputValidation.defaultStartTime(cur_dateTime);
                let sch_att_date = schedule_list_data_details.attendance_date;
                // sch_att_date = inputValidation.YMDformat(sch_att_date);
                // sch_att_date = inputValidation.defaultStartTime(sch_att_date);
                // sch_att_date = inputValidation.YMDformat(sch_att_date);

                // if( inputValidation.parseDate(cur_def_dateTime) > inputValidation.parseDate(sch_att_date) )  {
                //   // console.log("larger")
                //   let response_data = status_codes.cancel_class_already_taken;
                //   console.log(response_data);
                //   let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                //   res.end(enc);
                // // }else if( (parseDate(sch_att_date) >= parseDate(sch_att_date)) ){
                // // }else{
                  let sch_att_date1 = inputValidation.YMDformat(sch_att_date);
                //  console.log("smaller")
                  let start_time =   schedule_list_data_details.start_time;
                  // console.log(start_time+'start_time');
                  // console.log(sch_att_date+' sch_att_date');
                  // console.log(sch_att_date1+' sch_att_date1');
                  // console.log( moment(sch_att_date1,'YYYY-MM-DD hh:mm a'));
                  let endTime = sch_att_date1 + " " +start_time;
                  endTime = moment(endTime,'YYYY-MM-DD hh:mm a')
                  let getMtsLeft = moment().diff(endTime, 'minutes');
                  // console.log(endTime);
                  var beginningTime = moment();
                  // console.log('before');
                  // console.log(beginningTime);
                  beginningTime.add(12,'hours');
                  // console.log(beginningTime);
                  // console.log('beginningTime');
                  // console.log('endTime');

                  // var beginningTime = moment('8:45am', 'h:mma');
                  // var endTime = moment('9:00am', 'h:mma');

                  // console.log(beginningTime.isBefore(endTime)); // true
                  // console.log(beginningTime.toDate()); // Mon May 12 2014 08:45:00
                  // console.log(endTime.toDate()); // Mon May 12 2014 09:00:00
                  //








                  if(start_time==undefined || start_time==null || start_time==""){
                    let response_data = status_codes.no_start_time;
                    // console.log(response_data);
                    let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                    res.end(enc);
                  }else{
                    var before12hrs = beginningTime.isBefore(endTime);
                    if(!before12hrs){
                      let response_data = status_codes.not_before_12hours;
                      // console.log(response_data);
                      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                      res.end(enc);
                    }else{



                    // let hourstogo, hrs, orgHrs, mtsAMPM, tempmts, mts, ampm, secs, att_Date_with_time;
                    // try{
                    //   hrs = start_time.split(":");
                    //   if(hrs.length>2 || hrs.length<2){
                    //     let response_data = status_codes.no_start_time;
                    //     console.log(response_data);
                    //     let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                    //     res.end(enc);
                    //   }else{
                    //     orgHrs = hrs[0];
                    //     mtsAMPM = hrs[1].split(' ');
                    //     tempmts = mtsAMPM[0];
                    //     if(mtsAMPM.length ==1){
                    //       ampm = tempmts.substr( ((tempmts.length)-2), (tempmts.length) );
                    //       mts = tempmts.substr( 0, ((tempmts.length)-2) );
                    //     }else if(mtsAMPM.length == 2){
                    //       ampm = tempmts[1];
                    //       mts = tempmts[0];
                    //     }
                    //     // ampm.toLowerCase()
                    //     if(ampm == 'PM' || ampm == 'pm' || ampm == 'Pm' || ampm == 'pM'){
                    //       orgHrs = parseInt(orgHrs) + 12;
                    //     }
                    //     att_Date_with_time = inputValidation.customStartEndTime(sch_att_date, orgHrs, mts, secs);
                    //
                    //   }
                    // }catch(e){
                    //   let response_data = status_codes.not_before_12hours;
                    //   console.log(response_data);
                    //   let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                    //   res.end(enc);
                    // }

                    // hourstogo = inputValidation.calcHrsBetTwoDates(att_Date_with_time,cur_def_dateTime);

                    // if(hourstogo <= 12){
                    //   let response_data = status_codes.not_before_12hours;
                    //   console.log(response_data);
                    //   let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                    //   res.end(enc);
                    //  }else{
                       // change his/her status to cancelled
                       let cancel_schedule_list = 'UPDATE gym_attendance SET status = "'+cancelled_by+'"'+
                        ' WHERE schedule_id = "'+ schedule_list_id +'"';
                       cancel_schedule_list = cancel_schedule_list + cancel_extra_query;
                      //  console.log(cancel_schedule_list);
                       connection_db.query(cancel_schedule_list,function(err,up_sch_status_data){
                         if(err){
                           // throw err;
                           let response_data = status_codes.db_error_0001;
                          //  console.log(response_data);
                           let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                           res.end(enc);
                         }else {
                           /* *******************Handle waiting list for other users
                            and then notify via email
                          *************** */
                           handleWaitingListClient(req, res, iv, schedule_list_id, user_data, userid, schedule_list_data_details);
                         }
                       });
                    //  }
                   }
                  }
              //  }
              }else if(user_data.role_id == 3 || user_data.role_id == 2
                || user_data.role_id == 6 || user_data.role_id == 7
                || user_data.role_id == 8){
                let sch_att_date = schedule_list_data_details.schedule_date;
                // sch_att_date = inputValidation.defaultStartTime(sch_att_date);
                let sch_user_id = schedule_list_data_details.assign_staff_mem;
                // console.log(schedule_list_data_details.schedule_type + 'schedule_list_data_details.schedule_type');

                let scheAttData = {
                  user_id: schedule_list_data_details.assign_staff_mem,
                  class_id: schedule_list_data_details.class_name,
                  attendance_date:  sch_att_date,status: 'cancelled_by_trainer',
                  attendance_by: schedule_list_data_details.assign_staff_mem,
                  role_name: 'staff_member',
                  schedule_id: schedule_list_id
                }
                var query = connection_db.query('INSERT INTO gym_attendance SET ?', scheAttData,function (error, results, fields) {
                    if (error){
                      // throw error;
                      let response_data = status_codes.db_error_0001;
                      // console.log(response_data);
                      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                      res.end(enc);
                    }else{
                      let notifiedCustomers = 'SELECT gatt.user_id,gm.email,gm.first_name, gm.last_name ,'+
                      ' pn.device_type,  '+
                      ' pn.device_address '+
                      ' FROM gym_attendance gatt'+
                      ' LEFT JOIN gym_member gm on gm.id = gatt.user_id'+
                      ' LEFT JOIN push_notification pn ON pn.user = gatt.user_id'+
                      ' WHERE gatt.schedule_id = "'+
                       schedule_list_id +'" AND gatt.status = "Taken"';
                      //  console.log(notifiedCustomers + 'notifiedCustomers');
                       connection_db.query(notifiedCustomers,function(err,notifiedCustomers_data){
                         if(err){
                           // throw err;
                           let response_data = status_codes.db_error_0001;
                          //  console.log(response_data);
                           let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                           res.end(enc);
                         }else {



                           let update_user_status = 'UPDATE gym_attendance SET status = "cancelled_by_trainer"'+
                           ' WHERE schedule_id = "'+  schedule_list_id +'"';
                          //  console.log(update_user_status);
                           connection_db.query(update_user_status,function(err,not_1){
                             if(err){
                               // throw err;
                               let response_data = status_codes.db_error_0001;
                              //  console.log(response_data);
                               let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                               res.end(enc);
                             }else{

                               let response_data = status_codes.any_schedule_cancel;
                              //  console.log(response_data);
                               let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                               res.end(enc);




                               let sender_data;
                               let hn_wo_port = inputValidation.hostnameSeparator(req.headers.host);
                               let enrollStatus = false;
                               let enroll_DateTime = {
                                 "scheduleDate" : schedule_list_data_details.schedule_date || "",
                                 "start_time" : schedule_list_data_details.start_time|| "",
                                 "classTitle": schedule_list_data_details.classTitle|| "",
                                 "days": schedule_list_data_details.days|| "",
                                 "schedule_type": schedule_list_data_details.schedule_type|| ""
                              };
                              //  if(user_data.role_id == 2){
                              //    let staff_memeber_id = schedule_list_data_details.assign_staff_mem;
                              //    userDataNotifications.getUserData(req, res, iv, staff_memeber_id, function(train_cb){
                              //     //  console.log();
                              //      scheduleEmail.cancel_schedule_sgt_by_license_license( train_cb, user_data, enroll_DateTime, hn_wo_port, enrollStatus);
                              //      scheduleEmail.cancel_schedule_sgt_by_license_staff( train_cb, user_data, enroll_DateTime, hn_wo_port, enrollStatus);
                               //
                              //      sender_data = train_cb;
                              //      sender_data.schedule_type = schedule_list_data_details.schedule_type|| "";
                              //     //  let emailBody_t = 'Schedule Cancelled by License', emailSubject1 = 'GoTribe : SGT/PT/OPT Schedule';
                              //     //  emailUtil.sendEmail(emailBody_t, '' , emailSubject1, '' , '' , sender_data.email, sender_data.first_name, '');
                              //      deviceValid.checkDeviceType(sender_data, "cancel_trainer_byLicense", user_data);
                              //      if(notifiedCustomers_data.length>0){
                              //        // Notify Users about their cancel enrollment sgt_schedule_cancel
                              //        //  emailUtil.sendEmail(emailBody, '' , emailSubject, '' , '' , user_data.email, 'Your Name', '');
                              //        let emailSubject = 'GoTribe : SGT/PT/OPT Schedule';
                              //          for(var i = 0; i < notifiedCustomers_data.length; i++) {
                              //           //  let my_name = notifiedCustomers_data[i].first_name || "Gotribe User";
                              //           //  let emailBody = 'Dear '+my_name+' , your Schedule Cancelled by tainer';
                              //           //   emailUtil.sendEmail(emailBody, '' , emailSubject, '' , '' , notifiedCustomers_data[i].email,
                              //           //      my_name, '');
                              //           scheduleEmail.cancel_schedule_sgt_by_license_customer(notifiedCustomers_data[i], train_cb, user_data, enroll_DateTime, hn_wo_port, enrollStatus);
                              //                notifiedCustomers_data[i].type = schedule_list_data_details.schedule_type|| "";
                              //              deviceValid.checkDeviceType(notifiedCustomers_data[i], "cancel_trainer", sender_data);
                              //          }
                              //        }
                              //    });
                              //  }else if(user_data.role_id == 3
                              //          || user_data.role_id == 6 || user_data.role_id == 7
                              //          || user_data.role_id == 8
                              //       ){
                               //
                               //
                              //    if(schedule_list_data_details.schedule_type== "SGT"){
                              //      userDataNotifications.getUserData(req, res, iv, user_data.associated_licensee, function(license_cb){
                               //
                              //       scheduleEmail.cancel_schedule_by_staff( user_data, license_cb, enroll_DateTime, hn_wo_port, enrollStatus);
                               //
                              //       //  let emailBody1 = 'Schedule Cancelled by trainer', emailSubject1 = 'GoTribe : SGT/PT/OPT Schedule';
                              //       //  emailUtil.sendEmail(emailBody1, '' , emailSubject1, '' , '' , user_data.email, user_data.first_name, '');
                              //        if(notifiedCustomers_data.length>0){
                              //          // Notify Users about their cancel enrollment sgt_schedule_cancel
                              //          //  emailUtil.sendEmail(emailBody, '' , emailSubject, '' , '' , user_data.email, 'Your Name', '');
                              //          let emailSubject = 'GoTribe : SGT/PT/OPT Schedule';
                              //            for(var i = 0; i < notifiedCustomers_data.length; i++) {
                              //              let my_name = notifiedCustomers_data[i].first_name || "Gotribe User";
                              //             //  let emailBody = 'Dear '+my_name+' , your Schedule Cancelled by tainer';
                              //              scheduleEmail.cancel_schedule_by_staff_customer(notifiedCustomers_data[i], user_data, license_cb, enroll_DateTime, hn_wo_port, enrollStatus);
                              //               // emailUtil.sendEmail(emailBody, '' , emailSubject, '' , '' , notifiedCustomers_data[i].email,
                              //               //    my_name, '');
                              //                  notifiedCustomers_data[i].type = schedule_list_data_details.schedule_type|| "";
                              //                deviceValid.checkDeviceType(notifiedCustomers_data[i], "cancel_trainer", user_data);
                              //            }
                              //          }
                              //      });
                              //    }else if(schedule_list_data_details.schedule_type== "PT"
                              //             || schedule_list_data_details.schedule_type== "OPT"){
                              //      userDataNotifications.getUserData(req, res, iv, user_data.associated_licensee, function(license_cb){
                              //       //  let emailBody1 = 'Schedule Cancelled by trainer', emailSubject1 = 'GoTribe : SGT/PT/OPT Schedule';
                              //       //  emailUtil.sendEmail(emailBody1, '' , emailSubject1, '' , '' , user_data.email, user_data.first_name, '');
                              //        if(notifiedCustomers_data.length>0){
                              //          // Notify Users about their cancel enrollment sgt_schedule_cancel
                              //          //  emailUtil.sendEmail(emailBody, '' , emailSubject, '' , '' , user_data.email, 'Your Name', '');
                              //          let emailSubject = 'GoTribe : SGT/PT/OPT Schedule';
                              //            for(var i = 0; i < notifiedCustomers_data.length; i++) {
                              //              let my_name = notifiedCustomers_data[i].first_name || "Gotribe User";
                              //             //  let emailBody = 'Dear '+my_name+' , your Schedule Cancelled by tainer';
                              //              scheduleEmail.cancel_schedule_by_staff_ptopt_customer(notifiedCustomers_data[i], user_data, license_cb, enroll_DateTime, hn_wo_port, enrollStatus);
                              //               // emailUtil.sendEmail(emailBody, '' , emailSubject, '' , '' , notifiedCustomers_data[i].email,
                              //               //    my_name, '');
                              //                  notifiedCustomers_data[i].type = schedule_list_data_details.schedule_type|| "";
                              //                deviceValid.checkDeviceType(notifiedCustomers_data[i], "cancel_trainer", user_data);
                              //                scheduleEmail.cancel_schedule_by_ptopt_staff( notifiedCustomers_data[i],user_data, license_cb, enroll_DateTime, hn_wo_port, enrollStatus);
                               //
                              //            }
                              //          }
                              //      });
                              //    }
                              //  }


                                  //  console.log('emailUtil'+i);
                                    // var array = notifiedCustomers_data;
                                    // asyncLoop(array, function (item, next)
                                    // {
                                    //     do.some.action(item, function (err)
                                    //     {
                                    //         if (err)
                                    //         {
                                    //             next(err);
                                    //             return;
                                    //         }
                                    //
                                    //         next();
                                    //     });
                                    // }, function (err)
                                    // {
                                    //     if (err)
                                    //     {
                                    //         console.error('Error: ' + err.message);
                                    //         return;
                                    //     }
                                    //
                                    //     console.log('Finished!');
                                    // });
                             }
                           });

                         }
                       });
                    }
                });
              }else{
                // let response_data = status_codes.superadmin_not_cancel;
                let response_data = status_codes.no_role_name;
                // console.log(response_data);
                let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                res.end(enc);
              }
            }

          }
        }
      });
    }else{
      // other than 1,2,3,4,6,7,8
      let response_data = status_codes.no_role_name;
      // console.log(response_data);
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }
     }
    }
  });
}



function handleWaitingListClient(req, res, iv, schedule_list_id, user_data, userid, schedule_list_data_details){
  /* *******************Handle waiting list and notify */

  // Schedule Canceled by client
  let hn_wo_port = inputValidation.hostnameSeparator(req.headers.host);

  let waitinglist_management_query = 'UPDATE gym_attendance SET waiting = (waiting-1) WHERE schedule_id = "'+
   schedule_list_id +'" AND waiting != "0"';
   connection_db.query(waitinglist_management_query,function(err,wait_status_data){
     if(err){
       // throw err;
       let response_data = status_codes.db_error_0001;
      //  console.log(response_data);
       let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
       res.end(enc);
     }else {
        // Notify Users about their cancel enrollment sgt_schedule_cancel
        // userDataNotifications.getUserData(req, res, iv, user_data.assign_staff_mem, function(train_cb){
        //   train_cb.schedule_type = "SGT";
        //   /* For email */
        //   // let staff_by = subs_data_details.assign_staff_mem;
        //   let enroll_DateTime = {
        //     "scheduleDate" : schedule_list_data_details.schedule_date || "",
        //     "start_time" : schedule_list_data_details.start_time|| "",
        //     "classTitle": schedule_list_data_details.classTitle|| "",
        //     "days": schedule_list_data_details.days|| ""
        // };
        // let enrollStatus = false;
        //   /* End of email */
        //   deviceValid.checkDeviceType(user_data,"cancel",train_cb);
        //   // inputValidation.send_enroll_msg_on_emailCus(user_data.email);
        //   // inputValidation.send_enroll_msg_on_emailSta(user_data.email);
        //   userDataNotifications.getUserData(req, res, iv, train_cb.associated_licensee, function(license_cb){
        //     scheduleEmail.send_schedule_sgt_client(user_data, train_cb, license_cb, enroll_DateTime, hn_wo_port, enrollStatus);
        //     scheduleEmail.send_schedule_sgt_staff(user_data, train_cb, license_cb, enroll_DateTime, hn_wo_port, enrollStatus);
        //   });
          // let emailBody = 'Your Schedule Cancelled', emailSubject = 'GoTribe : SGT Schedule';
          // emailUtil.sendEmail(emailBody, '' , emailSubject, '' , '' , user_data.email, 'Your Name', '');
          let response_data = status_codes.sgt_schedule_cancel;
          // console.log(response_data);
          let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
          res.end(enc);
        // });
     }
   });
}


module.exports = schedule;
