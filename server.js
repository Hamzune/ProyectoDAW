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
var ObjectID = require('mongodb').ObjectID;

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
// middleware para verificar si un usuario esta logeado o no
var isLogged = function (req, res, next) {
    if (req.session.user && req.cookies.user_sid) {
        next();
    } else {
        res.redirect('/login');
    }
};
// Sirve el index
app.get('/', isLogged, function (request, response) {   
    response.sendFile(__dirname + "/index.html");
});

// Sirve el html del login
app.get('/login', function (request, response) {
    response.sendFile(__dirname + "/login.html");
});

// Se limipia la sesion
app.get('/logout', function (req, res) {
    res.clearCookie('user_sid');
    res.sendFile(__dirname + "/logout.html");
});

// Sirve el html del registro
app.get('/register', function (request, response) {
    response.sendFile(__dirname + "/register.html");
});

// Agrega los datos que se reciben por metodo GET a la BD
app.post('/doregister', function (request, response) {
    var user = {
        username: request.body.uname,
        password: request.body.pwd,
        email: request.body.email,
        kills: 0,
        las_sessions: 0
    };

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

// Post login para verificar los datos introducidos
app.post('/dologin', function (request, response) {
    var user = {
        username: request.body.uname,
        password: request.body.pwd,
    };

    dbo.collection('users').find(user).toArray().then(function (data) {
        if (data.length === 1) {
            // Se guarda una session con los datos del usuario logeado
            request.session.user = data[0];
            response.json({ status: 200, body: data[0] });
            response.end();
        } else {
            response.json({ status: 401 });
            response.end();
        }
    });
});

// Consulta a la BD para obtener el TOP de los mejores usuarios
app.get('/getTop', function (request, response) {
    dbo.collection('users').find().toArray().then(function (data) {
        // Si hay usuarios devolvemos una respuesta 200
        if (data.length > 0) {
            response.json({ status: 200, body: data });
            response.end();
        // si no devolvemos un 401
        } else {
            response.json({ status: 401 });
            response.end();
        }
    });
});

// Obtener las estadisiticas de los jugadores conectados y jugando en tiempo real
app.get('/getStat', isLogged, function (request, response) {
    dbo.collection('users').find().toArray().then(function (data) {
       var conectados = [];
       for( player of server.players) {
        for(playerdb of data) {
           if(playerdb._id == player.db_id.id){
               conectados.push(playerdb);
           }

        }
       }
       
        if (conectados.length > 0) {
            response.json({ status: 200, body: conectados });
            response.end();
        } else {
            response.json({ status: 200, body: data });
            response.end();
        }
    });
});

// Una funcion que devuelve el username del usuario logeado
app.get('/getLoggedUser', function(req, res) {
    res.json({data: req.session.user.username});
    res.end();
});

// Deuvelve el archivo html con el TOP jugadores
app.get('/top', isLogged, function (request, response) {
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

    socket.on('chat',function(msg){
        io.emit('chat',msg);
    })
    socket.on('newPlayer', function (id) {

        let data = {
            id: server.id++,
            x: Math.random() * 1920,
            y: Math.random() * 900,
            db_id: id,
            name: "PLAYER NAME",
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
        let killed = getIndex(data.killed_id);
        user = server.players[killerIndex].db_id;
        userKilled = server.players[killed].db_id;

        dbo.collection('users').updateOne({ _id: ObjectID(user.id) }, { $inc:   { kills: 1 , las_sessions : 1}  }, function (err, res) {
            if (err) {
                throw err;
            }
            console.log('1 document updated');
        });
        dbo.collection('users').updateOne({ _id: ObjectID(userKilled.id) },  {$set: { las_sessions : 0}} , function (err, res) {
            if (err) {
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

    socket.on('notification', function(data){
        io.emit('notification', data);
    })

    socket.on('error', function (err) {
        console.log("Socket.IO Error");
        console.log(err.stack); // this is changed from your code in last comment
    });

    setInterval(function () {
        io.emit('purge', server.players);
    }, 2000);
});
server.listen(3000, function () {
    console.log('Listening on ' + server.address().port);
});