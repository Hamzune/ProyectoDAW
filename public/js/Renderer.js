function Renderer(game) {
    this.game = game;
    this.scene = new PrevScene(game);

    this.init = function(){
        this.game.stage.disableVisibilityChange = false;
    }

    this.preload = function () {
        this.scene.preload();
    }

    this.create = function () {
        this.scene.create();
    }

    this.update = function () {
        this.scene.update();
    }

    this.render = function () {
        this.scene.render();
    }

    this.changeScene = function(newScene) {
        this.scene.stop();
        this.scene = newScene;
        this.scene.preload();
        this.scene.create();
    }
}