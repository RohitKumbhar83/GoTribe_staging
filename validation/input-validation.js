var crypto = require('crypto');
var email_check = require('email-validator');
var emailUtil = require("../routes/emailUtil.js");
var config = require("../routes/config.json");




var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];


function isValid (isFound){
  // console.log(isFound+'isValid function');
    var isValue = true;
    if(isFound==null || isFound=="" || isFound ==undefined){
      isValue = false;
    }
    return isValue;
}

function validateAllRequiredFields(inputToValidate) {
  var result = true;
  for(var i=0;i<inputToValidate.length;i++){
      result=isValid(inputToValidate[i]);
      if(result==false){
        return result;
      }
  }
  return result;
}

function validateDate(dateToValidate) {
  var result = true;
  // if ( Object.prototype.toString.call(dateToValidate) === "[object Date]" ) {
  //   // it is a date
  //   if( isNaN( dateToValidate.getTime() ) ){  // d.valueOf() could also work
  //     // date is not valid
  //     result = false;
  //   }
  //   else{
  //     // date is valid
  //       result = true;
  //   }
  // }
  // else {
  //   // not a date
  //   result = false;
  // }
  // return result;
  try{
    let date = Date.parse(dateToValidate);
    // alert(isNaN(date));
    if(isNaN(date)){
      result = false;
      // console.log('This is not date');

    }
    else{
      // console.log('This is date object');
      // let valiDate = new Date(dateToValidate);
      // if(valiDate == 'Invalid Date')
      //   result = false;

    }
    return result;
  }catch(e){
    return result;
  }
}

function encryptPassword (data){
  try{
    var cryptedData = crypto.createHash('md5').update(data).digest("hex");
    // console.log(cryptedData);
    return cryptedData;
  }catch(e){
    return "";
  }
}


/* Alias for date */
function currentTime () {
  var currentdate = new Date();
  // var datetime = "Last Sync: " + currentdate.getDate() + "/"
  //                 + (currentdate.getMonth()+1)  + "/"
  //                 + currentdate.getFullYear() + " @ "
  //                 + currentdate.getHours() + ":"
  //                 + currentdate.getMinutes() + ":"
  //                 + currentdate.getSeconds();
  currentdate = currentdate.getFullYear() + "-"
                + (currentdate.getMonth()+1) + "-"
                + currentdate.getDate();
  return currentdate;
}
function currentDateTime () {
  var currentdate = new Date();
  // var datetime = "Last Sync: " + currentdate.getDate() + "/"
  //                 + (currentdate.getMonth()+1)  + "/"
  //                 + currentdate.getFullYear() + " @ "
  //                 + currentdate.getHours() + ":"
  //                 + currentdate.getMinutes() + ":"
  //                 + currentdate.getSeconds();
  currentdate = currentdate.getFullYear() + "-"
                + (currentdate.getMonth()+1) + "-"
                + currentdate.getDate()+" "
                + currentdate.getHours() + ":"
                + currentdate.getMinutes() + ":"
                + currentdate.getSeconds();
  return currentdate;
}

function currDateStartTime () {
  var currentdate = new Date();
  currentdate = currentdate.getFullYear() + "-"
                + (currentdate.getMonth()+1) + "-"
                + currentdate.getDate()+" "
                + 00 + ":"+ 00 + ":"+ 00;
  return currentdate;
}

function currDateEndTime () {
  var currentdate = new Date();
  currentdate = currentdate.getFullYear() + "-"
                + (currentdate.getMonth()+1) + "-"
                + currentdate.getDate()+" "
                + 23 + ":"+ 59 + ":"+ 59;
  return currentdate;
}

function defaultStartTime (my_date) {
  try{
    // console.log(my_date + 'def Start');
    let setStartSTime = new Date(my_date);

    setStartSTime = setStartSTime.getFullYear() + "-"
                  + (setStartSTime.getMonth()+1) + "-"
                  + setStartSTime.getDate()+" "
                  + 00 + ":"+ 00 + ":"+ 00;
        // console.log(setStartSTime + 'setStartSTime');
        //
        //
        // let setStartSTime1 = new Date('2017-05-18');
        //
        // setStartSTime1 = setStartSTime1.getFullYear() + "-"
        //               + (setStartSTime1.getMonth()+1) + "-"
        //               + setStartSTime1.getDate()+" "
        //               + 00 + ":"+ 00 + ":"+ 00;
        //     console.log(setStartSTime1 + 'setStartSTime1');
    return setStartSTime;
  }catch(e){
    return false;
  }
}

function defaultEndTime (my_date) {
  try{
    // console.log(my_date + 'end Time');
    let endStartSTime = new Date(my_date);
    endStartSTime = endStartSTime.getFullYear() + "-"
                  + (endStartSTime.getMonth()+1) + "-"
                  + endStartSTime.getDate()+" "
                  + 23 + ":"+ 59 + ":"+ 59;
                  // console.log(endStartSTime + 'endStartSTime');
    return endStartSTime;
  }catch(e){
    return false;
  }
}

function customStartEndTime (my_date,hrs,mts,sec) {
  try{
    let endStartSTime = new Date(my_date);
    endStartSTime = endStartSTime.getFullYear() + "-"
                  + (endStartSTime.getMonth()+1) + "-"
                  + endStartSTime.getDate()+" "
                  + hrs + ":"+ mts + ":"+ sec;
    return endStartSTime;
  }catch(e){
    return false;
  }
}

function addDaysToDate (my_date, days) {
  try{
    let dat = new Date(my_date);
    dat.setDate(dat.getDate() + (days) );
    return dat;
  }catch(e){
    return false;
  }
}

function emailValidator (email_id) {
  return email_check.validate(email_id); // returns true if valid
}

function add_time(){
  let new_add_Date = new Date();
  new_add_Date.setMinutes(new_add_Date.getMinutes() + 30);
  return new_add_Date;
}


function add_sec_in_time(){
  let new_add_Date = new Date();
  new_add_Date.setSeconds(new_add_Date.getSeconds() + 3600);
  return new_add_Date;
}

function add_hours_in_time(){
  let new_add_Date = new Date();
  new_add_Date.setHours(new_add_Date.getHours() + 1);
  return new_add_Date;
}


function custom_add_hours_in_time(addingHours){
  let new_add_Date = new Date();
  let addHours = addingHours || 0;
  new_add_Date.setHours(new_add_Date.getHours() + addHours);
  return new_add_Date;
}


function set_Zero_Time(myDate){
  // console.log(myDate);
  let new_add_Date = myDate.toUTCString();

  // console.log(myDate);
  myDate.setHours(0);
  myDate.setSeconds(0);
  myDate.setHours(0);
  // console.log('my Data');
}


function timestamp_to_date(timestamp_val){
  return new Date(timestamp_val*1000); // TimeStamp to Date
}

function date_to_timestamp(date_val){
    return   Math.floor(date_val / 1000); // Date to TimeStamp
}

function generate_OTP(){
  let otp_value = Math.floor( Math.random() * ( 1 + 999999 - 100000 ) ) + 100000;
  return otp_value;
}

function generate_accessToken(){
  let access_token = crypto.randomBytes(20);
  access_token = (access_token.toString('hex'));
  return access_token;
}

function send_otp_on_email(rand_code,email_id){
  //rand_code = generate_OTP();
  let emailBody = "Your 6 digit OTP for Go_Tribe is:"+rand_code+
                  "<br/>Please use this for email verification only";
  let emailSubject = "Email Verification";
  console.log(email_id+'email_id in send_otp_on_email');
  emailUtil.sendEmail(emailBody, "", emailSubject, "", "", email_id,"Your Name","");
}

function send_pass_link_on_email(send_url,email_id,ios_url,web_url){
  let emailBody = "Please click on the Following link:<br />"+send_url+
                  "<br/>Please use this for Forgot Password only"+
                  "<br />IOS LINK:<br />"+
                  ios_url+
                  "<br /> Website URL:<br />"+
                  web_url;
  let emailSubject = "Forgot Password Link";
  console.log(email_id+'email_id in send_pass_link_on_email');
  emailUtil.sendEmail(emailBody, "", emailSubject, "", "", email_id,"Your Name","");
}

function send_referral_link_on_email(email_id){
  let androidURL = config.androidURL;
  let iosURL = config.iosURL;
  let emailBody = "Please click on the Following link to download our app<br />"+
                  "<br />Android app "+androidURL+
                  "<br /> OR"+
                  "<br />IOS app "+iosURL;
  let emailSubject = "Referred App Link Url";
  console.log(email_id+'email_id in send_referral_link_on_email');
  emailUtil.sendEmail(emailBody, "", emailSubject, "", "", email_id,"Your Name","");
}

function generateMemberId(prev_memberId){
  var currentdate = new Date();
  let curr_day = currentdate.getDate();
  let curr_year = currentdate.getFullYear();
}


function send_enroll_msg_on_emailCus(email_id){

  let emailBody = "Enroll Successfully<br />";
  let emailSubject = "Schedule Enroll";
  console.log(email_id+'email_id in send_enroll_msg_on_emailCus');
  emailUtil.sendEmail(emailBody, "", emailSubject, "", "", email_id,"Your Name","");
}


function parseDate(s1){
  var str = s1||"";
  console.log(str);
  console.log('parse str');
  try{
    var s = str.split(" "),
          d = s[0].split("-"),
          t = s[1].replace(/:/g, "");
    return d[2] + d[1] + d[0] + t;
  }catch(e){
    return "";
  }

}

function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

function calcHrsBetTwoDates (str1, str2) {
  date1 = new Date(str1);
  date2 = new Date(str2);
	let hours = Math.floor(Math.abs(date1 - date2) / 3600000);
	console.log(hours +'hours remaining');
  return hours;
}

function hostnameSeparator (hostname) {
  try{
    var hostname_url = hostname.split(':');
    hostname_withour_port = hostname_url[0];
    return hostname_withour_port;
  }catch(e){
    return "";
  }

}


function sch_class_time (getHours, getMts, ampm) {
  var startTimeArr = new Array(2);
  startTimeArr[0] = '';
  startTimeArr[1] = '';
  // console.log('Function');
  // console.log('getHours'+getHours);
  // console.log('getMts'+getMts);
  // console.log('ampm'+ampm);
  console.log('ampm -> '+ampm+' getMts -> '+getMts+' getHours -> '+getHours);
  try{
    startTimeArr[0] = getHours + ':' + getMts + ampm;
    startTimeArr[1] = getHours + ':' + getMts + ' ' + ampm;
    return startTimeArr ;
  }catch(e){
    return startTimeArr ;
  }

}


function am_or_pm (getHours) {
  let ampm = '';
  try{
      if(getHours<12)
        ampm = "AM";
      else
        ampm = "PM";
    return ampm ;
  }catch(e){
    return ampm ;
  }

}

function convertHrs (getHours) {
    if(getHours>12)
      getHours = (parseInt(getHours) - 12);
    return getHours;
}

function curr_date_time () {
  let new_add_Date = new Date();
  return new_add_Date;
}

function YMDformat (my_date) {
  try{
  let date = new Date(my_date);
    date = date.getFullYear() + "-"
          + (date.getMonth()+1) + "-"
          + date.getDate();
    return date;
  }catch(ex){
    return my_date;
  }
}

function YMDHMSformat (my_date) {
  let date = new Date(my_date);
  date = date.getFullYear() + "-"
        + (date.getMonth()+1) + "-"
        + date.getDate()+" "+
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();
  return date;
}

function isEmptyObj(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

function currDayMonthYear () {
  var DateArr = new Array();
  var currentdate = new Date();
  DateArr[0] = currentdate.getFullYear();
  DateArr[1] = (currentdate.getMonth()+1);
  DateArr[2] = currentdate.getDate();
  return DateArr;
}

function checkDeviceAndSend () {
  if(user_data.device_type == "an"){
    sendTo
  }else if(user_data.device_type == "ios"){

  }
}

function getDayMonth(myDate){

    var sendDayMonth  = {
      "day":"",
      "month": ""
    };
    console.log('dayMonth');
      try{
        var get_Date  = new Date (myDate);
        sendDayMonth.day = days[ get_Date.getDay() ] || "";
        sendDayMonth.month = months[ get_Date.getMonth() ] || "";
        console.log(get_Date.getDay() + 'get_Date.getDay()');
        console.log(get_Date.getMonth() + 'get_Date.getMonth()');
      }catch(ex){
        // do nothing
        console.log('catching error');
      }finally{
        return sendDayMonth;
      }

}

function fixDigit(val){
        return val.toString().length === 1 ? "0" + val : val;
  }


function YMD2digitFormat(my_date){
  try{

    var created = my_date.getFullYear() + '-' +
                      fixDigit(my_date.getMonth() + 1) +
                      '-' + fixDigit(my_date.getDate());
    return created;
  }catch(ex){
    let date = new Date(my_date);
      date = date.getFullYear() + "-"
            + fixDigit(date.getMonth()+1) + "-"
            + fixDigit(date.getDate());
      return date;
  }
}



module.exports.isValid = isValid;
module.exports.validateAllRequiredFields = validateAllRequiredFields;
module.exports.emailValidator = emailValidator;
module.exports.validateDate = validateDate;
module.exports.encryptPassword = encryptPassword;
module.exports.currentTime = currentTime;
module.exports.currentDateTime = currentDateTime;
module.exports.add_time = add_time;
module.exports.timestamp_to_date = timestamp_to_date;
module.exports.date_to_timestamp = date_to_timestamp;
module.exports.generate_accessToken = generate_accessToken;
module.exports.generate_OTP = generate_OTP;
module.exports.send_otp_on_email = send_otp_on_email;
module.exports.send_pass_link_on_email = send_pass_link_on_email;
module.exports.send_referral_link_on_email = send_referral_link_on_email;
module.exports.set_Zero_Time = set_Zero_Time;
module.exports.generateMemberId = generateMemberId;
module.exports.currDateStartTime = currDateStartTime;
module.exports.currDateEndTime = currDateEndTime;
module.exports.defaultStartTime = defaultStartTime;
module.exports.defaultEndTime = defaultEndTime;
module.exports.addDaysToDate = addDaysToDate;
module.exports.send_enroll_msg_on_emailCus = send_enroll_msg_on_emailCus;
module.exports.parseDate = parseDate;
module.exports.customStartEndTime = customStartEndTime;
module.exports.calcHrsBetTwoDates = calcHrsBetTwoDates;
module.exports.hostnameSeparator = hostnameSeparator;
module.exports.custom_add_hours_in_time = custom_add_hours_in_time;
module.exports.sch_class_time = sch_class_time;
module.exports.am_or_pm = am_or_pm;
module.exports.curr_date_time = curr_date_time;
module.exports.YMDformat = YMDformat;
module.exports.convertHrs = convertHrs;
module.exports.isEmptyObj = isEmptyObj;
module.exports.currDayMonthYear = currDayMonthYear;
module.exports.checkDeviceAndSend = checkDeviceAndSend;
module.exports.getDayMonth = getDayMonth;
module.exports.YMD2digitFormat = YMD2digitFormat;

// exports.isValid = function() {};
// exports.validateAllRequiredFields = function() {};
//
// module.exports = {
//     isValid: function() {},
//     validateAllRequiredFields: function() {}
// }
//


/*
console.log("My Module")
console.log(module)
exports.isValid = function(isFound){
    var isValue = true;
    if(isFound==null || isFound=="" || isFound ==undefined){
      isValue = false;
    }
    return isValue;
};

exports.validateAllRequiredFields = function(inputToValidate) {
  var result = true;
  for(var i=0;i<inputToValidate.length;i++){
      result=isValid(inputToValidate[i]);
      if(result==false){
        return result;
      }
  }
  return result;
}
*/
