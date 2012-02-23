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
        
      },
      onMoveToTile: function( tile, callback ) {
        this.tile = tile;
        this.get("#kittyImage").animate( {
          left: tile.onGetPosX(),
          top: tile.onGetPosY()
        }, "fast", 'linear', callback );
      }     
    }
  });
})();