var express = require('express');
var app = express();
var server = require('http').Server(app);
var path = require('path');
var io = require('socket.io').listen(server);


var usersId = {};

app.use('/', express.static(__dirname + '/public/'));

app.get('/', function (request, response) {
    response.sendFile(__dirname + "/index.html");
});

var map = {
    portals: [{ x: 500, y: 900 }, { x: 1030, y: 300 }, { x: 2600, y: 400 }],
    stars: [{ x: 100, y: 500 }, { x: 1000, y: 500 }, { x: 4000, y: 500 }]
};

server.lastPlayerID = 0;
server.players = [];

io.on('connection', function (socket) {
    io.emit('map', map);
    socket.on('askNewPlayer', function () {
        var data = {
            id: server.lastPlayerID++,
            x: Math.random() * 900,
            y: 500,
        };
        server.players[data.id] = data;
        socket.player = {
            id: data.id,
        }
        io.emit('newPlayer', data);
    });

    socket.on('m', function (data) {
        server.players[data.id] = data;
        io.emit('allPlayer', server.players);
    });

    socket.on('disconnect', () => {
        //io.emit('remove', socket.player.id);
        console.log("one user disconnected");
    });
});



server.listen(3000, function () {
    console.log('Listening on ' + server.address().port);
});