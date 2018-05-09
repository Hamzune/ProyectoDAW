function PrevScene(game){
    this.game = game;


    this.preload = function () {
        //sonidos
        game.load.audio('disparo', 'assets/audio/EfectosDeSonido/disparo2.mp3');
        game.load.audio('teleportal', 'assets/audio/EfectosDeSonido/portal.mp3');
        game.load.audio('dead', 'assets/audio/EfectosDeSonido/dead.mp3');
        game.load.audio('bonus', 'assets/audio/EfectosDeSonido/bonus.mp3');
        game.load.audio('musicadefondo', 'assets/audio/EfectosDeSonido/musicadefondo.mp3');

        game.load.image('ship', 'assets/images/ship.png');
        game.load.image('star', 'assets/images/star.png');
        game.load.image('portal', 'assets/images/upgrade.png');
        game.load.image('bullet', 'assets/images/bullet.png');
        game.load.image('skull', 'assets/images/skull.png');
        game.load.image('red', 'assets/images/red.png');
        game.load.image('bonus', 'assets/images/bonus.png');
        game.stage.disableVisibilityChange = true;

    }

    this.create = function() {

        tileSprite = game.add.tileSprite(0, 0, 8000, 1920, 'red');
        var start = game.add.text(game.world.centerX, game.world.centerY-120, "< START >", { font: "65px Arial", fill: "white", align: "center" });
        var options = game.add.text(game.world.centerX, game.world.centerY, "< OPTIONS >", { font: "65px Arial", fill: "white", align: "center" });
        var credits = game.add.text(game.world.centerX, game.world.centerY+120, "< CREDITS >", { font: "65px Arial", fill: "white", align: "center" });
       
        start.anchor.set(0.5);
        options.anchor.set(0.5);
        credits.anchor.set(0.5);

        start.inputEnabled = true;
        options.inputEnabled = true;
        credits.inputEnabled = true;

        start.input.enableDrag();
        start.input.useHandCursor = true;
        options.input.enableDrag();
        options.input.useHandCursor = true;
        credits.input.enableDrag();
        credits.input.useHandCursor = true;

        start.events.onInputOver.add(over, this);
        options.events.onInputOver.add(over, this);
        credits.events.onInputOver.add(over, this);

        start.events.onInputOut.add(out, this);
        options.events.onInputOut.add(out, this);
        credits.events.onInputOut.add(out, this);



        start.events.onInputUp.add(up, this);
        options.events.onInputUp.add(opciones, this);
        credits.events.onInputUp.add(creditos, this);
    }

    function over(item) {
   
        item.fill = "red";
   
    }
   
    function out(item) {
   
        item.fill = "white";

   
    }
    function opciones(item) {
       
   
    }

    function creditos(item) {
       
   
    }

    function up(item) {
   
        this.listener();
   
    }

    
    this.listener = function(){
        this.game.myrenderer.changeScene(new FirstScene(this.game));
    }

    this.update = function() {
       
        
    }

    this.render = function () {

    }
    this.stop = function () {
        this.game.world.removeAll();
    }
}