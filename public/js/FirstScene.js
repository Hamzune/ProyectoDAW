function FirstScene(game) {

    this.game = game;
    this.map = {};

    this.portals = [];
    this.stars = [];

    this.players = [];
    this.client;

    this.myId = null;

    this.preload = function () {
        game.load.image('ship', 'assets/images/ship.png');
        game.load.image('star', 'assets/images/star.png');
        game.load.image('portal', 'assets/images/bullet.png');
    }

    this.create = function () {
        var that = this;

        game.physics.startSystem(Phaser.Physics.P2JS);
        game.world.setBounds(0, 0, 8000, 1920);
        this.client = new Client();

        //Pedir el mapa
        this.client.getMap().then((map) => {
            that.map = map;
            that.map.portals.forEach(element => {
                that.portals.push(game.add.sprite(element.x, element.y, 'star'));
            });

            that.map.stars.forEach(element => {
                that.stars.push(game.add.sprite(element.x, element.y, 'portal'));
            });

            //Pedir un jugador al servidor
            this.client.createNewPlayer();
        });

        //Recivir mi jugador nuevo
        this.client.socket.on('newPlayer', function (data) {
            let p = new Player(that.game);
            that.myId = (that.myId == null) ? data.id : that.myId;
            p.id = that.myId;
            p.preload();
            p.create(data.x, data.y);
            that.game.physics.p2.enable(p.getSprite());
            that.players.push(p);
        });

        //Refrescar mi posicion al servidor cada 10 milisegundos
        setInterval(function () {
            if (that.myId != null) {
                let myPosition = that.players.map(function (player) { return player.id; }).indexOf(that.myId);
                let player = that.players[myPosition];

                let new_position = {
                    id: that.myId,
                    x: player.getPosition().x,
                    y: player.getPosition().y
                };
                that.client.socket.emit('player_position_refresh', new_position);
            }
        }, 100);
        /*
                this.client.socket.on('movePlayer', function (data) {
                    that.players[data.id].getSprite().body.x = data.x;
                    that.players[data.id].getSprite().body.y = data.y;
                });
        */

        //Refrescar la posición de los demas y no la mia
        this.client.socket.on('refresh_all_players', function (data) {
            data.forEach(function (element) {
                if (element.id != that.myId) {
                    console.log(element);
                    let player_position = that.players.map(function (player) { return player.id; }).indexOf(element.id);
                    if (player_position == -1) {
                        var p = new Player(that.game);
                        p.id = element.id;
                        p.preload();
                        p.create(element.x, element.y);
                        that.game.physics.p2.enable(p.getSprite());
                        that.players.push(p);
                    } else {
                        that.players[player_position].setPosition(element.x, element.y);
                    }
                }
            });
        });

        this.client.socket.on('remove', function (id) {
            let player_position = that.players.map(function (player) { return player.id; }).indexOf(id);
            this.players[player_position].die();
            this.players.splice(player_position, 1);
        });
    }

    this.listener = function () {
        this.game.myrenderer.changeScene(new SecondScene(this.game));
    }


    this.update = function () {

        //this.player.setVelocityX(0);
        //this.player.setVelocityY(0);
        //this.player.getSprite().body.angularVelocity = 0;



        // La apunta al mouse, siempre
        //var dy = this.game.input.mousePointer.y - this.player.getSprite().worldPosition.y;
        //var dx = this.game.input.mousePointer.x - this.player.getSprite().worldPosition.x;

        //var angle = Math.atan2(dy, dx);

        //this.player.getSprite().body.rotation = angle;

        if (this.game.input.keyboard.isDown(Phaser.Keyboard.A)) {
            let player_position = this.players.map(function (player) { return player.id; }).indexOf(this.myId);
            this.players[player_position].setVelocityX(-200);
        }
        else if (this.game.input.keyboard.isDown(Phaser.Keyboard.D)) {
            let player_position = this.players.map(function (player) { return player.id; }).indexOf(this.myId);
            this.players[player_position].setVelocityX(200);
        }

        if (this.game.input.keyboard.isDown(Phaser.Keyboard.W)) {
            let player_position = this.players.map(function (player) { return player.id; }).indexOf(this.myId);
            this.players[player_position].setVelocityY(-200);
        } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.S)) {
            let player_position = this.players.map(function (player) { return player.id; }).indexOf(this.myId);
            this.players[player_position].setVelocityY(200);
        }
    }


    this.render = function () {

    }

    this.stop = function () {
        this.game.world.removeAll();
    }
}