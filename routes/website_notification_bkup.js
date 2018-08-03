var crypto = require('crypto');

var emailUtil = require("./emailUtil.js");
var config = require('./config.json');
var status_codes = require('.././status_codes/status_codes.json');
var request = require('request');
var web_notif_cron = require('./website_not_conig.json');


// console.log(web_notif_cron.cronAutopays);
var CronJob = require('cron').CronJob;
var cron = require('cron');


   try{
     var job3 = new cron.CronJob({
       cronTime: '10 0 * * *',
       onTick: function(){
         console.log('Every day at 12:10th minute');
         hitWebsiteUrl( web_notif_cron.cronMembership);
       },
       start: false,
       timeZone: 'America/Los_Angeles'
      //  timeZone: 'GMT'
     });
   }catch(ex){
     console.log('Every day at 12:10th minutecrone');
   }


   try{
     var job4 = new cron.CronJob({
       cronTime: '20 0 * * *',
       onTick: function(){
         console.log('Every day at 12:20th minute');
         hitWebsiteUrl( web_notif_cron.cronAutopay);
       },
       start: false,
       timeZone: 'America/Los_Angeles'
      //  timeZone: 'GMT'
     });
   }catch(ex){
     console.log('Every day at 12:20th minutecrone');
   }


   try{
     var job5 = new cron.CronJob({
       cronTime: '30 0 * * *',
       onTick: function(){
         console.log('Every day at 12:30th minute');
         hitWebsiteUrl( web_notif_cron.cronAutopayOldClient);
       },
       start: false,
       timeZone: 'America/Los_Angeles'
      //  timeZone: 'GMT'
     });
   }catch(ex){
     console.log('Every day at 12:30th minutecrone');
   }


   try{
     var job6 = new cron.CronJob({
       cronTime: '40 0 * * *',
       onTick: function(){
         console.log('Every day at 12:40th minute');
         hitWebsiteUrl( web_notif_cron.cronAutopayMembership);
       },
       start: false,
       timeZone: 'America/Los_Angeles'
      //  timeZone: 'GMT'
     });
   }catch(ex){
     console.log('Every day at 12:40th minutecrone');
   }


   try{
     var job7 = new cron.CronJob({
       cronTime: '50 0 * * *',
       onTick: function(){
         console.log('Every day at 12:50th minute');
         hitWebsiteUrl( web_notif_cron.cronLicenseeFeeAmt);
       },
       start: false,
       timeZone: 'America/Los_Angeles'
      //  timeZone: 'GMT'
     });
   }catch(ex){
     console.log('Every day at 12:50th minutecrone');
   }





   try{
     var job8 = new cron.CronJob({
       cronTime: '0 1 8,23 * *',
       onTick: function(){
         console.log('8th and 23rd of every month');
         hitWebsiteUrl(web_notif_cron.cronPayroll);
       },
       start: false,
       timeZone: 'America/Los_Angeles'
      //  timeZone: 'GMT'
     });
   }catch(ex){
     console.log('8th and 23rd of every month crone');
   }




   console.log('job3 status', job3.running); // job3 status undefined

   job3.start(); // job 3 started

   console.log('job3 status', job3.running); // job3 status true



   console.log('job4 status', job4.running); // job4 status undefined

   job4.start(); // job  started

   console.log('job4 status', job4.running);



   console.log('job5 status', job5.running); // job5 status undefined

   job5.start(); // job  started

   console.log('job5 status', job5.running);



   console.log('job6 status', job6.running); // job6 status undefined

   job6.start(); // job  started

   console.log('job6 status', job6.running);


   console.log('job7 status', job7.running); // job7 status undefined

   job7.start(); // job  started

   console.log('job7 status', job7.running);


   console.log('job8 status', job8.running); // job8 status undefined

   job8.start(); // job  started

   console.log('job8 status', job8.running);



   function hitWebsiteUrl(postUrl){

     let fsc = require('fs');

     try{
       console.log(postUrl);
     request.post(
         postUrl,
         // { json: { key: 'value' } },
         function (error, response, body) {
             // if (!error && response.statusCode == 200) {
             //     console.log(body)
             // }
             if(error){
               // throw error;

               fsc.appendFile('./website_not_error.txt', error, function (err1) {

               });


               console.log('Web Port error');
               console.log(error);
             }
             else if(response.statusCode == 200) {
              //  console.log(response.body);
               // console.log('/home/rnf-022/VikasKohli_Workspace/project/routes/httpUtil.js');
               // console.log(response.body);
                 console.log(response.statusCode + 'Success');


                 fsc.appendFile('./website_not_success.txt', JSON.stringify(response), function (err1) {

                 });


             }else{
               fsc.appendFile('./website_not_error.txt', JSON.stringify(response), function (err1) {

               });

               console.log(response.statusCode);
               console.log('my name'+' not success');
             }
         });
     }catch(e){
       console.log('request error');
     }
   }

    //  dailyCron();
    //  specificDayCron();
