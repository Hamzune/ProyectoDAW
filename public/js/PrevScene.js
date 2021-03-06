function PrevScene(game){
    this.game = game;

    var content = [
        " ",
        "DAW studios presents",
        "a phaser production",
        " ",
        "SpaceWar",
        " ",
        "produced by SOUFIANE & Hamza",
        "or HAMZA & Soufiane ",
        "..we are still thinking on it....",
        "the last month of class, 2018",
        "somewhere in Badalona",
        "Enjoy our Game!!......Hamza is the best",
    ];
    var text;
    var index = 0;
    var line = '';

    this.tecla ;
    this.preload = function () {

        //menu
        game.load.image('start', 'assets/menu/new_game.png');
        game.load.image('stats', 'assets/menu/estadisticas.png');

        //sonidos
        game.load.audio('disparo', 'assets/audio/EfectosDeSonido/disparo2.mp3');
        game.load.audio('teleportal', 'assets/audio/EfectosDeSonido/portal.mp3');
        game.load.audio('dead', 'assets/audio/EfectosDeSonido/dead.mp3');
        game.load.audio('bonus', 'assets/audio/EfectosDeSonido/bonus.mp3');
        game.load.audio('musicadefondo', 'assets/audio/EfectosDeSonido/musicadefondo.mp3');
        
        game.load.audio('tecla', 'assets/audio/EfectosDeSonido/tecla.mp3');
        game.load.audio('boom', 'assets/audio/EfectosDeSonido/boom.mp3');

        game.load.image('ship', 'assets/images/ship.png');
        game.load.image('star', 'assets/images/star.png');
        game.load.image('portal', 'assets/images/upgrade.png');
        game.load.image('bullet', 'assets/images/bullet.png');
        game.load.image('skull', 'assets/images/skull.png');
        game.load.image('red', 'assets/images/red.png');
        game.load.image('bonus', 'assets/images/bonus.png');
        game.load.image('smoke', 'assets/images/smoke-puff.png');

        game.load.image('logout', 'assets/images/shutdown.png');
        
        game.load.image('asteroid1', 'assets/images/asteroid1.png');
        game.load.image('asteroid2', 'assets/images/asteroid2.png');
        game.load.image('asteroid3', 'assets/images/asteroid3.png');
        game.load.image('asteroid4', 'assets/images/asteroid4.png');

        game.load.spritesheet('kaboom', 'assets/images/explode.png', 128, 128);
        game.load.image('game-over', 'assets/images/game-over.png');

        game.load.image('bg0','assets/images/bkgd_0.png');
        game.load.image('bg1','assets/images/bkgd_1.png');
        game.load.image('bg2','assets/images/bkgd_2.png');
        game.load.image('bg3','assets/images/bkgd_3.png');
        game.load.image('bg4','assets/images/bkgd_4.png');
        game.load.image('bg5','assets/images/bkgd_5.png');
        game.load.image('bg6','assets/images/bkgd_6.png');
        game.load.image('bg7','assets/images/bkgd_7.png');


        game.stage.disableVisibilityChange = true;

    }

    this.create = function() {

        this.tecla = this.game.add.audio('tecla'); 

        var tileSprite = game.add.tileSprite(0, 0, 8000, 1920, 'bg0');
       // var start = this.game.add.text(window.innerWidth/2, (window.innerHeight/2)-120, "< START >", { font: "65px Arial", fill: "white", align: "center" });
        //var options = this.game.add.text(window.innerWidth/2, (window.innerHeight/2), "< OPTIONS >", { font: "65px Arial", fill: "white", align: "center" });
        //var stats = this.game.add.text(window.innerWidth/2, (window.innerHeight/2)+120, "< ESTADISTICAS >", { font: "65px Arial", fill: "white", align: "center" });
       
        var start = this.game.add.sprite(window.innerWidth/2, (window.innerHeight/2)-50, 'start');
        var stats = this.game.add.sprite(window.innerWidth/2, (window.innerHeight/2)+50, 'stats');

        //boton log out
        var boton = this.game.add.sprite(window.innerWidth-60, 60,'logout');
        boton.anchor.set(0.5);
        boton.inputEnabled = true;
        boton.fixedToCamera = true;
        boton.scale.set(0.3);
        boton.input.useHandCursor = true;
        boton.alpha = 0.2;
        boton.events.onInputUp.add(function(){
            window.location.replace("/logout")
        });
        boton.events.onInputOver.add(()=>{
            boton.alpha = 1;
        })
        boton.events.onInputOut.add(()=>{
            boton.alpha = 0.2;
        })
        start.fixedToCamera = true;
        stats.fixedToCamera = true;

        

        start.anchor.set(0.5);
        stats.anchor.set(0.5);

        start.inputEnabled = true;
        stats.inputEnabled = true;


        start.input.useHandCursor = true;
        stats.input.useHandCursor = true;



        start.events.onInputOver.add(over, this);
        stats.events.onInputOver.add(over, this);

        start.events.onInputOut.add(out, this);
        stats.events.onInputOut.add(out, this);

        
        start.events.onInputUp.add(up, this);
        stats.events.onInputUp.add(estadisticas, this);

        text = game.add.text(window.innerWidth/2-460, (window.innerHeight/2)+420, '', { font: "30pt Courier", fill: "#19cb65", stroke: "#119f4e", strokeThickness: 2 });

        this.bg3 = this.game.add.tileSprite(0, this.game.height - this.game.cache.getImage("bg3").height, this.game.width, this.game.cache.getImage("bg3").height, "bg3");
    
      




        this.bg3.fixedToCamera = true;


        this.nextLine();

    }

    function over(item) {
   
       //hover
       item.scale.setTo(1.2,1.2);

   
    }
   
    function out(item) {
   
        item.scale.setTo(1,1);

   
    }

    function opciones(item) {
       
   
    }
    this.updateLine = () => {

        if(content[index] != undefined){
            if (line.length < content[index].length)
            {
                line = content[index].substr(0, line.length + 1);
                // text.text = line;
                text.setText(line);
                this.tecla.play();
                this.tecla.volume = 0.2;
            }
            else
            {
                //  Wait 2 seconds then start a new line
                this.game.time.events.add(Phaser.Timer.SECOND * 2, this.nextLine, this);
                
            }

        }
    
    }
    this.nextLine = () => {

        index++;
        if(content[index] != undefined){
        
            if (index < content.length)
            {
                line = '';
                this.game.time.events.repeat(80, content[index].length + 1, this.updateLine, this);
            }
        }
    
    }
    function estadisticas(item) {
       
        window.location.replace("/top");
    }

    function up(item) {
        content = [];
        this.listener();
   
    }

    
    this.listener = function(){
        this.game.myrenderer.changeScene(new FirstScene(this.game));
    }

    this.update = function() {

        this.bg3.tilePosition.y -= 0.25;

        
    }

    this.render = function () {

    }
    this.stop = function () {
        this.game.world.removeAll();
    }
}