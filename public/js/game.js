var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, 'game');
var renderer = new Renderer(game);


// Fixed resize window
window.onresize = function(){
    var canvas = document.getElementsByTagName('canvas')[0];
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.inneHeight + "px";
    game.scale.setGameSize(window.innerWidth, window.innerHeight);
}

game.myrenderer = renderer;

game.state.add('game', renderer);
game.state.start('game');