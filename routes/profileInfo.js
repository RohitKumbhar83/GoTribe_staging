var crypto = require('crypto');
var dataBaseUtil = require("./mysql_data.js");
var emailUtil = require("./emailUtil.js");
var config = require('./config.json');
var status_codes = require('.././status_codes/status_codes.json');
var encrypt_decrypt = require('.././encrypt_decrypt/encryption-decryption.js');
var inputValidation = require('.././validation/input-validation.js');
var nullKeyValidation = require('.././validation/null-key-validation.js');

var connection_db = dataBaseUtil;

var cryptkey = encrypt_decrypt.generate_crypt_key();

var profile = {

  save_profile: function(req, res, next){
    let isUserId = inputValidation.isValid(req.params.userid);
    let iv = encrypt_decrypt.generate_randomIV();
    if(isUserId!=true){
      let response_data = status_codes.userId_not_found;
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }else{
      var data='';
        req.setEncoding('utf8');
        req.on('data', function(chunk) {
           data += chunk;
        });
        req.on('end', function() {
            req.rawBody = data;
            // console.log(req.rawBody+'data');
            // console.log(req.rawBody+'data');
            save_profile_next(req, res, next, iv);
        });
    }
  },

  get_profile: function(req, res, next){
    let isUserId = inputValidation.isValid(req.params.userid);
    // console.log(isUserId+'  isUserId');
    let iv = encrypt_decrypt.generate_randomIV();
    if(isUserId!=true){
      let response_data = status_codes.userId_not_found;
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }else{
      // console.log('get_profile_next');
      get_profile_next(req, res, next, iv);
    }
  },

  saveUpdate_monitorIP: function(req, res, next){
    let isUserId = inputValidation.isValid(req.params.userid);
    // console.log(isUserId+'  saveUpdate_monitorIP');
    let iv = encrypt_decrypt.generate_randomIV();
    if(isUserId!=true){
      let response_data = status_codes.userId_not_found;
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }else{
      var data='';
        req.setEncoding('utf8');
        req.on('data', function(chunk) {
           data += chunk;
        });
        req.on('end', function() {
            req.rawBody = data;
            // console.log(req.rawBody+'data');
            // console.log(req.rawBody+'data');
            saveUpdate_monitorIP_next(req, res, next, iv);
        });
    }
  },

  get_monitor_data: function(req, res, next){
      let isUserId = inputValidation.isValid(req.params.userid);
      // console.log(isUserId+'  isUserId');
      let iv = encrypt_decrypt.generate_randomIV();
      if(isUserId!=true){
        let response_data = status_codes.userId_not_found;
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
      }else{
        // console.log('get_profile_next');
        get_monitor_data_next(req, res, next, iv);
      }
  },

  del_monitor_data: function(req, res, next){
    // let paramsValues = {};
    // paramsValues = req.params;
    // QueryValuesCheck = [req.params.userid,req.params.deleteid];
    let isUserId = inputValidation.isValid(req.params.userid);
    let iv = encrypt_decrypt.generate_randomIV();
    if(isUserId!=true){
      let response_data = status_codes.userId_not_found;
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }
    else{
      del_monitor_data_next(req, res, next, iv);
    }
  }


}

function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

function save_profile_next(req, res, next, iv){
  let userid   = encrypt_decrypt.decode_base64(req.params.userid);
  var get_string = req.rawBody || null;
  //  console.log(get_string+" get_string");
  if(get_string!=null){
    try{
      var de_cryptdata = encrypt_decrypt.decrypt_new(cryptkey, get_string);
      de_cryptdata = JSON.parse(de_cryptdata);
      let profile_query = 'select * from gym_member where id="'+userid+'";';
      connection_db.query(profile_query,function(err,user_row){
        if(err){
          // throw err;
          let response_data = status_codes.db_error_0001;
          let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
          res.end(enc);
        }else {
          if(user_row.length<=0){
            // No User Found for that id
            let response_data = status_codes.no_user_found;
            // console.log(response_data);
            let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
            res.end(enc);
            // res.status(200).json(response_data);
          }else{
            var user_data = user_row[0];
            let user_profile = {};
            // Update Data and Save
            // console.log(user_data);
            // console.log(de_cryptdata);
            // console.log('de_cryptdata');
            let isFName = inputValidation.isValid(de_cryptdata.first_name);
            if(isFName!=true){
              user_profile.first_name =   user_data.first_name;
            }else{
              user_profile.first_name =   de_cryptdata.first_name;
            }
            let isLName = inputValidation.isValid(de_cryptdata.last_name);
            if(isLName!=true){
              user_profile.last_name =   user_data.last_name||"";
            }else{
              user_profile.last_name =   de_cryptdata.last_name||"";
            }
            let isMName = inputValidation.isValid(de_cryptdata.middle_name);
            if(isMName!=true){
              user_profile.middle_name =   user_data.middle_name||"";
            }else{
              user_profile.middle_name =   de_cryptdata.middle_name||"";
            }
            if(de_cryptdata.middle_name==""){
              user_profile.middle_name = "";
            }else{
              user_profile.last_name = de_cryptdata.middle_name|| "";
            }
            if(de_cryptdata.last_name==""){
              // user_profile.last_name = "";
              user_profile.last_name = de_cryptdata.middle_name|| "";
              user_profile.middle_name = "";
            }else{
              if(isMName!=true){
                user_profile.last_name = de_cryptdata.last_name|| "";
                user_profile.middle_name = "";
              }else{
                user_profile.last_name = (de_cryptdata.middle_name|| "")  + " " +(de_cryptdata.last_name|| "");
                user_profile.middle_name = "";
              }
            }


            let isDOB = inputValidation.isValid(de_cryptdata.birth_date);
            if(isDOB!=true){
              user_profile.birth_date =   user_data.birth_date;
            }else{
              user_profile.birth_date =   de_cryptdata.birth_date;
              user_profile.maxHeartRate = 211 - (0.64 * getAge(user_profile.birth_date));
            }
            let isGender = inputValidation.isValid(de_cryptdata.gender);
            if(isGender!=true){
              user_profile.gender =   user_data.gender;
            }else{
              user_profile.gender =   de_cryptdata.gender;
            }
            let isPhone = inputValidation.isValid(de_cryptdata.phone);
            if(isPhone!=true){
              user_profile.phone =   user_data.phone||"";
            }else{
              user_profile.phone =   de_cryptdata.phone;
            }
            let isAdd = inputValidation.isValid(de_cryptdata.address);
            if(isAdd!=true){
              user_profile.address =   user_data.address||"";
            }else{
              user_profile.address =   de_cryptdata.address;
            }
            let isCity = inputValidation.isValid(de_cryptdata.city);
            if(isCity!=true){
              user_profile.city =   user_data.city||"";
            }else{
              user_profile.city =   de_cryptdata.city;
            }
            let isState = inputValidation.isValid(de_cryptdata.state);
            if(isState!=true){
              user_profile.state =   user_data.state||"";
            }else{
              user_profile.state =   de_cryptdata.state;
            }
            let isCountry = inputValidation.isValid(de_cryptdata.country);
            if(isCountry!=true){
              user_profile.country =   user_data.country||"";
            }else{
              user_profile.country =   de_cryptdata.country;
            }
            let isZipCode = inputValidation.isValid(de_cryptdata.zipcode);
            if(isZipCode!=true){
              user_profile.zipcode =   user_data.zipcode||"";
            }else{
              user_profile.zipcode =   de_cryptdata.zipcode;
            }
            let isUnits = inputValidation.isValid(de_cryptdata.units);
            if(isUnits!=true){
              user_profile.units =   user_data.units||"";
            }else{
              user_profile.units =   de_cryptdata.units;
            }
            let ismaxHR = inputValidation.isValid(de_cryptdata.maxHeartRate);
            if(ismaxHR!=true){
              console.log('maxHeartRate');
console.log(user_data.maxHeartRate);
              user_profile.maxHeartRate =   user_data.maxHeartRate||"";
            }else{
console.log('maxHeartRate');
console.log(de_cryptdata.maxHeartRate);
console.log('birthDate');
console.log(de_cryptdata.birth_date);
//user_profile.maxHeartRate = de_cryptdata.maxHeartRate;
            }
            update_user_profile(req, res, iv, user_profile, userid);
          }
        }
      });
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


function update_user_profile(req, res, iv, user_profile, userid){

  let update_status_query = 'update gym_member set first_name="'+user_profile.first_name+
  '", middle_name="'+user_profile.middle_name +
  '", last_name="'+user_profile.last_name+'", birth_date="'+user_profile.birth_date+'", gender="'+user_profile.gender+
  '", phone="'+user_profile.phone+'", address="'+user_profile.address +'", city="'+ user_profile.city+
  '", state="'+  user_profile.state+'", country="'+user_profile.country+'", zipcode="'+user_profile.zipcode+
  '", units="'+ user_profile.units+ '", maxHeartRate="'+user_profile.maxHeartRate+
  '" where id="'+userid+'";';
  // console.log(update_status_query);
  connection_db.query(update_status_query,function(err,user_mem_row){
    if(err){
      // throw err;
      let response_data = status_codes.db_error_0001;
      // console.log(response_data);
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }else {
      let response_data = status_codes.user_profile_updated;
      // console.log(response_data);
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }
  });
}


function get_profile_next (req, res, next, iv){
  let userid   = encrypt_decrypt.decode_base64(req.params.userid);
  // let get_profile_query = 'select * from gym_member where id="'+userid+'";';
  let get_profile_query = ' SELECT gym.*, liclocation.location_id as user_locationid ' +
                   ' FROM gym_member AS gym LEFT JOIN gym_member AS liclocation ' +
                   ' ON liclocation.id = gym.associated_licensee' +
                   ' WHERE gym.id="'+userid+'";';
  // console.log(get_profile_query);
  connection_db.query(get_profile_query,function(err,user_row){
    if(err){
      // throw err;
      let response_data = status_codes.db_error_0001;
      // console.log(response_data);
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }else {
      if(user_row.length<=0){
        // No Baseline Measurement Data
        let response_data = status_codes.no_user_profile;
        // console.log(response_data);
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
      }else{
        var user_data = user_row[0];
        // Send Profile Data
        // console.log(user_data);
        let response_data = {};
        response_data.output = {};
        response_data = status_codes.user_profile_data;
        response_data.output = user_data;
        try{
          if(typeof response_data.output!='undefined' && response_data.output!=undefined
          && response_data.output!='' && response_data.output!=null){

            let birth_date = response_data.output.birth_date;
            if(typeof (birth_date)!= 'undefined' && birth_date!=null && birth_date!="" && birth_date!=undefined ){
              // console.log(birth_date);
              birth_date = new Date(birth_date).toISOString();
              // console.log(birth_date+'toISOString');
              // console.log('date toISOString');
              let str = (birth_date).split('T');
                // console.log(str+'str');
              response_data.output.birth_date = (str[0]);
              // if(birth_date.indexOf('T')!=-1 && birth_date.indexOf('Z')!=-1){
              //    let str = (birth_date).split('T');
              //      console.log(birth_date);
              //    response_data.output.birth_date = (str[0]);
              // }else{
              //     let b_date = new Date(birth_date);
              //     if(b_date=="Invalid Date"){
              //       response_data.output.birth_date = null;
              //     }else{
              //       b_date = b_date.getFullYear() + "-" + (b_date.getMonth()+1) + "-" + b_date.getDate();
              //       response_data.output.birth_date = b_date;
              //     }
              // }
            }
          }
          let responseOutput = nullKeyValidation.iosNullValidation(response_data.output);
          response_data.output = responseOutput;

          var isLocationId = inputValidation.isValid(response_data.output.location_id);

          if(response_data.output.location_id == 0){
            response_data.output.user_locationid = response_data.output.location_id;
          }else{
            if(isLocationId!=true){
              // don't do anything
            }else{
              response_data.output.user_locationid = response_data.output.location_id;
            }
          }



          // console.log(response_data);
          let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
          res.end(enc);
        }
        catch(e){
          // console.log(response_data);
          // console.log('Catch error in date');
          let responseOutput = nullKeyValidation.iosNullValidation(response_data.output);
          response_data.output = responseOutput;
          // console.log(response_data);
          // console.log(response_data.output.birth_date);
          // if(response_data.output.birth_date == "0000-00-00"){
          //   console.log('Birth date 0');
          // }
          let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
          res.end(enc);
        }
      }
    }
  });
}


function saveUpdate_monitorIP_next (req, res, next, iv){
  let userid   = encrypt_decrypt.decode_base64(req.params.userid);
  var get_string = req.rawBody || null;
  if(get_string!=null){
    try{
      var de_cryptdata = encrypt_decrypt.decrypt_new(cryptkey, get_string);
      de_cryptdata = JSON.parse(de_cryptdata);
      let profile_query = 'select * from gym_member where id="'+userid+'";';
      connection_db.query(profile_query,function(err,user_row){
        if(err){
          // throw err;
          let response_data = status_codes.db_error_0001;
          let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
          res.end(enc);
        }else {
          if(user_row.length<=0){
            // No User Found for that id
            let response_data = status_codes.no_user_found;
            // console.log(response_data);
            let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
            res.end(enc);
            // res.status(200).json(response_data);
          }else{
            var user_data = user_row[0];
            let user_profile = {};
            // Update Data and Save
            // console.log(user_data);
            let isMonitor = inputValidation.isValid(de_cryptdata.monitor);
            if(isMonitor!=true){
              user_profile.monitor =   user_data.monitor || "";
            }else{
              user_profile.monitor =   de_cryptdata.monitor;
            }
            let isMonitorIP = inputValidation.isValid(de_cryptdata.monitor_ip);
            if(isMonitorIP!=true){
              user_profile.monitor_ip =   user_data.monitor_ip || "";
            }else{
              user_profile.monitor_ip =   de_cryptdata.monitor_ip;
            }
            let update_monitor_query;
            let isUserType = inputValidation.isValid(de_cryptdata.type);
            if(isUserType!=true){
              update_monitor_query = 'update gym_member set monitor="'+user_profile.monitor+
             '", monitor_ip="'+user_profile.monitor_ip+'" where id="'+userid+'";';
            }else{
              let iosUser = de_cryptdata.type || "";
              try{
                iosUser = iosUser.toString();
                iosUser = iosUser.toLowerCase();
                if(iosUser == 'ios'){
                  let monitor_ios = de_cryptdata.monitor_ip || "";
                  update_monitor_query = 'update gym_member set monitor="'+user_profile.monitor+
                 '", monitor_ip_ios="'+monitor_ios+'" where id="'+userid+'";';
               }else{
                 let response_data = status_codes.ios_not_found;
                //  console.log(response_data);
                 let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                 res.end(enc);
               }
             }catch(ex){
               let response_data = status_codes.ios_string_error;
              //  console.log(response_data);
               let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
               res.end(enc);
             }

            }

            // console.log(update_monitor_query);
            connection_db.query(update_monitor_query,function(err,user_mem_row){
              if(err){
                // throw err;
                let response_data = status_codes.db_error_0001;
                // console.log(response_data);
                let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                res.end(enc);
              }else {
                let response_data = status_codes.monitor_IP_saveUpdate;
                // console.log(response_data);
                let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                res.end(enc);
              }
            });
          }
        }
      });
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


function get_monitor_data_next (req, res, next, iv){
  let userid   = encrypt_decrypt.decode_base64(req.params.userid);
  let get_monitor_query = 'select monitor,monitor_ip,monitor_ip_ios from gym_member where id="'+userid+'";';
  // console.log(get_monitor_query);
  connection_db.query(get_monitor_query,function(err,user_row){
    if(err){
      // throw err;
      let response_data = status_codes.db_error_0001;
      // console.log(response_data);
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }else {
      if(user_row.length<=0){
        // No Profile Data
        let response_data = status_codes.no_user_profile;
        // console.log(response_data);
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
      }else{
        var user_data = user_row[0];
        // Send Monitor Data
        // console.log(user_data);
        let response_data = {}
        response_data = status_codes.user_monitor_data;
        response_data.output = user_data;
        // console.log(response_data);
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
      }
    }
  });
}


function del_monitor_data_next(req, res, next, iv){
  let userid   = encrypt_decrypt.decode_base64(req.params.userid);
  // console.log(req.query);
  let get_monitor_query = 'select * from gym_member where id="' + userid + '";';
  // console.log(get_monitor_query);
  connection_db.query(get_monitor_query,function(err,user_row){
    if(err){
      // throw err;
      let response_data = status_codes.db_error_0001;
      // console.log(response_data);
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }else {
      if(user_row.length<=0){
        // No_measure_history for that id
        let response_data = status_codes.no_user_profile;
        // console.log(response_data);
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
      }else{
        let isUsertype = inputValidation.isValid(req.query.type);
        var del_status_query;
        if(isUsertype!=true){
          del_status_query = 'update gym_member SET monitor_ip="" where id= "'+userid +'";';
        }else{
          let iosUser = req.query.type || "";
          try{
            iosUser = iosUser.toString();
            iosUser = iosUser.toLowerCase();
            if(iosUser == 'ios'){
              del_status_query = 'update gym_member SET monitor_ip_ios="" where id= "'+userid +'";';
           }else{
             let response_data = status_codes.ios_not_found;
            //  console.log(response_data);
             let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
             res.end(enc);
           }
         }catch(ex){
           let response_data = status_codes.ios_string_error;
          //  console.log(response_data);
           let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
           res.end(enc);
         }
        }
        // console.log(del_status_query);
          connection_db.query(del_status_query,function(err,user_mem_row){
            if(err){
              // throw err;
              let response_data = status_codes.db_error_0001;
              // console.log(response_data);
              let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
              res.end(enc);
            }else {
              let response_data = status_codes.del_monitorData;
              // console.log(response_data);
              let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
              res.end(enc);
            }
          });
        }
      }
    });
}


module.exports = profile;
