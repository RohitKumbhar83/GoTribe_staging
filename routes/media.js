var config = require('./config.json');
var CachedFs = require('cachedfs');

var mediaFeatures = {


    downloadMedia: function (req, res) {

        var response = {};
        var fs = new CachedFs();

        var filepath = req.query.file.toString();

        var fileActualPath = config.downloadmediapath + filepath;

        fs.readFile(fileActualPath, function (err, buf) {

            response.filepath = filepath;
            response.videobuf = buf;
            res.end(JSON.stringify(response));

        });
    },


    downloadFiles: function (req, res) {

        var response = {};
        var fs = new CachedFs();

        var filepath = req.body.file;
        var versonname = req.body.versonname;
        //  var fileActualPath = config.downloadfilespath + filepath;
        var fileActualPath = config.downloadfilespath + "/" + versonname + "/" + filepath;
        fs.readFile(fileActualPath, function (err, buf) {

            response.filepath = filepath;
            response.videobuf = buf;
            res.end(JSON.stringify(response));

        });
    },

    filesToUpdate: function (req, res) {
        var appversion = req.body.appversion;
        var response = {};
        var filepath1 = [];
        var files1;
        var versions;
        var files2 = [];

        var fs = require('fs');
        fs.readdir(config.downloadfilespath, function (err, files) {
            if (!err) {

                files2 = files.toString().split(',');

                version_array = files2.sort();
                var a = version_array.indexOf(appversion);
                a = a + 1;
                foldername = version_array[a];

                var fileActualPath = config.downloadfilespath + "/" + foldername + "/";
                var recursive = require('recursive-readdir');

                recursive(fileActualPath, function (err, files1) {

                    var data = {};
                    data.fullpath = fileActualPath;
                    data.filepath = files1;
                    data.version = foldername;
                    res.end(JSON.stringify(data));

                });
            }
            else
                throw err;
        });


    },
        searchMedia: function (req, res) {

        var response = {};
        var fs = new CachedFs();

        var filepath = req.body.file;
        var versonname = req.body.versonname;
        //  var fileActualPath = config.downloadfilespath + filepath;
        var fileActualPath = config.downloadfilespath + "/" + versonname + "/" + filepath;
        fs.readFile(fileActualPath, function (err, buf) {

            response.filepath = filepath;
            response.videobuf = buf;
            res.end(JSON.stringify(response));

        });
    }
};







// the header for the one and only part (need to use CRLF here)
request.write(
  '--' + boundaryKey + '\r\n'
  // use your file's mime type here, if known
  + 'Content-Type: image/jpeg\r\n'
  // "name" is the name of the form field
  // "filename" is the name of the original file
  + 'Content-Disposition: form-data; name="upload[upload]"; filename="/home/abhijeet/Downloads/fgo-2.jpg"\r\n'
  + 'Content-Transfer-Encoding: binary\r\n\r\n'
  );
var readFile = fs.createReadStream('/home/abhijeet/Downloads/fgo-2.jpg', { bufferSize: 4 * 1024 })
.on('end', function() {
    request.end('\r\n--' + boundaryKey + '--'); // mark the end of the one and only part
  })
  .pipe(request, { end: false }) // set "end" to false in the options so .end() isn't called on the request
  request.on('error',function(error){
    console.log(error);
  });
  // maybe write directly to the socket here?
  request.end();
  // console.log(readFile);






























module.exports = mediaFeatures;
