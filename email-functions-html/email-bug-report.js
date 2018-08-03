var crypto = require('crypto');
var email_check = require('email-validator');
var emailUtil = require("../routes/emailUtil.js");
var config = require("../routes/config.json");
var inputValidation = require("../validation/input-validation.js");
var ejs = require('ejs');


var web_loginUrl = config.website_login_url;

let hn_wo_port = config.emailImageUrl;

let sendBugEmails = config.bugEmails;

var bugEmailFunction = {






    send_bug_report : function bug_reportedData (userBug, userInfo){

       userBug.gotribe_name = (userInfo.first_name || "User") + " " + (userInfo.last_name || "");
       userBug.email = userInfo.email || "User Email";

      let emailSubject = "GoTRIBE::Bug Report";
      hostName = hn_wo_port;
      let filename = "templates/ejs-html/bug_report.ejs";


      ejs.renderFile( filename,
          { userBug, hn_wo_port },
        function (err, htmlData) {
        if (err) {
            console.log(err);
            console.log('err in ejs');
        } else {

          console.log('success');
          if(userBug.bugData!= "" || userBug.bugData != undefined)
            emailUtil.sendEmail(htmlData, userBug.bugData, emailSubject, "", "", sendBugEmails ,"Go tribe User","");
            else
            emailUtil.sendEmail(htmlData, "", emailSubject, "", "", sendBugEmails ,"Go tribe User","");
            // emailUtil.sendEmail(htmlData, "", emailSubject, "", "", "gauri.prasad@rnf.tech" ,"Go tribe User","");
            // emailUtil.sendEmail(htmlData, "", emailSubject, "", "", "rahil@rnf.tech" ,"Go tribe User","");
            // emailUtil.sendEmail(htmlData, "", emailSubject, "", "", "harshal@rnftechnologies.com" ,"Go tribe User","");
            // emailUtil.sendEmail(htmlData, "", emailSubject, "", "", "abhinav.goswami@rnftechnologies.org" ,"Go tribe User","");
        }

      });

    }



}






module.exports = bugEmailFunction;
