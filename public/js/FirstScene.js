function FirstScene(game) {

    this.game = game;
    this.map = {};

    this.portals = [];
    this.stars = [];

    this.players = {};
    this.client;

    this.myId = -1;
    this.preload = function () {
        game.load.image('ship', 'assets/images/ship.png');
        game.load.image('star', 'assets/images/star.png');
        game.load.image('portal', 'assets/images/bullet.png');

    }

    this.create = function () {
        var that = this;
        this.playerMap = {};

        game.physics.startSystem(Phaser.Physics.P2JS);
        game.world.setBounds(0, 0, 8000, 1920);
        this.client = new Client();


        this.client.getMap().then(function (map) {
            that.map = map;
            that.map.portals.forEach(element => {
                that.portals.push(game.add.sprite(element.x, element.y, 'star'));
            });

            that.map.stars.forEach(element => {
                that.stars.push(game.add.sprite(element.x, element.y, 'portal'));

            });
        });

        this.client.askNewPlayer();

        this.client.socket.on('newPlayer', function (data) {
            var p = new Player(that.game);
            that.myId = that.myId == -1 ? data.id : that.myId;
            p.id = data.id;
            p.preload();
            p.create(data.x, data.y);
            that.game.physics.p2.enable(p.getSprite());

            that.players[data.id] = p;
        });

        this.client.socket.on('movePlayer', function (data) {
            that.players[data.id].getSprite().body.x = data.x;
            that.players[data.id].getSprite().body.y = data.y;
        });

        this.client.socket.on('allPlayer', function (data) {
            data.forEach(function (element) {
                if (!that.players[element.id]) {
                    var p = new Player(that.game);
                    p.id = element.id;
                    p.preload();
                    p.create(element.x, element.y);
                    that.game.physics.p2.enable(p.getSprite());

                } else {
                    that.players[element.id].setPosition(element.x, element.y);
                }
            });

        });

        this.client.socket.on('remove', function (data) {
            that.players[data.id].getSprite().destroy();
            delete that.players[data.id];

        });

        setInterval(function () {
            var player = that.players[that.myId];
            var d = {};
            d.id = player.id;
            d.x = player.getPosition().x;
            d.y = player.getPosition().y;

            that.client.socket.emit('m', d);
        }, 1000);
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
            this.players[this.myId].setVelocityX(-200);

        }
        else if (this.game.input.keyboard.isDown(Phaser.Keyboard.D)) {
            this.players[this.myId].setVelocityX(200);

        }

        if (this.game.input.keyboard.isDown(Phaser.Keyboard.W)) {
            this.players[this.myId].setVelocityY(-200);


        } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.S)) {
            this.players[this.myId].setVelocityY(200);

        }

    }


    this.render = function () {

    }

    this.stop = function () {
        this.game.world.removeAll();
    }
}