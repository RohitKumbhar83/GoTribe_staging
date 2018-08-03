//import express package
var express = require("express");

//import mysql package
var mysql      = require('mysql');

var config = require('./config.json');

var dbObject;

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'local_db_gotribe'
});
// var connection = mysql.createConnection({
//   host     : '172-31-10-189',
//   user     : 'root',
//   password : 'zAst7hekuch_hu',
//   database : 'gotribe'
// });
// mysql -u root  -pzAst7hekuch_hu gotribe
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + connection.threadId);
});

module.exports = connection;
