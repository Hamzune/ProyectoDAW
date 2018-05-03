function Player(game) {
    this.id = 0;
    this.game = game;
    this.sprite;
    this.rotation = 90;
    this.position = {
        x: 0,
        y: 0
    }
    this.size = {
        x: 0,
        y: 0
    }
    this.life = 100;
    this.velocity = 400;
    //objeto Weapon
    this.weapon = null;

    this.preload = function () {
        this.game.load.image('ship', 'assets/images/ship.png');
    }

    this.create = function (x, y) {

        //creacion de sprite player
        this.sprite = this.game.add.sprite(x, y, 'ship');
        this.sprite.anchor.set(0.5, 0.5);
        //añadir arma a jugador 
        this.weapon = game.add.weapon(40, 'bullet');
        this.weapon.setBulletFrames(0, 80, true);
        this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
        this.weapon.bulletSpeed = 1000;
        this.weapon.fireRate = 150;

        this.weapon.bullets.setAll('scale.x', 0.5);
        this.weapon.bullets.setAll('scale.y', 0.5);
        
        this.weapon.trackSprite(this.sprite, 0, 0, true);
        
    }
    this.getSprite = function () {
        return this.sprite;
    }

    this.shut = function () {

    }
    this.setWeapon = function () {

    }

    this.setDamage = function () {

    }
    
    this.fire = function() {
        this.weapon.fire();        
    }

    this.getGame = function () {
        return this.game.world;
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

    this.setRotation = function (angle){
        this.rotation = angle;
        this.getSprite().body.rotation = angle;
    }
    this.getRotation = function (){
        return this.rotation
    }
    this.getVelocity = function () {
        return this.velocity;
    }
    this.setVelocity = function (vel){
        this.velocity = vel;
    }
    this.setAngularVelocity = function (vel) {
        this.getSprite().body.angularVelocity = vel;
    }

    this.movement = function () {
/*      if (this.game.input.keyboard.isDown(Phaser.Keyboard.A)) {
            this.setVelocityX(-this.velocity);
        }
        else if (this.game.input.keyboard.isDown(Phaser.Keyboard.D)) {
            this.setVelocityX(this.velocity);
        }

        if (this.game.input.keyboard.isDown(Phaser.Keyboard.W)) {
            this.setVelocityY(-this.velocity);
            
        } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.S)) {
            this.setVelocityY(this.velocity);
        }

        this.position.x = this.sprite.body.x;
        this.position.y = this.sprite.body.y;
*/
    }
    this.getPosition = function() {
        return this.getSprite().body;
    }
    this.setPosition = function(x,y) {
        this.getSprite().body.x = x;
        this.getSprite().body.y = y;
    }
    this.die = function(){
        this.getSprite().destroy();
    }
    this.render = function () {

    }
}