
var inputValidation = require('./input-validation.js');
var notifications = require('.././notifications/send-notifications.js');

module.exports = {

  checkDeviceType: function checkDeviceType(client,status,trainer){
    // console.log('client Data');
    // console.log(client);
    // console.log('status');
    // console.log(status);
    // console.log('trainer Data');
    // console.log(trainer);
      try{
        var trainer_name = trainer.first_name || "Trainer";
        var client_name = client.first_name || "Client";

        let isDevice, isDeviceAdd, send_data;
        var message_body;
        if(status=='enroll'){
          message_body = 'Hey '+ trainer_name + ', ' +
          client_name + ' has enrolled in your SGT class';
          // console.log(message_body + ' enroll');
          send_data = trainer;
        }else if(status=='cancel'){
          message_body = 'Hey '+ trainer_name + ', ' +
          client_name + ' has cancelled his enrolled SGT';
          // console.log(message_body + ' cancel');
          send_data = trainer;
        }else if(status=='cancel_trainer'){
          message_body = 'Hey '+ client_name + ', ' +
          trainer_name + ' has cancelled his scheduled SGT';
          // console.log(message_body + ' cancel');
          send_data = client;
        }else if(status=='cancel_trainer_byLicense'){
          /*
            // here  trainer word means license_name
            // and client means trainer
          */
          var license_name = trainer.first_name || "license";
          var trainer_under_license = client.first_name || "Trainer";
          // Hey (Trainer name), (licensee_name) has created your SGT schedule
          message_body = 'Hey '+ trainer_under_license + ', ' +
          license_name + ' has cancelled your scheduled SGT';
          // console.log(message_body + ' cancel');
          send_data = client;
        }
        isDevice = inputValidation.isValid(send_data.device_type);
        isDeviceAdd = inputValidation.isValid(send_data.device_address);
        // console.log(isDevice && isDeviceAdd);
        // // console.log(send_data.id);
        // console.log(send_data.device_type);
        // console.log(send_data.device_type);
        // Sending to Trainer or Client
        if(isDevice && isDeviceAdd){
          if(send_data.device_type == "an"){
            notifications.androidDeviceNotification(send_data, message_body);
          }else if(send_data.device_type == "ios"){
            notifications.iosDeviceNotification(send_data, message_body);
          }
        }
        return;
      }catch(ex){
        return;
      }
    }


  }
