var express = require('express');
var app = express();
var server = require('http').Server(app);
var path = require('path');
var io = require('socket.io').listen(server);
var uniqid = require('uniqid');

app.use('/', express.static(__dirname + '/public/'));

app.get('/', function (request, response) {
    response.sendFile(__dirname + "/index.html");
});

var map = {
    portals: [{ x: 500, y: 900 }, { x: 1030, y: 300 }, { x: 2600, y: 400 }],
    stars: [{ x: 100, y: 500 }, { x: 1000, y: 500 }, { x: 4000, y: 500 }]
};

server.players = [];

io.on('connection', function (socket) {

    io.emit('map', map);

    socket.on('newPlayer', function () {
        let data = {
            id: uniqid(),
            x: Math.random() * 900,
            y: 500,
        };
        server.players.push(data);
        socket.player = data;
        io.emit('newPlayer', data);
    });

    socket.on('player_position_refresh', function (data) {
        let posicion = server.players.map(function (player) { return player.id; }).indexOf(data.id);
        if (posicion != -1) server.players[posicion] = data;
    });

    //El servidor envia a todo el mundo la posicion de todos
    setInterval(function () {
        socket.broadcast.emit('refresh_all_players', server.players);
    }, 50);

    socket.on('disconnect', () => {
        if (typeof socket.player.id !== undefined) {
            io.emit('remove', socket.player.id);

            let posicion = server.players.map(function (player) { return player.id; }).indexOf(socket.player.id);
            if (posicion != -1) server.players.splice(posicion, 1);
            console.log("user " + socket.player.id + " disconnected");
        }
    });
});

server.listen(3000, function () {
    console.log('Listening on ' + server.address().port);
});