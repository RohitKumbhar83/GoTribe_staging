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

var client = {

  // Clients/Users/Members under Staff Trainer/Coach
  members_under_trainer: function(req, res, next){
    let isUserId = inputValidation.isValid(req.params.userid);
    // console.log(isUserId+'  isUserId');
    let iv = encrypt_decrypt.generate_randomIV();
    if(isUserId!=true){
      let response_data = status_codes.userId_not_found;
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }else{
      let isRoleid = inputValidation.isValid(req.params.roleid);
      // console.log(isRoleid+'  isRoleid');
      let iv = encrypt_decrypt.generate_randomIV();
      if(isRoleid!=true){
        let response_data = status_codes.roleId_not_found;
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
            members_under_trainer_next(req, res, next, iv);
        });
      }
    }
  },

  get_profile_squat_baseline_nut: function(req, res, next){
    let isUserId = inputValidation.isValid(req.params.userid);
    // console.log(isUserId+'  isUserId');
    let iv = encrypt_decrypt.generate_randomIV();
    if(isUserId!=true){
      let response_data = status_codes.userId_not_found;
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }else{
      get_profile_squat_baseline_nut_next(req, res, next, iv);
    }

}



} // End of Client Users under Trainers in Client Object


function members_under_trainer_next (req, res, next, iv){
  let userid   = encrypt_decrypt.decode_base64(req.params.userid);
  let roleid   = encrypt_decrypt.decode_base64(req.params.roleid);
  var get_string = req.rawBody || null;
  let roleidFilter = "";
  // console.log(get_string+" get_string");
  if(get_string!=null){
    try{
      var de_cryptdata = encrypt_decrypt.decrypt_new(cryptkey, get_string);
      de_cryptdata = JSON.parse(de_cryptdata);
      let isSearchByName = inputValidation.isValid(de_cryptdata.searchByName);
      let isClientStatus = inputValidation.isValid(de_cryptdata.clientStatus);
      // console.log((isSearchByName!=true && isClientStatus!=true)+' isSearchByName!=true && isClientStatus!=true');
      // console.log((isSearchByName==true && isClientStatus!=true)+'isSearchByName==true && isClientStatus!=true');
      // console.log((isClientStatus==true && isSearchByName!=true)+'isClientStatus==true && isSearchByName!=true');
      let roleidFilter = de_cryptdata.roleFilter;
      // console.log(roleidFilter+' roleidFilter');
      if(isSearchByName!=true && isClientStatus!=true){
        no_filter_selected_data(req, res, iv, userid, roleid, roleidFilter);
      }else{
        let searchNameFilter = de_cryptdata.searchByName;
        let clientStatusFilter = de_cryptdata.clientStatus;
        // let roleidFilter = de_cryptdata.roleFilter;
        // console.log(clientStatusFilter+' clientStatusFilter');
        // console.log(roleidFilter+' roleidFilter');
        if(isSearchByName==true && isClientStatus!=true){
          only_searchByName_filter_data(req, res, iv, searchNameFilter, userid, roleid, roleidFilter);
        }else if(isClientStatus==true && isSearchByName!=true){
          // console.log('only_ClientStatus_filter_data');
          only_ClientStatus_filter_data(req, res, iv, clientStatusFilter, userid, roleid, roleidFilter);
        }else{
          both_searchByName_ClientStatus_filter_data(req, res, iv, searchNameFilter, clientStatusFilter, userid, roleid, roleidFilter);
        }
      }
    }catch(e){
      let response_data = status_codes.wrong_string;
      // console.log(response_data);
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }
  }else{
      no_filter_selected_data(req, res, iv, userid, roleid, roleidFilter);
    }
  }

function members_under_trainer (req, res, iv, userid, roleid, roleidFilter, searchName, callback){

  let get_client_query;
  let searchNameData = searchName || "" ;
  let condition = "", extraCondition = "", orderByCondition;
  var isValidEmail = inputValidation.emailValidator(searchNameData);
  // if(isValidEmail!=true){
    // User enter name so search name in database
    searchNameData = searchNameData.replace(/^\s+|\s+$/g, "") // trim leading and trailing space if exists
    let searchNameSplit = searchNameData.split(" ");
    let searchfirst_name, searchmiddle_name, searchlast_name;
    searchfirst_name = searchNameSplit[0] || "" ; // by default give first_name

    searchfirst_name = searchfirst_name.trim(); // trim trailing space if exists

    searchmiddle_name = "";
    searchlast_name = "";
    if(searchNameSplit.length<=1){
    condition   = ' AND (email like"%'+ searchNameData + '%"'+
    ' or first_name like "%'+searchNameData+'%"'+
    ' or middle_name like "%'+searchNameData+'%"'+
    ' or last_name like "%'+searchNameData+'%" )';
    // ' order by role_id;';
    }
    else{

      // searchmiddle_name = searchlast_name;
      searchmiddle_name = searchmiddle_name.trim(); // trim trailing space if exists

      if(searchNameSplit.length==2){
        // Length 2 user enters first and last name (its a confusion it may be his middle name)

        searchlast_name = searchNameSplit[1] || "" ; // first and last name or first-middle or middle-last only
        searchlast_name = searchlast_name.trim(); // trim trailing space if exists

        // // first and middle name only
        extraCondition = ' OR (first_name like "%'+searchfirst_name+'%"' +
                          ' AND middle_name like "%'+searchlast_name+'%"' +
                          ' AND last_name like "%%")' ;
      // }else if(searchNameSplit.length>=3){
      }else{
        // Length 3 user enters first, middle and last name
        searchmiddle_name = searchNameSplit[1] || "" ;
        // searchlast_name = searchNameSplit[2] || "" ;
      //
      //
      // }else if(searchNameSplit.length>3){
          // searchmiddle_name = searchNameSplit[1] || "" ;
          searchlast_name1 = searchNameSplit[2] || "" ;
          // console.log(searchNameSplit.length);
          for(var i=2;i<searchNameSplit.length;i++){
            if(searchNameSplit[i]!=" " && searchNameSplit[i]!="" && searchNameSplit[i]!=undefined
                && searchNameSplit[i]!=null){
                searchlast_name = searchlast_name + (searchNameSplit[i] || "") + " " ;
              }
          }
          let trimlastNSpace  = searchlast_name || ""
          trimlastNSpace  = trimlastNSpace.replace(/\s+$/, '') ;
          extraCondition = ' OR (first_name like "%'+searchfirst_name+'%"' +
                            ' AND middle_name like "%'+searchmiddle_name+'%"' +
                            ' AND last_name like "%'+trimlastNSpace+'%")';
                            // ' AND last_name like "%'+searchlast_name1+'%")' ;
      }
      condition   = ' AND (first_name like "%'+searchfirst_name+'%"' +
                      ' AND middle_name like "%'+searchmiddle_name+'%"' +
                      ' AND last_name like "%'+searchlast_name+'%")' + extraCondition ;
                      // ' order by role_id;'

      // console.log('extraCondition = ' + extraCondition );
    }


  // }else{
  //   // User enter email so search email in database
  //   condition   = ' AND (email like"%'+ searchNameData + '%"'+
  //   ' or first_name like "%'+searchNameData+'%"'+
  //   ' or middle_name like "%'+searchNameData+'%"'+
  //   ' or last_name like "%'+searchNameData+'%" )'+
  //   ' order by role_id;';
  // }

  //Role id filter
  let roleCondition = "";
  let roleIdFilter = roleidFilter || ""
  let isRoleFilter = inputValidation.isValid(roleIdFilter);
  // console.log(isRoleFilter);
  // console.log('isRoleFilter');
  // console.log(roleIdFilter+'roleIdFilter');
  if(isRoleFilter!=true){
    if(roleid == 1){
      roleCondition = ' AND (role_id =2 or role_id =3 or role_id =4 or role_id = 6'+
      ' or role_id = 7 or role_id = 8)';
    }
  }else{
      try{
        roleIdFilter = parseInt(roleIdFilter);
          if(!isNaN(roleIdFilter)){
            if(roleIdFilter== 2){
              roleCondition = ' AND (role_id =2 or role_id =6 or role_id =7 or role_id =8) ';
            }else if(roleIdFilter== 3){
              roleCondition = ' AND (role_id =3 or role_id =6) ';
            }else if (roleIdFilter>3 && roleIdFilter<9 && roleIdFilter!=5) {
              roleCondition = ' AND role_id ="'+roleIdFilter+'"';
            }else{
              let response_data = status_codes.roleFiter_iderror;
              // console.log(response_data);
              let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
              res.end(enc);
            }
            //
            //
            // if( (roleIdFilter>=2 || roleIdFilter<=8) && roleIdFilter!=5 ){
            //   roleCondition = ' AND role_id ="'+roleIdFilter+'"';
            // }else{
            //   let response_data = status_codes.roleFiter_iderror;
            //   console.log(response_data);
            //   let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
            //   res.end(enc);
            // }
          }else{
            let response_data = status_codes.roleFiter_error;
            // console.log(response_data);
            let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
            res.end(enc);
          }

      }catch(ex){
        let response_data = status_codes.roleFiter_error;
        // console.log(response_data);
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
      }
  }


  orderByCondition =  ' order by role_id';

  let dbParameters =  ' id, role_name, role_id, member_id, associated_licensee,'+
                      ' first_name, middle_name, last_name, gender, birth_date,'+
                      ' mobile, phone, email, username, image, assign_staff_mem,'+
                      ' reg_from, monitor, monitor_ip, monitor_ip_ios';
  let isValidRole = true;
  if(roleid == 1){
    get_client_query = 'select' + dbParameters + ' from gym_member where 1 ';
    // ' and first_name like "%'+searchName+'%" order by role_id;';
  }
  else if(roleid == 2 ){
    get_client_query = 'select' + dbParameters + ' from gym_member where associated_licensee="'+ userid + '"';
    // '" and first_name like "%'+searchName+'%" order by role_id;';
  }
  else if(roleid ==  7 || roleid == 8){
    get_client_query = 'select' + dbParameters + ' from gym_member where (associated_licensee="'+ userid + '"'+
                        ' or created_by="' + userid + '")';
    // '" and first_name like "%'+searchName+'%" order by role_id;';
  }
  else if(roleid == 3 || roleid == 6){
    // role_id --> 3 and roleid --> 6
    get_client_query = 'select' + dbParameters + ' from gym_member where assign_staff_mem="'+ userid + '"';
    // '" and first_name like "%'+searchName+'%" order by role_id;';
  }else{
    isValidRole = false;
  }
  // let get_client_query = 'select * from gym_member where assign_staff_mem="'+userid+
  // '" and first_name like "%'+searchName+'%";';
  if(isValidRole){
    get_client_query = get_client_query + condition + roleCondition + orderByCondition;
    // console.log(get_client_query);
    connection_db.query(get_client_query,function(err,user_row){
      if(err){
        // throw err;
        let response_data = status_codes.db_error_0001;
        // console.log(response_data);
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
      }else {
        // console.log(user_row);
          return callback(user_row);
      }
    });
  }else{
    let response_data = status_codes.roleid_permission_err;
    // console.log(response_data);
    let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
    res.end(enc);
  }

}

function no_filter_selected_data(req, res, iv, userid, roleid, roleidFilter){
    let searchName = "";
    // console.log('roleIdFilter');
    var no_filterPromise = new Promise((resolve, reject) => {
      members_under_trainer(req, res, iv, userid, roleid, roleidFilter, searchName, function(no_filter){
          resolve(no_filter);
      }); // Yay! Everything went well!
    });
    Promise.all([no_filterPromise]).then(function(parsedData) {
        let user_row = parsedData[0];
        if(user_row.length<=0){
          // No Client data under this trainer
          let response_data = status_codes.no_client_data;
          // console.log(response_data);
          let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
          res.end(enc);
        }else{
          var user_data = new Array();
          for(var i=0;i<user_row.length;i++){
            //user_data[i] = user_row[i];
            let user_client_data = nullKeyValidation.iosNullValidation(user_row[i]);
            user_data[i] = user_client_data;
          }
          let response_data = {}
          response_data = status_codes.client_data;
          response_data.output = user_data;
          // console.log(response_data);
          let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
          res.end(enc);
        }
      },
       reason => {
        // console.log(reason);
          let response_data = status_codes.db_error_0001;
          // console.log(response_data);
          let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
          res.end(enc);
      });
}


function only_searchByName_filter_data(req, res, iv, searchName, userid, roleid, roleidFilter){
  var searchByName_filterPromise = new Promise((resolve, reject) => {
    members_under_trainer(req, res, iv, userid, roleid, roleidFilter, searchName, function(name_filter){
        resolve(name_filter);
    }); // Yay! Everything went well!
  });
  Promise.all([searchByName_filterPromise]).then(function(parsedData) {
      let user_row = parsedData[0];
      if(user_row.length<=0){
        // No Client data under this trainer
        let response_data = status_codes.no_client_data_name;
        // console.log(response_data);
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
      }else{
        var user_data = new Array();
        for(var i=0;i<user_row.length;i++){
          // user_data[i] = user_row[i];
          let user_client_data = nullKeyValidation.iosNullValidation(user_row[i]);
          user_data[i] = user_client_data;
        }
        let response_data = {}
        response_data = status_codes.client_data;
        response_data.output = user_data;
        // console.log(response_data);
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
      }
    },
     reason => {
      // console.log(reason);
        let response_data = status_codes.db_error_0001;
        console.log(response_data);
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
    });
}

function clientSatusDataOnly(req, res, iv, ids, gym_member_data, clientStatusFilter, callback2){
  // console.log(gym_member_data);
  // console.log('gym_member_data');
  let client_status_query = 'SELECT * FROM membership_payment where member_id in('+ids + ')'+
  ' and payment_status = 1;';
  // console.log(client_status_query);
  connection_db.query(client_status_query,function(err,user_row1){
    if(err){
      // throw err;
      let response_data = status_codes.db_error_0001;
      // console.log(response_data);
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }else {
      if(user_row1.length<=0){
        // No Client data of this status under this trainer
        let response_data = status_codes.no_client_data_status;
        // console.log(response_data);
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
      }else{
        // SELECT * FROM `membership_payment` where member_id in(47,49) and payment_status = 1;
        let response_data = {}
        response_data = status_codes.client_data;
        var user_data1 = new Array();
        var membersArr = [];
        for(var i=0;i<user_row1.length;i++){
          // user_data1[i] = user_row1[i];
          let user_client_data = nullKeyValidation.iosNullValidation(user_row1[i]);
          user_data1[i] = user_client_data;
        }

        var myResult = new Array();
        for(var i=0; i<gym_member_data.length; i++){
          let myArray =new Array();
          for(var j=0;j<user_data1.length;j++){
            // console.log(gym_member_data[i].id +'nested loop');
            if(gym_member_data[i].id == user_row1[j].member_id){
              myArray.push(JSON.stringify(user_row1[j]));
            }
            if(j== (user_data1.length-1) ){
              myResult.push({
                'member_data' : gym_member_data[i],
                'membership_data' : myArray
              });
            }
          }
        }
        // console.log(myResult);
        // console.log('myResult.length');
        var activeUsers = [], pastUsers = [], allUserData = [];
        for(var i=0; i<myResult.length; i++){
          var paymentStatus_data = [];
          var isActive = 0, isExpired = 0;
          if(typeof myResult[i].membership_data!='undefined' && myResult[i].membership_data!=undefined
          && myResult[i].membership_data!= null && myResult[i].membership_data!=""){
            if(myResult[i].membership_data.length>0){
              for(var k=0;k<myResult[i].membership_data.length;k++){
                try{
                  var paymentStatus_data = JSON.parse(myResult[i].membership_data[k]);
                  // console.log('PaymentStatus'+paymentStatus_data.mp_id);
                  // console.log(paymentStatus_data);
                  if(paymentStatus_data.mem_plan_status==1){
                    isActive = 1;
                  }else if(paymentStatus_data.mem_plan_status==3){
                    isExpired = 1;
                  }
                }catch(e){
                  // console.log('Running');
                  return callback2(response_data);
                }
              }
            }
          }
          try{
            if(isActive){
              activeUsers.push({
                'member_data' : (myResult[i].member_data)
                // 'membership_data' : myResult[i].membership_data
              });
              allUserData.push({
                'member_data' : (myResult[i].member_data)
                // 'membership_data' : myResult[i].membership_data
              });

            }
            if(!isActive && isExpired){
              pastUsers.push({
                'member_data' : (myResult[i].member_data)
                // 'membership_data' : myResult[i].membership_data
              });
              allUserData.push({
                'member_data' : (myResult[i].member_data)
                // 'membership_data' : myResult[i].membership_data
              });
            }
          }catch(e){
            if(clientStatusFilter=='active'){
              // Send Active Users Data
              response_data.activeUsers = activeUsers;
              return callback2(activeUsers);
            }else if(clientStatusFilter=='past'){
              // Send Past Users Data
              response_data.pastUsers = pastUsers;
              return callback2(pastUsers);
            }else{
              // Send All User Data
              response_data.allUserData = allUserData;
              return callback2(allUserData);
            }
            // return callback2(response_data);
            // return callback2(allUserData);
          }
        }

        if(clientStatusFilter=='active'){
          // Send Active Users Data
          response_data.activeUsers = activeUsers;
          return callback2(activeUsers);
        }else if(clientStatusFilter=='past'){
          // Send Past Users Data
          response_data.pastUsers = pastUsers;
          return callback2(pastUsers);
        }else{
          // Send All User Data
          response_data.allUserData = allUserData;
          return callback2(allUserData);
        }
        // console.log(user_data1);
        // return callback2(response_data);

      }
    }
  });
}

function only_ClientStatus_filter_data(req, res, iv, clientStatusFilter, userid, roleid, roleidFilter){
  //res.end('only_ClientStatus_filter_data');
  let searchName = '';
  var clientStatusPromise = new Promise((resolve, reject) => {
    members_under_trainer(req, res, iv, userid, roleid, roleidFilter, searchName, function(client_filter){
        resolve(client_filter);
    }); // Yay! Everything went well!
  });
  Promise.all([clientStatusPromise]).then(function(parsedData) {
      let user_row = parsedData[0];
      if(user_row.length<=0){
        // No Client data of this status under this trainer
        let response_data = status_codes.no_client_data_status;
        // console.log(response_data);
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
      }else{
        var gym_member_data = new Array();
        var ids = "",idsArr = [];
        for(var i=0;i<user_row.length;i++){
          gym_member_data.push(user_row[i]);
            if(i==(user_row.length-1) )
              ids = ids + user_row[i].id;
            else
              ids = ids +user_row[i].id +",";
              // console.log(gym_member_data[i].id);
              // console.log('gym_member_data[i]');
        }

        var p1 = new Promise( (resolve, reject) => {
          clientSatusDataOnly(req, res, iv, ids, gym_member_data, clientStatusFilter, function(status_filter){
              resolve(status_filter);
          }); // Yay! Everything went well!
        });
          p1.then( value => {
              if(value.length<=0){
                // No Client data under this trainer
                let response_data = status_codes.no_client_data_status;
                // console.log(response_data);
                let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                res.end(enc);
              }else{
                let response_data1 = {};
                response_data1 = status_codes.client_data;
                // response_data1.output = value;
                var user_clientdata = new Array();
                for(var i=0;i<value.length;i++){
                  // user_clientdata[i] = value[i].member_data;
                  let user_client_data1 = nullKeyValidation.iosNullValidation(value[i].member_data);
                  user_clientdata[i] = user_client_data1;
                }
                response_data1.output = user_clientdata;
                var key1 = "activeUsers", key2="pastUsers";
                delete response_data1[key1]; delete response_data1[key2];
                // console.log(user_clientdata);
                // console.log(' user_clientdata response_data1');
                // console.log(response_data1);
                let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data1));
                res.end(enc);
                // res.
              }
          },
          reason => {
              // console.log(reason); // Error!
              let response_data = status_codes.db_error_0001;
              // console.log(response_data);
              let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
              res.end(enc);
          });

      //   var clientData = new Promise((resolve, reject) => {
      //     clientSatusDataOnly(req, res, iv, ids, clientStatusFilter, function(status_filter){
       //
      //         resolve(status_filter);
      //     }); // Yay! Everything went well!
      //   });
      //   Promise.all([clientSatusDataOnly]).then(function(parsedData1) {
      //     console.log(parsedData1);
      //     console.log('parsedData1');
      //       let user_row1 = parsedData1[0];
      //       let response_data = status_codes.db_error_0001;
      //       console.log(user_row1+'');
      //       //console.log(user_row1+' clientSatussDataOnly 2');
      //       let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      //       res.end(enc);
      //   },
      //   reason => {
      //    console.log(reason);
      //      let response_data = status_codes.db_error_0001;
      //      console.log(response_data);
      //      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      //      res.end(enc);
      //  });
      }
    },
     reason => {
      // console.log(reason);
        let response_data = status_codes.db_error_0001;
        // console.log(response_data);
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
    });
}



function both_searchByName_ClientStatus_filter_data(req, res, iv, searchName, clientStatusFilter, userid, roleid, roleidFilter){
// res.end('function both_searchByName_ClientStatus_filter_data(req, res, iv, searchName, clientStatus, userid){');
var searchNameClientStatusPromise = new Promise((resolve, reject) => {
  members_under_trainer(req, res, iv, userid, roleid, roleidFilter, searchName, function(name_status_filter){
      resolve(name_status_filter);
  }); // Yay! Everything went well!
});
Promise.all([searchNameClientStatusPromise]).then(function(parsedData) {
    let user_row = parsedData[0];
    if(user_row.length<=0){
      // No Client data of this status and that name under this trainer
      let response_data = status_codes.no_client_name_status;
      // console.log(response_data);
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }else{
      var gym_member_data = new Array();
      var ids = "",idsArr = [];
      for(var i=0;i<user_row.length;i++){
        gym_member_data.push(user_row[i]);
          if(i==(user_row.length-1) )
            ids = ids + user_row[i].id;
          else
            ids = ids +user_row[i].id +",";
            // console.log(gym_member_data[i].id);
            // console.log('gym_member_data[i]');
      }

      var p1 = new Promise( (resolve, reject) => {
        clientSatusDataOnly(req, res, iv, ids, gym_member_data, clientStatusFilter, function(status_filter){
            resolve(status_filter);
        }); // Yay! Everything went well!
      });
        p1.then( value => {
          if(value.length<=0){
            // No Client data under this trainer
            let response_data = status_codes.no_client_name_status;
            // console.log(response_data);
            let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
            res.end(enc);
          }else{
              let response_data1 = {};
              response_data1 = status_codes.client_data;
              // response_data1.output = value;
              var user_clientdata = new Array();
              for(var i=0;i<value.length;i++){
                // user_clientdata[i] = value[i].member_data;
                let user_client_data1 = nullKeyValidation.iosNullValidation(value[i].member_data);
                user_clientdata[i] = user_client_data1;
              }
              response_data1.output = user_clientdata;
              var key1 = "activeUsers", key2="pastUsers";
              delete response_data1[key1]; delete response_data1[key2];
              // console.log(user_clientdata);
              // console.log(' user_clientdata response_data1');
              // console.log(response_data1);
              let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data1));
              res.end(enc);
              // res.
            }
        },
        reason => {
            // console.log(reason); // Error!
            let response_data = status_codes.db_error_0001;
            // console.log(response_data);
            let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
            res.end(enc);
        });
    }
  },
   reason => {
    // console.log(reason);
      let response_data = status_codes.db_error_0001;
      // console.log(response_data);
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
  });
}



function get_profile_squat_baseline_nut_next (req, res, next, iv){
  let userid   = encrypt_decrypt.decode_base64(req.params.userid);
  let get_p_s_b_n_query ='  select m.*,  s.id as s_id, s.user as s_user, s.testResults as s_testResults,'+
  ' bm.id as bm_id, bm.user as bm_user, bm.activityLevel as bm_activityLevel,'+
  ' bm.weight as bm_weight, bm.height as bm_height, bm.bodyFat as bm_bodyFat,'+
  ' bm.waterWeight as bm_waterWeight, bm.leanBodyMass as bm_leanBodyMass, bm.boneDensity as bm_boneDensity,'+
  ' SUBSTRING_INDEX(bm.updatedAt, "T",-1 ) as bm_updatedAt, SUBSTRING_INDEX(bm.createdAt, "T",-1 ) as bm_createdAt'+
  ', bm.caliperBicep as bm_caliperBicep,'+
  ' bm.triceps as bm_triceps, bm.subscapular as bm_subscapular,'+
  ' bm.iliacCrest as bm_iliacCrest, bm.neck as bm_neck, bm.chest as bm_chest,'+
  ' bm.circumferenceBicep as bm_circumferenceBicep, bm.forearm as bm_forearm, bm.waist as bm_waist,'+
  ' bm.hip as bm_hip, bm.thigh as bm_thigh, bm.calf as bm_calf,'+
  ' bm.circumferencesSum as bm_circumferencesSum'+
  // ' n.id as n_id,n.user_id as n_user_id, n.nutrition as n_nutrition'+
  ' from gym_member as m'+
  ' left join member_overhead_squat as s on m.id = s.user'+
  ' left join member_measurement as bm on m.id = bm.user'+
  // ' left join gym_nutrition as n on m.id = n.user_id '+
  ' where m.id="'+  userid +'"'+
  // ' order by n.id desc limit 1'
  ' group by m.id;'
  // console.log(get_p_s_b_n_query);
  connection_db.query(get_p_s_b_n_query,function(err,user_row){
    if(err){
      // throw err;
      let response_data = status_codes.db_error_0001;
      // console.log(response_data);
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }else {
      if(user_row.length<=0){
        // No User Found for that id
        let response_data = status_codes.no_data_found;
        // console.log(response_data);
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
        // res.status(200).json(response_data);
      }else{

        var user_data = user_row[0];
        // console.log(user_row);
        let response_data = {};
        response_data = status_codes.profile_squat_baseline;
        let baselineData = {}, profileData = {}, squatData = {}, nutritionData = {};
        try{
            baselineData={
              "id" : user_row[0].bm_id  ,"user"  : user_row[0].bm_user  ,
              "activityLevel":user_row[0].bm_activityLevel  ,
              "weight" : user_row[0].bm_weight  ,"height" : user_row[0].bm_height  ,
              "bodyFat":user_row[0].bm_bodyFat  ,
              "waterWeight": user_row[0].bm_waterWeight  ,
              "leanBodyMass": user_row[0].bm_leanBodyMass  ,
              "boneDensity": user_row[0].bm_boneDensity  ,
              "updatedAt" : user_row[0].bm_updatedAt  ,
              "createdAt":user_row[0].bm_createdAt  ,
              "caliperBicep": user_row[0].bm_caliperBicep  ,
              "triceps": user_row[0].bm_triceps  ,"subscapular": user_row[0].bm_subscapular  ,
              "iliacCrest" : user_row[0].bm_iliacCrest  ,
              "neck"  : user_row[0].bm_neck  , "chest" : user_row[0].bm_chest  ,
              "circumferenceBicep" : user_row[0].bm_circumferenceBicep  ,
              "forearm": user_row[0].bm_forearm  ,
              "waist": user_row[0].bm_waist  ,"hip": user_row[0].bm_hip  ,
              "thigh": user_row[0].bm_thigh  ,"calf": user_row[0].bm_calf  ,
              "circumferencesSum": user_row[0].bm_circumferencesSum
            };
            try{
              let  pr_birth_date = new Date(user_row[0].birth_date).toISOString();
              let str = (pr_birth_date).split('T');
                // console.log(str+'str');
              user_row[0].birth_date = (str[0]);
            }catch(ex){
              user_row[0].birth_date = "";
            }


            profileData = {
              "id": user_row[0].id ,  "activated": user_row[0].activated  ,
              "role_name": user_row[0].role_name  ,"role_id": user_row[0].role_id  ,
              "member_id": user_row[0].member_id  ,"associated_licensee": user_row[0].associated_licensee  ,
              "first_name": user_row[0].first_name  ,"middle_name": user_row[0].middle_name  ,
              "last_name": user_row[0].last_name  ,"location_id": user_row[0].location_id  ,
              "licensee_type": user_row[0].licensee_type  ,"member_type": user_row[0].member_type  ,
              "role": user_row[0].role  ,"s_specialization": user_row[0].s_specialization  ,
              "gender": user_row[0].gender  ,"birth_date": user_row[0].birth_date  ,
              "assign_class": user_row[0].assign_class  ,"assign_group": user_row[0].assign_group  ,
              "address": user_row[0].address  ,"city": user_row[0].city  ,
              "state": user_row[0].state  ,"country": user_row[0].country  ,
              "zipcode": user_row[0].zipcode  ,"mobile": user_row[0].mobile  ,
              "phone": user_row[0].phone  , "email": user_row[0].email  ,
              "username": user_row[0].username  ,
              "image": user_row[0].image   ,"assign_staff_mem": user_row[0].assign_staff_mem  ,
              "intrested_area": user_row[0].intrested_area  ,"g_source": user_row[0].g_source  ,
              "referrer_by": user_row[0].referrer_by  ,"inquiry_date": user_row[0].inquiry_date  ,
              "trial_end_date": user_row[0].trial_end_date  ,
              "selected_membership": user_row[0].selected_membership  ,
              "membership_status": user_row[0].membership_status  ,
              "membership_valid_from": user_row[0].membership_valid_from  ,
              "membership_valid_to": user_row[0].membership_valid_to  ,
              "first_pay_date": user_row[0].first_pay_date  ,
              "created_by": user_row[0].created_by  ,"created_role": user_row[0].created_role  ,
              "class_type": user_row[0].class_type  ,"login_type": user_row[0].login_type  ,
              "access_token": user_row[0].access_token  ,
              "monitor": user_row[0].monitor  ,"units": user_row[0].units  ,
              "maxHeartRate": user_row[0].maxHeartRate  ,"monitor_ip": user_row[0].monitor_ip  ,
              "monitor_ip_ios": user_row[0].monitor_ip_ios  ,
              "reg_from": user_row[0].reg_from  ,"agree": user_row[0].agree
          };
          squatData={
            "id" : user_row[0].s_id  ,"user"  : user_row[0].s_user  ,
            "testResults":user_row[0].s_testResults
          };
          let temp_baselineData = nullKeyValidation.iosNullValidation(baselineData);
          baselineData = temp_baselineData;
          let temp_profileData = nullKeyValidation.iosNullValidation(profileData);
          profileData = temp_profileData;
          let temp_squatData = nullKeyValidation.iosNullValidation(squatData);
          squatData = temp_squatData;

          let birth_date = profileData.birth_date;
          if(typeof (birth_date)!= 'undefined' && birth_date!=null
              && birth_date!="" && birth_date!=undefined ){
                birth_date = new Date(birth_date).toISOString();
                // console.log('date toISOString');
                let str = (birth_date).split('T');
                profileData.birth_date = (str[0]);
          }

          // nutritionData={
          //   "id" : user_row[0].n_id,"user_id"  : user_row[0].n_user_id,"nutrition":user_row[0].n_nutrition
          // };
        }catch(e){
          // console.log('catch error');
        }
        finally{
          response_data.output = {};
          response_data.output.baselineData = baselineData;
          response_data.output.profileData = profileData;
          response_data.output.squatData = squatData;
          // response_data.output.nutritionData = nutritionData;
        }

        // response_data.output = user_row;
        // console.log(response_data);
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
      }
    }
  });
}


function makeSearchQuery(){

}


module.exports = client;
