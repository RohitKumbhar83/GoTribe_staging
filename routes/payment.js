var crypto = require('crypto');
var dataBaseUtil = require("./mysql_data.js");
var emailUtil = require("./emailUtil.js");
var config = require('./config.json');
var status_codes = require('.././status_codes/status_codes.json');
var encrypt_decrypt = require('.././encrypt_decrypt/encryption-decryption.js');
var inputValidation = require('.././validation/input-validation.js');
var nullKeyValidation = require('.././validation/null-key-validation.js');
var userRegister = require('.././validation/isUserRegister.js');
var moment = require('moment');
var PHPUnserialize = require('php-unserialize');

// first_date: '1494201600',
//     last_date: '1495411200',

// console.log('uhu');
// var day = moment('1494201600000');
// console.log(day);
// console.log(moment('1494201600000', "x").format("DD MMM YYYY") );//parse string
// console.log(moment('1495411200000', "x").format("DD MMM YYYY") );//parse string
// var PHPUnserialize = require('php-unserialize');
// // var payrollData = require('.././validation/payroll_data.js');
// var serializedArr = "YToxOntpOjA7YTo0OntzOjEwOiJmaXJzdF9uYW1lIjtzOjc6ImhhcnNoYWwiO3M6MTE6InBhaWRfYW1vdW50IjtzOjY6Ijg5OS45OSI7czo4OiJlbmRfZGF0ZSI7czoxMDoiMjAxNy0wNi0xMiI7czoxNjoibWVtYmVyc2hpcF9sYWJlbCI7czoxOToiUEVSU09OQUwgVFJBSU5JTkcgNCI7fX0=";
// // // console.log(encrypt_decrypt.decode_base64(serializedArr));
// // // console.log(serializedArr);
// var mySerialize ;
// mySerialize= (encrypt_decrypt.decode_base64(serializedArr));
// // var qs = require('qs');
// var arr_data = [];
// var deSerialize = (PHPUnserialize.unserialize(mySerialize));
// //
// console.log(deSerialize); // {}
// for(property in deSerialize ){
//   // (objectData[property])
//   arr_data.push((deSerialize[property]));
// }
//
// console.log(arr_data);

//
// console.log(deSerialize.length); // {}
// // console.log(JSON.parse(deSerialize));
// console.log(deSerialize.a);
// console.log('deSerialize');
// var AssocArray = {};  // <- initialize an object, not an array
//
// console.log("a = " + AssocArray["a"]); // "a = The letter A"
// JSON.stringify(AssocArray); // "{"a":"The letter A"}"
//
// var unpackArr = JSON.parse( JSON.stringify(serializedArr) );
// console.log('serializedArr');
// console.log(unpackArr);
var connection_db = dataBaseUtil;

var cryptkey = encrypt_decrypt.generate_crypt_key();

var userpayment = {

  get_my_paycheck: function(req, res, next){
    let iv = encrypt_decrypt.generate_randomIV();
    let isUserId = inputValidation.isValid(req.params.userid);
    if(isUserId!=true){
      let response_data = status_codes.userId_not_found;
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }else{
      get_my_paycheck_next(req, res, next, iv);
    }
  },

  get_my_payroll: function(req, res, next){
    let isUserId = inputValidation.isValid(req.params.userid);
    console.log(isUserId);
    let iv = encrypt_decrypt.generate_randomIV();
    if(isUserId!=true){
      let response_data = status_codes.userId_not_found;
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }else{
        get_my_payroll_next(req, res, next, iv);
    }
  },

  get_my_latest_payroll: function(req, res, next){
   let isUserId = inputValidation.isValid(req.params.userid);
   console.log(isUserId);
   let iv = encrypt_decrypt.generate_randomIV();
   if(isUserId!=true){
     let response_data = status_codes.userId_not_found;
     let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
     res.end(enc);
   }else{
       get_my_latest_payroll_next(req, res, next, iv);
   }
 }


}



function get_my_paycheck_next (req, res, next, iv){
  let userid   = encrypt_decrypt.decode_base64(req.params.userid);
  let roleid   = encrypt_decrypt.decode_base64(req.params.roleid);
  var check_roleid = roleIdCheck(req, res, iv, roleid);
  if(check_roleid){
    var my_paycheck_query = 'Select pr.*,'+
    ' gm.first_name,gm.middle_name,gm.last_name'+
    ' FROM payroll pr '+
    ' LEFT JOIN gym_member gm on gm.id ="' + userid + '"'+
    ' WHERE 1';
    let condition="";
    if (roleid== 3 || roleid== 6) {
      condition = ' AND trainer_id="' + userid + '"';
    }else if(roleid== 2){
      condition = ' AND trainer_id="' + userid + '"' +' AND licensee_id="'+ userid + '"';
    }
    my_paycheck_query = my_paycheck_query + condition;
    console.log(my_paycheck_query);
    connection_db.query(my_paycheck_query,function(err,user_pay){
      if(err){
        // throw err;
        let response_data = status_codes.db_error_0001;
        console.log(response_data);
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
      }else {
        if(user_pay.length<=0){
          // No My Paycheck Data
          let response_data = status_codes.no_my_paycheck;
          console.log(response_data);
          let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
          res.end(enc);
        }else{
          var user_data = user_pay;
          console.log('My paycheck data length'+user_data.length);
          let paycheck_data = new Array();
          // Send My Paycheck Data
          try{
            for(var i=0; i<user_data.length; i++){
              paycheck_data[i] = user_data[i];
              var mySerialize, deSerialize ;
              mySerialize= (encrypt_decrypt.decode_base64(user_data[i].data));
              var arr_data = new Array();
              // console.log(mySerialize);
              deSerialize  = (PHPUnserialize.unserialize(mySerialize));
              console.log(deSerialize );
                for(property in deSerialize ){
                  // console.log(property+ 'property');
                  // (objectData[property])
                  if((deSerialize[property])!= 'false' && (deSerialize[property])!= false
                    && (deSerialize[property])!= "" && (deSerialize[property])!=undefined
                    && (deSerialize[property])!=null && (deSerialize[property])!='null') {
                    arr_data.push((deSerialize[property]));
                  }
                }
                console.log(arr_data );
                // paycheck_data[i].data = arr_data;
                delete paycheck_data[i].data;
                paycheck_data[i].arr_data = new Array();
                paycheck_data[i].arr_data = arr_data;
                // console.log(paycheck_data[i].arr_data);
            }
          }catch(ex){
            paycheck_data = [];
          }finally{
            let response_data = {}
            response_data = status_codes.my_paycheck_data;
            response_data.output = paycheck_data;
            // let responseOutput = nullKeyValidation.iosNullValidation(response_data.output);
            // response_data.output = responseOutput;
            // console.log(response_data);
            let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
            res.end(enc);
          }
        }
      }
    });
  }
}


function get_my_payroll_next(req, res, next, iv){
  let userid   = encrypt_decrypt.decode_base64(req.params.userid);
  let roleid   = encrypt_decrypt.decode_base64(req.params.roleid);
  let payrollid   = encrypt_decrypt.decode_base64(req.params.payrollid);
  var check_roleid = roleIdCheck(req, res, iv, roleid);
  if(check_roleid){
    // payrollData.get_payroll_by_id(req, res, iv, payrollid, function(cb_pay){
      // if (roleid == 2 || roleid== 3 || roleid== 6){
      //     if(cb_pay.trainer_id != userid){
      //       let response_data = status_codes.roleid_permission_err;
      //       console.log(response_data);
      //       let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      //       res.end(enc);
      //     }
      // }
      // let my_payrollid_status;
      // if(roleid == 2){
      // my_payrollid_status = 'select prsum(grand_total) as grand_total from payroll where'+
      // ' licensee_id="'+ userid + '" AND trainer_id !="' + userid + '"'+
      // ' AND id="'+payrollid+'"';
      // }else{
      // my_payrollid_status = 'select sum(grand_total) as grand_total from payroll where'+
      // ' licensee_id= "' + cb_pay.licensee_id + '" AND trainer_id !="' + cb_pay.licensee_id + '"';
      // }
      var my_payrollId_query = 'select * FROM payroll WHERE 1';
      let condition1, condition2;
      if (roleid== 3 || roleid== 6) {
        condition1 = ' AND trainer_id="' + userid + '"';
      }else if(roleid== 2){
        condition1 = ' AND trainer_id="' + userid + '"' +' AND licensee_id="'+ userid + '"';
      }
      condition2 = ' AND id="'+  payrollid+ '"';
      my_payrollId_query = my_payrollId_query + condition1 + condition2;
      console.log(my_payrollId_query);
      connection_db.query(my_payrollId_query,function(err,user_pay){
        if(err){
          // throw err;
          let response_data = status_codes.db_error_0001;
          console.log(response_data);
          let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
          res.end(enc);
        }else{
          if(user_pay.length<=0){
            // No My Payroll Data
            let response_data = status_codes.no_payroll_found_id;
            console.log(response_data);
            let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
            res.end(enc);
          }else{
            var user_payroll = user_pay[0];
            // Send My Payroll Data
            let response_data = {};
            if( (roleid == 2 || roleid== 3 || roleid== 6) && (user_payroll.trainer_id != userid) ){
                let response_data = status_codes.roleid_permission_err;
                console.log(response_data);
                let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                res.end(enc);
            }else{
                let total_amount= 0;
                let response_data = status_codes.my_payroll_data_id;
                console.log(response_data);
                let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                res.end(enc);
                    // $row['sgt_price']=$row['lic1_sgt'];
                    // $data11=unserialize(base64_decode($row['data']));
                    //   foreach ($data11 as $rows) {
                    //       $peramt=number_format($rows['paid_amount']);
                    //       $total_sal=$total_sal+$peramt;
                    //   }
                    //   $row["cut_total"]=$total_sal;
                    let percent = 0;
                    if(role_id==6){
                       percent = 100;
                    }
                    else if(role_id==3){
                       percent = user_payroll.discount_percent || 0;
                    }


                    let unserialized_data;
                     // unserialized_data = unserialize(base64_decode($row['data']));
                    //  foreach ($data11 as $row) {
                    //       $subtotal=$subtotal+$row['paid_amount'];
                    //       $peramt=number_format($row['paid_amount']*$perce/100,2);
                    //       $grand_total=$grand_total+$peramt;
                    //       $fname=$row['first_name']?$row['first_name']:'N/A';
                    //       $membership_label=$row['membership_label']?$row['membership_label']:'PT/OPT';
                    //       $paid_amount=$row['paid_amount']?$row['paid_amount']:'0.00';
                    //       $peramts=$peramt?$peramt:'0.00';
                    //   }



            }

          }
        }
      });
    // });
  }
}

function roleIdCheck(req, res, iv, roleid){
  console.log('my roleid is '+roleid);
  try{
    if(!isNaN(roleid)){
      if(roleid<1){
        let response_data = status_codes.roleid_int_error;
        console.log(response_data);
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
      }else if(roleid == 4 || roleid ==1 || roleid>8 || roleid == 5){
        // console.log('gjkhf');
        let response_data = status_codes.roleid_permission_err;
        console.log(response_data);
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
      }else {
        return true;
      }
    }else{
      console.log('!isNaN');
      let response_data = status_codes.roleid_error;
      console.log(response_data);
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }
  }
  catch(ex){
    console.log('catch');
    let response_data = status_codes.roleid_error;
    console.log(response_data);
    let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
    res.end(enc);
  }

}

function get_my_latest_payroll_next(req, res, next, iv){
  let userid   = encrypt_decrypt.decode_base64(req.params.userid);
  let roleid   = encrypt_decrypt.decode_base64(req.params.roleid);
  var check_roleid = roleIdCheck(req, res, iv, roleid);
  if(check_roleid){
    var my_latest_payroll_query = 'Select pr.*,'+
    ' gm.first_name,gm.middle_name,gm.last_name'+
    ' FROM payroll pr '+
    ' LEFT JOIN gym_member gm on gm.id ="' + userid + '"'+
    ' WHERE 1 ';
    let condition="", orderByCondition = "";
    if (roleid== 3 || roleid== 6) {
      condition = ' AND trainer_id="' + userid + '"';
    }else if(roleid== 2){
      condition = ' AND trainer_id="' + userid + '"' +' AND licensee_id="'+ userid + '"';
    }
    orderByCondition = " order by pr.id desc limit 1";
    my_latest_payroll_query = my_latest_payroll_query + condition + orderByCondition;
    console.log(my_latest_payroll_query);
    connection_db.query(my_latest_payroll_query,function(err,user_pay){
      if(err){
        // throw err;
        let response_data = status_codes.db_error_0001;
        console.log(response_data);
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
      }else {
        if(user_pay.length<=0){
          // No My Paycheck Data
          let response_data = status_codes.no_payroll_data;
          console.log(response_data);
          let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
          res.end(enc);
        }else{
          var user_data = user_pay[0];
          let latest_payrollData = new Array(), i=0;
          // Send My Latest Payroll Data
          try{
              var mySerialize, deSerialize ;
              mySerialize= (encrypt_decrypt.decode_base64(user_data.data));
              var arr_data = new Array();
              console.log(mySerialize);
              deSerialize  = (PHPUnserialize.unserialize(mySerialize));
              console.log(deSerialize );
                for(property in deSerialize ){
                  // console.log(property+ 'property');
                  // (objectData[property])
                  if((deSerialize[property])!= 'false' && (deSerialize[property])!= false
                    && (deSerialize[property])!= "" && (deSerialize[property])!=undefined
                    && (deSerialize[property])!=null && (deSerialize[property])!='null') {
                    arr_data.push((deSerialize[property]));
                  }
                }
                let default_price = 0.0, total_payment = 0.0;
                // console.log(arr_data );
                // latest_payrollData[i].data = arr_data;
                if(roleid == 6){
                  /*
                  // For license cum staff discount is 100% so cut_total is equal to its grand_total
                  // ||ly for total_sgt, use lic1_sgt instead of sgt_price
                  */
                  latest_payrollData.push({
                    'id': user_data.id, 'trainer_id': user_data.trainer_id,
                    'licensee_id': user_data.licensee_id,
                    'total_sgt': parseFloat(user_data.lic1_sgt) || default_price, // different with below
                    'cut_total': parseFloat(user_data.grand_total) || default_price, // different with below
                    'commission_rate': parseFloat(user_data.commission_rate) || default_price
                  });
                }else{
                  /*
                  // For other trainers/licenses discount is 60% so cut_total is equal to its cut_total
                  // ||ly for total_sgt, use lic1_sgt instead of sgt_price
                  */
                  latest_payrollData.push({
                    'id': user_data.id, 'trainer_id': user_data.trainer_id,
                    'licensee_id': user_data.licensee_id,
                    'total_sgt': parseFloat(user_data.sgt_price) || default_price, // different with above
                    'cut_total': parseFloat(user_data.cut_total) || default_price, // different with above
                    'commission_rate': parseFloat(user_data.commission_rate) || default_price
                  });
                }
                total_payment = latest_payrollData[i].total_sgt + latest_payrollData[i].cut_total + latest_payrollData[i].commission_rate;
                // latest_payrollData[i].arr_data = new Array();
                // latest_payrollData[i].arr_data = arr_data;
                latest_payrollData[i].total_payment = total_payment;
                latest_payrollData[i].first_date = user_data.first_date;
                latest_payrollData[i].last_date = user_data.last_date;
                // console.log(latest_payrollData[i].arr_data);
          }catch(ex){
            paycheck_data = [];
          }finally{
            let response_data = {}
            response_data = status_codes.payroll_data;
            response_data.output = latest_payrollData;
            // let responseOutput = nullKeyValidation.iosNullValidation(response_data.output);
            // response_data.output = responseOutput;
            console.log(response_data);
            let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
            res.end(enc);
          }
        }
      }
    });
  }
}

module.exports = userpayment;
