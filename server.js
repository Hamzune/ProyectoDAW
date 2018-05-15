var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
var server = require('http').Server(app);
var path = require('path');
var io = require('socket.io').listen(server);
var db = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/projecte";
var dbo = null;
db.connect(url, function(err, databaseObject){
    dbo = databaseObject;
});

app.use('/', express.static(__dirname + '/public/'));

app.get('/', function (request, response) {
    response.sendFile(__dirname + "/login.html");
});

app.get('/register', function(request, response){
    response.sendFile(__dirname + "/register.html");
});

app.post('/doregister', function(request, response){
    console.log(request.body);    
    //dbo.collection('users',)
});

app.post('/dologin', function(request, response){

    console.log('logged requested');
});

var bons = [];
var asteroids = [];

for( let i = 0; i < 5 ; i++){
    bon = {
        x: Math.random() * 8000,
        y: Math.random() * 1920
    }
    bons.push(bon);
}
for( let i = 0; i < 20 ; i++){
    ast = {
        x: Math.random() * 8000,
        y: Math.random() * 1920
    }
    asteroids.push(ast);
}
var map = {
    portals: [{ x: 500, y: 900 }, { x: 1030, y: 300 }, { x: 2600, y: 400 }],
    stars: [{ x: 100, y: 500 }, { x: 1000, y: 500 }, { x: 4000, y: 500 }],
    bonus: bons,
    asteroides: asteroids
};

server.players = [];


function getIndex(id) {
    for (let i = 0, ic = server.players.length; i < ic; i++) {
        if (server.players[i].id == id) {
            return i;
        }
    }
}
server.id = 0;

io.on('connection', function (socket) {

    io.emit('map', map);

    socket.on('newPlayer', function () {
        let data = {
            id: server.id++,
            x: Math.random() * 1920,
            y: Math.random() * 900,

        };
        server.players.push(data);
        socket.player = data;
        io.emit('newPlayer', data);
    });

    socket.on('player_position_refresh', function (data) {
        let index = getIndex(data.id);
        if (index > -1) server.players[index] = data;

        socket.broadcast.emit('refresh_all_players', server.players);

    });


    socket.on('remove_player', (id) => {

        io.emit('remove', id);

        // Buscamos en el array de jugadores al que se acaba de desconectar y lo eliminamos
        let index = getIndex(id);
        if (index > -1) server.players.splice(index, 1);

        console.log("user " + id + " killed");

    });

    socket.on('set_damage', (id) => {
        io.emit('damage', id);
    });


    socket.on('disconnect', () => {
        if (socket.player && typeof socket.player.id !== undefined) {
            // Buscamos en el array de jugadores al que se acaba de desconectar y lo eliminamos
            let index = getIndex(socket.player.id);
            if (index > -1) {
                if (server.players[index].life > 0) {
                    socket.broadcast.emit('remove', socket.player.id);
                    if (index > -1) server.players.splice(index, 1);
                }
            }
            console.log("user " + socket.player.id + " disconnected");
        }
    });

    socket.on('error', function (err) {
        console.log("Socket.IO Error");
        console.log(err.stack); // this is changed from your code in last comment
    });
});


server.listen(3000, function () {
    console.log('Listening on ' + server.address().port);
});