function Client(scene) {
    this.socket = io.connect();
    this.scene = scene;
    this.getMap = function(){
        var that = this;
        var p = new Promise(function(resolve, reject){
            that.socket.on('map', function(map) {
                resolve(map);
            });
        });

        return p;
       
    }
    this.askNewPlayer = function() {
        this.socket.emit('askNewPlayer');
    }

    this.movedPlayer = function(player){
    }

    this.getPlayers = function () {
        
    }
    this.socket.on('remove',function(id){
    })
    this.KilledPlayer = function(){

    }
}