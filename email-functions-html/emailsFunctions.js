var crypto = require('crypto');
var email_check = require('email-validator');
var emailUtil = require("../routes/emailUtil.js");
var config = require("../routes/config.json");
var ejs = require('ejs');

var web_loginUrl = config.website_login_url;
var android_appUrl = config.androidURL;
var ios_appUrl = config.iosURL;
// var ejs = require('ejs');
// var fs = require('fs');
var hostName = "";
var headerHTML1 = '<!DOCTYPE html>'+
                    '<html>  <head> <meta http-equiv="Content-Type" content="text/html; charset=windows-1252">'+
                    '<title>GoTRIBE::Registration</title> </head>'+
                    '<body>'+
                    '<table cellpadding="0" cellspacing="0" bordeer="0" align="center" width="100%" height="100%" style="color:#696969; font-family:Arial, sans-serif; line-height:25px;">'+
                      '<tbody>'+
                        '<tr>'+
                          '<td align="center"><table width="600" style=" margin:0 auto;" cellpadding="0" cellspacing="0" border="0" align="center">'+
                              '<tbody>'+
                                '<tr>'+
                                  '<td style="width: 100%;text-align: center;background: #000000;"><table cellpadding="0" cellspacing="0" style="width:80%;text-align:center;padding: 25px 0;color: #fff;margin:auto;" align="center">'+
                                      '<tbody>'+
                                        '<tr>'+
                                          '<td><a href="" target="_blank"><img style="display: inline-block; width: 200px;" src="';
var headerHTML2 = '/img/Thumbnail-img2.png" alt="GoTRIBE"></a></td>'+
                                        '</tr>'+
                                      '</tbody>'+
                                    '</table></td>'+
                                '</tr>';

var footerHTML = '<tr>'+
                '<td><table width="100%" border="0" cellspacing="0" cellpadding="0">'+
                    '<tbody>'+
                      '<tr>'+
                        '<td width="40%" style="padding: 21px 26px 0 26px;background: #000000; color:#ffffff;"><p style="color:#ffffff;font-size: 13px; margin:0; padding:10px 0px; font-weight:600; font-family:"Open Sans,Arial,Helvetica,sans-serif;"> Phone: (866) 944-4607 </p></td>'+
                        '<td width="60%" style="padding: 21px 26px 0 26px;background: #000000; color:#ffffff; text-align:right;"><p style="color:#ffffff;font-size: 13px; margin:0; padding:10px 0px;; font-weight:600; font-family:"Open Sans,Arial,Helvetica,sans-serif;"> <strong>Website:</strong> <a href="www.gotribefit.com" style="color:#ffffff;">www.gotribefit.com</a> </p></td>'+
                      '</tr>'+
                    '</tbody>'+
                  '</table></td>'+
              '</tr>'+
              '</tbody>'+
              '</table></td>'+
              '</tr>'+
              '</tbody>'+
              '</table>'+
              '</body>'+
              '</html>';

var emailsFunction = {


  send_pass_social_user : function(user_data, rand_pass, hn_wo_port){
    // let emailBody = "Enroll SUcessfully<br />";
    let emailSubject = "Gotribe Registration";
    hn_wo_port = config.emailImageUrl;
    hostName = hn_wo_port;
    let html1 =   '<tr>'+
                  '<td><table width="100%" border="0" cellspacing="0" cellpadding="0">'+
                      '<tbody>'+
                        '<tr>'+
                          '<td><p>Hi <strong>Gotribe User</strong></p>'+
                            '<p><strong style="color:#ed4934;">Congratulation!</strong> You are registered with <strong>GoTRIBE</strong>.</p>'+
                            '<p>Click below button to login into <strong>GoTribe</strong> portal.</p>'+
                            '<p style=" text-align:center;">'+
                            ' <a href="'+web_loginUrl+'" target="_blank" style="color: #444; background:#ed4934; color:#ffffff; text-decoration: none; padding:10px; display:inline-block; text-align:center;">Portal Login</a></p>'+
                            '<p>If you&#39;re having trouble clicking the login button, copy and paste the following link into your web browser.</p>'+
                            '<p><a href="'+web_loginUrl+'" target="_blank" style="color: #444;">'+web_loginUrl+'</a></p>'+
                            '<p>Please find below the download link for Android and iOS Mobile app.</p>'+
                            '<p style=" text-align:center;"> '+
                            ' <a href="'+android_appUrl+'"  target="_blank" style="color: #444; background:#ed4934; color:#ffffff; text-decoration: none; padding:10px; display:inline-block; text-align:center;">Android Mobile App</a>'+
                            ' <a href="'+ios_appUrl+'"  target="_blank" style="color: #444; background:#ed4934; color:#ffffff; text-decoration: none; padding:10px; display:inline-block; text-align:center;">iOS Mobile App</a> </p>'+
                            '<p>Also, please use the below credentials for web.</p>'+
                            '<p><strong>Username: </strong>'+ user_data.email +'</p>'+
                            '<p><strong>Password: </strong>'+ rand_pass + '</p>'+
                            '<p>&nbsp;</p>'+
                            '<p><strong>P.S.</strong>We would also love to hear from you. Let us know if you have any more queries at <a href="mailto:gotribe@gotribefit.com" style="color:#ed4934; font-weight:bold;">gotribe@gotribefit.com</a>. </p>'+
                            '<p>&nbsp;</p>'+
                            '<p><strong>Thanks,</strong><br/>  GoTRIBE Team.</p></td>'+
                        '</tr>'+
                      '</tbody>'+
                    '</table></td>'+
                '</tr>';
    let emailBody = headerHTML1 +hostName+ headerHTML2 + html1 + footerHTML;
    // console.log(hostName);
    // console.log(emailBody);
    // console.log(email_id+'email_id in send_enroll_msg_on_emailCus');
    emailUtil.sendEmail(emailBody, "", emailSubject, "", "", user_data.email,"Go tribe User","");
  },

  send_otp_on_email : function(user_email, rand_pass, hn_wo_port){
    // let emailBody = "Enroll SUcessfully<br />";
    let emailSubject = "Gotribe Registration";
    hn_wo_port = config.emailImageUrl;
    hostName = hn_wo_port;
    let html1 =   '<tr>'+
                  '<td><table width="100%" border="0" cellspacing="0" cellpadding="0">'+
                      '<tbody>'+
                        '<tr>'+
                          '<td><p>Hi <strong>Gotribe User</strong></p>'+
                            '<p><strong style="color:#ed4934;">Congratulation!</strong> You are registered with <strong>GoTRIBE</strong>.</p>'+
                            '<p>Click below button to login into <strong>GoTribe</strong> portal.</p>'+
                            '<p style=" text-align:center;">'+
                            ' <a href="'+web_loginUrl+'" target="_blank" style="color: #444; background:#ed4934; color:#ffffff; text-decoration: none; padding:10px; display:inline-block; text-align:center;">Portal Login</a></p>'+
                            '<p>If you&#39;re having trouble clicking the login button, copy and paste the following link into your web browser.</p>'+
                            '<p><a href="'+web_loginUrl+'" target="_blank" style="color: #444;">'+web_loginUrl+'</a></p>'+
                            '<p>Please find below the download link for Android and iOS Mobile app.</p>'+
                            '<p style=" text-align:center;"> '+
                            ' <a href="'+android_appUrl+'"   target="_blank" style="color: #444; background:#ed4934; color:#ffffff; text-decoration: none; padding:10px; display:inline-block; text-align:center;">Android Mobile App</a>'+
                            ' <a href="'+ios_appUrl+'" target="_blank" style="color: #444; background:#ed4934; color:#ffffff; text-decoration: none; padding:10px; display:inline-block; text-align:center;">iOS Mobile App</a> </p>'+
                            '<p>Also, please use the below credentials for web.</p>'+
                            '<p><strong>Username: </strong>'+ user_email +'</p>'+
                            '<p><strong>OTP: </strong>'+ rand_pass + '</p>'+
                            '<p>&nbsp;</p>'+
                            '<p><strong>P.S.</strong>We would also love to hear from you. Let us know if you have any more queries at <a href="mailto:gotribe@gotribefit.com" style="color:#ed4934; font-weight:bold;">gotribe@gotribefit.com</a>. </p>'+
                            '<p>&nbsp;</p>'+
                            '<p><strong>Thanks,</strong><br/>  GoTRIBE Team.</p></td>'+
                        '</tr>'+
                      '</tbody>'+
                    '</table></td>'+
                '</tr>';
    let emailBody = headerHTML1 +hostName+ headerHTML2 + html1 + footerHTML;
    // console.log(hostName);
    // console.log(emailBody);
    // console.log(email_id+'email_id in send_enroll_msg_on_emailCus');
    emailUtil.sendEmail(emailBody, "", emailSubject, "", "", user_email,"Go tribe User","");
  },


  send_pass_link_on_email : function(android_url, email_id, ios_url, web_url, hn_wo_port, user_data){
    // let emailBody = "Enroll SUcessfully<br />";
      let gotribe_name = (user_data.first_name || "User") + " " + (user_data.last_name || "");
      let emailSubject = "GoTRIBE::Forgot Password";
      let filename = "templates/ejs-html/forgot_pass_mail.ejs";
      hn_wo_port = config.emailImageUrl;
      ejs.renderFile( filename,
          { gotribe_name, hn_wo_port, android_url, email_id, ios_url, web_url },
        function (err, htmlData) {
        if (err) {
            console.log(err);
            console.log('err in ejs');
        } else {
          console.log('success');
            emailUtil.sendEmail(htmlData, "", emailSubject, "", "", email_id,"Go tribe User","");
        }

      });

  },

  send_referral_link_on_email : function send_referral(email_id, referred_by_friend, hn_wo_port){
    let refrred_by_name = (referred_by_friend.first_name || "User") + " " + (referred_by_friend.last_name || "");
    let referred_email = (referred_by_friend.email );
    let androidURL = config.androidURL;
    let iosURL = config.iosURL;
    let filename = "templates/ejs-html/refer_friend_mail.ejs";
    let emailSubject = "GoTRIBE Referral Email";
    console.log(refrred_by_name+'refrred_by_name');
    console.log(referred_email+'referred_email');
    console.log(hn_wo_port+'hn_wo_port');
    console.log(androidURL+'androidURL');
    console.log(iosURL+'iosURL');
    hn_wo_port = config.emailImageUrl;
    ejs.renderFile( filename,
        { refrred_by_name, hn_wo_port, referred_email, androidURL, iosURL },
      function (err, htmlData) {
      if (err) {
          console.log(err);
          console.log('err in ejs');
      } else {
        console.log('success');
          emailUtil.sendEmail(htmlData, "", emailSubject, "", "", email_id,"Go tribe User","");
      }

    });

  }



}


module.exports =  emailsFunction;
