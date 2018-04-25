function FirstScene(game){
    this.game = game;

    this.preload = function () {
        this.game.load.image('ship', 'assets/ship.png');

    }

    this.create = function() {
        this.game.stage.backgroundColor = "#ff5900";
        var image = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'ship');

        //  Moves the image anchor to the middle, so it centers inside the game properly
        image.anchor.set(0.5);
    
        //  Enables all kind of input actions on this image (click, etc)
        image.inputEnabled = true;
    
        text = this.game.add.text(250, 16, '', { fill: '#ffffff' });
    
        image.events.onInputDown.add(this.listener, this);

    }

    this.listener = function(){

        this.game.myrenderer.changeScene(new SecondScene(this.game));
    }

    this.update = function() {

    }

    this.render = function () {

    }

    this.stop = function() {
        this.game.world.removeAll();
    }
}