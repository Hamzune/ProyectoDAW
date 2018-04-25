var express = require('express');
var app = express();
var server = require('http').Server(app);
var path = require('path');

app.use('/',express.static(__dirname + '/public/'));

app.get('/', function(request, response){
    response.sendFile(__dirname + "/index.html");
});

server.listen(3000, function(){
    console.log('Listening on '+ server.address().port);
});