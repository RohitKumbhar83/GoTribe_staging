
  var express = require("express");

  //import mysql package
  var mysql      = require('mysql');

  var config = require('./config.json');

  var dbObject;
  //
  // var connection = mysql.createConnection({
  //   host     : 'localhost',
  //   user     : 'root',
  //   password : 'root',
  //   database : 'local_db_gotribe'
  // });
  // var connection = mysql.createConnection({
  //   // host     : '172-31-10-189',
  //   host : 'localhost',
  //   user     : 'root',
  //   password : 'zAst7hekuch_hu',
  //   database : 'gotribe'
  // });
  // var connection = mysql.createConnection({
  //   host     : 'gotribeprod-1.cluster-cpqh8v9nt9lt.us-west-1.rds.amazonaws.com',
  //   user     : 'gotribe_aws',
  //   password : 'PHeYEbrest?3&r6r',
  //   database : 'gotribe_prod'
  // });
  //
  // // // mysql -u root  -pzAst7hekuch_hu gotribe
  // connection.connect(function(err) {
  //   if (err) {
  //     console.error('error connecting: ' + err.stack);
  //     return;
  //   }
  //   console.log('connected as id ' + connection.threadId);
  // });


  // var db_config = {
  //   host     : 'gotribe-prod-01-21-2018-us-east-1.cf2bp2hvlpth.us-east-1.rds.amazonaws.com',
  //   user     : 'gotribe_aws',
  //   password : 'PHeYEbrest?3&r6r',
  //   database : 'gotribe_prod'
  // };

  //Staging database configuration 
  
 var db_config = {
  host     : 'gotribe-staging.cf2bp2hvlpth.us-east-1.rds.amazonaws.com',
  user     : 'gotribe_aws',
  password : 'g85yBrmivTEusbwL',
  database : 'gotribe_prod'
};
  /*
  
 

  var db_config = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'zAst7hekuch_hu',
    database : 'gotribe'
  });
*/
// var db_config = {
//   host     : 'localhost',
//   user     : 'root',
//   password : 'root',
//   database : 'local_db_gotribe'
// };
  var connection;

  function handleDisconnect() {
    connection = mysql.createConnection(db_config); // Recreate the connection, since
                                                    // the old one cannot be reused.

    connection.connect(function(err) {              // The server is either down
      if(err) {                                     // or restarting (takes a while sometimes).
        console.log('error when connecting to db:', err);
        console.log('error when connecting to stack db:', err.stack);
        setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
      }
      console.log('SQl connected as id ' + connection.threadId);
                                            // to avoid a hot loop, and to allow our node script to
    });                                     // process asynchronous requests in the meantime.
                                            // If you're also serving http, display a 503 error.
    connection.on('error', function(err) {
      console.log('db error', err);
      if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
        handleDisconnect();                         // lost due to either server restart, or a
      } else {                                      // connnection idle timeout (the wait_timeout
        //throw err;                                  // server variable configures this)
      }
    });
  }

  handleDisconnect();







  module.exports = connection;
 
