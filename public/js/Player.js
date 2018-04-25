function Player(game) {
    this.game = game;
    this.sprite;
    this.position = {
        x: 0,
        y: 0
    }
    this.size = {
        x: 0,
        y: 0
    }
    this.life = 100;
    this.velocity = 60;
    //objeto Weapon
    this.weapon = null;

    this.preload = function () {
        this.game.load.image('ship', 'assets/images/ship.png');
    }

    this.create = function (x, y) {

        //creacion de sprite player
        this.sprite = this.game.add.sprite(x, y, 'ship');
        this.sprite.anchor.set(0.5, 0.5);

    }
    this.getSprite = function () {
        return this.sprite;
    }

    this.setWeapon = function () {

    }

    this.setDamage = function () {

    }

    this.setVelocityX = function (x) {
        //velocidad igualada a 0;
        this.getSprite().body.velocity.x = x;

        this.velocity.x = x;
    }

    this.setVelocityY = function (y) {
        //velocidad igualada a 0;
        this.getSprite().body.velocity.y = y;

        this.velocity.y = y;
    }

    this.getVelocity = function() {
        return this.velocity;
    }

    this.setAngularVelocity = function (vel) {
        this.getSprite().body.angularVelocity = vel;
    }

    this.movement = function () {
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.A)) {
            this.setVelocityX(-200);
        }
        else if (this.game.input.keyboard.isDown(Phaser.Keyboard.D)) {
            this.setVelocityX(200);
        }

        if (this.game.input.keyboard.isDown(Phaser.Keyboard.W)) {
            this.setVelocityY(-200);
            
        } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.S)) {
            this.setVelocityY(200);
        }
    }

    this.render = function () {

    }
}