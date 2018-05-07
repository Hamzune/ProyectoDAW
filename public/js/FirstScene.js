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
    this.fireButton = null;
    this.isFiring = false;

    this.enemies = {};

    this.text = null;

    this.bullets;

    this.preload = function () {
        game.load.image('ship', 'assets/images/ship.png');
        game.load.image('star', 'assets/images/star.png');
        game.load.image('portal', 'assets/images/upgrade.png');
        game.load.image('bullet', 'assets/images/bullet.png');
        game.stage.disableVisibilityChange = true;
    }
    this.getIndex = function (id) {
        for (let i = 0, ic = this.players.length; i < ic; i++) {
            if (this.players[i].id == id) {
                return i;
            }
        }
    }
    this.create = function () {
        var that = this;
        this.grup = this.game.add.group();
        this.grup.enableBody = true;
        this.grup.physicsBodyType = Phaser.Physics.ARCADE;
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.world.setBounds(0, 0, 8000, 1920);
        this.client = new Client();

        this.fireButton = this.game.input.mousePointer;

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

                that.game.camera.follow(that.addPlayer(data, false).getSprite(), Phaser.Camera.FOLLOW_LOCKON);

                var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };

                //  The Text is positioned at 0, 100
                let myPosition = that.getIndex(that.myId);

                that.text = game.add.text(10, 10, "Life:" + that.players[myPosition].life, style);
                that.text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
                that.text.fixedToCamera = true;

                //  We'll set the bounds to be from x0, y100 and be 800px wide by 100px high
            }
        });

        //Refrescar mi posicion al servidor cada 10 milisegundos
        setInterval(function () {
            if (that.myId != -1) {
                let myPosition = that.getIndex(that.myId);
                if (myPosition > -1) {
                    let player = that.players[myPosition];

                    let new_position = player.getInformation(that.myId,that.isFiring);

                    that.client.socket.emit('player_position_refresh', new_position);
                }
            }
        }, 16);

        //Refrescar la posición de los demas y no la mia
        this.client.socket.on('refresh_all_players', function (data) {
            data.forEach(function (element) {
                let index = that.getIndex(element.id);
                // Si ya existe, modificamos la posicion
                if (index > -1) {
                    that.players[index].setPosition(element.x, element.y);
                    that.players[index].setRotation(element.rotation);

                    if (element.fire) {
                        that.players[index].fire();
                    }
                } else {
                    // si no, lo añadimos.
                    let p = that.addPlayer(element, true);
                }
            });
        });

        // Si se ha desconectado ejecutamos el remove
        this.client.socket.on('remove', function (id) {
            let player_position = that.getIndex(id);
            // Destroy al objecto player
            that.players[player_position].die();
            // Eliminamos el player del array de players
            that.players.splice(player_position, 1);
        });

        this.client.socket.on('damage', function (id) {
            let player_position = that.getIndex(id);
            that.players[player_position].setDamage(10);

            if (that.players[player_position].id == that.myId) {
                that.text.setText("Life:" + that.players[player_position].getLife());
            }
        });


    }

    this.addPlayer = function (element, enemy) {
        let p = new Player(this.game);
        p.id = element.id;

        p.preload();
        p.create(element.x, element.y);
        if (enemy) {
            p.setTint(0xff5100);
        }
        this.game.physics.arcade.enable(p.getSprite(),true);

        this.players.push(p);

        return p;
    }

    this.listener = function () {
        this.game.myrenderer.changeScene(new SecondScene(this.game));
    }

    this.update = function () {
        let player_position = this.getIndex(this.myId);
        if (player_position > -1) {
            this.player = this.players[player_position];
            if (this.player != null) {
                this.player.setVelocityX(0);
                this.player.setVelocityY(0);

                var dy = this.game.input.mousePointer.y - this.player.getSprite().worldPosition.y;
                var dx = this.game.input.mousePointer.x - this.player.getSprite().worldPosition.x;

                var angle = Math.atan2(dy, dx);

                this.player.setRotation(angle);

                this.weapon = this.player.getWeapon();
            }


            if (this.game.input.keyboard.isDown(Phaser.Keyboard.A)) {
                this.player.setVelocityX(-this.players[player_position].getVelocity());
            } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.D)) {
                this.player.setVelocityX(this.players[player_position].getVelocity());
            }

            if (this.game.input.keyboard.isDown(Phaser.Keyboard.W)) {
                this.player.setVelocityY(-this.players[player_position].getVelocity());
            } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.S)) {
                this.player.setVelocityY(this.players[player_position].getVelocity());
            }
            var that = this;

            this.bullets = this.player.getWeapon().bullets.children;

            if (this.fireButton.isDown) {
                this.isFiring = true;
                

            } else {
                this.isFiring = false;
            }

            for (let i = 0, ic = that.players.length; i < ic; i++) {
                if (that.players[i].id != that.myId) {

                    //this.game.physics.arcade.collide(this.bullets, that.players[i].getSprite());
                    this.game.physics.arcade.overlap(this.bullets,  that.players[i].getSprite(), this.collision , null, this);
                }
            }
            
        }
    }

    this.collision = function (bullet, player) {

        //  When a bullet hits an alien we kill them both

        bullet.destroy();

        this.setDamage(player.id);

        //  Increase the score
      
        //  And create an explosion :)
      
    }
    this.setDamage = function (id) {
        //console.log(this.players);

        let index = this.getIndex(id);
        if ((this.players[index].getLife()) == 0) {
            this.client.socket.emit('remove_player', id);

        } else {
            this.client.socket.emit('set_damage', id);
        }
    }

    this.render = function () {
        /*if(this.player != null){
            this.game.debug.body(this.player.getSprite());
            
        }*/   
        this.game.debug.text('render FPS: ' +this.game.time.fps, 2, 14,'white');
        
    }

    this.stop = function () {
        this.game.world.removeAll();
    }

    this.hitEnemy = function (player, enemies) {

        console.log("Hit");
    }
    
}