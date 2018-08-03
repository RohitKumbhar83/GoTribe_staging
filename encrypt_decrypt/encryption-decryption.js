var crypto = require('crypto');
var config = require('.././routes/config.json');

var AESCrypt = {

  decrypt: function(cryptkey, iv, encryptdata) {

      try{
        encryptdata = new Buffer(encryptdata, 'base64').toString('binary');

        var decipher = crypto.createDecipheriv('aes-256-cbc', cryptkey, iv),
            decoded = decipher.update(encryptdata, 'binary', 'utf8');

        decoded += decipher.final('utf8');
        return decoded;
      }catch(e){
          return 'Wrong String';
      }


  },

  encrypt : function(cryptkey, iv, cleardata) {
    // console.log('crypt key');
    // console.log(cryptkey);
    // console.log('iv');
    // console.log(iv);

    var buffer_DATA_IV = new Buffer( iv);

      var encipher = crypto.createCipheriv('aes-256-cbc', cryptkey, buffer_DATA_IV),
          encryptdata = encipher.update(cleardata, 'utf8', 'binary');

      encryptdata += encipher.final('binary');
      // console.log('encryptdata using aes-256-cbc');
      // console.log(encryptdata);

      encode_encryptdata = new Buffer(encryptdata, 'binary').toString('base64');
      // console.log('encoded data to base64');
      // console.log(encode_encryptdata);

      // return encode_encryptdata+":"+iv.toString('hex');
      // console.log("Encrypt Data");
      // console.log(new Buffer(encode_encryptdata+iv.toString('hex'), 'binary').toString('base64'));

      // Again encoded to base_64
      // console.log('Concatenate iv and encoded_data');
      // console.log(encode_encryptdata+iv.toString('hex'), 'binary');

      var encode_encryptdata_base64_2nd = new Buffer(encode_encryptdata+iv, 'binary').toString('base64');
      // return encode_encryptdata+iv.toString('hex');

      // console.log('Again Base 64- Encoded Data + IV');
      // console.log(encode_encryptdata_base64_2nd);
      return encode_encryptdata_base64_2nd;
  },



  decrypt_new: function(cryptkey, encryptdata_with_iv) {

    // console.log(cryptkey);
    // console.log('cryptkey in decrypt_');
      try{
        var  new_decryptdata = new Buffer(encryptdata_with_iv, 'base64').toString('binary');
        // var res_iv = (new_decryptdata.substr(new_decryptdata.length-32,new_decryptdata.length)).toString();
        // var encryptdata = (new_decryptdata.substr(0,new_decryptdata.length-32)).toString();

        var res_iv = (new_decryptdata.substr(new_decryptdata.length-16,new_decryptdata.length)).toString();
        var encryptdata = (new_decryptdata.substr(0,new_decryptdata.length-16)).toString();

        // var buf1 = Buffer.alloc(16, res_iv, 'hex');
        // var iv = buf1;
        var buffer = new Buffer( res_iv);
        var iv = buffer;
        console.log(iv+'iv');
        encryptdata = new Buffer(encryptdata, 'base64').toString('binary');

        var decipher = crypto.createDecipheriv('aes-256-cbc', cryptkey, iv),
            decoded = decipher.update(encryptdata, 'binary', 'utf8');

        decoded += decipher.final('utf8');
        return decoded;
      }catch(e){
        console.log('fhgukgi');
          return 'Wrong String';
      }

  },

  generate_crypt_key: function(){
    let cryptkey   = crypto.createHash('sha256').update(config.public_shared_key).digest();
    cryptkey = cryptkey.toString('hex');
    cryptkey = cryptkey.substr(0,cryptkey.length-32).toString();
    cryptkey = Buffer.from(cryptkey);

    return cryptkey;
  },

  generate_randomIV: function(){
     // let iv = crypto.randomBytes(16);
     function randomValueBase64 (len) {
         return crypto.randomBytes(Math.ceil(len * 3 / 4))
             .toString('base64')   // convert to base64 format
             .slice(0, len)        // return required number of characters
             .replace(/\+/g, '0')  // replace '+' with '0'
             .replace(/\//g, '0'); // replace '/' with '0'
     }

     let iv = randomValueBase64(16); // value 'wNm2OQu7UaTB'
     return iv;

  },


  encode_base64: function(string){
    try{
      // console.log('encode_base64');
      let  new_encrypt = new Buffer(string, 'binary').toString('base64');
      return new_encrypt;
    }catch(e){
      return "";
    }

  },


  decode_base64: function(encrypt_string){
    try{
      // console.log('decode_base64');
      let  new_decrypt = new Buffer(encrypt_string, 'base64').toString('binary');
      return new_decrypt;
    }catch(e){
      return "";
    }

  },


  generate_pass_social_user: function(){
    // try{
      var alphabet = "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789";
      let alphaLength = (alphabet.length - 1);
      let randPass = [];
      for (let i = 0;i < 8; i++) {
             let rand_char = alphabet[Math.floor(Math.random() * alphabet.length)];
             randPass[i] = rand_char;
       }
        randPass = randPass.toString();
        let concat = randPass.replace(/,/g , "");
        return concat;
    // }

  }



};


module.exports = AESCrypt;



// encrypt : function(cryptkey, iv, cleardata) {
//   console.log(iv+'Hello1        yfdgbyu');
//   var be = iv.toString('hex');
//   console.dir(convertHex.hexToBytes(be));
//     var encipher = crypto.createCipheriv('aes-256-cbc', cryptkey, iv),
//         encryptdata = encipher.update(cleardata, 'utf8', 'binary');
//
// var iv_hex = iv.toString('hex');
// console.log(convertHex.hexToBytes(iv_hex));
//     encryptdata += encipher.final('binary');
//     encode_encryptdata = new Buffer(encryptdata, 'binary').toString('base64');
//     // return encode_encryptdata+":"+iv.toString('hex');
//     console.log(iv+'Hello        yfdgbyu');
//     return encode_encryptdata+":"+iv;
// }
