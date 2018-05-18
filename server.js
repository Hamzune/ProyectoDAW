var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var server = require('http').Server(app);
var path = require('path');
var io = require('socket.io').listen(server);
var db = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/projecte";
var  ObjectID = require('mongodb').ObjectID;

var dbo = null;
db.connect(url, function (err, databaseObject) {
    dbo = databaseObject.db('projecte');
});

app.use(cookieParser());

// inicializar cookies por 1 dia
app.use(session({
    key: 'user_sid',
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));

app.use('/', express.static(__dirname + '/public/'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
var nombre;

var isLogged = function (req, res, next) {
    if (req.session.user && req.cookies.user_sid) {
        next();
    } else {
        res.redirect('/login');
    }
};
app.get('/', isLogged, function (request, response) {
    response.sendFile(__dirname + "/index.html");
    nombre = request.session.user.username;
    
});
app.get('/login', function (request, response) {
    response.sendFile(__dirname + "/login.html");
});

app.get('/logout', function (req, res) {
    res.clearCookie('user_sid');
    res.redirect('/');
});

app.get('/register', function (request, response) {
    response.sendFile(__dirname + "/register.html");
});

app.post('/doregister', function (request, response) {
    var user = {
        username: request.body.uname,
        password: request.body.pwd,
        email: request.body.email,
        kills: 0,
    };

    console.log(user);
    dbo.collection('users').find({ $or: [{ username: user.username }, { email: user.email }] })
        .toArray()
        .then(function (data) {
            if (data.length > 0) {
                response.json({ status: 401 });
                response.end();
            } else {
                dbo.collection('users').insertOne(user, function (err, res) {
                    if (err) {
                        throw err;
                    }
                    response.json({ status: 200 });
                    response.end();
                });
            }
        });
});

app.post('/dologin', function (request, response) {
    var user = {
        username: request.body.uname,
        password: request.body.pwd,
    };

    dbo.collection('users').find(user).toArray().then(function (data) {
        if (data.length === 1) {
            request.session.user = data[0];
            response.json({ status: 200, body: data[0] });
            response.end();
        } else {
            response.json({ status: 401 });
            response.end();
        }
    });
});

app.get('/getTop',function(request, response){
    dbo.collection('users').find().toArray().then(function (data) {
        if (data.length > 0) {
            response.json({ status: 200, body: data });
            response.end();
        } else {
            response.json({ status: 401 });
            response.end();
        }
    });
});

app.get('/top',isLogged, function (request, response) {
    response.sendFile(__dirname + "/top.html");
});

var bons = [];
var asteroids = [];

for (let i = 0; i < 5; i++) {
    bon = {
        x: Math.random() * 8000,
        y: Math.random() * 1920
    }
    bons.push(bon);
}
for (let i = 0; i < 20; i++) {
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

    socket.on('newPlayer', function (id) {


        let data = {
            id: server.id++,
            x: Math.random() * 1920,
            y: Math.random() * 900,
            db_id: id,
            name : nombre,
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


    socket.on('remove_player', (data) => {
        let killerIndex = getIndex(data.killer_id);
        user = server.players[killerIndex].db_id;
        
        console.log(user.id);
        dbo.collection('users').updateOne({_id: ObjectID(user.id)},{$inc: {kills:1}}, function(err, res){
            if(err){
                throw err;
            }
            console.log('1 document updated');
        });
        io.emit('remove', data.killed_id);

        // Buscamos en el array de jugadores al que se acaba de desconectar y lo eliminamos
        let index = getIndex(data.killed_id);
        if (index > -1) server.players.splice(index, 1);

        console.log("user " + data.killed_id + " killed");

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