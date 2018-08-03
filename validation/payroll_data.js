var dataBaseUtil = require(".././routes/mysql_data.js");
var status_codes = require('.././status_codes/status_codes.json');
var inputValidation = require('./input-validation.js');
var encrypt_decrypt = require('.././encrypt_decrypt/encryption-decryption.js');




var connection_db = dataBaseUtil;



var cryptkey = encrypt_decrypt.generate_crypt_key();


module.exports = {

  get_payroll_by_id: function dataFromPayrollId(req, res, iv, payrollId, callback){

    let payroll_id_query = 'select * from payroll where id="'+payrollId+'";';
    let send_data = {"payroll_found":false};
    console.log('payroll_id_query '+payroll_id_query);
    connection_db.query(payroll_id_query,function(error,user_pay){
      if(error){
        // throw err;
        let response_data = status_codes.db_error_0001;
        let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
        res.end(enc);
      }else {
        if(user_pay.length<=0){
          let response_data = status_codes.no_payroll_found;
          console.log(response_data);
          let enc   = encrypt_decrypt.encrypt(cryptkey, iv, JSON.stringify(response_data));
          res.end(enc);
        }else{
          var user_payroll = user_pay[0];
          user_payroll.payroll_found = true;
          return callback(user_payroll);
        }
      }
    });
  }

}
