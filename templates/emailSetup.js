var fs = require("fs");
var nodemailer = require("nodemailer");
var ejs = require("ejs");
var transporter = nodemailer.createTransport({
    // host: 'smtp.zoho.com',
    // host: 'smptp',
    // port: 465,
    service: 'gmail',
    // secure: true, // use SSL
    auth: {
        user: 'vikas.kohli@rnf.tech',
        pass: 'Rnf@1234'
    }
});



console.log('gfh');
var myData = {
  name: 'Stranger'
};

var myData2  = {
  name: 'Stranger2'
}
ejs.renderFile(__dirname + "/test.ejs", { myData,myData2 }, function (err, data) {
if (err) {
    console.log(err);
} else {
    var mainOptions = {
        from: '"Vikas JAMMU" vikas.kohli@rnf.tech',
        to: "vikas.kohli@rnf.tech,vikas152815@gmail.com",
        subject: 'Hello, world',
        html: data
    };
    // console.log("html data ======================>", mainOptions.html);
    // transporter.sendMail(mainOptions, function (err, info) {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         console.log('Message sent: ' + info.response);
    //     }
    // });
}

});



// module.exports = getEmailTemplate;
