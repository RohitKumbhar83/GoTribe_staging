var express = require('express');
var router = express.Router();
var user = require('./users.js');
var new_user = require('./new_users.js');
// var socketCon = require('./socketConnection/socket-io.js');

var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });

var bug_reports = require('./bug_report.js');
var calendar = require('./calendar_information.js');
var measurements = require('./measurement_information.js');
var passwords = require('./user_password.js');
var goal_info = require('./goal_information.js');
var profile_data = require('./profileInfo.js');
var user_workout = require('./workout_information.js');
var refer = require('./refer_and_earn.js');
var overhead_squat = require('./overhead_squat.js');
var member = require('./member_client.js');
var schedules = require('./schedule_list.js');
var notification_address = require('./save-notification-address.js');
var app_password = require('./app_password.js');
var nutrition = require('./nutrition.js');
var notifications = require('./push_notifications.js');
var push_notif_history = require('./push-notification-history.js');
var file_uploader = require('./file-Uploader.js');
var payment_data = require('./payment.js');
var goal_status_cron = require('./goalStatusCron.js');

// var emailSetUp = require('.././templates/emailSetup.js');

var website_not = require('./website_notification.js');

// var aes256 = require('nodejs-aes256');
//
// var public_key = "public key";
// var plaintext = "rnf@1123";

// var data = '{"username":"ahmad","password":"ahmad123#","device":"android","IP":"123.256.2.8"}';
//

// var crypto = require('crypto');
// var cryptedData = crypto.createHash('md5').update(data).digest("hex");
//
// var ciphertext = aes256.encrypt(public_key,data);
// console.log(ciphertext);
// console.log(cryptedData+" \n cryptedData");

//
// var crypto = require('crypto');
// var s = 'Hello World';
// console.log(
//     new Buffer(
//         crypto.createHmac('SHA256', 'SECRET').update(s).digest('hex')
//     ).toString('base64')
// );
//
//
//
// console.log(new Buffer("Hello World").toString('base64'));
// //SGVsbG8gV29ybGQ=
//
//
// var generated_hash = require('crypto')
// .createHash('md5')
// .update('my super secret data', 'utf8')
// .digest('hex')
// console.log(generated_hash+'rugby');
//
//
//
//
// var crypto = require('crypto'),
//     algorithm = 'aes-256-ctr',
//     password = 'd6F3Efeq';
//
// function encrypt(buffer){
//   var cipher = crypto.createCipher(algorithm,password)
//   var crypted = Buffer.concat([cipher.update(buffer),cipher.final()]);
//   return crypted;
// }
//
// function decrypt(buffer){
//   var decipher = crypto.createDecipher(algorithm,password)
//   var dec = Buffer.concat([decipher.update(buffer) , decipher.final()]);
//   return dec;
// }
//
// var hw = encrypt(new Buffer("hello world", "utf8"));
// console.log(hw);
// // outputs hello world
// console.log(decrypt(hw).toString('utf8')+'decrypt');
//


//
//
// var crypto = require("crypto")
//
// function encrypt(key, data) {
//         var cipher = crypto.createCipher('aes-256-cbc', key);
//         var crypted = cipher.update(text, 'utf-8', 'hex');
//         crypted += cipher.final('hex');
//
//         return crypted;
// }
//
// function decrypt(key, data) {
//         var decipher = crypto.createDecipher('aes-256-cbc', key);
//         var decrypted = decipher.update(data, 'hex', 'utf-8');
//         decrypted += decipher.final('utf-8');
//
//         return decrypted;
// }
// var data = {
//   "username":"ahmad","password":"ahmad123#","device":"android","IP":"123.256.2.8"
// }
// console.log('Original Data:'+data.username);
// var key = "supersecretkey";
// var text = "',"+data+"',";
// console.log("Original Text:fd " + JSON.stringify(text));
// var data1 = text.split("',")[1];
// console.log("Original Text:  data1" + JSON.stringify(data1));
// console.log("Original Text:  data1" + data1.username);
//
// var encryptedText = encrypt(key, text);
// console.log("Encrypted Text: " + encryptedText);
// var decryptedText = decrypt(key, encryptedText);
// console.log("Decrypted Text: " + decryptedText);
//
// console.log("\nAnd again...\n");
//
// console.log("Original Text: " + text);
// encryptedText = encrypt(key, text);
// console.log("Encrypted Text: " + encryptedText);
// decryptedText = decrypt(key, encryptedText);
// console.log("Decrypted Text: " + decryptedText);
//
// text = "this is another text";
// key = "this is another key";
//
// console.log("\nNew text: & key: " + text);
//
// encryptedText = encrypt(key, text);
// console.log("Encrypted Text: " + encryptedText);
// decryptedText = decrypt(key, encryptedText);
// console.log("Decrypted Text: " + decryptedText);



// //import crypto module to generate random binary data
// var crypto = require('crypto');
//
// // generate random passphrase binary data
// var r_pass = crypto.randomBytes(128);
//
// // convert passphrase to base64 format
// var r_pass_base64 = r_pass.toString("base64");
//
// console.log("passphrase base64 format: ");
// console.log(r_pass_base64);

// var crypto = require('crypto');
// var key="Crypto Key";
// var encrypt_key = new Buffer(
//         crypto.createHmac('SHA256', 'SECRET').update(key).digest('hex')
//     ).toString('base64')
// console.log(encrypt_key);
//
//
//
// var sharedSecret = crypto.randomBytes(32);
// var signer = crypto.createHmac('sha256', encrypt_key);
//
// var plaintext = "Everything's gonna be 200 OK!";
// var signature;
//
// signer.update(plaintext);
// signature = signer.digest('hex');
// console.log(plaintext);
//
//
// var crypto = require('crypto');
// var key="Crypto Key";
// var encrypt_key = new Buffer(
//         crypto.createHmac('SHA256', 'SECRET').update(key).digest('hex')
//     ).toString('base64')
// console.log(encrypt_key);
// var CryptoJS = require("crypto-js");
//
// var data = {
// id: 1,
//  iwd: 2}
//
// // Encrypt
// var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), encrypt_key);
//
// console.log(ciphertext.toString());
// // Decrypt
// var bytes  = CryptoJS.AES.decrypt(ciphertext.toString(), encrypt_key);
// var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
//
// console.log(decryptedData);


// //
// const assert = require('assert');
// var encryptionHelper = require(".././encrypt_decrypt/encrypt-decrypt.js");
// var story = "this is the story of the brave prince who went off to fight the horrible dragon... he set out on his quest one sunny day";
// var algorithm = encryptionHelper.CIPHERS.AES_256;
// var new_story =  {
// "id": 1,
//  "iwd": 2};
//  story = new_story;
// console.log("testing encryption and decryption");
// console.log("text is: " + story);
//
// encryptionHelper.getKeyAndIV("1234567890abcdefghijklmnopqrstuv", function (data) { //using 32 byte key
//
//     console.log("got key and iv buffers");
//
//     var encText = encryptionHelper.encryptText(algorithm, data.key, data.iv, JSON.stringify(story), "base64");
//
//     console.log("encrypted text = " + encText);
//
//     var decText = encryptionHelper.decryptText(algorithm, data.key, data.iv, encText, "base64");
//
//     console.log("decrypted text = " + decText);
//
//     //assert.equal(decText, story);
// });

// var cron = require('node-cron');
// var task = cron.schedule('1,2,4,5 * * * *', function() {
//   console.log('running every minute 1, 2, 4 and 5');
// });
// task.start();

/*
 * Routes that can be accessed by any one
 */

/* Our Starting Point */

// Service Start Url
router.get('/', user.checkService);

// SignUp Url
router.post('/signup', user.new_signup);

// New Sign Up URL
router.post('/new/signup', new_user.new_user_signup);

// Login Url
router.post('/oauth', user.login_oauth);

// Match Random Generated OTP Values
router.post('/matchValues', user.match_rand_OTP);

// Generated OTP Values
router.get('/generateOTP/:emailId', user.generate_rand_OTP);

// Password Recovery Url
router.post('/password/recovery', passwords.passsword_recovery);

// Password Link Match Password Reset Token and Set New Password
router.post('/password/matchTokenSavePassword', passwords.match_token_save_password);

/* Add headers for each userid */

// Save Baseline Measurement
router.post('/user/:userid/baseline/measurement', measurements.save_baseline_measure);

// Get Baseline Measurement
router.get('/user/:userid/baseline/measurement', measurements.get_baseline_measure);

// Save Profile Data
router.post('/user/:userid/profile', profile_data.save_profile);

// Get Profile Data
router.get('/user/:userid/profile', profile_data.get_profile);

// Calendar Information
router.get('/user/:userid/workout/calendar', calendar.calendar_info);


/* Measurement History Starts */

// Measurement Information that user added on daily basis not confused with baseline measurement data

// Get Measurement_History Data
router.get('/user/:userid/measurement/history/:measurement_hist_id', measurements.get_measure_info)  ;

// Add Measurement_History Data
router.post('/user/:userid/measurement/history', measurements.add_measurement);

// Update Measurement_History Data
router.put('/user/:userid/measurement/history/:measurement_hist_id', measurements.update_measurement);

// Delete Measurement_History Data
router.delete('/user/:userid/measurement/history/:measurement_hist_id', measurements.delete_measurement);

/* Measurement History ended */

// Password Update i.e Change Password Url
router.post('/user/:userid/password/update', passwords.pass_update);




/* User Workout Starts */

//  gym_user_workout daily data

// Get Workout Data
// router.get('/user/:userid/workout/:workout_id', user_workout.get_workout_info);
router.get('/user/:userid/workout/', user_workout.get_workout_info);

// Add Workout Data
router.post('/user/:userid/workout', user_workout.add_workout);

// Update Workout Data
router.put('/user/:userid/workout/:workout_id', user_workout.update_workout);

// Delete Workout Data
router.delete('/user/:userid/workout/:workout_id', user_workout.delete_workout);

/* User Workout ended */


// Get workout information from calender (measurement_history and workout)
router.post('/user/:userid', calendar.workout_info);



/* User Goal Starts */

//  gym_member_goal

// Get goals list(Active or Succeed)
router.get('/user/:userid/goal/activesucceed', goal_info.active_succeed_Goals);

// Get all goals list
router.get('/user/:userid/goal', goal_info.user_goals);

// Get single
router.get('/user/:userid/goal/:goal_id', goal_info.single_goal);

// Create or Add New Goal
router.post('/user/:userid/goal', goal_info.create_goal);

// Update Goal
router.put('/user/:userid/goal/:goal_id', goal_info.update_goal);

// Delete Goal
router.delete('/user/:userid/goal/:goal_id', goal_info.delete_goal);

/* User Goal ended */


/* Monitor Starts */

// Save or Update Monitor
router.put('/user/:userid/profile/monitor',profile_data.saveUpdate_monitorIP);

// Get Monitor
router.get('/user/:userid/profile/monitor',profile_data.get_monitor_data);

// Delete Monitor
router.delete('/user/:userid/profile/monitor',profile_data.del_monitor_data);

/* Monitor Ends */

// Report an issue
router.post('/user/:userid/report',bug_reports.save_bug_info);

// Refer a Friend
router.post('/user/:userid/refer',refer.save_refer_info);

// Get overhead Squat info
router.get('/user/:userid/overhead', overhead_squat.get_overhead_info);

// Save overhead Squat info
router.post('/user/:userid/overhead', overhead_squat.save_overhead_info);

// List of Clients with filters and by default take goal_id from app
router.post('/user/:userid/:roleid/clients', member.members_under_trainer);

//Get latest Measurement History If not then get baseline_measurement
router.get('/user/:userid/measurement/latest', measurements.latest_measurement);

// Profile Data, Baseline Data, Overhead_Squa Data
router.get('/user/:userid/profile_squat_baseline',member.get_profile_squat_baseline_nut);

/* Classes Schedules or Appointments*/

// All schedules List
router.get('/user/:userid/schedule/list', schedules.view_schedules);

// Enroll to a class
router.post('/user/:userid/schedule/enroll/:scheduleid', schedules.enroll_class);

// View enroll classes i.e my appointments
router.get('/user/:userid/schedule/my_schedule', schedules.my_schedules);

// User can can cancel his sgt enrolled schedule
// router.post('/user/:userid/schedule/sgt/cancel/:scheduleid', schedules.cancel_sgt_schedule);

// User can can cancel his sgt, pt and opt enrolled schedule
router.post('/user/:userid/schedule/sgt/cancel/:scheduleid', schedules.cancel_sgtPTOPT_schedule);

/* End of Classes Schedules */

/* User Notification Starts */

// Save Notification i.e Add or update
router.post('/user/:userid/notification', notification_address.save_notification_add);

// Get Notification History
router.get('/user/:userid/notification/history', push_notif_history.get_notification_history);

/* User Notification Ends */

// Save app_password when user do anything password related activity on web-portal
router.post('/user/:userid/app/:token', app_password.save_app_pass);

/* User Nutrition  */

// Save Nutrition gym_nutrition
router.post('/user/:userid/nutrition', nutrition.save_nutrition);

// Update Nutrition gym_nutrition Data
router.put('/user/:userid/nutrition/:nutritionid', nutrition.update_nutrition);

// Get Nutrition Data By date gym_nutrition
router.get('/user/:userid/nutrition/', nutrition.get_nutrition);

// Get Nutrition Data By id gym_nutrition
router.get('/user/:userid/nutrition/:nutritionid', nutrition.get_nutrition_info);

/* End User Nutrition */

/* File Uploader */

// Upload Profile Pic and Measurement Pic
router.post('/user/:userid/upload', upload.single('avatar'), file_uploader.upld_profile_measure_pic);

// View Profile Pic and Measurement Pic
router.get('/userimage', file_uploader.show_upload_images);



/* End of File Uploader */

/* Add headers for each userid */


/* Payment Information */

// View My Paycheck
router.get('/user/:userid/:roleid/paycheck', payment_data.get_my_paycheck);

// // View My Payroll by payment id
// router.get('/user/:userid/:roleid/payrollid/:payrollid', payment_data.get_my_payroll);

// View My Payroll by latest payment
router.get('/user/:userid/:roleid/latest/payroll', payment_data.get_my_latest_payroll);

/* End of Payment Information  */


// router.post('/');

module.exports = router;
