var crypto = require('crypto');
var dataBaseUtil = require("./mysql_data.js");
var emailUtil = require("./emailUtil.js");
var config = require('./config.json');
var status_codes = require('.././status_codes/status_codes.json');
var encrypt_decrypt = require('.././encrypt_decrypt/encryption-decryption.js');
var inputValidation = require('.././validation/input-validation.js');
var notifications = require('.././notifications/send-notifications.js');
var deviceValid = require('.././validation/deviceValidation.js');
var moment = require('moment'); // for time

// var fs = require('fs');

//
var CronJob = require('cron').CronJob;
var cron = require('cron');

//function will check if a directory exists, and create it if it doesn't

var fs = require('fs');
var mydir = 'push_notifications-log';
var extn = '.json';

fs.existsSync(mydir) || fs.mkdirSync(mydir);

// var currDate = inputValidation.currentTime();
// // var currDate = inputValidation.currentDateTime();
// var file = mydir+'/'+currDate.toString()+extn;
// var result = {};

// fs.readdir('.', (err, files)=>{
//    for (var i = 0, len = files.length; i < len; i++) {
//       var match = files[i].match(/en.*.js/);
//       if(match !== null)
//           fs.unlink(match[0]);
//    }
// });

//
// fs.readdir(mydir, (err, files)=>{
//   console.log(files);
//    for (var i = 0, len = files.length; i < len; i++) {
//       // var match = files[i].match(/en.*.js/);
//       console.log(files[i]);
//       var match = files[i];
//       if(match != file){
//         fs.unlink(mydir+"/"+match, (err) => {
//           if (err)
//               console.log("failed to delete local image:"+err);
//           else
//               console.log('successfully deleted local image');
//         });
//       } // not delete current file
//    }
// });;
//
//
//
// result.output = new Array();
// result.output.push({
// 		name: "Mikhail",
// 		age: 24
// 	});
// console.log(file);
// fs.stat(file, function(err,stat) {
//   //
//   if(err == null) {
//         console.log('File exists');
// 		readwrite(file);
//     } else if(err.code == 'ENOENT') {
//         // file does not exist
//         console.log('file does not exist');
//         // var readableStream = fs.createReadStream(file);
//       //  fs.writeFile('log.txt', 'Some log\n');
//         // fs.writeFile('foo.txt', 'fILE nOT eXISTS i AM WRITING IN THE FILE\n');
//         writeFunc(file, result);
//     } else {
//         console.log('Some other error: ', err.code);
//     }
//
//   // fs.appendFile(file, JSON.stringify(result.output), function (err1) {
//   // });
//
// });
//
//
//
// function readwrite(){
//   fs.readFile(file, 'utf8', function readFileCallback(err, data){
//       if (err){
//           console.log(err);
//       } else {
//         try{
//           result = JSON.parse(data); //now it an object
//           result.output.push({id: 2, square:3}); //add some data
//         }catch(e){
//         }finally{
//           writeFunc(file, result);
//         }
//     }
//   });
// }
//
//
// function writeFunc (file, result){
//     let json = JSON.stringify(result); //convert it back to json
//     console.log(json);
//     fs.writeFile(file, json, 'utf8', function (err1) {
//     }); // write it back
// }
//

//
// const fs = require('fs-extra');
//
const dir = 'push_notifications-log/';
// fs.ensureDir(dir, err => {
//   console.log(err) // => null
//   // dir has now been created, including the directory it is to be placed in
// })
//
// // With Promises:
// fs.ensureDir(dir)
// .then(() => {
//   console.log('success!')
// })
// .catch(err => {
//   console.error(err)
// });




//
// const file = 'tmp/vikas/file.txt'
// fs.ensureFile(file, err => {
//   console.log(err) // => null
//   // file has now been created, including the directory it is to be placed in
//
//   fs.outputFile(file, 'hellossss!', err => {
//     console.log(err) // => null
//
//     fs.readFile(file, 'utf8', (err, data) => {
//       if (err) return console.error(err)
//       console.log(data) // => hello!
//     });
//   })
//
//
// })
//
// // With Promises:
// fs.ensureFile(file)
// .then(() => {
//   console.log('success!')
// })
// .catch(err => {
//   console.error(err)
// })
//
//

var job = new CronJob('* * * * *', function() {
  // console.log('You will see this message every second');
}, null, false, 'America/Los_Angeles');

// var db_config = {
//   host     : 'localhost',
//   user     : 'root',
//   password : '',
//   database : 'local_db_gotribe'
// };
// var db_config = {
//   host     : 'localhost',
//   user     : 'root',
//   password : 'zAst7hekuch_hu',
//   database : 'gotribe'
// };
//
// var MySQLEvents = require('mysql-events');
// var dsn = {
//   host:     db_config.host,
//   user:     db_config.user,
//   password: db_config.password
// };
// var mysqlEventWatcher = MySQLEvents(dsn);
// // console.log(mysqlEventWatcher);
//
// // console.log('Before SqlWatcher');
//
// var watcher =mysqlEventWatcher.add(
//   'gotribe.gym_member',
//   // '"'+(db_config.database).gym_member+'"',
//
//   // 'myDB.table.field.value',
//   function (oldRow, newRow, event) {
//     // console.log('Hello'+'i am in sqlWatcher');
//      //row inserted
//     if (oldRow === null) {
//       //console('insert code goes here');
//     }
//
//      //row deleted
//     if (newRow === null) {
//       //delete code goes here
//     }
//
//      //row updated
//     if (oldRow !== null && newRow !== null) {
//       //update code goes here
//     }
//
//     //detailed event information
//     // console.log(event)
//   },
//   'Active'
// );



var cron = require('cron');
//
// // Android Device
// var FCM = require('fcm-push');
// var serverKey = config.serverKey;
// var fcm = new FCM(serverKey);
//
// // IOS Device
// var apn = require('apn');
// var options = {
//   token: {
//     key: "apns.p8",
//     keyId: config.keyId,
//     teamId: config.teamId
//   },
//   production: false
// };
//
// var apnProvider = new apn.Provider(options);
// var note = new apn.Notification();
// // note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
// note.badge = 3;
// note.sound = "ping.aiff";
// // note.alert = "\uD83D\uDCE7 \u2709 Hello Gauri Sir. ";
// // note.payload = {'messageFrom': 'John Appleseed'};
// note.topic = config.bundleId;


var firebase_adminsdk = require('.././server_key/my-first-project-7b1f9-firebase-adminsdk-gdbpo-ceac81c4fa.json');

var forge = require('node-forge');
// var fs = require('fs');


var d = new Date();
   var n = d.getDate();
  //  console.log(d);


// moment(myDate).subtract(1, 'hours'); .format('MMMM Do YYYY, h:mm:ss a');
// console.log(notDate);

   var connection_db = dataBaseUtil;

   try{


     var job1 = new cron.CronJob({
       cronTime: '1 0-23 * * *',
       onTick: function() {
         // console.log('job 1 ticked');
        //  usersToSendNotifications();
       },
       start: false,
       timeZone: 'America/Los_Angeles'
     });

   } catch(ex)  {
    //  console.log('cron pattern not valid');
   }



  //  try{
  //    var job2 = new cron.CronJob({
  //      cronTime: '*/10 * * * *',
  //      onTick: function(){
  //       //  console.log('Every dat at 10th minute');
  //       //  sendNotifications();
  //      },
  //      start: false,
  //      timeZone: 'America/Los_Angeles'
  //    });
  //  }catch(ex){
  //   //  console.log('Every 10th minute crone');
  //  }

  //  try{
  //    var job3 = new cron.CronJob({
  //      cronTime: '0 0 * * *',
  //      onTick: function(){
  //        console.log('Every day at mid-night');
  //        usersToSendNotifications();
  //      },
  //      started: false,
  //      timeZone: 'America/Los_Angeles'
  //    });
  //  }catch(ex){
  //    console.log('Cron catch exception');
  //  }



    // console.log('job2 status', job2.running); // job2 status undefined
    // console.log('job3 status', job3.running); // job3 status undefined

    // job3.start(); // job 3 started

    // job2.start(); // job 2 started
    // console.log('job2 status', job2.running);


    // usersToSendNotifications();
   function usersToSendNotifications(){

     var currDate = inputValidation.currentTime();
     // var currDate = inputValidation.currentDateTime();
     var file = mydir+'/'+currDate.toString()+extn;

     fs.readdir(mydir, (err, files)=>{
      //  console.log(files);
        for (var i = 0, len = files.length; i < len; i++) {
           // var match = files[i].match(/en.*.js/);
          //  console.log(files[i]);
           var match = mydir+"/"+files[i];
          //  if(match != file){
             fs.unlink(match, (err) => {
               if (err)
                   console.log("failed to delete local image:"+err);
               else
                   console.log('successfully deleted local image');
             });
          //  } // not delete current file
        }
     });


     setTimeout(
       function(){

    //  console.log(file);

      let curr_date_timeObj = {};
      curr_date_timeObj.curr_date_time = inputValidation.curr_date_time();
      curr_date_timeObj.getHours = (curr_date_timeObj.curr_date_time).getHours();
      curr_date_timeObj.OnlyHours = inputValidation.convertHrs(curr_date_timeObj.getHours);
      curr_date_timeObj.getMts = (curr_date_timeObj.curr_date_time).getMinutes();
      curr_date_timeObj.ampm = inputValidation.am_or_pm(curr_date_timeObj.getHours);
      curr_date_timeObj.onlyDate = inputValidation.YMDformat(curr_date_timeObj.curr_date_time);

      curr_date_timeObj.start_times = new Array(2);
      curr_date_timeObj.start_times = inputValidation.sch_class_time(curr_date_timeObj.getHours,
                                              curr_date_timeObj.getMts, curr_date_timeObj.ampm);

      curr_date_timeObj.start_time = new Array(2);
      curr_date_timeObj.start_time = inputValidation.sch_class_time(curr_date_timeObj.OnlyHours,
                                              curr_date_timeObj.getMts, curr_date_timeObj.ampm);
      // console.log(curr_date_timeObj);
      // console.log('curr_date_timeObj');

      let add2hrsinTimeObj = {};
      add2hrsinTimeObj.add2hrsinTime =  inputValidation.custom_add_hours_in_time(2);
      add2hrsinTimeObj.getHours = (add2hrsinTimeObj.add2hrsinTime).getHours();
      add2hrsinTimeObj.OnlyHours = inputValidation.convertHrs(add2hrsinTimeObj.getHours);
      add2hrsinTimeObj.getMts = (add2hrsinTimeObj.add2hrsinTime).getMinutes();
      add2hrsinTimeObj.ampm = inputValidation.am_or_pm(add2hrsinTimeObj.getHours);
      add2hrsinTimeObj.onlyDate = inputValidation.YMDformat(add2hrsinTimeObj.add2hrsinTime);

      add2hrsinTimeObj.start_times = new Array(2);
      add2hrsinTimeObj.start_times = inputValidation.sch_class_time(add2hrsinTimeObj.getHours,
                                      add2hrsinTimeObj.getMts, add2hrsinTimeObj.ampm);

      add2hrsinTimeObj.start_time = new Array(2);
      add2hrsinTimeObj.start_time = inputValidation.sch_class_time(add2hrsinTimeObj.OnlyHours,
                                              add2hrsinTimeObj.getMts, add2hrsinTimeObj.ampm);
      // console.log(add2hrsinTimeObj);
      // console.log('add2hrsinTimeObj');
      // console.log('usersToSendNotifications');
      // console.log(usersToSendNotifications);
      var getUsersNotifyQuery = 'select cs.schedule_type, cs.member_for, cs.assign_staff_mem, cs.licensee_id, cs.total_capacity,'+
                     ' cs.wait_list,csl.id as class_schedule_list_id, csl.class_id as schedule_id,csl.start_time, '+
                     ' concat(SUBSTRING_INDEX(gatt.attendance_date, "T",-1 ), " " ,csl.start_time ) as sch_concat,'+
                     ' csl.end_time, csl.days,SUBSTRING_INDEX(csl.schedule_date, "T",-1 ) as schedule_date, gm.first_name'+
                     ' as first_name, gm.last_name as last_name,  gm.email as email, gm.assign_staff_mem as trainer_id,'+
                     ' gatt.attendance_id as g_a_id, gatt.class_id'+
                     ' as gatt_class_id, gatt.user_id as gatt_user_id, SUBSTRING_INDEX(gatt.attendance_date, "T",-1 )'+
                     ' as gatt_attendance_date, gatt.status as gatt_status, gatt.attendance_by as gatt_attendance_by,'+
                     ' gatt.role_name as gatt_role_name, gatt.schedule_id as gatt_schedule_id, gatt.waiting as gatt_waiting,'+
                     ' pn.device_type, pn.device_address'+
                     ' From gym_attendance gatt'+
                     ' LEFT JOIN  class_schedule_list csl ON csl.id = gatt.schedule_id'+
                     ' LEFT JOIN  class_schedule cs ON csl.class_id = cs.id'+
                     ' LEFT JOIN gym_member gm ON gm.id = gatt.user_id'+
                     ' LEFT JOIN push_notification pn ON pn.user = gatt.user_id'+
                     ' where 1 AND'+
                     ' gatt.status = "Taken" AND  (gatt.waiting <= "2") AND'+
                     ' (gatt.attendance_date  = "'+ curr_date_timeObj.onlyDate +'" || '+
                     ' gatt.attendance_date  = "'+ add2hrsinTimeObj.onlyDate +'" ) order by gatt.attendance_id;';
                    //  ' (gatt.attendance_date  = "2017-07-28") '+
                    //  ' and gatt.user_id in (131228,27426,46733) order by gatt.attendance_id;'
     console.log(getUsersNotifyQuery + '\ngetUsers\b\bhjthr');
    //  console.log('getUsers\b\rhjthr');
     connection_db.query(getUsersNotifyQuery,function(err,sch_row){
      if(err){
        // let response_data = status_codes.db_error_0001;
        // console.log(response_data);
        // let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        // res.end(enc);
      }else{
        if(sch_row.length<=0){
          //do nothing
        }else{
          // makeUsersSchData(sch_row, file);
        }
      }
    });
      return true;
       }, 3000);
   }


  function makeUsersSchData(sch_row, file){

      var result = {};
      result.output = new Array();
      result.trainer = new Array();

      // console.log(moment(myDate).format('MMMM Do YYYY, h:mm:ss a') );
      // var timestamp = moment(myDate).format("X");
      // console.log(timestamp);
      fs.stat(file, function(err,stat) {
        //
        if(err == null) {
              console.log('File exists');
      		readwrite(file, result, sch_row);
          } else if(err.code == 'ENOENT') {
              // file does not exist
              console.log('file does not exist');
              // var readableStream = fs.createReadStream(file);
            //  fs.writeFile('log.txt', 'Some log\n');
              // fs.writeFile('foo.txt', 'fILE nOT eXISTS i AM WRITING IN THE FILE\n');
              writeFunc(file, result, sch_row);
          } else {
              console.log('Some other error: ', err.code);
          }

        // fs.appendFile(file, JSON.stringify(result.output), function (err1) {
        // });
      });


   }


  function readwrite(file, result, sch_row){
    fs.readFile(file, 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
          try{
            result = JSON.parse(data); //now it an object
            // result.output.push(sch_row); //add some data
          }catch(e){
            result = {};
            result.output = new Array();
            result.trainer = new Array();
          }finally{
            writeFunc(file, result, sch_row);
          }
      }
    });
  }


  function writeFunc (file, result, sch_row){

        // console.log((result.output).length);
        var clientTrainerData = new Array();
        let trainer_Ids = "";
        let get_trainer_data_query = 'select g.id, g.first_name, g.middle_name, g.last_name,g.email,'+
          ' pn.device_type, pn.device_address'+
          ' FROM gym_member g' +
          ' LEFT JOIN push_notification pn ON pn.user = g.id'+
          ' where 1 AND g.id IN ';

        if((result.output).length<=0){
          for(var i=0;i<sch_row.length;i++){
             // var mydate1 = ('2017-06-02 7:00 AM');
             let mydate1 = sch_row[i].sch_concat;
             let myDate = moment(mydate1,'YYYY-MM-DD hh:mm a');
             // let notDate = (myDate);
             myDate.subtract(1,'hours');
             sch_row[i].notification_time = myDate;
             //  try{
             //     //  var timestamp = moment(myDate).comb_date_time("X");
             //     //  console.log(timestamp);
             //  }catch(ex){
              //
             //  }moment().format('MMMM Do YYYY, h:mm:ss a');
            //  result.output
            clientTrainerData.push({
              "trainer_Id":sch_row[i].trainer_id,
              "schedule_type": sch_row[i].schedule_type
            });
            trainer_Ids = trainer_Ids + '"' +sch_row[i].trainer_id +'",';
            // trainer_Ids.push(sch_row[i].trainer_id);
             result.output.push(sch_row[i]);
            //  for(var )
          }
        }else{
            var tempOutput = [];
            var resOutput = result.output;
            for(var i=0;i<sch_row.length;i++){
              var flag = false;
              clientTrainerData.push({
                "trainer_Id":sch_row[i].trainer_id,
                "schedule_type": sch_row[i].schedule_type
              });
              trainer_Ids = trainer_Ids + '"' +sch_row[i].trainer_id +'",';
              for(var j=0;j<(resOutput).length;j++){
                let mydate1 = sch_row[i].sch_concat;
                let myDate = moment(mydate1,'YYYY-MM-DD hh:mm a');
                myDate.subtract(1,'hours');
                sch_row[i].notification_time = myDate;

                // console.log(resOutput[j].g_a_id);
                // console.log(sch_row[i].g_a_id);
                // console.log('sch_row[i].g_a_id');
                if(sch_row[i].g_a_id == resOutput[j].g_a_id){
                  resOutput[j] = sch_row[i]; // transfer new contents if id matched
                  flag = true;
                  break;
                }else{
                  if(i==0){
                    clientTrainerData.push({
                      "trainer_Id":sch_row[i].trainer_id,
                      "schedule_type": sch_row[i].schedule_type
                    });
                    trainer_Ids = trainer_Ids + '"' +sch_row[i].trainer_id +'",';
                  }
                }
              }
              if(!flag){
                tempOutput.push(sch_row[i]); // add new contents if id not matched in the file
              }
            }
            // console.log(tempOutput.length+' efuifuifgi');
            for(var i=0;i<tempOutput.length;i++){
              resOutput.push(tempOutput[i]);
            }
            result.output = resOutput;
        }

        trainer_Ids = trainer_Ids + '0';
        // console.log(trainer_Ids);
        get_trainer_data_query = get_trainer_data_query + ' ('+trainer_Ids+' )';
        // console.log(get_trainer_data_query);
        connection_db.query(get_trainer_data_query,function(err,staff_row){
         if(err){
           // let response_data = status_codes.db_error_0001;
           // console.log(response_data);
           // let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
           // res.end(enc);
         }else{
          //  console.log(clientTrainerData);
             if(staff_row.length>0){
               for(var k=0;k<staff_row.length;k++){
                 for(var l=0;l<clientTrainerData.length;l++){
                   if(clientTrainerData[l].trainer_Id == staff_row[k].id){
                     staff_row[k].schedule_type = clientTrainerData[l].schedule_type;
                   }
                 }

                 result.trainer.push(staff_row[k]);
               }
              //  result.trainer = staff_row;
             }
             let json;
             try{
               json = JSON.stringify(result); //convert it back to json
               // console.log(json);
               fs.writeFile(file, json, 'utf8', function (err1) {
               }); // write it back
             }catch(ex){
               //do nothing
             }finally{
               if((result.output).length>0){
                 clientNotifications(result.output);
               } // Client notifications
               setTimeout(function (){
                 if((result.trainer).length>0){
                   trainerNotifications(result.trainer);
                 } // Trainer notifications
               },3000);
             }
           }
         });
        // console.log(_.uniq([1, 2, 1, 3, 1, 4]));

    //
    // for(var i=0;i<sch_row.length;i++){
    //
    // }
  }

sendNotifications();
  function sendNotifications(){
    var currDate = inputValidation.currentTime();
    var file = mydir+'/'+currDate.toString()+extn;
    fs.readFile(file, 'utf8', function readFileCallback(err, data){
        if (err){
            // console.log(err);
            // console.log(err.code == 'ENOENT' && err.errno == -2)
            // console.log('File Not found');
            // console.log(err.code);
            // console.log(err.errno);
            // console.log( err.errno == -2);
            // console.log( err.code === 'ENOENT');
            if(err.code == 'ENOENT' && err.errno == -2){
                // console.log('Creating file ');
              usersToSendNotifications();
            }
        } else {
          usersToSendNotifications(); // updating file
          // let send_result = {};
          // send_result.output = new Array();
          // send_result.trainer = new Array();
          // try{
          //   send_result = JSON.parse(data); //now it an object
          // }catch(e){
          //   send_result = {};
          //   send_result.output = [];
          //   send_result.trainer = [];
          // }finally{
          //   if((send_result.output).length>0){
          //     clientNotifications(send_result.output);
          //   } // Client notifications
          //   if((send_result.trainer).length>0){
          //     trainerNotifications(send_result.trainer);
          //   } // Trainer notifications
          // }
      }
    });
  }



  function clientNotifications(clientData){

    // Hey (Client name), your scheduled SGT/PT/OPT class starts in 1 hour
    for(var i =0; i<clientData.length; i++){
      var my_name = clientData[i].first_name || "User";
      var my_schedule_type = clientData[i].schedule_type || "";
      var message_body = 'Hey '+ my_name + ' your scheduled ' +
      my_schedule_type + ' class starts in 1 hour';
      // console.log(message_body + ' client ');
      // console.log(clientData[i]);
        checkTime(clientData[i], message_body);
    }

  }



  function trainerNotifications(trainerData){
    // Hey (Trainer name), your scheduled SGT/PT/OPT class starts in 1 hour
    for(var j =0; j<trainerData.length; j++){
      var my_name = trainerData[j].first_name || "User";
      var my_schedule_type = trainerData[j].schedule_type || "";
      var message_body = 'Hey '+ my_name + ' your scheduled ' +
      my_schedule_type + ' class starts in 1 hour';
      // console.log(message_body+ ' trainer');
        checkTime(trainerData[j], message_body);
    }

  }

  function checkTime(userData, message_body){
    var format = "MMMM Do YYYY, h:mm:ss a";
    var curr_moment = moment(),
    after_mom = moment().add(10, 'minutes');
    var notif_time = (userData.notification_time);
    var my_notif_time = moment(notif_time);
      // var time = moment() gives you current time. no format required.
        // console.log(my_notif_time);
        // console.log(curr_moment);
        // console.log(after_mom);
      if (my_notif_time.isBetween(curr_moment, after_mom)) {

        // console.log('is between')
        if(userData.device_type=='an'){
          // push-notificattion send to android device
          // deviceValid.checkDeviceType(user_data,"enroll",train_cb);
          // notifications.androidDeviceNotification(userData, message_body);
        }else if(userData.device_type=='ios'){
          // push-notificattion send to ios device
          // notifications.iosDeviceNotification(userData, message_body);
        }else{
          // don't send notifications to device but send only on email
        }
      } else {
        // console.log('is not between')
      }
  }





   var android_user1 = 'dAYWXLyVIM8:APA91bE3HCeb6x0r2JqgBjU39ael4sMCgdzshGNz-iO3Rbu9oc0phDqxbCj3JyKEWevS3FXYLMvxZNQePINRXYhnXgImI8oOfzGgqWLzipIcRH04zDfXHBkhsG_JhlITl4mKFWTH9XIJ';


   //
  //  var message = {
  //      to: android_user, // required fill with device token or topics
  //      //  priority : "high",
  //      // collapse_key: 'your_collapse_key',
  //      // data: {
  //      //     your_custom_data_key: 'your_custom_data_value'
  //      // },
  //      notification: {
  //          title: 'Gotribe',
  //          body: 'Body of your push notification'
  //      }
  //  };

  //  fcm.send(message, function(err,response){
  //      if(err) {
  //          console.log("Something has gone wrong w/o cron !");
  //      } else {
  //          console.log("Successfully sent with resposne w/o cron :",response);
  //      }
  //  });




//
//   apnProvider.send(note, ios_user).then( (result) => {
//   // see documentation for an explanation of result
//   console.log('send');
//   console.log(result.failed);
// });
   //
  //  var message1 = {
  //      to: ios_user, // required fill with device token or topics
  //      // collapse_key: 'your_collapse_key',
  //      // data: {
  //      //     your_custom_data_key: 'your_custom_data_value'
  //      // },
  //      notification: {
  //          title: 'Title of your push notification',
  //          body: 'Body of your push notification'
  //      }
  //  };

  //  fcm.send(message1, function(err,response){
  //      if(err) {
  //          console.log("Something has gone wrong apple!"+err);
  //          console.log(err);
  //      } else {
  //          console.log("Successfully sent with resposne apple:",response);
  //      }
  //  });

  //  var keyFile = fs.readFileSync("http://54.219.175.76/RNFAPNS.pem", 'binary');
  //  // var keyFile = fs.readFileSync(".././server_key/Certificates.p12", 'binary');
  //  var p12Asn1 = forge.asn1.fromDer(keyFile);
   //
  //  var p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, '123456');
   //
  //  var bags = p12.getBags({bagType: forge.pki.oids.certBag});
   //
  //  var bag = bags[forge.pki.oids.certBag][0];
   //
  //  // convert to ASN.1, then DER, then PEM-encode
  //  var msg = {
  //    type: 'CERTIFICATE',
  //    body: forge.asn1.toDer(bag.asn1).getBytes()
  //  };
  //  var pem = forge.pem.encode(msg);
   //
  //  console.log(pem);





  //  const apn = require("apn");
  //
  //  let tokens = ["<insert token here>", "<insert token here>"];
  //
  //  let service = new apn.Provider({
  //    cert: ".././certificates/cert.pem",
  //    key: ".././certificates/key.pem",
  //  });
  //
  //  let note = new apn.Notification({
  //  	alert:  "Breaking News: I just sent my first Push Notification",
  //  });
  //
  //  // The topic is usually the bundle identifier of your application.
  //  // note.topic = "<bundle identifier>";
  //
  //  console.log(`Sending: ${note.compile()} to ${tokens}`);
  //  service.send(note, tokens).then( result => {
  //      console.log("sent:", result.sent.length);
  //      console.log("failed:", result.failed.length);
  //      console.log(result.failed);
  //  });
  //
  //
  //  // For one-shot notification tasks you may wish to shutdown the connection
  //  // after everything is sent, but only call shutdown if you need your
  //  // application to terminate.
  //  service.shutdown();



//
// var job2 = new cron.CronJob({
//   cronTime: '* * * * *',
//   onTick: function() {
//     console.log('job 2 ticked');
//   },
//   start: false,
//   timeZone: 'America/Los_Angeles'
// });
//
// console.log('job1 status', job1.running); // job1 status undefined
// console.log('job2 status', job2.running); // job2 status undefined
//
// job1.start(); // job 1 started
//
// console.log('job1 status', job1.running); // job1 status true
// console.log('job2 status', job2.running); // job2 status undefined
//
// console.log('before job.start status', job1.running); // job status
// job.start();
// console.log('after job.start status', job1.running); // job status
