feather.ns("catchakitty");
(function() {
  catchakitty.hextile = feather.Widget.create({
    name: "catchakitty.hextile",
    path: "widgets/hextile/",
    prototype: {
      onInit: function( ) {
        
      },
      onReady: function( ) {
        var me = this;
        this.north = null; // might want directions in array form
        this.south = null;
        this.neast = null;
        this.seast = null;
        this.nwest = null;
        this.swest = null;

        me.domEvents.bind( me.get("#hexTileImage"), "mouseenter", function( ) { 
          me.get("#hexTileImage").addClass("over");
        });

        me.domEvents.bind( me.get("#hexTileImage"), "mouseout", function( ) {
          me.get("#hexTileImage").removeClass("over");
        });

        me.domEvents.bind( me.get("#hexTileImage"), "click", function( ) {
          me.get("#hexTileImage").addClass("blocked"); 
        });
        
      },
      onSetTile: function( posX, posY ) {
        var image = this.get("#hexTileImage");

        image.css("left", posX);
        image.css("top", posY);
      },
      onSetLink: function( n, s, ne, nw, se, sw ) {
        if( n != null ) { this.north = n; n.south = this; }
        if( s != null ) { this.south = s; s.north = this; }
        if( ne != null ) { this.neast = ne; ne.swest = this; }
        if( nw != null ) { this.nwest = nw; nw.seast = this; }
        if( se != null ) { this.seast = se; se.nwest = this; }
        if( sw != null ) { this.swest = sw; sw.neast = this; }
      },
      onGetWidth: function( ) {
        return 64;
      },
      onGetHeight: function( ) {
        return 64;
      },
    }
  });
})();