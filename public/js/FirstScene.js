function FirstScene(game) {
    this.game = game;
    this.inputEnabled = true;
    this.map = {};

    this.portals = [];
    this.stars = [];

    this.players = [];
    this.client;

    this.player = null;
    this.myId = -1;

    this.preload = function () {
        game.load.image('ship', 'assets/images/ship.png');
        game.load.image('star', 'assets/images/star.png');
        game.load.image('portal', 'assets/images/bullet.png');
        game.stage.disableVisibilityChange = true;
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

        //Recibir mi jugador nuevo
        this.client.socket.on('newPlayer', function (data) {
            if (that.myId == -1) {
                that.myId = that.myId == -1 ? data.id : that.myId;
                that.game.camera.follow(that.addPlayer(data).getSprite(),Phaser.Camera.FOLLOW_LOCKON);
            
            }
        });

        //Refrescar mi posicion al servidor cada 10 milisegundos
        setInterval(function () {
            if (that.myId != -1) {
                let myPosition = that.players.map(function (player) { return player.id; }).indexOf(that.myId);
                let player = that.players[myPosition];

                let new_position = {
                    id: that.myId,
                    x: player.getPosition().x,
                    y: player.getPosition().y,
                    rotation: player.getRotation()
                };
                that.client.socket.emit('player_position_refresh', new_position);
            }
        }, 10);

        //Refrescar la posición de los demas y no la mia
        this.client.socket.on('refresh_all_players', function (data) {
            data.forEach(function(element){
                let index = that.players.map(function (player) { return player.id }).indexOf(element.id);
                // Si ya existe, modificamos la posicion
                if(index > -1){
                    that.players[index].setPosition(element.x, element.y);
                    that.players[index].setRotation(element.rotation);
                } else{
                    // si no, lo añadimos.
                    that.addPlayer(element);
                }
            });
        });

        // Si se ha desconectado ejecutamos el remove
        this.client.socket.on('remove', function (id) {
            let player_position = that.players.map(function (player) { return player.id; }).indexOf(id);
            // Destroy al objecto player
            that.players[player_position].die();
            // Eliminamos el player del array de players
            that.players.splice(player_position, 1);

        });
    }

    this.addPlayer = function(element){
        let p = new Player(this.game);
        p.id = element.id;
        p.preload();
        p.create(element.x, element.y);
        this.game.physics.p2.enable(p.getSprite());
        this.players.push(p);

        return p;
    }
    this.listener = function () {
        this.game.myrenderer.changeScene(new SecondScene(this.game));
    }


    this.update = function () {

        if(this.player != null){
            this.player.setVelocityX(0);
            this.player.setVelocityY(0);
            this.player.getSprite().body.angularVelocity = 0;

            var dy = this.game.input.mousePointer.y - this.player.getSprite().worldPosition.y;
            var dx = this.game.input.mousePointer.x - this.player.getSprite().worldPosition.x;
    
            var angle = Math.atan2(dy, dx);
    
            this.player.setRotation(angle);

        }
        

        if (this.game.input.keyboard.isDown(Phaser.Keyboard.A)) {
            let player_position = this.players.map(function (player) { return player.id; }).indexOf(this.myId);
            this.player = this.players[player_position];
            this.players[player_position].setVelocityX(-200);
        }
        else if (this.game.input.keyboard.isDown(Phaser.Keyboard.D)) {
            let player_position = this.players.map(function (player) { return player.id; }).indexOf(this.myId);
            this.player = this.players[player_position];
            this.players[player_position].setVelocityX(200);
        }

        if (this.game.input.keyboard.isDown(Phaser.Keyboard.W)) {
            let player_position = this.players.map(function (player) { return player.id; }).indexOf(this.myId);
            this.player = this.players[player_position];
            this.players[player_position].setVelocityY(-200);
        } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.S)) {
            let player_position = this.players.map(function (player) { return player.id; }).indexOf(this.myId);
            this.player = this.players[player_position];
            this.players[player_position].setVelocityY(200);
        }



    }


    this.render = function () {

    }

    this.stop = function () {
        this.game.world.removeAll();
    }
}