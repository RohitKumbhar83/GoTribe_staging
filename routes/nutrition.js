var crypto = require('crypto');
var dataBaseUtil = require("./mysql_data.js");
var emailUtil = require("./emailUtil.js");
var config = require('./config.json');
var status_codes = require('.././status_codes/status_codes.json');
var encrypt_decrypt = require('.././encrypt_decrypt/encryption-decryption.js');
var inputValidation = require('.././validation/input-validation.js')
var nullKeyValidation = require('.././validation/null-key-validation.js');

var connection_db = dataBaseUtil;

var cryptkey = encrypt_decrypt.generate_crypt_key();

var nutrition = {

  save_nutrition: function(req, res, next){
    let isUserId = inputValidation.isValid(req.params.userid);
    let iv = encrypt_decrypt.generate_randomIV();
    console.log('save_nurition');
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
            save_nutrition_next(req, res, next, iv);
        });
    }
  },

  update_nutrition: function(req, res, next){
    let isUserId = inputValidation.isValid(req.params.userid);
    let iv = encrypt_decrypt.generate_randomIV();
    if(isUserId!=true){
      let response_data = status_codes.userId_not_found;
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }
    else{
      let isNutritionId = inputValidation.isValid(req.params.nutritionid);
      if(isNutritionId!=true){
        let response_data = status_codes.nutritionId_not_found;
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
                  update_nutrition_next(req, res, next, iv);
              });
      }
    }
  },

  /* Get Nutrition By Date */

  get_nutrition: function(req, res, next){
    console.log('get');
    let isUserId = inputValidation.isValid(req.params.userid);
    let iv = encrypt_decrypt.generate_randomIV();
    if(isUserId!=true){
      let response_data = status_codes.userId_not_found;
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }
    else{
      let queryData = req.query||null;
      let isQuery = inputValidation.isValid(queryData);
      if(isQuery!=true){
        let response_data = status_codes.query_string_missing;
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
      }
      else{
          get_nutrition_next(req, res, next, iv);
      }
    }
  },

  /* Get Nutrition By Id */
  get_nutrition_info: function(req, res, next){
    let isUserId = inputValidation.isValid(req.params.userid);
    let iv = encrypt_decrypt.generate_randomIV();
    if(isUserId!=true){
      let response_data = status_codes.userId_not_found;
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }
    else{
      let isNutritionId = inputValidation.isValid(req.params.nutritionid);
      if(isNutritionId!=true){
        let response_data = status_codes.nutritionId_not_found;
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
      }else{
          get_nutrition_info_next(req, res, next, iv);
      }
    }
  }




}; // End of nutrition object


function save_nutrition_next(req, res, next, iv){
  let userid   = encrypt_decrypt.decode_base64(req.params.userid);
  var get_string = req.rawBody || null;

  // console.log(get_string+" get_string");
  if(get_string!=null){
    try{
      var de_cryptdata = encrypt_decrypt.decrypt_new(cryptkey, get_string);
      de_cryptdata = JSON.parse(de_cryptdata);
      let nutrition_data = {}, nutritionDate;
      let curr_date_time = inputValidation.currentDateTime();
      let curr_date_only = inputValidation.currentTime(); // alias function name
      nutrition_data = de_cryptdata;
      nutrition_data.user_id =   userid;
      // nutrition_data.created_date =   curr_date_time;

      let isNDate = inputValidation.isValid(de_cryptdata.created_date);
      if(isNDate!=true){
        nutrition_data.created_date  =   curr_date_only;
        nutritionDate = curr_date_only;
      }else{
        nutritionDate = nutrition_data.created_date;
      }

      console.log(req.query.createdDateTime+" req.query.createdDateTime");
      let createdDateTimeOnly = req.query.createdDateTime || '';
      let isNDateTime = inputValidation.isValid(createdDateTimeOnly);
      if(isNDateTime!=true){
          // don't change old value of old app users
      }else{
        nutrition_data.created_date = createdDateTimeOnly;
      }


      let get_nutr_query = 'select * from gym_nutrition where user_id = "'+ userid +
      '" and created_date like "%'+ nutritionDate + '%";';
      console.log(get_nutr_query);
      connection_db.query(get_nutr_query,function(err,user_row){
        if(err){
          // throw err;
          console.log(error);
          let response_data = status_codes.db_error_0001;
          let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
          res.end(enc);
        }else {
          if(user_row.length<=0){
            var query = connection_db.query('INSERT INTO gym_nutrition SET ?', nutrition_data, function (error, results, fields) {
              if (error){
                // throw error;
                let response_data = status_codes.db_error_0001;
                console.log(response_data);
                let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                res.end(enc);
              }else{
                let response_data = status_codes.nutrition_added;
                console.log(response_data);
                let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                res.end(enc);
              }
            });
          }else{
            var user_data = user_row[0];
            // Update Data and Save
            // console.log(user_data);
            let id = user_data.id
            update_nutritionData(req, res, iv, userid, id, user_data, nutrition_data);
          }
        }
      });
    }catch(e){
      let response_data = status_codes.wrong_string;
      console.log(response_data);
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }
  }else{
    let response_data = status_codes.raw_data_missing;
    console.log(response_data);
    let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
    res.end(enc);
  }
}



function update_nutrition_next(req, res, next, iv){
  let userid   = encrypt_decrypt.decode_base64(req.params.userid);
  let id = encrypt_decrypt.decode_base64(req.params.nutritionid);
  var get_string = req.rawBody || null;
  //  console.log(get_string+" get_string");
  if(get_string!=null){
    try{
      var de_cryptdata = encrypt_decrypt.decrypt_new(cryptkey, get_string);
      de_cryptdata = JSON.parse(de_cryptdata);
      let get_nutr_query = 'select * from gym_nutrition where user_id = "'+userid +
        '" and id = "'+id+'";';
      console.log(get_nutr_query);
      connection_db.query(get_nutr_query,function(err,user_row){
        if(err){
          // throw err;
          let response_data = status_codes.db_error_0001;
          let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
          res.end(enc);
        }else {
          if(user_row.length<=0){
            // No_measure_history for that id
            let response_data = status_codes.no_nutrition;
            console.log(response_data);
            let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
            res.end(enc);
          }else{
            var user_data = user_row[0];
            // Update Data and Save
            // console.log(user_data);
            update_nutritionData(req, res, iv, userid, id, user_data, de_cryptdata);
          }
        }
      });
    }catch(e){
      let response_data = status_codes.wrong_string;
      console.log(response_data);
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }
  }else{
    let response_data = status_codes.raw_data_missing;
    console.log(response_data);
    let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
    res.end(enc);
  }
}




function update_nutritionData(req, res, iv, userid, id, user_data, nutrition_data){

  let isNutNotes = inputValidation.isValid(nutrition_data.nutrition_notes);
  if(isNutNotes!=true){
    nutrition_data.nutrition_notes =   user_data.nutrition_notes||"";
  }
  let isNutrition = inputValidation.isValid(nutrition_data.nutrition);
  if(isNutrition!=true){
    measure_histData.nutrition =   user_data.nutrition||"";
  }
  let update_status_query = 'update gym_nutrition set nutrition_notes="'+nutrition_data.nutrition_notes+
  '", nutrition="'+nutrition_data.nutrition+'" where user_id="'+ userid + '" and id="'+id+'";';
  console.log(update_status_query);
  connection_db.query(update_status_query, function(err, user_mem_row){
  if (err){
    // throw error;
    console.log(err);
    let response_data = status_codes.db_error_0001;
    console.log(response_data);
    let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
    res.end(enc);
  }else{
    let response_data = status_codes.nutrition_updated;
    console.log(response_data);
    let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
    res.end(enc);
  }
  });

}



function get_nutrition_next(req, res, next, iv){
  let userid   = encrypt_decrypt.decode_base64(req.params.userid);
  let queryData = req.query, query_string;
      try{
        for ( property in queryData ) {
            console.log( property ); // Outputs: foo, fiz or fiz, foo
            query_string = property;
            break;
        }
        console.log( 'property queryData' );
      }catch(e){
        let response_data = status_codes.query_string_missing;
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
      }
      try{
          console.log('try '+query_string);
        var de_cryptdata = encrypt_decrypt.decrypt_new(cryptkey, query_string);
        console.log(de_cryptdata)
        de_cryptdata = JSON.parse(de_cryptdata);
        console.log(de_cryptdata);
         console.log(de_cryptdata+' de_cryptdata Object');
        var nutrition_Date = de_cryptdata.nutrition_Date;
        let isNutritionDate = inputValidation.isValid(de_cryptdata.nutrition_Date);
        if(isNutritionDate!=true){
          let response_data = status_codes.nutritionDate_not_found;
          console.log(response_data);
          let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
          res.end(enc);
        }else{
            let get_nutrition_query = 'select n.id,  n.user_id, n.nutrition, n.nutrition_notes,'+
            ' SUBSTRING_INDEX(n.created_date, "T",-1 )  as created_date from gym_nutrition as n'+
            ' where n.user_id = '+ userid+
            ' and n.created_date like"%'+ de_cryptdata.nutrition_Date + '%" order by n.created_date desc;';
            console.log(get_nutrition_query);
            connection_db.query(get_nutrition_query,function(err,user_row){
              if(err){
                // throw err;
                let response_data = status_codes.db_error_0001;
                console.log(response_data);
                let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                res.end(enc);
              }else {
                if(user_row.length<=0){
                  // No User Nutrition data in gym_nutrition
                  let response_data = status_codes.no_user_nutrition_date;
                  console.log(response_data);
                  let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                  res.end(enc);
                }else{
                  // var user_data = user_row[0];
                  var user_data = user_row;
                  // Send User Nutrition data from gym_nutrition
                  // console.log(user_data);
                  let response_data = {}
                  response_data = status_codes.user_nutrition_data;
                  response_data.output = user_data;
                  let responseOutput = nullKeyValidation.iosNullValidation(response_data.output);
                  response_data.output = responseOutput;
                  console.log(response_data);
                  let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                  res.end(enc);
                }
              }
            }); // select query ends
          }
        }
        catch(e){
        let response_data = status_codes.wrong_string;
        console.log(response_data);
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
        }
    }



function get_nutrition_info_next(req, res, next, iv){
  let userid   = encrypt_decrypt.decode_base64(req.params.userid);
  let id = encrypt_decrypt.decode_base64(req.params.nutritionid);
  let get_nutrition_query = 'select * from gym_nutrition where id = "'+id +'"' +
      ' and user_id = "'+userid+'";';
  console.log(get_nutrition_query);
  connection_db.query(get_nutrition_query,function(err,user_row){
    if(err){
      // throw err;
      let response_data = status_codes.db_error_0001;
      console.log(response_data);
      let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
      res.end(enc);
    }else {
      if(user_row.length<=0){
        // No Nutrition data For that id
        let response_data = status_codes.no_user_nutrition;
        console.log(response_data);
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
      }else{
        var user_data = user_row[0];
        // Send Nutrition data from GYM_NUTRITION
        // console.log(user_data);
        let response_data = {}
        response_data = status_codes.user_nutrition_data;
        response_data.output = user_data;
        let responseOutput = nullKeyValidation.iosNullValidation(response_data.output);
        response_data.output = responseOutput;
        console.log(response_data);
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
      }
    }
  });
}


module.exports = nutrition;
