var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, 'game');
var renderer = new Renderer(game);

game.myrenderer = renderer;

game.state.add('game', renderer);
game.state.start('game');