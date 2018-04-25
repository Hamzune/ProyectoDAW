function FirstScene(game) {

    this.game = game;


    this.preload = function () {
        this.game.load.tilemap('desert', 'assets/maps/desert.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tiles', 'assets/images/tmw_desert_spacing.png');

        this.player = new Player(this.game);
        this.player.preload();

    }

    this.create = function () {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        map = game.add.tilemap('desert');

        map.addTilesetImage('Desert', 'tiles');

        layer = map.createLayer('Ground');

        layer.resizeWorld();


        this.player.create(100, 100);

        this.game.physics.arcade.enable(this.player.getSprite());
    }

    this.listener = function () {

        this.game.myrenderer.changeScene(new SecondScene(this.game));
    }

    this.update = function () {

        this.player.setVelocityX(0);
        this.player.setVelocityY(0);
        this.player.getSprite().body.angularVelocity = 0;

        this.player.movement();

        // La apunta al mouse, siempre
        var dy = this.game.input.mousePointer.y - this.player.getSprite().y;
        var dx = this.game.input.mousePointer.x - this.player.getSprite().x;

        var angle = Math.atan2(dy, dx);

        this.player.getSprite().rotation = angle;
    }

    this.render = function () {

    }

    this.stop = function () {
        this.game.world.removeAll();
    }
}