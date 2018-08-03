var nodemailer = require('nodemailer');
var fs = require('fs');
var path  = require('path');

  // Not the movie transporter!
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'admin@gotribefit.com', // Your email id
            pass: '7];y%cB<!epu' // Your password
        }
    });

module.exports =
{
   sendEmail: function sendMail(varhtml,vartext, varsubject,varfrom, varfrom_name,varto, varto_name, reply_to_email ) {
        if(vartext!="" && vartext != undefined){
        var json = JSON.stringify(vartext); 
         fs.writeFile('./Error/bugs.txt', vartext); 
        var attachments = [{ filename: 'bugs.txt', path: './Error/bugs.txt', contentType: 'application/txt' }];
        //setup e-mail data with unicode symbols
        var mailOptions = {
         from: "'Gotribe' admin@gotribefit.com", // sender address
        to: [varto], // list of receivers	
            subject: varsubject, // Subject line
            text: vartext, // plaintext body
            html: varhtml, // html body
            attachments:attachments //attachment to html
        };
        }
        else{
        var mailOptions = {
            from: "'Gotribe' admin@gotribefit.com", // sender address
           to: [varto], // list of receivers	
               subject: varsubject, // Subject line
               text: vartext, // plaintext body
               html: varhtml, // html body
           };
        }

       //console.log(mailOptions);

       // send mail with defined transport object
        transporter.sendMail(mailOptions, function (error, info) {
           if (error) {
               return console.log(error);
           }else{
             return console.log(info);
           }
       });

      //
      //
      // var sendmail = require('sendmail')({silent: true})
      // sendmail({
      //   from: 'vikas152815@gmail.com',
      //   to: 'vikas.kohli@rnf.tech,vikas152815@gmail.com',
      //   subject: varsubject, // Subject line
      //   html: varhtml,
      //   attachments: [
      //   ]
      // }, function (err, reply) {
      //   console.log(err && err.stack)
      //   console.dir(reply)
      // })




   }

}
