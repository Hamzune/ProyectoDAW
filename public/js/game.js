
var game = new Phaser.Game(900, 600, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update, render: render });
function preload() {

  
}

function create() {

    game.stage.backgroundColor = "#ff5599";    

}


function update() {

}

function render () {

    // game.debug.text('Click / Tap to go fullscreen', 270, 16);
    // game.debug.text('Click / Tap to go fullscreen', 0, 16);

    game.debug.inputInfo(32, 32);
    // game.debug.pointer(game.input.activePointer);

}
