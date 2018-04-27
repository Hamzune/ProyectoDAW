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
    this.createNewPlayer = function(id) {
        this.socket.emit('newPlayer',{id:id});
    }

    this.movedPlayer = function(player){
    }

    this.getPlayers = function () {
        
    }
    this.socket.on('remove',function(id){

    });

    this.KilledPlayer = function(){

    }
}