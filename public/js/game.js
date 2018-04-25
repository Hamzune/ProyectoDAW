var game = new Phaser.Game(900, 600, Phaser.CANVAS, 'game');
var renderer = new Renderer(game);

game.myrenderer = renderer;

game.state.add('game', renderer);
game.state.start('game');