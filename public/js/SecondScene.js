function SecondScene(game){
    this.game = game;


    this.preload = function () {

    }

    this.create = function() {

        var stats = this.game.add.text(this.game.world.centerX, this.game.world.centerY-120, "< SHOW STATS >", { font: "65px Arial", fill: "white", align: "center" });
        var restart = this.game.add.text(this.game.world.centerX, this.game.world.centerY, "< PLAY AGAIN >", { font: "65px Arial", fill: "white", align: "center" });
        
       
        stats.anchor.set(0.5);
        restart.anchor.set(0.5);


        stats.inputEnabled = true;
        restart.inputEnabled = true;


        stats.input.enableDrag();
        stats.input.useHandCursor = true;
        restart.input.enableDrag();
        restart.input.useHandCursor = true;

/*
        stats.events.onInputOver.add(over, this);
        restart.events.onInputOver.add(over, this);


        stats.events.onInputOut.add(out, this);
        restart.events.onInputOut.add(out, this);


        stats.events.onInputUp.add(up, this);
        restart.events.onInputUp.add(up, this);
*/
    }

    function over(item) {
   
        item.fill = "red";
   
    }
   
    function out(item) {
   
        item.fill = "white";

   
    }
    function stats(item) {
       item.fill = "red";
   
    }
    function up(item) {
   
       // this.listener();
   
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