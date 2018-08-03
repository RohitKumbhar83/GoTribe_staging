
var crypto = require('crypto');
var dataBaseUtil = require("./mysql_data.js");
var emailUtil = require("./emailUtil.js");
var config = require('./config.json');
var status_codes = require('.././status_codes/status_codes.json');
var encrypt_decrypt = require('.././encrypt_decrypt/encryption-decryption.js');
var inputValidation = require('.././validation/input-validation.js');
var emailFunction = require('.././email-functions-html/emailsFunctions');
var httpClient = require('./httpUtil.js');
var nullKeyValidation = require('.././validation/null-key-validation.js');
var userReferralData = require('.././validation/referred-Function.js');


// var url = require('url');

var fs = require('fs');

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

// console.log(inputValidation.encryptPassword('rnf@1123'));

var secret_key = 'a0123456789bcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789y';

// var user_data = {
// "first_name":"VIKAS",
// "last_name":"KOHLI",
// "country":"INDIA",
// "state":"Jammu and Kashmir",
// "zipcode":"180001",
// "birth_date":"1993:10:08",
// "maxHeartRate":"160approx.",
// "units":"metric",
// "city":"Jammu",
// "mobile":9070278999
// };
var user_data = {
  // token: '123456',
"phoneModel":"VIKASKOHLI.VK@gmail.com",
"operatingSystem":"email",
"osVersion": "123456",
"appVersion": "123456",
"comment": "123456"

};
// let iddd = 177;
// let user_string = iddd.toString();
// let passsss = 123;
// var url_data1 = {
//   'id': encrypt_decrypt.encode_base64(user_string),
//   'token': encrypt_decrypt.encode_base64(passsss)
// }
// //
// // var url_data1 = {
// //   'id':encrypt_decrypt.encode_base64('177'),
// //   'token': encrypt_decrypt.encode_base64('123')
// // }
//  httpClient.makePostRequest(url_data1);
 // console.log(inputValidation.encryptPassword("123456"));
// console.log(encrypt_decrypt.encode_base64('1234567890')+'  gguy' );
// console.log(encrypt_decrypt.encode_base64("320")+'  u' );
// console.log(encrypt_decrypt.encode_base64('1')+'  u' );
// console.log(encrypt_decrypt.decode_base64('ODI=')+'  userid' );
// console.log(encrypt_decrypt.decode_base64('RHBxWTBFME0=')+ '  rand Passe' );

// var date_time = inputValidation.currentDateTime();
// console.log(date_time);


//var cryptkey   = crypto.createHash('sha256').update(config.public_shared_key).digest(),
    // var iv         = crypto.randomBytes(16),
  // var  buf        = "Here is some data for the encrypt";// 32 chars
    //cryptkey.toString('base64');
    //
    // function randomValueBase64 (len) {
    //     return crypto.randomBytes(Math.ceil(len * 3 / 4))
    //         .toString('base64')   // convert to base64 format
    //         .slice(0, len)        // return required number of characters
    //         .replace(/\+/g, '0')  // replace '+' with '0'
    //         .replace(/\//g, '0'); // replace '/' with '0'
    // }

    var value1 = encrypt_decrypt.generate_randomIV(); // value 'wNm2OQu7UaTB'

    var cryptkey = encrypt_decrypt.generate_crypt_key();
    // console.log('Cryptogra');
    var enc        = encrypt_decrypt.encrypt(cryptkey, value1, JSON.stringify(user_data));
    //  console.log(enc);
//     var gtdyud = "ftZ+B1YEZWy3OjcxN2ukFsULfTtkUA60w/TgWNUw6E4qfvT5uQykknsuuFehga5hRNUTWdptyWC5FFHIDaByVMF6Y0vhGv25URM"+
// "Ek2/XIFdkUnOoTW49WBmcz3wJmQ8Wpk7Q9n4ipC5gC6iq2DV+HUSJvr+kaHYdsBPQfAThkVo5/fpRTrT+fiJk0zGlmXImOkXNnviLJV+xs5uHZ"+
// "S8e8rLlJDRdX1J9ORmFXCZNSQhMc3JyFRVWXLjQKEWYgwz+J9uUF6Q0DkShF3eHUVkz7LYdbUC5sGyKudC81ML8shycP5lyzRLX5TD8IVQBFqgnO"+
// "67kSbvOV0l11MFofSGwpPTNKZ6BtxPXyzW22Tt0AoW8FZUxCYJyvipNq9IBkW1iBWR+XDvJUbp6jEQA0xg/hNJQGCBV7d/SW8FfdZsR2GqL10YVOy6"+
// "y4/IQFssM7G7mW3WYHZeE1aJXKdmBJUBm5qzslbKecRcsizFaRzrJxh/BWkDAt2PUMSSGHpDvKKpbfwjURcpglxZ+ugPW6DcJbboMJ1pASFoFoubqO1"+
// "+X6Yhpqd+MppVK1QBoqVghC4pRc0N71tNdEISZHDg9OhlAyXUZO9+BOn7snCW0pkTFqECExmd1tyrMHzhlINOsoEIcYCdputbn25yeQPedbnJJGy8tM7"+
// "52f8uqq4nw1s1mKA27MWM6f5x462RnhAyVhdw/fIAU6dR4P+F9cOzOpVk/gL2K/bmslughwaAhKxXvWjM3p1TYJwDhHJqhFex6v0AAxbpUs4KgcTk2"+
// "0PIQjqZicH80Vj/qd/eebU2I4iSsckIfv8PrwfKMjhuPL5Rxqfxwe4akJt6CcBm5xsNIVpO5mIA9T/ZyayFTtzt5/ljDB2K1ON3bpyacIncAKLl+XgNP"+
// "1xlELjGDEi6o9oWsNxUdhbMqRT+gCeHhal6TsTybjUZ5zlYbRZKputhB+2/NoN4megf7zmGa8cClo7FsWMv7qdmVLgLs3Cg3tprfW5oGQ6o3WVHf6zozzf"+
// "bz+U5cCLxcfNNaLUOC+PZpH8lyhhoMBSbIYLwwfeomiZooicnyx4AozO/CsW+n8GacV4pfrV64CAAgaULh21xOjiKHHFgkVOgx7q/nIjeVcTie1FNteCg/"+
// "VMutnZ5hfTkJIXh/EHtgkdc9UMJ3jRRnoZE7T1MyOUXjVOYPZjEl4w62cqH3jDtCyW9qo8L6+LzPy4QXerkP/fTxi2AqWU8MMCGOLmOHs9bD+C9RFfOF1s"+
// "WynGunD0fBQTnhGu3cFuAsfK46HParHMHLYLJeuOTC8m8ZTDahI5MntrgfDqQKeaWER3bGo4x8L+/bE3fMigPGfd9TTesD6C8xSXyQVdVQASJ5gjl0VzoVf"+
// "1uQcasznQr9n4uUP/GyIbjFjd1jPVrDlUPWuvkcj5NTCtSly/6n7b3/pCXZIDumKEjMFNoedRx9ESo2tPIB6BjTLM+li0qCsXJfyK4X7bf6AR7v3vufmpI"+
// "49zd3KBzHoXQ2p/tsASYindtPp9M=b404f9abff3fb732d55c7ccfaf52af44";
var gtdyud = "yAf2NTs90kTaZU1tD3tjqkXLVsLou5sgpveAZbn+DcAWKhMMnWRxcqtTy4fMBUYIX5QoPW6cvD8VIeog7uj/Xg==b28e898673c1e2c8800d99270995fdcf";
var enc1 = "N0ttSXByMVh1QVVuVXB2TjR4QjJ2ME9PQlhHTXN0a2ppYUY5SmJCSTBjM2dsUW1Nc2prR2kvRHc2SEwxTT"
+"dJTTgwTlY5ZUF1ZktRTWNVMjN6VWR6RWZPc0FaRWRMRlBRdDRWQVNNaDJOeENUTXR0L0VSeTlld1dRcTdlRVVYWGlC"
+"YitkVE83OUNtU1EwSVg0b1hzaHZHaXlOSHlOcnRYaWl6UGFLN3BYWE85Y0tLMHJZVmhJV2p2QloydURtQm9OU1VaYjVQa"
+"U5NUVVETGswdDF5ZG5heWhWdHU5QXYxa3JIblRRNlJmLzVDblBNQ0Q0YU5RMCsrRE9ROVMxRlpFRmRnUkhwOWFwVkFEZ2RFbHZV"
+"QVdWK1BvcFF5TXFJRUMxTnVVSFlXZFlMNU9Pa25qQVBkNzMvUVpyL1VvaVdRZTFBdDRUZkI2UGw1dWIyaitscEpaRzdZMm9iSGovMjBB"
+"RjljMlB3MlZvOHFzOTMyNnFPUUpiTlVQQnhnWTBWdVdiV1hpeUpsYXFGYXRLMTVQVjNidENDZTQxTUNUdEVPRUdMU2tDaUtPaWtUeWQ4"
+"ZStTWDB2aktBdE1uZ2ExS1JzZjFraWhHMDZTRU83UFNmRVFPdFh2TkpZcVJuYS9laU8vTWFBMDJvZ0U3RVFNOW5OUnRReUhDekRkaTQwb09VdkZRTlY4eVI2UU"
+"thdE1HcmxDRlZNaFlya0d0dU1iN1VIN0prbkF1TkVNMmh3Yy9zTzNwamYyZFFRajI4M3VsK2sxc1pjN0Z3SzNzUFh4VDR3RkVLNlZxMmFWaG05RGtHZGV2RVpKT"
+"DlieEt4WitRYW10TFRZVE9qSjF3V2QycjRQdG5WZlJYUThKU1BuWEFyOEtESkNYcmFYcDcxTGdxdHlUQVNxNUlFUTdFZGdlUGxZZUhVSFoyQUZZMC9VY09rV"
+"nU3dkdxZG95UTlLM2VrZEZlS0VoaWxrVTVPVkVYdE40NlJjRHlDZWRacEtYKzFNVzlWMkY1eWtQK0NLc0E4WEk3S0M2dFZuNnRzVngzVEluZ3dXNnNvRTkyTWlqUV"
+"lCcDRaUjRmWGZpejBZRGhIT2poSE1SUlJhUmVGWDIyU1FINlZQdVZKbmljOFJrR1d1YW5NT3JFUHlRQ1ppbGZLSkVVdUJkNFNVVjhWRTZQYjBrL3NaNXdSa0lkM3R"
+"3bDZCN1JyRW8wYzBId0pXRVAzMTh0WDRDNFhGVWtXMkhObHg0NlExYUhvSmdiRVlaajNIKzd1N3VSSExtT0Z0c3VlQnB3S1JiKzBsOXNZSllEWk5ZMFh4QldITVRVZ"
+"HhDRUYvVHZYTU8vbGN4TzNjeG5FTTVlZkN6SmRwMXV6SWhJSFQzeDZOZFRDa3IvTGdXNzJ0ejJOcVd2L1RBRG5kZGhOM2RoM1lSekx6RzFYMXFwMk5wK1BuNTZOVjZJQ"
+"WZ5TytwMXJidnNZTkdyMjRsYWJZaU5EcEZhOHUxNnduVThYdTVlNUFqZ3Q5TmtiWkVWdlYvdHJCNTlmbmRQbVFvTXYyanRyUVo4MmxaQjNFR1pZU3J6QlN0REdxYmtBOT"
+"NIRUJabUVrcll0TzFXWGRVaGlJSUVrbkFyMjZuRnZvU1krbGRFYW9ta1dSTlpKWXNBMEpWRHJQNHVWUUpKUUQ5Wk5GRlBZY2Vtei83WWxDQi9PZ0F0V3RSSkN4cVVjbFQ5Qj"
+"JtcENHSDF5dmNha09jeEg5cVVvY3J3N1dsU0MyMnlzSVd3bG1VOHRURmF2bWRrQmZBWjRuai9QNE9uTG9RdCtlUG5iZURwaHNlOUhFdW1IKzJGSmZML3JaV1hKMENiZ2V4b3"
+"J4L2J0aW01MmJUWWRsV0o0WEJUOEtsZTh6YXJRR3pWcklOTUFOUEpxZDZtNGFuU3dzTDNSam9ndDN6d1NhRU01ZFB0Z2pMTThJTGFmbnhJeG5mbVhjVGhJNmQ0K2gvaGpma"
+"1JIZlIyNW9MaGVwcmw2STlRSlJrTjRGU3RnQTVTUzN1amJwZXN0TDBjZWNidWVod2VPMUcrbktVRTFTaTJ2WndNVzdVWlJ1enlyc0p0NWpqNGpqcmJ2cEN4bktlZnBLajNG"
+"NnVVN2FVUnpmc2pFWjBwMmpXY2NLbS8yOEVSWFBLK0RHQ1EyOGV2aVpKUUZlVzFBRGc9PWMyNWZkODA5OWNjZGM0ZjY3MDVhZmViN2JmNjE0OGI4";
  //var   new_decryptdata = new Buffer(enc1, 'base64').toString('binary');
    //let res_iv1 = (new_decryptdata.substr(new_decryptdata.length-32,new_decryptdata.length)).toString();
    //let res_data = (new_decryptdata.substr(0,new_decryptdata.length-32)).toString();
    // console.log(new_decryptdata);
    // console.log(res_iv1);
    //
    // console.log(iv);


    var enc_java = "N0ptd2VaYUZxSE9UOForMW5yODJGbDZ5VEh5RTVjWHdTNXFBK3JLanZZa1E5Y0orVy9OZDluUmRjZXpTWHM3d0lxZ2ZodExsUFB6QVpGVlhtL3VlTUZFMXdBdmtvdG9yeGtWcFgxUlYvSDZLR0xncGhlYnBLV3NweDlVd3dYajNkZkN2dWVFOU9kYlZnRC9nUURIMmRCZW1KOWJZMWdTYVY3TmpKUFNyZG83eTJkUHZsbDA2Z3A3c1FjRzlYcXp6Z1pFT3NOQ25JeDdFSWhOOHlzSm5qR3Rpck5OU2Z2TGxvTWJKUDQ5UjZsWDgvQWFDWnR6ZSswZkZOL0pIL0RGc25zU2hpSDloSWdwZ2Q3eFRnTGhFelhCUUQyTjJYbHdrZTJyWjRTaVVqbzBtS0JLQlpseFdXUUdvbXdVMW8wV25vaklsOWQ1eW40QXZMSTJ3R3gxb29kaW5sV3diSTVPOHhUdWNnakJiUng1RlhZdDlwTlVTejk4N0dXenloempNb1BNZUxyL1Vna2o0bURhbGR4SFFyckJQa2I3Q2RZQVpWalp1TXZ0UnNPL01MQ1orUGV4aVp4NEtUMEJHckJmdXowNEpESDhReVM1MjNPZEVwK2FjbmxFMlN4ZXVZaVJkWUVOVE95SjY1QTVXZDVxQUVQcVlDWFNhNGVNS3JZWUFmN3dEOGJ4aXBUTXNkOEw3L24yNzBRK1FOZnJPNDVoOFkrWlZTS1RoT1FMQllaTHhxd3VhREl3T1M2d2hGSlhBMVVRZjRmREQySjlhYWNnYjVWaGNvb284eXhJMVVqRS9RNHZPR1pHYi9iVWlRRTl0N0RBRnJ2YUxuU3BkalNEQWFhaXlQQWR6WU1ZNUZWaVdnY1pCNnc9PWJ5VGpvcG5uME9KTDhLZUs=";
    var dec   = encrypt_decrypt.decrypt_new(cryptkey, enc_java);
    // console.log(enc_java);
    // console.log(dec);
    // console.log('dec');
    // var buffer_data = new Buffer(res_iv);
    // console.log(buffer_data);
    // var convertHexa = Buffer.from(res_iv, 'hex');
    // console.log(convertHexa+'      convert hexa');
    // console.log(Buffer.from(res_iv,'utf-8')+'      convert hexa');

    //let buf11 = Buffer.alloc(16, res_iv1, 'hex');
    // console.log(buf11);

    // let textParts = req.body.string.split(':')[0];
    // let textParts1 = req.body.string.split(':')[1];
    // console.log(textParts1.length);
    //var de_cryptdata1 = encrypt_decrypt.decrypt(cryptkey, buf11, res_data);
    // de_cryptdata = JSON.parse(de_cryptdata1);
    // console.log((de_cryptdata1));
    // console.log('User Again');
    // console.log(de_cryptdata1);
    // console.log(de_cryptdata1.email);
    // console.log(de_cryptdata1.first_name);
    // console.log(de_cryptdata1.type);
    // console.log(de_cryptdata1.token );
//     var dec   = encrypt_decrypt.decrypt(cryptkey, iv, enc);
//     console.log()
// console.log("iv length: ", iv.length);
// console.log("iv iv: ", iv);
// console.log("encrypt length: ", enc.length);
//  console.log("encrypt in Base64:", enc);


 // let res_iv2 = (enc.substr(enc.length-32,enc.length)).toString();
 // console.log(res_iv2+ '              Getting IV Value');
 // // var buffer_data = new Buffer(res_iv2);
 // // console.log(buffer_data);
 //
 // console.log(Buffer.from(res_iv2,'hex'));
 //
 // var buffff1 = Buffer.alloc(16, res_iv2, 'hex');

 // Prints: <Buffer 68 65 6c 6c 6f 20 77 6f 72 6c 64>
 // console.log(buffff1  );


//cryptkey.toString('base64');
var email_check = require('email-validator');

// var query_exec = 'desc gym_member;';
// var emailData = {};
// // console.log(query_exec);
// dataBaseUtil.query(query_exec,function(err,rows){
//     if(err){
//       // throw err;
//     }else{
//         if(rows.length>0){
// //           emailData = rows[0];
// //           var key = emailData.Field;
// // var obj = {},myArray=[];
// // obj[key] = "";
// // myArray.push(obj);
// //            console.log(myArray);
// }
//     }
//   });

var emailBody = "Thank you for registration";
//  emailUtil.sendEmail(emailBody, "", "Registration", emailData.email, "RNF Management", "vikas.kohli@rnf.tech", "" ,"");
var connection_db = dataBaseUtil;

 // console.log(inputValidation.validateDate('s'));
var users = {

    checkService: function (req, res, next) {
        // console.log(req.headers.access_token);
        // console.log(req.headers);
        res.status(200).json("Service working properly.");
        // var hostname = req.headers.host; // hostname = 'localhost:8080'
        //  var pathname = url.parse(req.url).pathname; // pathname = '/MyApp'
        //  console.log(req.headers);
        //  console.log(hostname +' hostname' );
        // let collection = ['vikas.kohli@rnf.tech','vikas152815@rnf.tech','vikas52815@gmail.com','rahil@rnf.tech','ios@rnf.tech','gaurprasad@rnf.tech'];
        //
        //   for(var i = 0; i < collection.length; i++) {
        //     let emailBody = 'Test Bulk Email', emailSubject = 'Bulk Email';
        //     emailUtil.sendEmail(emailBody, '' , emailSubject, '' , '' , collection[i], 'Your Name', '');
        //
        //   }
        //   console.log('emailUtil'+i);


    },

    new_signup: function(req, res, next){
            var data='';
            req.setEncoding('utf8');
            req.on('data', function(chunk) {
               data += chunk;
            });
            req.on('end', function() {
                req.rawBody = data;
                // console.log(req.rawBody+'data');
                // console.log(req.rawBody+'data');
                let iv = encrypt_decrypt.generate_randomIV();
                new_signup_next(req, res, next, iv);
            });
    },

    login_oauth: function(req, res, next){

          var data='';
          req.setEncoding('utf8');
          req.on('data', function(chunk) {
             data += chunk;
          });
          req.on('end', function() {
              req.rawBody = data;
              // console.log(req.rawBody+'data');
              // console.log(req.rawBody+'data');
              let iv = encrypt_decrypt.generate_randomIV();
              login_oauth_next(req, res, next, iv);
          });
    },

    match_rand_OTP: function(req, res, next){
          var data='';
          req.setEncoding('utf8');
          req.on('data', function(chunk) {
             data += chunk;
          });
          req.on('end', function() {
              req.rawBody = data;
              // console.log(req.rawBody+'data');
              // console.log(req.rawBody+'data');
              let iv = encrypt_decrypt.generate_randomIV();
              rand_OTP_next(req, res, next, iv);
          });
    },

    generate_rand_OTP: function(req, res, next){
        let email_id =  req.params.emailId;
        var isEmail = inputValidation.isValid(email_id);
        let iv = encrypt_decrypt.generate_randomIV();
        if(isEmail!=true){
            let response_data = status_codes.email_not_found;
            // console.log(response_data);
            let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
            res.end(enc);
        }else{
          var isValidEmail = inputValidation.emailValidator(email_id);
          if(isValidEmail!=true){
            let response_data = status_codes.email_not_valid;
            // console.log(response_data);
            let enc  = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
            res.end(enc);
          }else{
            let select_query = 'select * from gym_member where email="'+email_id+'";';
            connection_db.query(select_query,function(err,user_row){
                if(err){
                  // throw err;
                  let response_data = status_codes.db_error_0001;
                  // console.log(response_data);
                  let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                  res.end(enc);
                }else{
                    if(user_row.length<=0){
                      let response_data = status_codes.no_user_found;
                      // console.log(response_data);
                      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                      res.end(enc);
                      // res.status(200).json(response_data);
                    }else{
                      let rand_code = inputValidation.generate_OTP();
                      let update_rand_code_query = 'update gym_member set random_OTP ='+rand_code +' where email="'+email_id+'";';
                      // console.log(update_rand_code_query);
                      connection_db.query(update_rand_code_query,function(err,user_row){
                        if(err){
                          // throw err;
                          let response_data = status_codes.db_error_0001;
                          // console.log(response_data);
                          let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                          res.end(enc);
                        }else{
                          inputValidation.send_otp_on_email(rand_code,email_id);
                          // emailFunction.send_pass_social_user(email_id,rand_code, hn_wo_port);
                          let response_data = status_codes.otp_generated;
                          // console.log(response_data);
                          let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                          res.end(enc);
                        }
                      });
                    }
                }
              });



          }
        }
    }

} // End of user object

function new_signup_next(req, res, next, iv){

  //
  let hn_wo_port = inputValidation.hostnameSeparator(req.headers.host);
  let date_added_time = inputValidation.add_time();
  let timestamp = inputValidation.date_to_timestamp(date_added_time);
  let date = inputValidation.timestamp_to_date(timestamp);
  var get_string = req.rawBody || null;
  // console.log(get_string+" get_string");
  if(get_string!=null){
    try{
      // let res_iv = (get_string.substr(get_string.length-32,get_string.length)).toString();
      // let res_data1 = (get_string.substr(0,get_string.length-32)).toString();
      // //console.log(res_iv+'  res_data');
      // //console.log(res_data1+'  res_data res_data');
      // // var buffer_data = new Buffer(res_iv);
      // // console.log(buffer_data);
      // // var convertHexa = Buffer.from(res_iv, 'hex');
      // // console.log(convertHexa+'      convert hexa');
      // // console.log(Buffer.from(res_iv,'utf-8')+'      convert hexa');
      //
      // let buf1 = Buffer.alloc(16, res_iv, 'hex');
      // console.log(buf1);
      // console.log('buf1');
      // // let textParts = req.body.string.split(':')[0];
      // // let textParts1 = req.body.string.split(':')[1];
      // // console.log(textParts1.length);
      // var de_cryptdata = encrypt_decrypt.decrypt(cryptkey, buf1, res_data1);
      var de_cryptdata = encrypt_decrypt.decrypt_new(cryptkey, get_string);
      de_cryptdata = JSON.parse(de_cryptdata);
      // console.log(de_cryptdata);
        var email_id = de_cryptdata.identity;
        var token_val = de_cryptdata.token;
        var login_type = de_cryptdata.type;
        var activated = 0;
        //var first_name = de_cryptdata.first_name;
        if(login_type==null || login_type=="" || login_type ==undefined || login_type== "email" || login_type== "Email"){
          login_type = "email";
        // }else{
        //   activated = 1; // sign up using facebook, google
        //   let response_data = status_codes.other_than_email;
        //   console.log(response_data);
        //   let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        //   res.end(enc);
        // } // End of  sign up using facebook, google
        var isEmail = inputValidation.isValid(email_id);
        if(isEmail!=true){
          let response_data = status_codes.email_not_found;
          // console.log(response_data);
          let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
          res.end(enc);
        }else if( (token_val==null || token_val=="" || token_val ==undefined) && (activated== 0) ){
          let response_data = status_codes.tokenpass_not_found;
          // console.log(response_data);
          let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
          res.end(enc);
        }else{
          var isValidEmail = inputValidation.emailValidator(email_id);
          if(isValidEmail!=true){
            let response_data = status_codes.email_not_valid;
            // console.log(response_data);
            let enc  = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
            res.end(enc);
          }else{
            // var isfirst_name = inputValidation.isValid(de_cryptdata.first_name);
            //if(isfirst_name!=true){
            //  res.status(200).json("First Name Not Found");
            //}else{
               email_id = email_id.toLowerCase();
              // var userName = de_cryptdata.userName || email_id;
              var userName =  email_id;
              var encrypt_using_md5 = inputValidation.encryptPassword(token_val);
              var query_exec = 'SELECT * FROM gym_member where userName = "'+userName +'" or email="'+email_id+'";';
              //console.log(query_exec);
              connection_db.query(query_exec,function(err,rows){
                  if(err){
                    // throw err;
                    let response_data = status_codes.db_error_0001;
                    // console.log(response_data);
                    let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                    res.end(enc);
                  }else{
                    if(rows.length>0){
                      let response_data = {};
                      // response_data.date_added_time = date_added_time;
                      // response_data.timestamp = timestamp;
                      // response_data.date = date;
                      // response_data.message = "User Exists";
                      // response_data.data = new Date();
                      // console.log(userName);
                      let isActivated = rows[0].activated || 0;
                      let get_login_type = rows[0].login_type || null;
                        response_data = status_codes.user_exists;
                        response_data.activated = isActivated;
                        // console.log(response_data);
                        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                        res.end(enc);
                    }else{
                        let created_date = inputValidation.currentTime();
                        var saveUserData  = {};
                        // if(activated){ // For Facebook/Gmail
                        //       saveUserData  = {
                        //        email: email_id,login_type:login_type,
                        //        activated: 1, role_name: "member",
                        //        role_id: 4, first_name: "",
                        //        username:userName,password:"",
                        //        created_date: created_date, activated:activated
                        //      };
                        // }else{
                              saveUserData  = {
                               email: email_id,login_type:login_type,reg_from:"Mobile App",
                               activated: 1, role_name: "member",
                               role_id: 4, first_name: "",weight:"",assign_group:6,
                               username:userName,password:"",app_password:encrypt_using_md5,
                               created_date: created_date, activated:activated
                             };
                        //  }

                          // var query = connection_db.query('select * from gym_member ORDER BY id desc limit 1', function (error, last_field_data) {
                          //   if (error){
                          //     // throw error;
                          //     let response_data = status_codes.db_error_0001;
                          //     res.status(200).json(response_data);
                          //   }else{
                              // var member_id_data = "M0000"+1;
                              // console.log(member_id_data+'member_id_data');
                              // if(last_field_data.length>0){
                              //   memberData = last_field_data[0];
                              //   console.log(memberData.id);
                              //   var str = "" + memberData.id;
                              //   var pad = "00000";
                              //   var ans = "M"+pad.substring(0, pad.length - str.length) + str;
                              //   member_id_data = ans;
                              // }
                              // console.log(member_id_data);
                              // saveUserData.member_id = member_id_data;
                          var query = connection_db.query('INSERT INTO gym_member SET ?', saveUserData, function (error, results, fields) {
                            if (error){
                              // throw error;
                              let response_data = status_codes.not_able_register;
                              let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                              res.end(enc);
                            }else{
                              // Neat!
                            var emailBody = "Thank you for registration";
                              //htmlContent, textContent, subject, from_email, from_name, to_email, to_name, reply_to_email
                            //  emailUtil.sendMail(emailBody, "", "Registration", "jameel.ahmad@rnf.tech", "RNF Management", "vikas.kohli@rnf.tech", "");
                              //console.log(query.sql); // INSERT INTO posts SET `id` = 1, `title` = 'Hello MySQL'
                              //console.log(results); // INSERT INTO posts SET `id` = 1, `title` = 'Hello MySQL'
                              //console.log(fields); // INSERT INTO posts SET `id` = 1, `title` = 'Hello MySQL'
                              var isInsert = inputValidation.isValid(results.insertId);
                              if(isInsert!=true){
                                let response_data = status_codes.not_able_register;
                                // console.log(response_data);
                                let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                                res.end(enc);
                              }else{

                                let send_id = (results.insertId ).toString();
                                let send_new_token_val =(token_val).toString();
                                var pass_data1 = {
                                  'id':encrypt_decrypt.encode_base64(send_id),
                                  'token': encrypt_decrypt.encode_base64(send_new_token_val)
                                };
                                httpClient.makePostRequest(pass_data1);
                                let created_date_time = inputValidation.currentDateTime();
                                let  saveMeasurementData  = {
                                   updatedAt:created_date_time, createdAt: created_date_time,
                                   user:results.insertId,weight:0,height:0,bodyFat:0,waterWeight:0,
                                   leanBodyMass:0,boneDensity:0,caliperBicep:0,triceps:0,
                                   subscapular:0,iliacCrest:0,neck:0,chest:0,forearm:0,waist:0,
                                   hip:0,thigh:0,calf:0,circumferencesSum:0,circumferenceBicep:0
                                 };
                                //  console.log('INSERT INTO member_measurement SET ?', saveMeasurementData);
                                let query_meas = connection_db.query('INSERT INTO member_measurement SET ?', saveMeasurementData, function (error, result_meas, fields) {
                                if (error){
                                  throw error;
                                  let response_data = status_codes.not_able_measurement;
                                  let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                                  res.end(enc);
                                }else{
                                      var fetch_query = "select * from gym_member where id="+results.insertId+";";
                                      // console.log(fetch_query);
                                      connection_db.query(fetch_query,function(err,rows_fetch){
                                          if(err){
                                            // throw err;
                                            let response_data = status_codes.db_error_0001;
                                            let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                                            res.end(enc);
                                          }else{
                                            // console.log(rows_fetch);
                                            var member_id_data;
                                            // console.log(member_id_data+'member_id_data');
                                            if(rows_fetch.length>0){
                                              memberData = rows_fetch[0];
                                              // console.log(memberData.id);
                                              var str = "" + memberData.id;
                                              var pad = "00000";
                                              var ans = "M"+pad.substring(0, pad.length - str.length) + str;
                                              member_id_data = ans;
                                              // console.log(member_id_data);
                                              let set_member_idQuery;
                                              let rand_code = inputValidation.generate_OTP();
                                              if(activated){
                                                set_member_idQuery = 'update gym_member set member_id="'+ member_id_data+'" WHERE id='+memberData.id+';';
                                              }else{
                                                set_member_idQuery = 'update gym_member set member_id="'+ member_id_data+'" ,random_OTP='+rand_code+' WHERE id='+memberData.id+';';
                                              }
                                              // console.log(set_member_idQuery);
                                              connection_db.query(set_member_idQuery,function(err,user_mem_row){
                                              if(err){
                                                // throw err;
                                                let response_data = status_codes.db_error_0001;
                                                // console.log(response_data);
                                                let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                                                res.end(enc);
                                              }else {
                                                 let activate_status = rows_fetch[0].activated || 0;
                                                //  console.log(activate_status+'activate_status');
                                                if(activate_status){
                                                  let response_data = {};
                                                  response_data = status_codes.reg_code_0000;
                                                  response_data.access_token = rows_fetch[0].access_token;
                                                  response_data.output = rows_fetch[0];
                                                  // console.log(response_data);
                                                  //console.log(response_data);
                                                    let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                                                    //res.status(200).json(response_data);
                                                    res.end(enc);
                                                    //console.log(rows_fetch);
                                                }else{
                                                  let response_data = {};
                                                  // console.log(email_id+'email_id');
                                                  // inputValidation.send_otp_on_email(rand_code,email_id);
                                                  emailFunction.send_otp_on_email(email_id,rand_code, hn_wo_port);
                                                  response_data = status_codes.not_activated;
                                                  // console.log(response_data);
                                                  let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                                                  res.end(enc);
                                                }
                                              }
                                                });
                                              }else{
                                                let response_data = status_codes.db_error_0001;
                                                // console.log(response_data);
                                                let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                                                res.end(enc);
                                              }

                                            }
                                          });
                                }
                              });


                              }
                            }
                          });

                      //  }
                      // }); // End of last existing user in database
                    }
                  }
                });
            // } // End of First Name
          }
        }
      }else{
        activated = 1; // sign up using facebook, google
        let response_data = status_codes.other_than_email;
        // console.log(response_data);
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
      } // End of  sign up using facebook, google
    }catch(e){
      let response_data = status_codes.wrong_string;
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }

  }else{
    let response_data = status_codes.raw_data_missing;
    let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
    res.end(enc);
  }

}



function login_oauth_next(req, res, next, iv){
  var get_string = req.rawBody || null;
  if(get_string!=null){
    var de_cryptdata = encrypt_decrypt.decrypt_new(cryptkey, get_string);
    try{
        de_cryptdata = JSON.parse(de_cryptdata);
        let email_id = de_cryptdata.identity;
        let mobile_number = de_cryptdata.mobile_number;
        let token_val = de_cryptdata.token;
        let login_type = de_cryptdata.type || "email";
        var isEmail = inputValidation.isValid(email_id);
        var isMobile = inputValidation.isValid(mobile_number);
        if(isEmail!=true){
          if(login_type=="facebook" && isMobile==true){
            //  console.log('Mobile Number');
            login_fb_number(req, res, de_cryptdata, iv, login_type);
          }else{
            // console.log('email_not_found');
            let response_data = status_codes.email_not_found;
            // console.log(response_data);
            let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
            res.end(enc);
          }
        }else{
          var isValidEmail = inputValidation.emailValidator(email_id);
          // console.log('isValidEmail'+isValidEmail);
          if(isValidEmail!=true){
            let response_data = status_codes.email_not_valid;
            // console.log(response_data);
            let enc  = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
            res.end(enc);
          }else{
              email_id = email_id.toLowerCase();
              de_cryptdata.identity = email_id;
              // var query_exec = 'SELECT * FROM gym_member where email="'+email_id+'";';
              var query_exec = ' SELECT gym.*, liclocation.location_id as user_locationid ' +
                               ' FROM gym_member AS gym LEFT JOIN gym_member AS liclocation ' +
                               ' ON liclocation.id = gym.associated_licensee' +
                               ' WHERE gym.email="'+email_id+'";';
              //  console.log('v   '+query_exec);
                connection_db.query(query_exec,function(err,user_row){
                if(err){
                  // throw err;
                  let response_data = status_codes.db_error_0001;
                  // console.log(response_data);
                  let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                  res.end(enc);
                }else {
                    // console.log("User Data");
                  if(user_row.length<=0){
                    if(login_type!="" && login_type!=null && login_type!=undefined && login_type!='email' && login_type!='Email'){
                        // console.log("login_via_socialaccounts");
                        if(login_type=='facebook' || login_type=='Facebook' || login_type=='gmail' || login_type=='Gmail'){
                            login_via_socialaccounts(req, res, de_cryptdata, iv, login_type);
                        }else{
                          let response_data = status_codes.no_fb_gmail;
                          // console.log(response_data);
                          let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                          res.end(enc);
                        }
                    }else{
                        let response_data = status_codes.no_user_found;
                        // console.log(response_data);
                        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                        res.end(enc);
                    }
                  }else{
                    var user_data = user_row[0];
                    //console.log(user_row+(user_data.login_type!='email'));
                    if(login_type!='email' && login_type!='Email'){
                      // console.log("Not Email");
                      if(login_type=='facebook' || login_type=='Facebook' || login_type=='gmail' || login_type=='Gmail'){
                          send_login_data(req, res, user_data, iv, login_type);
                      }else{
                        // console.log("Not facebook not gmail then what else you are sending me man");
                        // console.log(login_type);
                        let response_data = status_codes.no_fb_gmail;
                        // console.log(response_data);
                        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                        res.end(enc);
                      }
                    }
                    else {
                      var isPassword = inputValidation.isValid(token_val);
                      if(isPassword!=true){
                        let response_data = status_codes.tokenpass_not_found;
                        // console.log(response_data);
                        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                        res.end(enc);
                      }else{
                        var encrypt_pass_md5 = inputValidation.encryptPassword(token_val);
                        if(encrypt_pass_md5!=user_data.app_password){
                          let response_data = status_codes.password_error;
                          // console.log(response_data);
                          let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                          res.end(enc);
                        }else{
                            // console.log('Login using email and password');

                            if(user_data.activated==1){
                                send_login_data(req, res, user_data, iv, login_type);
                            }else{

                              /* Now for the time we show only messages */

                              let response_data = status_codes.account_not_activated;
                              // console.log(response_data);
                              let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                              res.end(enc);

                              /* end of Message */

                              // Resend Otion automatically if not activated

                                // generate_OTP_token(req, res, user_data, iv, login_type, email_id);
                            }
                        }
                      }
                    }
                  }
                }
              });
          }
        }
    }catch(e){
      let response_data = status_codes.wrong_string;
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }
  }else{
    let response_data = status_codes.raw_data_missing;
    let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
    res.end(enc);
  }
}

function send_login_data(req, res, user_data, iv, login_type){
  let access_token = inputValidation.generate_accessToken();
  let set_access_tokenQuery = 'update gym_member set access_token="'+ access_token+'", activated=1,random_OTP=0 WHERE id="'+user_data.id +'" and email ="'+user_data.email+'";';
  //  console.log(set_access_tokenQuery + ' update query quotes');
  connection_db.query(set_access_tokenQuery,function(err,user_row){
    if(err){
      // throw err;
      let response_data = status_codes.db_error_0001;
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }else {
      var baseline_measurement_query = 'select * from member_measurement where user='+user_data.id+';';
      // console.log(baseline_measurement_query);
      connection_db.query(baseline_measurement_query,function(err,baseline_data){
          if(err){
            // throw err;
            let response_data = status_codes.db_error_0001;
            let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
            res.end(enc);
          }else{
            user_data.access_token = access_token;
            let response_data = {};
            response_data.output = {};
            // console.log('login successful');
            response_data= status_codes.login_code_0000;
            response_data.access_token = access_token;
            response_data.output = user_data;
            let baselineEmptydata = {};
            response_data.baseline = baseline_data[0] || baselineEmptydata;
            try{
              if(typeof response_data.output!='undefined' && response_data.output!=undefined && response_data.output!='' && response_data.output!=null){
                response_data.output.access_token = access_token;
                response_data.output.activated = 1;
                response_data.output.random_OTP = "";

                let birth_date = user_data.birth_date;
                // console.log(birth_date);
                if(typeof (birth_date)!= 'undefined' && birth_date!=null && birth_date!="" && birth_date!=undefined ){
                  // console.log(birth_date);
                  birth_date = new Date(birth_date).toISOString();
                  // console.log('date toISOString');
                  let str = (birth_date).split('T');
                    // console.log(str+'str');
                  response_data.output.birth_date = (str[0]);
                } // Send only date parameter without time


              }
            }catch(e){
                // console.log('catch');
              if(typeof response_data.output!='undefined' && response_data.output!=undefined && response_data.output!='' && response_data.output!=null){
                response_data.output.access_token = access_token;
                response_data.output.activated = 1;
                response_data.output.random_OTP = "";
              }
            }finally{
              //res.status(200).json(response_data); user_locationid

              let responseOutput = nullKeyValidation.iosNullValidation(response_data.output);
              response_data.output = responseOutput;

              var isLocationId = inputValidation.isValid(response_data.output.location_id);
              if(isLocationId!=true){
                // don't do anything
              }else{
                response_data.output.user_locationid = response_data.output.location_id;
              }

              let responseBaseline = nullKeyValidation.iosNullValidation(response_data.baseline);
              response_data.baseline = responseBaseline;
              // console.log(response_data);
              let enc = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
              //res.status(200).json(response_data);
              res.end(enc);
            }
          }
        });
    }
  });
}


function generate_OTP_token(req, res, user_data, iv, login_type, email_id){
    let rand_code = inputValidation.generate_OTP();
    let hn_wo_port = inputValidation.hostnameSeparator(req.headers.host);
    let update_rand_code_query = 'update gym_member set random_OTP ='+rand_code +' where email="'+email_id+'";';
    // console.log(update_rand_code_query);
    connection_db.query(update_rand_code_query,function(err,user_row){
      if(err){
        // throw err;
        let response_data = status_codes.db_error_0001;
        // console.log(response_data);
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
      }else{
        // inputValidation.send_otp_on_email(rand_code,email_id);
        emailFunction.send_otp_on_email(email_id,rand_code, hn_wo_port);
        let response_data = status_codes.otp_generated;
        // console.log(response_data);
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
      }
    });
}

function login_via_socialaccounts(req, res, de_cryptdata, iv, login_type){

  /* Generating random password for google sign in and facebook sign in */
  let random_password = encrypt_decrypt.generate_pass_social_user();
  let enc_rand_pass = inputValidation.encryptPassword(random_password);
  // console.log(random_password+ ' random_password');
  /* End */

  let email_id = de_cryptdata.identity;
  let created_date = inputValidation.currentTime();
  let userName = de_cryptdata.userName || email_id;
  let mobile_number = "";
    let  saveUserData  = {
       email: email_id,login_type:login_type,
       activated: 1, role_name: "member",reg_from:"Mobile App",
       role_id: 4, first_name: "",weight:"",app_password:enc_rand_pass,
       username:userName,password:"",assign_group:6,
       created_date: created_date
     };
     saveDataandLogin(req, res, de_cryptdata, iv, login_type, email_id, mobile_number, created_date, saveUserData, random_password);

}


function login_fb_number(req, res, de_cryptdata, iv, login_type){

  let mobile_number = de_cryptdata.mobile_number;
  let created_date = inputValidation.currentTime();
  let userName = de_cryptdata.userName || mobile_number;
  let email_id = "";

    let  saveUserData  = {
       mobile: mobile_number,login_type:login_type,
       email: "",reg_from:"Mobile App",app_password:"",
       activated: 1, role_name: "member",
       role_id: 4, first_name: "",weight:"",
       username:userName,password:"",assign_group:6,
       created_date: created_date
     };

     saveDataandLogin(req, res, de_cryptdata, iv, login_type, email_id, mobile_number, created_date, saveUserData, random_password);

}


function saveDataandLogin(req, res, de_cryptdata, iv, login_type, email_id, mobile_number, created_date, saveUserData, random_password){
  // console.log(saveUserData);

  //  var hostname = req.headers.host;
   let hn_wo_port = inputValidation.hostnameSeparator(req.headers.host);
    var query = connection_db.query('INSERT INTO gym_member SET ?', saveUserData, function (error, results, fields) {
    if (error){
      // throw error;
      // console.log(error);
      let response_data = status_codes.not_able_register;
      // console.log(response_data);
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }else{
      // console.log(saveUserData);
      var isInsert = inputValidation.isValid(results.insertId);
      if(isInsert!=true){
        let response_data = status_codes.not_able_register;
        // console.log(response_data);
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
      }else{
        let created_date_time = inputValidation.currentDateTime();
        let  saveMeasurementData  = {
           updatedAt:created_date_time, createdAt: created_date_time,
           user:results.insertId,weight:0,height:0,bodyFat:0,waterWeight:0,
           leanBodyMass:0,boneDensity:0,caliperBicep:0,triceps:0,
           subscapular:0,iliacCrest:0,neck:0,chest:0,forearm:0,waist:0,
           hip:0,thigh:0,calf:0,circumferencesSum:0,circumferenceBicep:0
         };
        //  console.log('INSERT INTO member_measurement SET ?', saveMeasurementData);
        let query_meas = connection_db.query('INSERT INTO member_measurement SET ?', saveMeasurementData, function (error, result_meas, fields) {
        if (error){
          // throw error;
          let response_data = status_codes.not_able_measurement;
          let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
          res.end(enc);
        }else{
                  // var fetch_query = "select * from gym_member where id="+results.insertId+";";
                  var fetch_query = ' SELECT gym.*, liclocation.location_id as user_locationid ' +
                                   ' FROM gym_member AS gym LEFT JOIN gym_member AS liclocation ' +
                                   ' ON liclocation.id = gym.associated_licensee' +
                                   ' WHERE gym.id="'+results.insertId+'";';
                  connection_db.query(fetch_query,function(err,rows_fetch){
                      if(err){
                        // throw err;
                        let response_data = status_codes.db_error_0001;
                        // console.log(response_data);
                        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                        res.end(enc);
                      }else{
                        var member_id_data;
                        if(rows_fetch.length>0){
                          // console.log(saveMeasurementData);
                          memberData = rows_fetch[0];
                          var str = "" + memberData.id;
                          var pad = "00000";
                          var ans = "M"+pad.substring(0, pad.length - str.length) + str;
                          member_id_data = ans;
                          let set_member_idQuery;
                          let rand_code = inputValidation.generate_OTP();
                          let access_token = inputValidation.generate_accessToken();
                          set_member_idQuery = 'update gym_member set member_id="'+ member_id_data+'" ,access_token="'+access_token+'" WHERE id='+memberData.id+';';
                          connection_db.query(set_member_idQuery,function(err,user_mem_row){
                          if(err){
                            // throw err;
                            let response_data = status_codes.db_error_0001;
                            // console.log(response_data);
                            let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                            res.end(enc);
                          }else {
                              let my_user_data = rows_fetch[0];
                              let send_id = (my_user_data.id ).toString();
                              let send_new_token_val =(random_password).toString();
                              var pass_data1 = {
                                'id':encrypt_decrypt.encode_base64(send_id),
                                'token': encrypt_decrypt.encode_base64(random_password)
                              };
                              //  console.log(send_id +' send_id');
                              //  console.log(send_new_token_val + ' send_new_token_val');
                              //  console.log(pass_data1 + ' pass_data1');
                              httpClient.makePostRequest(pass_data1);
                              emailFunction.send_pass_social_user(my_user_data,random_password, hn_wo_port);
                              userReferralData.isUserReferred(req, res, iv, my_user_data.id , email_id, function(user_reference){
                                // doing user refernce proccesing
                              });

                              send_login_data(req, res, my_user_data, iv, login_type);
                          }
                            });
                          }else{
                            let response_data = status_codes.db_error_0001;
                            // console.log(response_data);
                            let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                            res.end(enc);
                          }
                        }
                      });
        }
      });
      }
    }
  });

}


function rand_OTP_next(req, res, next, iv){
  var get_string = req.rawBody || null;
  if(get_string!=null){
    var de_cryptdata = encrypt_decrypt.decrypt_new(cryptkey, get_string);
    try{
        de_cryptdata = JSON.parse(de_cryptdata);
        let email_id = de_cryptdata.identity;
        let rand_code = de_cryptdata.token;
        var isEmail = inputValidation.isValid(email_id);
        if(isEmail!=true){
          let response_data = status_codes.email_not_found;
          // console.log(response_data);
          let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
          res.end(enc);
        }else{
          var isValidEmail = inputValidation.emailValidator(email_id);
          if(isValidEmail!=true){
            let response_data = status_codes.email_not_valid;
            // console.log(response_data);
            let enc  = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
            res.end(enc);
          }else{
            var query_exec = 'SELECT * FROM gym_member where email="'+email_id+'";';
            // console.log('v   '+query_exec);
              connection_db.query(query_exec,function(err,user_row){
              if(err){
                // throw err;
                let response_data = status_codes.db_error_0001;
                let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                res.end(enc);
              }else {
                if(user_row.length<=0){
                  let response_data = status_codes.no_user_found;
                  // console.log(response_data);
                  let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                  res.end(enc);
                }else{
                  var user_data = user_row[0];
                  let isActivated = user_row[0].activated || 0;
                  let random_OTP = user_row[0].random_OTP || 0;
                  var isRandCode = inputValidation.isValid(rand_code);
                    if(isRandCode!=true){
                      let response_data = status_codes.otp_not_found;
                      // console.log(response_data);
                      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                      res.end(enc);
                    }else{
                      try{
                        // console.log(rand_code+'rand_code'+rand_code);
                        // console.log(rand_code!=0 && (random_OTP)==rand_code);
                        if(rand_code!=0 && (random_OTP)==rand_code){
                          // console.log('Enterif');
                          let access_token = inputValidation.generate_accessToken();
                          let update_status_query = 'update gym_member set activated=1, random_OTP="", access_token="'+ access_token+'" WHERE id='+user_row[0].id+';';
                          // console.log(update_status_query);
                          connection_db.query(update_status_query,function(err,user_mem_row){
                            if(err){
                              // throw err;
                              let response_data = status_codes.db_error_0001;
                              // console.log(response_data);
                              let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                              res.end(enc);
                            }else {
                              var baseline_measurement_query = 'select * from member_measurement where user='+user_data.id+';';
                              // console.log(baseline_measurement_query);
                              connection_db.query(baseline_measurement_query,function(err,baseline_data){
                                  if(err){
                                    // throw err;
                                    let response_data = status_codes.db_error_0001;
                                    let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                                    res.end(enc);
                                  }else{
                                    let response_data = {};
                                    response_data = status_codes.user_activated_login;
                                    response_data.access_token = access_token;
                                    response_data.output = user_row[0];
                                    let baselineEmptydata = {};
                                    response_data.baseline = baseline_data[0] || baselineEmptydata;
                                    try{
                                      if(typeof response_data.output!='undefined' && response_data.output!=undefined && response_data.output!='' && response_data.output!=null){
                                        response_data.output.access_token = access_token;
                                        response_data.output.activated = 1;
                                        response_data.output.random_OTP = "";

                                        let birth_date = user_row[0].birth_date;
                                        if(typeof (birth_date)!= 'undefined' && birth_date!=null && birth_date!="" && birth_date!=undefined ){
                                          // console.log(birth_date);
                                          // console.log('date toISOString');
                                          birth_date = new Date(birth_date).toISOString();
                                          let str = (birth_date).split('T');
                                            // console.log(str+'str');
                                          response_data.output.birth_date = (str[0]);
                                        } // Send only date parameter without time


                                      }
                                    }catch(e){
                                      // console.log('catch');
                                      if(typeof response_data.output!='undefined' && response_data.output!=undefined && response_data.output!='' && response_data.output!=null){
                                        response_data.output.access_token = access_token;
                                        response_data.output.activated = 1;
                                        response_data.output.random_OTP = "";
                                      }
                                    }finally{
                                      // console.log(response_data);
                                      let responseOutput = nullKeyValidation.iosNullValidation(response_data.output);
                                      response_data.output = responseOutput;
                                      let responseBaseline = nullKeyValidation.iosNullValidation(response_data.baseline);
                                      response_data.baseline = responseBaseline;
                                      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                                      res.end(enc);
                                    }


                                  }
                                });
                            }
                          });
                        }else{
                          let response_data = status_codes.otp_not_matched;
                          // console.log(response_data);
                          let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                          res.end(enc);
                        }
                      }catch(e){
                        let response_data = status_codes.otp_not_number;
                        // console.log(response_data);
                        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                        res.end(enc);
                      }
                    }

                }
              }
            });
          }
      }

  }catch(e){
    let response_data = status_codes.wrong_string;
    // console.log(response_data);
    let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
    res.end(enc);
    }
  }else{
    let response_data = status_codes.raw_data_missing;
    // console.log(response_data);
    let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
    res.end(enc);
  }
}

function isFound (isFound){
    var isValue = true;
    if(isFound==null || isFound=="" || isFound ==undefined){
      isValue = false;
    }
    return isValue;
}


function encryptPassword (data){
  var cryptedData = crypto.createHash('md5').update(data).digest("hex");
  return cryptedData;
}


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



function emailValidator (email_id) {
  return email_check.validate(email_id); // true
}

function date_to_timestamp(date_val){
    return   Math.floor(date_val / 1000); // Date to TimeStamp
}

function add_time(){
  let new_add_Date = new Date();
  new_add_Date.setMinutes(new_add_Date.getMinutes() + 30);
  return new_add_Date;
}

function timestamp_to_date(timestamp_val){
  return new Date(timestamp_val*1000); // TimeStamp to Date
}


module.exports = users;
