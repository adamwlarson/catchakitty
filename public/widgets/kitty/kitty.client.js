feather.ns("catchakitty");
(function() {
  catchakitty.kitty = feather.Widget.create({
    name: "catchakitty.kitty",
    path: "widgets/kitty/",
    prototype: {
      onInit: function() {
        
      },
      onReady: function() {
        
      },
      onMoveToTile: function( tile ) {
        this.get("#kittyImage").animate( {
          left: tile.get("#hexTileImage").position().left,
          top: tile.get("#hexTileImage").position().top
        }, "fast", 'linear', 0 );
      },
    }
  });
})();