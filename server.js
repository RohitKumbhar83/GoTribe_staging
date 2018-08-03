var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var fs = require('fs');
var app = express();
var os = require('os');
var http = require('http');
var https = require('https');
// var tls = require('tls');



const fileUpload = require('express-fileupload');
// const formidable = require('express-formidable');
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// default options
app.use(fileUpload());
// .use(formidable({
//   encoding: 'utf-8',
//   uploadDir: '/userimage',
//   multiples: true, // req.files to be arrays of files
// }));
 // app.use(bodyParser.urlencoded());
 // .use(bodyParser.urlencoded()); // To process multipart data seperatly

app.all('/*', function (req, res, next) {
    // CORS headers
    res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    // Set custom headers for CORS
    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
    if (req.method == 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});

// Auth Middleware - This will check if the token is valid
// Only the requests that start with /api/v1/* will be checked for the token.
// Any URL's that do not follow the below pattern should be avoided unless you
// are sure that authentication is not needed
//app.all('/api/v1/*', [require('./middlewares/validateRequest')]);
app.use('/', require('./routes'));

app.use(function (err, req, res, next) {
    if (!err) {
        return next();
    }
    else {
        var date = new Date();
        var str = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        str = str + "--------" + err + os.EOL;
        fs.appendFile('./Error/error.txt', str, function (err1) {
            return next();
        });
    }
});

// If no route is matched by now, it must be a 404
app.use(function (req, res, next) {
    var err = new Error('URL Not Found');
    err.status = 404;
    var date = new Date();
    var str = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    str = str + "--------" + err + os.EOL;
    fs.appendFile('./Error/error.txt', str, function (err1) {
        return next();
     })
    //fs.writeFile('./Error/error.txt', str, function (err1) {
      //  return next();
    // });
    next(err);
});

// if (app.get('env') === 'development') {
//   app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     console.log(err.message+'           w');
//     res.render('error', {
//       message: err.message,
//       error: err
//     });
//   });
// }
//
// // production error handler
// // no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.render('error', {
//     message: err.message,
//     error: {}
//   });
// });


// This line is from the Node.js HTTPS documentation.

//var options = {
//  key: fs.readFileSync('ssl_key.key'),
//  cert: fs.readFileSync('ssl_certificate.crt')
//};

var key = fs.readFileSync('ssl_key.key');
var cert = fs.readFileSync('ssl_certificate.crt')
var https_options = {
    key: key,
    cert: cert
};
var PORT = 3000;
var HOST = 'node.gotribefit.com';


// var server = https.createServer(https_options, app).listen(process.env.PORT || PORT);
// woking on staging 
var server = http.createServer(app).listen(process.env.PORT || 3000);
// var server = http.createServer(app).listen(PORT);
console.log('HTTPS Server listening on %s:%s', HOST,PORT);


//tls.createServer(options, function (s) {
 // s.write("welcome!\n");
 // s.pipe(s);
//}).listen(8000);

//var server = http.createServer();
//server.setSecure(options);
//server.addListener("request", handler);
//server.listen(8000);

// Start the server
//app.set('port', process.env.PORT || 3000);

//var server = app.listen(app.get('port'), function () {
//    console.log('Express server listening on port ' + server.address().port);
//});


// Create an HTTP service.
//http.createServer(app).listen(80);
// Create an HTTPS service identical to the HTTP service.
//https.createServer(options, app).listen(443);


// var io = require('socket.io')(server);



// class ServerSocket{
/* Including Socket Connection starts*/
        // new routes(this.app,this.io).routesConfig();
        // includeRoutes(){
    // }
    /* Including Socket Connection ends*/

// this.includeRoutes();

// }
// app.includeRoutes();



// var socketCon = require('./routes/socketConnection/socket-io.js');

/* Basic Authentication */

/*
var basicAuth = require('basic-auth');

exports.BasicAuthentication = function(request, response, next) {

    function unauthorized(response) {
        response.set('WWW-Authenticate', 'Basic realm=' + request.authRealm);
        return response.send(401);
    };

    var user = basicAuth(request);

    if (!user || !user.name || !user.pass) {
        return unauthorized(response);
    };

    if (user.name === 'foo' && user.pass === 'bar') {
        return next();
    } else {
        return unauthorized(response);
    };

};

exports.SetRealm = function(realm) {
    return function(request, response, next){
        request.authRealm = realm || 'default';
        return next();
    }

*/


/* End of Basic Authentication */
