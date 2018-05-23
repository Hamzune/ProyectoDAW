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
    this.velocity = 250;
    //objeto Weapon
    this.weapon = null;

    //sounds
    this.disparo;
    this.dead;
    this.portal;
    this.bonus;
    this.boom;

    this.name;
    this.nombre;

    this.emitter;

    this.explosions = null;

    this.preload = function () {

    }

    this.create = function (x, y,nom) {

        //creacion de sprite player
        this.sprite = this.game.add.sprite(x, y, 'ship');
        this.sprite.anchor.set(0.5, 0.5);
        this.sprite.id = this.id;
        this.game.physics.arcade.enable(this.getSprite(),true);

        this.sprite.body.collideWorldBounds = true;
        this.nombre = nom+"";
        this.name = this.game.add.text(x, y-20, this.nombre, { font: "15px Arial", fill: "white", align: "center" });

        //sounds
        this.portal = this.game.add.audio('teleportal');
        this.dead = this.game.add.audio('dead');
        this.disparo = this.game.add.audio('disparo');
        this.bonus = this.game.add.audio('bonus');
        this.boom = this.game.add.audio('boom');
        //añadir arma a jugador 
        this.weapon = game.add.weapon(40, 'bullet');
        this.weapon.setBulletFrames(0, 80, true);
        this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
        this.weapon.bulletSpeed = 1000;
        this.weapon.fireRate = 400;

        this.weapon.bullets.setAll('scale.x', 2);
        this.weapon.bullets.setAll('scale.y', 2);
        
        this.weapon.trackSprite(this.sprite, 40, 0, true);

         //create an emitter
         this.emitter = game.add.emitter(0, 0, 1000);
         this.emitter.makeParticles('smoke');
 
         this.emitter.setScale(0.2, 0, 0.2, 0, 30);
 
         //position the emitter relative to the sprite's anchor location
         this.emitter.y = 0;
         this.emitter.x = -16;
 
         // setup options for the emitter
         this.emitter.gravity = -100;
         this.emitter.lifespan = 500;
         this.emitter.maxParticleSpeed = new Phaser.Point(-100,50);
         this.emitter.minParticleSpeed = new Phaser.Point(-200,-50);
 
        //  An explosion pool
        this.explosions = game.add.group();
        this.explosions.createMultiple(30, 'kaboom');
        this.explosions.forEach(setupInvader, this);
        
    }
    this.getSprite = function () {
        return this.sprite;
    }

    this.tocado = function () {
        //  And create an explosion :)
        let explosion =  this.explosions.getFirstExists(false);
        let cuerpo = this.getSprite().body;
        explosion.reset(cuerpo.x + (cuerpo.width/2), cuerpo.y + (cuerpo.width/2));
        explosion.play('kaboom', 30, false, true);
        this.boom.play();
    }
    function setupInvader (invader) {

        invader.anchor.x = 0.5;
        invader.anchor.y = 0.5;
        invader.animations.add('kaboom');
    
    }
    this.setWeapon = function () {

    }
    this.playTeleportSound = function (){
        this.portal.volume = 0.5;
        this.portal.play();
        
    }

    this.setDamage = function (damage) {
        this.setLife(this.life-damage);
        this.tocado();
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
            life: this.life,
            db_id: this.db_id,
            name : this.nombre,
        };

        //Direccion del humo
        if((new_position.rotation * (180/Math.PI) > 40 && new_position.rotation * (180/Math.PI) < 130) ){
            this.emitter.gravity = this.getVelocityX()*3;
        }
        else if((new_position.rotation * (180/Math.PI) < -40 && new_position.rotation * (180/Math.PI) > -130) ){
            this.emitter.gravity = -this.getVelocityX()*3;
        }
        else if((new_position.rotation * (180/Math.PI) <= 30 && new_position.rotation * (180/Math.PI) >= -30) ){
            this.emitter.gravity = -this.getVelocityY()*3;
        }
        else if((new_position.rotation * (180/Math.PI) > 140 || new_position.rotation * (180/Math.PI) <= -140) ){
            this.emitter.gravity = this.getVelocityY()*3;
        }


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
    this.getVelocityY = function () {
        return this.getSprite().body.velocity.y;
    }

    this.getVelocityX = function () {
        return this.getSprite().body.velocity.x;
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
        this.name.x = x - 25;
        this.name.y = y - 50;
    }
    this.die = function(){
        let x = this.getPosition().x;
        let y = this.getPosition().y;
        
        this.dead.play();
        this.dead.volume = 0.6;
        this.getSprite().kill();
        this.sprite = this.game.add.sprite(x, y, 'skull');
        this.sprite.anchor.set(0.5, 0.5);
        var that = this;
        setTimeout(function(){
            that.sprite.kill();
            that.name.kill();
        },6000);
    }
    
    this.render = function () {

    }
    this.getWeapon = function () {
        return this.weapon;
    }
}