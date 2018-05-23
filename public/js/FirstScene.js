function FirstScene(game) {
    this.game = game;
    this.inputEnabled = true;
    this.map = {};

    this.portals = [];
    this.stars = [];
    this.bonus = [];
    this.asteroides = [];

    this.players = [];
    this.client;

    this.player = null;
    this.myId = -1;
    this.fireButton = null;
    this.isFiring = false;

    this.lp = null;

    this.enemies = {};
    this.healthBar = null;
    this.kills = 0;
    this.bullets;

    this.name;

    this.popup;

    //sonidos
    this.fondo;

    this.notifications = [];
    this.indexNotifications = -1;

    this.preload = function () {


    }
    this.getIndex = function (id) {
        for (let i = 0, ic = this.players.length; i < ic; i++) {
            if (this.players[i].id == id) {
                return i;
            }
        }
    }
    this.create = function () {
        this.client = new Client();
        this.game.time.advancedTiming = true;
        this.grup = this.game.add.group();
        this.grup.enableBody = true;
        this.grup.physicsBodyType = Phaser.Physics.ARCADE;
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.world.setBounds(0, 0, 8000, 1920);

        this.fireButton = this.game.input.mousePointer;
        //sonidos
        this.fondo = this.game.add.audio('musicadefondo');
        this.fondo.loopFull(0.5);

        //tileSprite = game.add.tileSprite(0, 0, 8000, 1920, 'red');

        //Pedir el mapa
        this.loadMap();

        //Recibir mi jugador nuevo
        this.newEnemy();

        //Refrescar la posición de los demas (enemigos)
        this.moveEnemies();

        // Si se ha desconectado un enemigo ejecutamos el remove
        this.removePlayer();

        // Aplicar daño a jugadores enemigos
        this.damageEnemies();


        var colors = ["bg0", "red"];
        var color = colors[parseInt((Math.random() * 2))];

        this.bg0 = this.game.add.tileSprite(0, this.game.height - this.game.cache.getImage(color).height, this.game.width, this.game.cache.getImage(color).height, color);
        this.bg1 = this.game.add.tileSprite(0, this.game.height - this.game.cache.getImage("bg1").height, this.game.width, this.game.cache.getImage("bg1").height, "bg1");
        this.bg2 = this.game.add.tileSprite(0, this.game.height - this.game.cache.getImage("bg2").height, this.game.width, this.game.cache.getImage("bg2").height, "bg2");
        this.bg3 = this.game.add.tileSprite(0, this.game.height - this.game.cache.getImage("bg3").height, this.game.width, this.game.cache.getImage("bg3").height, "bg3");
        this.bg4 = this.game.add.tileSprite(0, this.game.height - this.game.cache.getImage("bg4").height, this.game.width, this.game.cache.getImage("bg4").height, "bg4");
        this.bg5 = this.game.add.tileSprite(0, this.game.height - this.game.cache.getImage("bg5").height, this.game.width, this.game.cache.getImage("bg5").height, "bg5");
        this.bg6 = this.game.add.tileSprite(0, this.game.height - this.game.cache.getImage("bg6").height, this.game.width, this.game.cache.getImage("bg6").height, "bg6");
        this.bg7 = this.game.add.tileSprite(0, this.game.height - this.game.cache.getImage("bg7").height, this.game.width, this.game.cache.getImage("bg7").height, "bg7");


        this.bg0.fixedToCamera = true;
        this.bg1.fixedToCamera = true;
        this.bg2.fixedToCamera = true;
        this.bg3.fixedToCamera = true;
        this.bg4.fixedToCamera = true;
        this.bg5.fixedToCamera = true;
        this.bg6.fixedToCamera = true;
        this.bg7.fixedToCamera = true;
        //boton log out
        var boton = this.game.add.sprite(window.innerWidth - 60, 60, 'logout');
        boton.anchor.set(0.5);
        boton.inputEnabled = true;
        boton.fixedToCamera = true;
        boton.scale.set(0.3);
        boton.input.useHandCursor = true;
        boton.alpha = 0.2;
        boton.events.onInputUp.add(function () {
            window.location.replace("/logout")
        });
        boton.events.onInputOver.add(() => {
            boton.alpha = 1;
        })
        boton.events.onInputOut.add(() => {
            boton.alpha = 0.2;
        })

        this.client.socket.on('purge', function (data) {
            for (let i = 0, ic = that.players.length; i < ic; i++) {
                var found = false;
                for (let j = 0, jc = data.length; j < jc; j++) {
                    if (that.players[i].id == data[j].id) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    that.players[i].destroy();
                    that.players.splice(i, 1);
                }
            }
        });

        this.client.socket.on('notification', function(data){
            that.addNotification(data.msg, data.color);
        })


    }

    this.addHealthBar = function () {
        var barConfig = {
            width: 250,
            height: 40,
            x: 280,
            y: 50 ,
            bg: {
                color: 'black'
            },
            bar: {
                color: '#2ecc71'
            },
            animationDuration: 200,
            flipped: false
        };
        this.healthBar = new HealthBar(this.game, barConfig);
        this.healthBar.setFixedToCamera(true);
                   
        this.lp = this.game.add.text(160 , 90, "Life", { font: "16px Arial", fill: "white", align: "center" });
        this.lp.fixedToCamera = true;
    }

    this.addNotification = function (text, color) {

        this.indexNotifications++;
        if (this.indexNotifications === 4) {
            this.indexNotifications = 0;
            for (let i = 0, ic = 4; i < ic; i++) {
                if (this.notifications[i]) this.notifications[i].destroy();
            }
        }

        this.notifications[this.indexNotifications] = this.game.add.text(100, 400 + (this.indexNotifications * 20), text, { font: "15px Arial", fill: color, align: "center" });
        this.notifications[this.indexNotifications].fixedToCamera = true;
    }

    this.loadMap = function () {
        var that = this;

        this.client.getMap().then((map) => {
            that.map = map;
            that.map.portals.forEach(element => {
                let sprite = game.add.sprite(element.x, element.y, 'portal');
                that.game.physics.arcade.enable(sprite, true);
                that.portals.push(sprite);
            });

            that.map.stars.forEach(element => {
                let sprite = game.add.sprite(element.x, element.y, 'star');
                that.stars.push(sprite);
            });

            that.map.bonus.forEach(element => {
                let sprite = game.add.sprite(element.x, element.y, 'bonus');
                that.game.physics.arcade.enable(sprite, true);
                that.bonus.push(sprite);
            });

            that.map.asteroides.forEach(element => {
                let sprite = game.add.sprite(element.x, element.y, 'asteroid1');
                that.game.physics.arcade.enable(sprite, true);
        
                that.asteroides.push(sprite);
            });

            //Pedir un jugador al servidor
            this.client.createNewPlayer();

            // añadir gui
            var graphics = game.add.graphics(0, 0);

            // graphics.lineStyle(2, 0xffd900, 1);
        
            graphics.beginFill(0x000000, 0.6);
            graphics.drawCircle(90, 70, 120);
            graphics.fixedToCamera = true;
            var g= this.game.add.sprite(60,40,"ship");
            g.alhpa = 0.6;
            g.fixedToCamera= true;
            this.addHealthBar();
     

        });

    }

    this.newEnemy = function () {
        var that = this;
        this.client.socket.on('newPlayer', function (data) {
            if (that.myId == -1) {
                that.myId = that.myId == -1 ? data.id : that.myId;

                that.game.camera.follow(that.addPlayer(data, false).getSprite(), Phaser.Camera.FOLLOW_LOCKON);
                
                $.ajax({
                    type: 'get',
                    url: '/getLoggedUser',
                    success: function (res) {
                        var index = that.getIndex(that.myId);
                        that.players[index].nombre = res.data;
                        that.players[index].name.setText(res.data);
                        that.client.socket.emit("notification",{msg: "Se ha conectado " + res.data, color: 'skyblue'});
                    }
                });
                //  The Text is positioned at 0, 100
                let myPosition = that.getIndex(that.myId);
            }
        });
    }

    this.damageEnemies = function () {
        var that = this;

        this.client.socket.on('damage', function (id) {
            let player_position = that.getIndex(id);
            let player = that.players[player_position];
            if (player_position > -1 && player && that.player) {
                player.setDamage(10);

                var distance = Math.sqrt(Math.pow((player.getPosition().x - that.player.getPosition().x), 2) + Math.pow((player.getPosition().y - that.player.getPosition().y), 2));
                var volumen = (1 - (distance / 1000));
                volumen = volumen < 0 ? 0 : volumen;
                player.boom.volume = volumen;
            }
        });
    }

    this.removePlayer = function () {
        var that = this;

        this.client.socket.on('remove', function (id) {
            let player_position = that.getIndex(id);
            // Destroy al objecto player
            that.players[player_position].die();
            // Eliminamos el player del array de players
            that.players.splice(player_position, 1);
            // Si soy el que he muerto entra la siguiente escena
            if (id == that.myId) {
                that.listener();
            }

        });
    }

    this.moveEnemies = function () {
        var that = this;

        this.client.socket.on('refresh_all_players', function (data) {
            data.forEach(function (element) {
                let index = that.getIndex(element.id);
                // Si ya existe, modificamos la posicion
                if (index > -1) {

                    if (element.id != that.myId) {
                        that.players[index].nombre = element.name;
                        that.players[index].name.setText(element.name);
                        that.players[index].setPosition(element.x, element.y);
                        that.players[index].setRotation(element.rotation);

                        that.players[index].life = element.life;

                        if (that.players[index].life < 100) {
                            that.players[index].getSprite().addChild(that.players[index].emitter);
                            that.players[index].emitter.emitParticle();
                        }

                        if (element.fire && that.getIndex(that.myId) > -1) {
                            that.players[index].fire();
                            var player = that.players[that.getIndex(that.myId)];
                            var distance = Math.sqrt(Math.pow((element.x - player.getPosition().x), 2) + Math.pow((element.y - player.getPosition().y), 2));
                            var volumen = (1 - (distance / 1000));
                            volumen = volumen < 0 ? 0 : volumen;
                            that.players[index].disparo.volume = volumen;

                        }

                        for (let i = 0, ic = that.asteroides.length; i < ic; i++) {
                            for (let e = 0, ic = that.asteroides.length; e < ic; e++) {
                                //that.game.physics.collide(that.asteroides[i],that.asteroides[i])
                            }
                            
                            that.game.physics.arcade.overlap(that.players[index].getWeapon().bullets.children, that.asteroides[i], that.choceAsteroideBullet, null, that);
                        }
                    }

                } else {
                    // si no, lo añadimos.
                    let p = that.addPlayer(element, true);
               }

            });
        });
    }

    this.addPlayer = function (element, enemy) {
        let p = new Player(this.game);
        p.id = element.id;
        p.db_id = element.db_id;
        p.preload();
        p.create(element.x, element.y, element.name);
        if (enemy) {
            p.setTint(0xff5100);
        }
        this.game.physics.arcade.enable(p.getSprite(), true);
        this.players.push(p);

        return p;
    }
    var that = this;
    this.listener = function () {
        //popup
        this.popup = game.add.sprite(window.innerWidth / 2, (window.innerHeight / 2), 'game-over');
        this.popup.alpha = 0.8;
        this.popup.anchor.set(0.5);
        this.popup.inputEnabled = true;
        this.popup.input.enableDrag();
        this.popup.fixedToCamera = true;
        this.popup.scale.set(0.01);

        this.game.add.tween(this.popup.scale).to({ x: 2.5, y: 2.5 }, 6000, Phaser.Easing.Elastic.Out, true);

        setTimeout(() => {
            location.reload();
        }, 7000);
        //that.game.myrenderer.changeScene(new SecondScene(that.game));
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
            if (this.fireButton.isDown) {
                this.isFiring = true;
                this.player.fire();

            } else {
                this.isFiring = false;
            }

            this.bullets = this.player.getWeapon().bullets.children;
            for (let i = 0, ic = that.players.length; i < ic; i++) {
                if (that.players[i].id != that.myId) {
                    //this.game.physics.arcade.collide(this.bullets, that.players[i].getSprite());
                    this.game.physics.arcade.overlap(this.bullets, that.players[i].getSprite(), function (bullet, sprite) {
                        this.collision(bullet, sprite);
                    }, null, this);
                }
            }

            for (let i = 0, ic = this.portals.length; i < ic; i++) {
                this.game.physics.arcade.overlap(this.player.getSprite(), this.portals[i], this.teleport, null, this);
            }

            for (let i = 0, ic = this.bonus.length; i < ic; i++) {
                this.game.physics.arcade.overlap(this.player.getSprite(), this.bonus[i], this.bonuslive, null, this);
            }

            for (let i = 0, ic = this.asteroides.length; i < ic; i++) {
                this.game.physics.arcade.overlap(this.bullets, this.asteroides[i], this.choceAsteroideBullet, null, this);

            }
            if (this.player.life < 100) {
                this.player.getSprite().addChild(this.player.emitter);
                this.player.emitter.emitParticle();
            }
            this.healthBar.setPercent(this.player.getLife());
            //Reenviar posiciones
            this.player.name.x = this.player.getPosition().x - 25;
            this.player.name.y = this.player.getPosition().y - 50;

            this.lp.setText(this.player.life + "/100");

            this.bg0.tilePosition.x -= 0.15;
            this.bg1.tilePosition.x -= 0.05;
            this.bg2.tilePosition.x -= 0.075;
            this.bg3.tilePosition.x -= 0.25;
            this.bg4.tilePosition.x -= 0.075;
            this.bg5.tilePosition.x -= 0.095;
            this.bg6.tilePosition.x -= 0.8;
            this.bg7.tilePosition.x -= 0.075;

            this.client.socket.emit('player_position_refresh', this.player.getInformation(this.myId, this.isFiring));

        }
    }

    this.teleport = function (player, portal) {
        let next = parseInt(Math.random() * this.portals.length);
        while (portal.x == this.portals[next].x && this.portals[next].y == portal.y) {
            next = parseInt(Math.random() * this.portals.length);
        }
        this.player.getSprite().x = this.portals[next].x + 120;
        this.player.getSprite().y = this.portals[next].y + 120;
        this.players[this.getIndex(player.id)].playTeleportSound();
    }

    this.collision = function (bullet, player) {
        //let index = this.getIndex(player.id);
        //this.players[index].tocado();

        bullet.kill();
        this.setDamage(player.id);
    }

    this.bonuslive = function (player, bonus) {
        let index = this.getIndex(player.id);
        if ((this.players[index].getLife()) < 100) {
            bonus.destroy();
            this.players[index].takebonus();
        }
    }

    this.choceAsteroide = function (player, asteroide) {

        this.setDamage(player.id);
        asteroide.destroy();
    }

    this.choceAsteroideBullet = function (bullet, asteroide) {
        /*//  And create an explosion :)
        var explosion =  this.explosions.getFirstExists(false);
        explosion.reset(bullet.body.x, bullet.body.y);
        explosion.play('kaboom', 30, false, true);
*/
        bullet.kill();
    }

    this.setDamage = function (id) {
        let index = this.getIndex(id);
        if ((this.players[index].getLife()) < 10) {
            this.client.socket.emit("notification",{msg: this.players[this.getIndex(this.myId)].nombre + " ha matado a " + this.players[index].nombre, color: 'red'});
            this.client.socket.emit('remove_player', { killed_id: id, killer_id: this.myId });
        } else {
            this.client.socket.emit('set_damage', id);
        }
    }

    this.render = function () {
        if (this.player != null) {
            //this.game.debug.body(this.player.getSprite());
        }
        this.game.debug.text('render FPS: ' + this.game.time.fps, 2, 10, 'white');

    }

    this.stop = function () {
        this.game.world.removeAll();
    }
}
