var request = require('request');
var config = require('./config.json');
var encrypt_decrypt = require('.././encrypt_decrypt/encryption-decryption.js');
// 
// request.post(
//     'http://www.yoursite.com/formpage',
//     { json: { key: 'value' } },
//     function (error, response, body) {
//         if (!error && response.statusCode == 200) {
//             console.log(body)
//         }
//     }
// );



module.exports ={

  makePostRequest: function postRequest( url_data) {
    let userid = url_data.id;
    let token = url_data.token;
    let postUrl = config.portalPassUrl + '/' + url_data.id + '/' + url_data.token;
    console.log(postUrl);
    request.post(
        postUrl,
        // { json: { key: 'value' } },
        function (error, response, body) {
            // if (!error && response.statusCode == 200) {
            //     console.log(body)
            // }
            if(error){
              // throw error;
              console.log('Web Port error');
              console.log(error);
            }
            else if(response.statusCode == 200) {
              // console.log('/home/rnf-022/VikasKohli_Workspace/project/routes/httpUtil.js');
              // console.log(response.body);
                console.log(response.statusCode + 'Success');
            }else{
              console.log(response.statusCode);
              console.log('my name'+' not success');
            }
        });
  }

}
