function FirstScene(game) {

    this.game = game;
    this.map = {
        portals: [{x: 500, y: 900}, {x: 1030, y: 300}, {x:2600, y:400}],
        stars: [{x: 100,y:500},{x: 1000,y:500},{x: 4000,y:500}]
    };

    this.portals = [];
    this.stars = [];

    this.preload = function () {
        this.player = new Player(this.game);
        this.player.preload();

        game.load.image('star', 'assets/images/star.png');
        game.load.image('portal', 'assets/images/bullet.png');

    }

    this.create = function () {
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.world.setBounds(0,0,8000,1920);
        
        this.player.create(game.world.centerX, game.world.centerY);

        this.map.portals.forEach(element => {
            this.portals.push(game.add.sprite(element.x, element.y, 'star'));
        });

        this.map.stars.forEach(element => {
            this.stars.push(game.add.sprite(element.x, element.y, 'portal'));

        });

        game.camera.follow(this.player.getSprite());
        this.game.physics.p2.enable(this.player.getSprite());
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
        var dy = this.game.input.mousePointer.y - this.player.getSprite().worldPosition.y;
        var dx = this.game.input.mousePointer.x - this.player.getSprite().worldPosition.x;


        var angle = Math.atan2(dy, dx);

    
        this.player.getSprite().body.rotation = angle;
    }

    this.render = function () {

    }

    this.stop = function () {
        this.game.world.removeAll();
    }
}