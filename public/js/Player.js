function Player(game) {
    this.id = 0;
    this.game = game;
    this.sprite;
    this.rotation = 90;
    this.position = {
        x: 100,
        y: 100
    }
    this.size = {
        x: 0,
        y: 0
    }
    this.life = 100;
    this.velocity = 200;
    //objeto Weapon
    this.weapon = null;

    //sounds
    this.disparo;
    this.dead;
    this.portal;
    this.bonus;

    this.preload = function () {

    }

    this.create = function (x, y) {

        //creacion de sprite player
        this.sprite = this.game.add.sprite(x, y, 'ship');
        this.sprite.anchor.set(0.5, 0.5);
        this.sprite.id = this.id;
        this.game.physics.arcade.enable(this.getSprite(),true);

        this.sprite.body.collideWorldBounds = true;

        //sounds
        this.portal = this.game.add.audio('teleportal');
        this.dead = this.game.add.audio('dead');
        this.disparo = this.game.add.audio('disparo');
        this.bonus = this.game.add.audio('bonus');

        //añadir arma a jugador 
        this.weapon = game.add.weapon(40, 'bullet');
        this.weapon.setBulletFrames(0, 80, true);
        this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
        this.weapon.bulletSpeed = 1000;
        this.weapon.fireRate = 150;

        this.weapon.bullets.setAll('scale.x', 2);
        this.weapon.bullets.setAll('scale.y', 2);
        
        this.weapon.trackSprite(this.sprite, 40, 0, true);

        
    }
    this.getSprite = function () {
        return this.sprite;
    }

    this.setWeapon = function () {

    }
    this.teletransporte = function (){
        this.portal.volume = 0.5;
        this.portal.play();
        
    }

    this.setDamage = function (damage) {
        this.setLife(this.life-damage);
    }

    this.getLife = function() {
        return this.life;
    }
    this.getInformation = function(id, fire){
        let new_position = {
            id: id,
            x: this.getPosition().x,
            y: this.getPosition().y,
            fire: fire,
            rotation: parseFloat(this.getRotation()).toFixed(5),
            life: this.life
        };
        return new_position;
    }
    this.setLife = function (life){
        this.life = life;
    }
    
    this.takebonus = function (){
        this.life = this.life <= 50 ? this.life + 50 : 100;
        this.bonus.play();
    }
    this.fire = function() {

        this.disparo.play();
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
        this.getSprite().rotation = angle;
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

    this.setTint = function(color){
        this.getSprite().tint = color;
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
        return this.getSprite();
    }
    this.setPosition = function(x,y) {
        this.getSprite().x = x;
        this.getSprite().y = y;
    }
    this.die = function(){
        let x = this.getPosition().x;
        let y = this.getPosition().y;
        
        this.dead.play();
        this.dead.volume = 0.6;
        this.getSprite().kill();
        this.sprite = this.game.add.sprite(x, y, 'skull');
        this.sprite.anchor.set(0.5, 0.5);
  
    }
    
    this.render = function () {

    }
    this.getWeapon = function () {
        return this.weapon;
    }
}