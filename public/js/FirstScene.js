function FirstScene(game) {
    this.game = game;
    this.preload = function () {
        this.player = new Player(this.game);
        this.player.preload();

    }

    this.create = function () {
        this.game.stage.backgroundColor = "#ff5900";
        this.player.create(100, 100);

        game.physics.arcade.enable(this.player.getSprite());
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