var express = require('express');
var formidable = require('formidable');
var cors = require('cors');
var path = require('path');
var fs = require('fs');

var app = express();

app.use(cors());

app.get('/', function (req, res){
  res.end('success');
});

app.post('/', function(req, res){

// create an incoming form object
  var form = new formidable.IncomingForm();

  // specify that we want to allow the user to upload multiple files in a single request
  form.multiples = true;

  // store all uploads in the /uploads directory
  form.uploadDir = path.join(__dirname, '/uploads');

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function(field, file) {
    let timestamp = Date.now() + "_";
    fs.rename(file.filepath, path.join(form.uploadDir, timestamp + file.originalFilename), (e) => {
      if (e) return console.log(e);

      console.log("Upload complete. ", path.join(form.uploadDir,  timestamp + file.originalFilename));
    });
  });

  // log any errors that occur
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
    res.end('success');
  });

  // parse the incoming request containing the form data
  form.parse(req);
});

app.listen(3000);