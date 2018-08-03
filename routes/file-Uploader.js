var crypto = require('crypto');
var dataBaseUtil = require("./mysql_data.js");
var emailUtil = require("./emailUtil.js");
var config = require('./config.json');
var status_codes = require('.././status_codes/status_codes.json');
var encrypt_decrypt = require('.././encrypt_decrypt/encryption-decryption.js');
var inputValidation = require('.././validation/input-validation.js');
var userRegister = require('.././validation/isUserRegister.js');
const fs = require('fs');
var path = require('path');

var mydissr = 'userimage';
var extssn = '.png';

var connection_db = dataBaseUtil;



var cryptkey = encrypt_decrypt.generate_crypt_key();


var portal_config = require('./portal_config.json');
var client = require('scp2');

client.defaults({
    port: portal_config.port,
    host: portal_config.host,
    username: portal_config.username,
    // privateKey: '....',
    password: portal_config.password // (accepts password also)
});


console.log(portal_config)






// var request = require('request');

// request('http://gotribe.rnf.tech/upload/fh.jpg').pipe(fs.createWriteStream('doodle.jpg'))

// var poster = require('poster');
//
// var options = {
//   uploadUrl: 'http://gotribe.rnf.tech/webroot/',
//   method: 'POST',
//   fileId: 'file_vikas',
//   fileContentType: 'image/jpeg',
//   fields: {
//     'myfield': 'value',
//     'myfield2': 'value2'
//   }
// };
//
// poster.post('fh.jpg', options, function(err, data) {
//   if (err) {
//     console.log(err);
//     console.log('err in poster');
//   }else{
//     console.log(data);
//     console.log('data in poster');
//   }
//   console.log('No if-else');
// });


//
// var Sftp = require('sftp-upload'),
//     fs = require('fs');
//
// var options = {
//     host:"gotribe.rnf.tech",
//     username:'root',
//     path: '/',
//     remoteDir: '/webroot',
//     pass : "VehEjeQAcr"
// },
// sftp = new Sftp(options);
//
// sftp.on('error', function(err){
//     throw err;
// })
// .on('uploading', function(pgs){
//     console.log('Uploading', pgs.file);
//     console.log(pgs.percent+'% completed');
// })
// .on('completed', function(){
//     console.log('Upload Completed');
// })
// .upload();
//


// var JSFtp = require("jsftp");
//
// ftpConfig = {
//     host : "gotribe.rnf.tech",
//     port : 22,
//     // path : "/",
//     user : "gotribe",
//     pass : "VehEjeQAcr"
// };
//
// ftp = new JSFtp(ftpConfig);

// var ftpConnect = function (callback){
//
//     ftpConn = new JSFtp(ftpConfig);
//
//     ftpConn.on('error',function(err){
//         console.log('try catch');
//           console.log(err);
//         // ftpLogs({code: 000 , text: err});
//         // callback(false);
//         // callback(false);
//     });
//
//     ftpConn.auth( ftpConfig.user , ftpConfig.pass , function (err,data){
//       console.log(err);
//         if(err) {
//           // ftpLogs(err);
//           // callback("false");
//           // callback("false");
//         }else{
//
//           console.log('authenticated...');
//           // ftpLogs(data);
//           // callback(true);
//           // callback(true);
//         }
//     });
// };
//
// console.log(ftpConnect());
// var Ftp = new JSFtp({
//   host: "http://54.219.175.76",
//   path: '/webroot',
//   port: 22, // defaults to 21
//   user: "gotribe", // defaults to "anonymous"
//   pass: "VehEjeQAcr" // defaults to "@anonymous"
// });

// ftpConn.raw("mkd", "/new_dir_vikas", function(err, data) {
//     if (err) return console.error(err);
//
//     console.log(data.text); // Show the FTP response text to the user
//     console.log(data.code); // Show the FTP response code to the user
// });
//
//

// fs.readFile('fh.jpg', function(err, buffer) {
//      if(err) {
//          console.error(err);
//         //  callback(err);
//      }
//      else {
//        console.log('hjgf');
//        console.log(buffer);
//          ftpConn.put(buffer, 'myvikas.jpg', function(err) {
//             console.log('put');
//              if (err) {
//                  console.error(err);
//                 //  callback(err);
//              }
//              else {
//                 // alert(file + " - uploaded successfuly");
//                 //  callback();
//                 console.error('success');
//              }
//          });
//      }
//  });

// ftp.get("/var/www/html/composer.json", function(err, data) {
//     if (err)
//         return console.error(err);
//     console.log(data);
//     // Do something with the buffer
//     // doSomething(data);
//
//     // We can use raw FTP commands directly as well. In this case we use FTP
//     // 'QUIT' method, which accepts no parameters and returns the farewell
//     // message from the server
//     ftp.raw.quit(function(err, res) {
//         if (err)
//             return console.error(err);
//
//         console.log("FTP session finalized! See you soon!");
//     });
// });
//
// fs.createReadStream('package.json')
//   .pipe(request.put('http://gotribe.rnf.tech/webroot/upload/package_package.json'),
//   function (error, response, body) {
//     console.log('Web Port error');
//       // if (!error && response.statusCode == 200) {
//       //     console.log(body)
//       // }
//       if(error){
//         // throw error;
//         console.log('Web Port error');
//         console.log(error);
//       }
//       else if(response.statusCode == 200) {
//         // console.log('/home/rnf-022/VikasKohli_Workspace/project/routes/httpUtil.js');
//         // console.log(response.body);
//           console.log(response.statusCode + 'Success');
//       }else{
//         console.log(response.statusCode);
//         console.log('my name'+' not success');
//       }
//     }
// );
// var content;
// // First I want to read the file
//
// fs.readFile('email-functions-html/C_yH9LXVwAEjotW.jpg', function (err, data) {
//     if (err) {
//         console.log( err);
//     }
//     content = data;
//     fs.writeFile(process.cwd()+'/fh.jpg', content, 'utf8', function (err) {
//       if(err){
//         console.log(err);
//       }else{
//         console.log(data);
//           console.log(err);
//       }
//     });
//     // Invoke the next step here however you like
//     // console.log(content+' u');   // Put all of the code here (not the best solution)
//     // processFile();          // Or put the next step in a function and invoke it
//     console.log(process.cwd());
// });

// function processFile() {
//     console.log(content);
// }






















// fs.readdir("/home/rnf-022/Pictures", function(err, filenames) {
//    if (err) {
//     //  onError(err);
//      return;
//    }
//    filenames.forEach(function(filename) {
//      console.log(filename);
//      fs.readFile("/home/rnf-022/Pictures" + filename, 'utf-8', function(err, content) {
//        if (err) {
//         //  onError(err);
//          return;
//        }
//       //  onFileContent(filename, content);
//      });
//    });
//  });




//
//
// var JSFtp = require("jsftp");
//
// var Ftp = new JSFtp({
//   host: "gotribe.rnf.tech",
//   port: 22, // defaults to 21
//   // user: "gotribe", // defaults to "anonymous"
//   // pass: "VehEjeQAcr" // defaults to "@anonymous"
// });
//
//
// Ftp.auth("gfotribe","VehEjeQAcr",function authen(err){
//   Ftp.ls(".", function(err, res) {
//     res.forEach(function(file) {
//       console.log(file.name);
//     });
//   });
// });
//
//
//




//

// client.scp('file.text', 'gotribe:VehEjeQAcr@gotribe.rnf.tech:22:/var/www/html/files.text', function(err) {
//   console.log('h'+err);
//   console.log(err);
// });
// client.scp('gotribe:VehEjeQAcr@gotribe.rnf.tech:22:/var/www/html/file.text', 'file.text', function(err) {
// });


// client.upload('fh.jpg', '/var/www/html/webroot/fileXXX.jpg', callback);

// var Client = require('scp2').Client;


// client.write({
//     destination: '/home/gotribe/filed.text',
//     content: 'file'
//   }, callback)
// //
// // client.upload('file.text', '/home/admin/fileddd.text', callback)
//
// client.upload('file.txt', '/var/www/html/', callback)


function callback(err){
  console.log('upload'+err);
}

var fileUploader = {

  upld_profile_measure_pic: function(req, res, next){
      console.log('upld_profile_measure_pic');
    let isUserId = inputValidation.isValid(req.params.userid);
    let iv = encrypt_decrypt.generate_randomIV();
    if(isUserId!=true){
      let response_data = status_codes.userId_not_found;
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }else{
        upld_profile_measure_pic_next(req, res, next, iv);
    }
  },

  show_upload_images: function(req, res, next){
    console.log('show_upload_images')
    let imageName = req.query.image || "";
    let completeFilename = mydissr + "/"+ imageName ;
    var filePath = path.join(__dirname, completeFilename);
    console.log(filePath);
    fs.readFile(completeFilename,  function (err, content) {
      if (err) {
          res.writeHead(400, {'Content-type':'text/html'})
          console.log(err);
          res.end("No such image");
      } else {
          //specify the content type in the response will be an image
          res.writeHead(200,{'Content-type':'image/jpg'});
          res.end(content);
      }
    });
  }

};



function upld_profile_measure_pic_next(req, res, next, iv){
  console.log('upld_profile_measure_pic');
  let uploadType = req.query.type || "";
  let isUploadType = inputValidation.isValid(uploadType);
  if(isUploadType!=true){
    let response_data = status_codes.uploadType_not_found;
    console.log(response_data);
    let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
    res.end(enc);
  }else{
    if(uploadType.toLowerCase()=='profile'){
      // Profile Pic Upload
      upld_profile_pic(req, res, iv);
    }else if(uploadType.toLowerCase()=='measurement'){
      // Measurement History Upload
      upld_measure_pic(req, res, iv);
    }else{
      // spoofed data i.e unauthorized access to computers,
      let response_data = status_codes.uploadType_not_matched;
      console.log(response_data);
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }
  }



}


function uploadFile(req, res, iv, userid, type, callback){
  let hn_wo_port = inputValidation.hostnameSeparator(req.headers.host);
  let mydir, fileextension, imageFullPath;
  // mydir = hn_wo_port + config.rootPath;
  mydir =  config.uploadRootpath;
  if(type=='profile'){
    mydir = mydir + config.profileFolder;
    imageFullPath = config.ImageFullPath + config.profileFolder;
    // mydissr =  config.lprofileFolder;
    fileextension = config.profileExtn;
  }
  else{
    mydir = mydir + config.measurementFolder;
    imageFullPath =  config.measurementFolder;
    // mydissr = config.lmeasurementFolder;
    fileextension = config.measurementExtn;
  }
  // console.log(54.219.175.76/img/useriamge/staff-member.png');
  console.log('mydir');
  console.log(mydir);





    fs.existsSync(mydir) || fs.mkdirSync(mydir);
    // fs.existsSync(mydissr) || fs.mkdirSync(mydissr);
    // fs.readFile("fh.jpg", function (err, datas) {
    //     if (err) {
    //         console.log( err);
    //         res.end('Error');
    //     }else{
        let DayMonYr = inputValidation.currDayMonthYear();
        console.log(DayMonYr);
        let rand_code = inputValidation.generate_OTP();
        let otp_value = Math.floor( Math.random() * ( 1 + 99999999999 - 10000000000 ) ) + 10000000000;
        let filename = otp_value;
        // let filename = userid + '-' + rand_code + '-' + DayMonYr[2]+DayMonYr[1]+DayMonYr[0];
        // let filename = userid+DayMonYr[2]+DayMonYr[1]+DayMonYr[0];
        // let completeFilename = mydir+"/"+filename+fileextension;
        let completeFilename;
        // console.log(completeFilename);
        // console.log('completeFilename');

        // var f=fs.createWriteStream(completeFilename);

             // Continue with your processing here.
           if (!req.files){
            //  return res.status(400).send('No files were uploaded.');
             let response_data = status_codes.file_uplpoad_error;
             console.log(response_data);
             let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
             res.end(enc);
           }

        console.log(req.files);
        let vikasfile,vikasExten;
      // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
      try{
          let sampleFile = req.files.sampleFile || req.files.name;
          vikasfile = req.files.image;
          vikasName = req.files.image.name || "";
          // completeFilename = mydissr+"/"+vikasName;
          completeFilename = mydir+"/"+vikasName;
          let new_serverFilename = completeFilename;
          // let vikasfile =  || ""; vikasExten
          if(vikasfile!=undefined && vikasfile!=null && vikasfile!=""
             && vikasName!=undefined && vikasName!=null && vikasName!=""){



              //  client.upload(vikasfile, completeFilename, callback);





            // Use the mv() method to place the file somewhere on your server
            vikasfile.mv(completeFilename, function(err) {
              if (err){
                // return res.status(500).send(err);
                let response_data = status_codes.file_uplpoad_error;
                console.log(response_data);
                let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                res.end(enc);
              }
              client.upload(completeFilename, new_serverFilename, function(err) {
                  if (err){
                    // return res.status(500).send(err);
                    let response_data = status_codes.file_uplpoad_error;
                    console.log(response_data);
                    let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                    res.end(enc);
                  }
                  let fileData = {};





                  fileData.filename = imageFullPath + "/" + vikasName;
                  // fileData.fileextension = fileextension;
                return callback(fileData);
              });
            });
          }else{
            // return res.status(500).send(err);
            let response_data = status_codes.file_uplpoad_error;
            console.log(response_data);
            let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
            res.end(enc);
          }
      }catch(ex){
        let response_data = status_codes.file_uplpoad_error;
        console.log(response_data);
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
      }
      // finally{
      // }


// }


                       // parse the incoming request containing the form data
                      //  form.parse(req);
        // var data='';
        //   req.setEncoding('utf-8');
        //   req.on('data', function(chunk) {
        //      data += chunk;
        //     // f.write(chunk);
        //   });
        //   req.on('end', function() {
        //       req.rawBody = data;
        //
        //       let multer  = require('multer');
        //       let upload  = multer({ storage: multer.memoryStorage() });

              // var path = require('path');
              // var formidable = require('formidable');
              // var form = new formidable.IncomingForm();
              //   form.parse(req, function (err, fields, files) {
              //     var oldpath = files.filetoupload.path;
              //     var newpath = mydissr + files.filetoupload.name;
              //     fs.rename(oldpath, newpath, function (err) {
              //       if (err) throw err;
              //       res.write('File uploaded and moved!');
              //       res.end();
              //     });
              //   });
              //
              //   // create an incoming form object
              //   var form = new formidable.IncomingForm();
              //
              //   // specify that we want to allow the user to upload multiple files in a single request
              //   form.multiples = true;
              //
              //   // store all uploads in the /uploads directory
              //   form.uploadDir = path.join(__dirname, '/uploads');
              //
              //   // every time a file has been uploaded successfully,
              //   // rename it to it's orignal name
              //   form.on('file', function(field, file) {
              //     console.log('Incoming file');
              //   fs.rename(file.path, path.join(form.uploadDir, file.name));
              //   });
              //
              //   // log any errors that occur
              //   form.on('error', function(err) {
              //     console.log('Incoming file error');
              //   console.log('An error has occured: \n' + err);
              //   });
              //
              //   // once all the files have been uploaded, send a response to the client
              //   form.on('end', function() {
              //     console.log('Incoming file success');
              //   res.end('success');
              //   });
              //
              //   // parse the incoming request containing the form data
              //   form.parse(req);

              // var formidable = require('formidable');
              // var form = new formidable.IncomingForm();
              //    form.parse(req, function (err, fields, files) {
              //      console.log('form');
              //      console.log(files);
              //      var oldpath = files.filetoupload.path;
              //      let completeFilename1 = mydissr + files.filetoupload.name;
              //      var newpath = 'C:/Users/Your Name/' + files.filetoupload.name;
              //      fs.rename(oldpath, completeFilename1, function (err) {
              //        if (err){
              //          console.error(err.stack);
              //          console.log(err);
              //          let response_data = status_codes.file_uplpoad_error;
              //          console.log(response_data);
              //          let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
              //          res.end(enc);
              //        }
              //        res.write('File uploaded !');
              //        return callback(fileData);
              //      });
              // });












              // console.log(data);
              // var base64Data = req.rawBody.replace(/^data:image\/png;base64,/, "");
              // console.log(req.file);
              // console.log('req.file');
              // // console.log(req);
              // console.log('req.body');
              // console.log(req.files);
              // console.log('req.files');
              // console.log(data);
              // f.end();

              // return callback(fileData);
              // if(data!=null){
              //
              // }

              // content = data;
              // // filename = "11208062017"
              //
              // fs.writeFile(completeFilename, data, 'utf-8', function (err) {
              //     if(err){
              //       console.log(err);
              //       let response_data = status_codes.file_uplpoad_error;
              //       console.log(response_data);
              //       let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
              //       res.end(enc);
              //     }else{
              //       let fileData = {};
              //       fileData.filename = filename;
              //       fileData.fileextension = fileextension;
              //       return callback(fileData);
              //     }
              // });
              // Invoke the next step here however you like
              // console.log(content+' u');   // Put all of the code here (not the best solution)
              // processFile();          // Or put the next step in a function and invoke it
              // console.log(process.cwd());
          // });
          // req.on('error', function(err) {
          //   // This prints the error message and stack trace to `stderr`.
          //   console.error(err.stack);
          //   console.log(err);
          //   let response_data = status_codes.file_uplpoad_error;
          //   console.log(response_data);
          //   let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
          //   res.end(enc);
          // });





        // }
    // });
}



function upld_profile_pic(req, res, iv){
  let userid   = encrypt_decrypt.decode_base64(req.params.userid);
  userRegister.isUserRegister(req, res, iv, userid, function(callback1){
      // Authenticated and Register User so upload his pic
    uploadFile(req, res, iv, userid, 'profile', function(callback2){
      // let fileData = callback2.filename + callback2.fileextension;
      let fileData = callback2.filename;
      let  update_user_pic = 'update gym_member set image="'+fileData+'" where id="'+userid+'";';
      console.log(update_user_pic);
      connection_db.query(update_user_pic,function(err,user_mem_row){
        if(err){
          // throw err;
          let response_data = status_codes.db_error_0001;
          console.log(response_data);
          let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
          res.end(enc);
        }else {
          let response_data = status_codes.profile_pic_upload;
          response_data.fileID = callback2.filename;
          console.log(response_data);
          let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
          res.end(enc);
        }
      });
    });
  });
}


function upld_measure_pic(req, res, iv){
  let userid   = encrypt_decrypt.decode_base64(req.params.userid);
  userRegister.isUserRegister(req, res, iv, userid, function(callback1){
    // Authenticated and Register User so upload his pic
    uploadFile(req, res, iv, userid, 'measurement', function(callback2){
      let response_data = status_codes.measure_pic_upload;
      response_data.fileID = callback2.filename;
      console.log(response_data);
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    });
  });
}









module.exports = fileUploader;
