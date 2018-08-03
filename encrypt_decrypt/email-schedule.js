var crypto = require('crypto');
var email_check = require('email-validator');
var emailUtil = require("../routes/emailUtil.js");
var config = require("../routes/config.json");
var inputValidation = require("../validation/input-validation.js");
var ejs = require('ejs');

var web_loginUrl = config.website_login_url;


var headerHTML1 = '<!DOCTYPE html>'+
                    '<html>'+
                        '<head>'+
                            '<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">'+
                            '<title>GoTRIBE::PT/OPT Schedules</title>'+
                        '</head>'+
                        '<body>'+
                            '<table width="600" border="0" cellspacing="0" cellpadding="0" align="center" style="font-family:Arial, sans-serif; font-size:13px;">'+
                                '<tbody>'+
                                    '<tr>'+
                                        '<td style="text-align: center;background: #000000;">'+
                                            '<table cellpadding="0" cellspacing="0" style="width:80%;text-align:center;padding: 25px 0;color: #fff;margin:auto;" align="center">'+
                                                '<tbody>'+
                                                    '<tr>'+
                                                        '<td><a href="" target="_blank"><img style="display: inline-block; width: 200px;" src="';


var headerHTML2 = '/img/Thumbnail-img2.png" alt="GoTRIBE"></a></td>'+
                          '</tr>'+
                        '</tbody>'+
                      '</table></td>'+
                  '</tr>';


var footerHTML =         '<tr>'+
                              '<td>'+
                                '<p>&nbsp;</p>'+
                                '<p><strong>P.S.</strong>We would also love to hear from you. Let us know if you have any more queries at <a href="mailto:gotribe@gotribefit.com" style="color:#ed4934; font-weight:bold;">gotribe@gotribefit.com</a>. </p>'+
                                '<p>&nbsp;</p>'+
                                '<p><strong>Thanks,</strong><br/>GoTRIBE Team.</p>'+
                              '</td>'+
                          '</tr>'+
                        '</tbody>'+
                      '</table>'+
                    '</td>'+
                        '</tr>'+
                        '<tr>'+
                          '<td>'+
                            '<table width="100%" border="0" cellspacing="0" cellpadding="0">'+
                              '<tbody>'+
                                '<tr>'+
                                '<td width="40%" style="padding: 0px 26px 0 26px;background: #000000; color:#ffffff;"><p style="color:#ffffff;font-size: 13px; margin:0; padding:10px 0px;; font-weight:600; font-family:Open Sans,Arial,Helvetica,sans-serif;"> Phone: (866) 944-4607 </p></td>'+
                                '<td width="60%" style="padding: 0px 26px 0 26px;background: #000000; color:#ffffff; text-align:right;"><p style="color:#ffffff;font-size: 13px; margin-bottom:20px; padding:10px 0px;; font-weight:600; font-family:Open Sans,Arial,Helvetica,sans-serif;">'+
                                ' <strong>Website:</strong> <a href="www.gotribefit.com" style="color:#ffffff;">www.gotribefit.com</a> </p></td>'+
                                '</tr>'+
                              '</tbody>'+
                            '</table>'+
                          '</td>'+
                        '</tr>'+
                        '</tbody>'+
                      '</table>'+
                    '</body>'+
                  '</html>';


var scheduleEmailFunction = {



  send_schedule_sgt_client : function (user_data, train_cb, license_cb, enroll_DateTime, hn_wo_port, enrollStatus){

    let gotribe_name = (user_data.first_name || "User") + " " + (user_data.last_name || "");

    let gotribe_staffname = (train_cb.first_name || "Trainer") + " " + (train_cb.last_name || "");

    let gotribe_licname = (license_cb.first_name || "License") + " " + (license_cb.last_name || "");

    // let enrollDay = inputValidation.getDayMonth(enroll_DateTime.scheduleDate);

    let enrollDay = (enroll_DateTime.days);

    // enroll_DateTime.scheduleDate = inputValidation.YMDformat(enroll_DateTime.scheduleDate);

    let emailSubject = "GoTRIBE::PT/OPT Schedules";
    hostName = hn_wo_port;
    let filename;

    let enrollCancelMessages = new Array(); ;
    if(enrollStatus){
      filename = "templates/ejs-html/schedule_sgt_customer.ejs";
      enrollCancelMessages.push('<p><strong style="color:#ed4934;">Congratulation! </strong> You have successfully enrolled in `Small Group Training` schedule. Please find the schedule info below.</p>');
      enrollCancelMessages.push('');
      enrollCancelMessages.push('');
      enrollCancelMessages.push('');
    }else{
      filename = "templates/ejs-html/cancel_schedule_sgt_customer.ejs";
      enrollCancelMessages.push('<p>Your following `Small Group Training` schedule has been canceled successfully. Please find the schedule details below.</p>');
      enrollCancelMessages.push('<p><strong>Status:</strong> Canceled</p>');
      enrollCancelMessages.push('<th scope="col">Status</th>');
      enrollCancelMessages.push('<td>Canceled</td>');
    }
    console.log(filename+ 'filename');
    console.log(__dirname+ '__dirname');
    ejs.renderFile( filename,
        { gotribe_name, gotribe_staffname, gotribe_licname, enroll_DateTime, hn_wo_port, enrollDay },
      function (err, htmlData) {
      if (err) {
          console.log(err);
          console.log('err in ejs');
      } else {
        console.log('success');
          emailUtil.sendEmail(htmlData, "", emailSubject, "", "", user_data.email,"Go tribe User","");
      }

    });

    let html1 =     '<tr>'+
          '<td>'+
              '<table width="100%" border="0" cellspacing="0" cellpadding="0">'+
                  '<tbody>'+
                      '<tr>'+
                          '<td>'+
                              '<p>Hi <strong>'+gotribe_name+',</strong></p>'+
                              enrollCancelMessages[0]+
                              '<p><strong>Licensee: </strong>'+gotribe_licname+',</p>'+
                              '<p><strong>Class: </strong>'+enroll_DateTime.classTitle+'</p>'+
                              '<p><strong>Trainer: </strong>'+gotribe_staffname+',</p>'+
                              '<p><strong>Schedule Type: </strong> SGT</p>'+
                              enrollCancelMessages[1]+
                              '<p>&nbsp;</p>'+
                          '</td>'+
                      '</tr>'+
                      '<tr>'+
                          '<td>'+
                              '<table width="100%" border="1" cellspacing="0" cellpadding="10">'+
                                  '<tbody>'+
                                      '<tr>'+
                                          '<th scope="col">Date</th>'+
                                          '<th scope="col">Day</th>'+
                                          '<th scope="col">Time</th>'+
                                          enrollCancelMessages[2]+
                                      '</tr>'+
                                      '<tr>'+
                                          '<td>'+enroll_DateTime.scheduleDate+'</td>'+
                                          '<td>'+enrollDay.day+'</td>'+
                                          '<td>'+enroll_DateTime.start_time+'</td>'+
                                            enrollCancelMessages[3]+
                                      '</tr>'+
                                  '</tbody>'+
                              '</table>'+
                          '</td>'+
                      '</tr>';

    let emailBody = headerHTML1 +hostName+ headerHTML2 + html1 + footerHTML;
    // console.log(hostName);
    // console.log(emailBody);
    // console.log(email_id+'email_id in send_enroll_msg_on_emailCus');
    // emailUtil.sendEmail(emailBody, "", emailSubject, "", "", user_data.email,"Go tribe User","");


  },


  send_schedule_sgt_staff: function (user_data, train_cb, license_cb, enroll_DateTime, hn_wo_port, enrollStatus){


        console.log('staff');
        let gotribe_name = (user_data.first_name || "User") + " " + (user_data.last_name || "");

        let gotribe_staffname = (train_cb.first_name || "Trainer") + " " + (train_cb.last_name || "");

        let gotribe_licname = (license_cb.first_name || "License") + " " + (license_cb.last_name || "");

        // let enrollDay = inputValidation.getDayMonth(enroll_DateTime.scheduleDate);

        let enrollDay = (enroll_DateTime.days);

        // enroll_DateTime.scheduleDate = inputValidation.YMDformat(enroll_DateTime.scheduleDate);

        let filename;

        let enrollCancelMessages = new Array(); ;
        if(enrollStatus){
          filename = "templates/ejs-html/schedule_sgt_staff.ejs";
          enrollCancelMessages.push('<p>A client <strong>'+gotribe_name+'</strong> enrolled in your `Small Group Training Schedule`. Please find the below details.</p>');
        }else{
          filename = "templates/ejs-html/cancel_schedule_sgt_staff.ejs";
          enrollCancelMessages.push('<p>A client <strong>'+gotribe_name+'</strong> canceled its `Small Group Training` schedule. Please find the schedule details.</p>');
        }

        let emailSubject = "GoTRIBE::PT/OPT Schedules";
        hostName = hn_wo_port;

        ejs.renderFile( filename,
            { gotribe_name, gotribe_staffname, gotribe_licname, enroll_DateTime, hn_wo_port, enrollDay },
          function (err, htmlData) {
          if (err) {
              console.log(err);
              console.log('err in ejs');
          } else {
            console.log('success');
              emailUtil.sendEmail(htmlData, "", emailSubject, "", "", train_cb.email,"Go tribe User","");
          }

        });



      //   let html1 =     '<tr>'+
      //         '<td>'+
      //             '<table width="100%" border="0" cellspacing="0" cellpadding="0">'+
      //                 '<tbody>'+
      //                     '<tr>'+
      //                         '<td>'+
      //                             '<p>Hi <strong>'+gotribe_staffname+',</strong></p>'+
      //                             enrollCancelMessages[0]+
      //                             '<p><strong>Licensee: </strong>'+gotribe_licname+',</p>'+
      //                             '<p><strong>Customer: </strong>'+gotribe_name+',</p>'+
      //                             '<p><strong>Class: </strong>'+enroll_DateTime.classTitle+'</p>'+
      //                             '<p><strong>Schedule Type: </strong> SGT</p>'+
      //                             '<p>&nbsp;</p>'+
      //                         '</td>'+
      //                     '</tr>'+
      //                     '<tr>'+
      //                         '<td>'+
      //                             '<table width="100%" border="1" cellspacing="0" cellpadding="10">'+
      //                                 '<tbody>'+
      //                                     '<tr>'+
      //                                         '<th scope="col">Date</th>'+
      //                                         '<th scope="col">Day</th>'+
      //                                         '<th scope="col">Time</th>'+
      //                                     '</tr>'+
      //                                     '<tr>'+
      //                                         '<td>'+enroll_DateTime.scheduleDate+'</td>'+
      //                                         '<td>'+enrollDay.day+'</td>'+
      //                                         '<td>'+enroll_DateTime.start_time+'</td>'+
      //                                     '</tr>'+
      //                                 '</tbody>'+
      //                             '</table>'+
      //                         '</td>'+
      //                     '</tr>';
      //
      //
      // let emailBody = headerHTML1 +hostName+ headerHTML2 + html1 + footerHTML;
      // // console.log(hostName);
      // // console.log(emailBody);
      // // console.log(email_id+'email_id in send_enroll_msg_on_emailCus');
      // emailUtil.sendEmail(emailBody, "", emailSubject, "", "", train_cb.email,"Go tribe User","");



  },

  cancel_schedule_by_staff : function schedule_cancelled_by_staff( train_cb, license_cb, enroll_DateTime, hn_wo_port, enrollStatus){

    console.log('enroll_DateTime staff');

    console.log(enroll_DateTime);

    let gotribe_staffname = (train_cb.first_name || "Trainer") + " " + (train_cb.last_name || "");

    let gotribe_licname = (license_cb.first_name || "License") + " " + (license_cb.last_name || "");

    // let enrollDay = inputValidation.getDayMonth(enroll_DateTime.scheduleDate);


    let enrollDay = (enroll_DateTime.days);

    // enroll_DateTime.scheduleDate = inputValidation.YMDformat(enroll_DateTime.scheduleDate);

    let filename;

    let enrollCancelMessages = new Array(); ;
    // if(enrollStatus){
    //   filename = "templates/ejs-html/schedule_sgt_by_trainer_staff";
    //
    // }else{
    //   filename = "templates/ejs-html/cancel_schedule_sgt_by_trainer_staff.ejs";
    //
    // }

    if(enroll_DateTime.schedule_type == "SGT"){
      filename = "templates/ejs-html/cancel_schedule_sgt_by_trainer_staff.ejs";
    }else{
      filename = "templates/ejs-html/cancel_schedule_ptopt_staff.ejs";
    }



    let emailSubject = "GoTRIBE::PT/OPT Schedules";
    hostName = hn_wo_port;

    ejs.renderFile( filename,
        {  gotribe_staffname, gotribe_licname, enroll_DateTime, hn_wo_port, enrollDay },
      function (err, htmlData) {
      if (err) {
          console.log(err);
          console.log('err in ejs');
      } else {
        console.log('success');
          emailUtil.sendEmail(htmlData, "", emailSubject, "", "", train_cb.email,"Go tribe User","");
      }

    });



  },

  cancel_schedule_by_staff_customer: function schedule_cancelled_by_staff_customer
                (user_data, train_cb, license_cb, enroll_DateTime, hn_wo_port, enrollStatus){

    console.log('enroll_DateTime staff_customer');

    console.log(enroll_DateTime);

    let gotribe_name = (user_data.first_name || "User") + " " + (user_data.last_name || "");

    let gotribe_staffname = (train_cb.first_name || "Trainer") + " " + (train_cb.last_name || "");

    let gotribe_licname = (license_cb.first_name || "License") + " " + (license_cb.last_name || "");

    // let enrollDay = inputValidation.getDayMonth(enroll_DateTime.scheduleDate);

    let enrollDay = (enroll_DateTime.days);

    // enroll_DateTime.scheduleDate = inputValidation.YMDformat(enroll_DateTime.scheduleDate);

    let filename;

    let enrollCancelMessages = new Array(); ;
    // if(enrollStatus){
    //   filename = "templates/ejs-html/schedule_sgt_by_trainer_staff";
    //
    // }else{
    //   filename = "templates/ejs-html/cancel_schedule_sgt_by_trainer_staff.ejs";
    //
    // }
    filename = "templates/ejs-html/cancel_schedule_sgt_by_trainer_customer.ejs";

    let emailSubject = "GoTRIBE::PT/OPT Schedules";
    hostName = hn_wo_port;

    ejs.renderFile( filename,
        {  gotribe_name, gotribe_staffname, gotribe_licname, enroll_DateTime, hn_wo_port, enrollDay },
      function (err, htmlData) {
      if (err) {
          console.log(err);
          console.log('err in ejs');
      } else {
        console.log('success');
          emailUtil.sendEmail(htmlData, "", emailSubject, "", "", user_data.email,"Go tribe User","");
      }

    });



  }




}





module.exports = scheduleEmailFunction;
