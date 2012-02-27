feather.ns("catchakitty");
(function() {
  catchakitty.kitty = feather.Widget.create({
    name: "catchakitty.kitty",
    path: "widgets/kitty/",
    prototype: {
      onInit: function() {
        
      },
      onReady: function() {
        this.tile = null;
        var me = this;

        me.domEvents.bind( me.get("#kittyImage"), "mousedown", function(event) {
          event.preventDefault();
        });
        
      },
      onMoveToTile: function( tile, callback ) {
        this.tile = tile;
        this.get("#kittyImage").animate( {
          left: tile.onGetPosX(),
          top: tile.onGetPosY()
        }, "fast", 'linear', callback );
      },
      onGetCurrentTile: function( ) {
        return this.tile;
      }
    }
  });
})();