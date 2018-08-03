var dataBaseUtil = require(".././routes/mysql_data.js");
var config = require("../routes/config.json");
var pushNotifHistory = require("../routes/push-notification-history.js");
var inputValidation = require('.././validation/input-validation.js');
var encrypt_decrypt = require('.././encrypt_decrypt/encryption-decryption.js');



var connection_db = dataBaseUtil;



var cryptkey = encrypt_decrypt.generate_crypt_key();


// Android Device
var FCM = require('fcm-push');
var serverKey = config.serverKey;
var fcm = new FCM(serverKey);


module.exports = {


  androidDeviceNotification: function androidNotification(send_data,message_body) {
    // console.log('send_data to android');
    // console.log(send_data);
    var android_user = send_data.device_address;
    var message = {
        to: android_user, // required fill with device token or topics
        //  priority : "high",
        // collapse_key: 'your_collapse_key', androidDeviceNotification
        data: {
            type: send_data.schedule_type,
            message: message_body,
            user: send_data.id,

        }
        // notification: {
        //     title: 'Gotribe',
        //     body:  message_body
        // }
    };

    fcm.send(message, function(err,response){
        if(err) {
            // console.log("Something has gone wrong w/o cron !");
        } else {
            // console.log("Successfully sent with resposne w/o cron :",response);
            save_notification(send_data,message_body);
        }
    });

  },


    iosDeviceNotification: function iosNotification(send_data,message_body) {
      // console.log('Sending to ios');
      //   console.log(send_data);
      //   let curr_date_time = inputValidation.currentDateTime();
      //   let notification_data = {
      //     "user": send_data.user_id,
      //     "device_address": send_data.device_address,
      //     "device_type": send_data.device_type,
      //     "message": message_body,
      //     "type": "SGT"
      // }
      //
      //   var query = connection_db.query('INSERT INTO push_notification_history SET ?', notification_data,
      //     function (error, results, fields) {
      //   if (error){
      //     // throw error;
      //     // let response_data = status_codes.db_error_0001;
      //     // console.log(response_data);
      //     // let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      //     // res.end(enc);
      //   }else{
      //     // let response_data = status_codes.measure_history_added;
      //     // console.log(response_data);
      //     // let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      //     // res.end(enc);
      //   }
      // });

	// IOS Device
	var apn = require('apn');
	var options = {
	  token: {
	    key: "apns.p8",
	    keyId: config.keyId,
	    teamId: config.teamId
	  },
	  production: true
	};


	var apnProvider = new apn.Provider(options);
	var note = new apn.Notification();
	// note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
	note.badge = 0;
	note.sound = "ping.aiff";
	// note.alert = "\uD83D\uDCE7 \u2709 Hello Gauri Sir. ";
	// note.payload = {'messageFrom': 'John Appleseed'};
	note.topic = config.bundleId;


      var ios_user = send_data.device_address;
      // note.alert = "\uD83D\uDCE7 \u2709 " + message_body;
      note.alert = message_body;
      note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
      note.payload = {
        type: send_data.schedule_type,
        message: message_body,
        user: send_data.id
    };

      apnProvider.send(note, ios_user).then( (result) => {
        // see documentation for an explanation of result
          // console.log('send');
          // console.log(' ios send now check result');
          // console.log(result.failed);
          // console.log(result);
          // if((response.sent).length){
          if((result.sent).length){
            save_notification(send_data,message_body);
          }

        });

    }



}


function save_notification(send_data,message_body){
    let curr_date_time = inputValidation.currentDateTime();
    let notification_data = {
      "user": send_data.id,
      "device_address": send_data.device_address,
      "device_type": send_data.device_type,
      "message": message_body,
      "type": send_data.schedule_type
  };
  // console.log(notification_data);
  //   console.log('notification_data');
    var query = connection_db.query('INSERT INTO push_notification_history SET ?', notification_data,
      function (error, results, fields) {
    if (error){
      // throw error;
      // let response_data = status_codes.db_error_0001;
      // console.log(response_data);
      // let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      // res.end(enc);
    }else{
      // let response_data = status_codes.measure_history_added;
      // console.log(response_data);
      // let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      // res.end(enc);
    }
    // console.log(query.sql);
    // console.log(results);
    // console.log(fields);
    // console.log(error);
    return;
  });
}
