var dataBaseUtil = require(".././routes/mysql_data.js");
var status_codes = require('.././status_codes/status_codes.json');
var inputValidation = require('./input-validation.js');
var encrypt_decrypt = require('.././encrypt_decrypt/encryption-decryption.js');




var connection_db = dataBaseUtil;



var cryptkey = encrypt_decrypt.generate_crypt_key();


module.exports = {

  isUserReferred: function checkUser(req, res, iv, insertedId, emailid, callback){
    let refer_query = 'SELECT * FROM referral_log WHERE referred_to_email = "'+
    emailid+'"  ORDER BY id ASC limit 1;';
      console.log(refer_query);
      let send_data = {"user_found":false};
      connection_db.query(refer_query,function(err,user_row){
        if(err){
          return callback(false);
          // throw err;
          // let response_data = status_codes.db_error_0001;
          // let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
          // res.end(enc);
        }else {
          if(user_row.length<=0){
              return callback(false);
            // return callback(send_data);
            // No User Found for that id
            // let response_data = status_codes.no_user_found;
            // console.log(response_data);
            // let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
            // res.end(enc);
            // res.status(200).json(response_data);
          }else{
            var referred_user = user_row[0];
            var get_license_query = 'select associated_licensee, role_id, email, first_name, last_name from gym_member'+
            ' where id="'+ referred_user.referred_by_userid+'"';
            connection_db.query(get_license_query,function(err,user_ref_license){
              if(err){
                  return callback(false);
                // throw err;
                // let response_data = status_codes.db_error_0001;
                // let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                // res.end(enc);
              }else {
                if(user_ref_license.length<=0){
                    return callback(false);
                  // return callback(send_data);
                  // No User Found for that id
                  // let response_data = status_codes.no_user_found;
                  // console.log(response_data);
                  // let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                  // res.end(enc);
                  // res.status(200).json(response_data);
                }else{
                  var referral_user = user_ref_license[0];
                  let isAssocLicense = inputValidation.isValid(referral_user.associated_licensee);
                  if(isAssocLicense!=true){
                    // don't do anything
                      return callback(false);
                  }else{
                    let referred_Id_data = {
                      referrer_id: referred_user.referred_by_userid,
                      refer_to: insertedId
                    };
                    var query = connection_db.query('INSERT INTO referrer_referred SET ?', referred_Id_data, function (error, results, fields) {
                      if (error){
                        // throw error;
                        // let response_data = status_codes.db_error_0001;
                        // console.log(response_data);
                        // let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                        // res.end(enc);
                          return callback(false);
                      }else{
                        // inputValidation.send_referral_link_on_email(email_id);
                        // let response_data = status_codes.user_referred;
                        // console.log(response_data);
                        // let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                        // res.end(enc);

                          /*
                            //Roleid 6 i.e license cum trainer
                          */
                          let assocLicense = referral_user.associated_licensee || NULL;
                          let update_license_staff_query = 'UPDATE gym_member SET associated_licensee = "'+
                          assocLicense+'"' ;
                          if(referral_user.role_id == 3 || referral_user.role_id == 6){
                            let addStaff = ' , assign_staff_mem="'+referred_user.referred_by_userid + '"';
                            update_license_staff_query = update_license_staff_query + addStaff;
                          }
                          let condition =  ' WHERE id="'+insertedId+'"';
                          update_license_staff_query = update_license_staff_query + condition;
                        console.log(update_license_staff_query + ' update_license_staff_query');
                        connection_db.query(update_license_staff_query,function(err,user_mem_row){
                          if(err){
                            // throw err;
                            // let response_data = status_codes.db_error_0001;
                            // console.log(response_data);
                            // let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                            // res.end(enc);
                              return callback(false);
                          }else {
                            // let response_data = status_codes.del_monitorData;
                            // console.log(response_data);
                            // let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
                            // res.end(enc);
                            return callback(true);
                          }
                        });
                      }
                    }); // inserted referred data
                  }
                }
              }
            });
          }
        }
      });
  }

}
