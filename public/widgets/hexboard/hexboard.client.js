feather.ns("catchakitty");
(function() {
  var me = 0;
  catchakitty.hexboard = feather.Widget.create({
    name: "catchakitty.hexboard",
    path: "widgets/hexboard/",
    prototype: {
      onInit: function( ) {
        
      },
      onReady: function( ) {
        me = this;
        this.width = 0;
        this.height = 0;
        this.totalTiles = 0;
        this.grid = 0;
        this.tileWidgets = 0;
      },
      _onCreateTile: function( callback ) {
        
        feather.Widget.load( { // creats a widget
          path: "widgets/hextile/", // path to widget
          clientOptions: {
            parent: me,
            keepContainerOnDispose: true,
            container: $("<div class='gameBoard'></div>").prependTo( me.get( "#gameBoard" ) ), // adding the html
            onceState: {
              ready: function( ) {
                callback( this );
              }
            }
          }
        });

      },
      _onCreateTileCallback: function( obj ) {
        me.tileWidgets[me.tileWidgets.length] = obj;

        if( me.tileWidgets.length >= me.totalTiles ){
          me._onCreateBoardDone( );
        }
      },
      _onCreateBoardDone: function( ) {
        var index = 0;
        var xOffset = 0;
        var yOffset = 0;
        var width = this.tileWidgets[0].onGetWidth( );
        var halfHeight = this.tileWidgets[0].onGetHeight( )/2;
        for( var y = 0; y < this.height; y++ ) {            
          for( var x = 0; x < this.width; x++ ) {
              this.grid[x][y] = this.tileWidgets[index];
              if( x%2 ){
                // odd columns
                this.tileWidgets[index].onSetLink(  (y != 0)? this.grid[x][y-1]:null,  // north
                                                    (y != this.height-1)? this.grid[x][y+1]:null,  // south
                                                    (x != this.width-1)? this.grid[x+1][y]:null,  // north east
                                                    (x != 0)? this.grid[x-1][y]:null,  // north west
                                                    (x != this.width-1 && y != this.height-1)? this.grid[x+1][y+1]:null,// south east
                                                    (x != 0)? this.grid[x-1][y+1]:null);// south west
              }
              else {
                // even columns
                this.tileWidgets[index].onSetLink(  (y != 0)? this.grid[x][y-1]:null,  // north
                                                    (y != this.height-1)? this.grid[x][y+1]:null,  // south
                                                    (x != this.width-1 && y != 0)? this.grid[x+1][y-1]:null,// north east
                                                    (y != 0 && x != 0)? this.grid[x-1][y-1]:null,// north west
                                                    (x != this.width-1)? this.grid[x+1][y]:null,  // south east
                                                    (x != 0)? this.grid[x-1][y]:null);// south west
              }
              this.tileWidgets[index++].onSetTile( xOffset, yOffset );
              xOffset += width;
              yOffset += (x%2)? -halfHeight:halfHeight;
          }
          yOffset += halfHeight;
          xOffset = 0;
        }
        
        //this.grid[2][0].get("#hexTileImage").addClass( "blocked");
        /*this.grid[1][2].get("#hexTileImage").addClass( "blocked");
        this.grid[0][2].get("#hexTileImage").addClass( "blocked");
        this.grid[2][2].north.north.get("#hexTileImage").addClass( "blocked");*/
        /*this.grid[2][2].nwest.nwest.get("#hexTileImage").addClass( "blocked");
        this.grid[2][2].neast.neast.get("#hexTileImage").addClass( "blocked");
        this.grid[2][2].south.south.get("#hexTileImage").addClass( "blocked");
        this.grid[2][2].north.north.get("#hexTileImage").addClass( "blocked");        
        this.grid[2][2].swest.swest.get("#hexTileImage").addClass( "blocked");
        this.grid[2][2].seast.seast.get("#hexTileImage").addClass( "blocked");*/
        //alert( this.grid[2][0].north == null );

        me.fire('LoadingDone');
        
      },
      onCreateBoard: function( width, height, kitty ) {
        this.width = width;
        this.height = height;
        this.totalTiles = width * height;
        this.kitty = kitty;
               
        // create the grid
        this.grid = [width];
        for( var i = 0; i < width; i++ ) {
         this.grid[i] = [];
        }

        // create tiles
        if( this.tileWidgets != 0 ) { alert("board already created");}
        this.tileWidgets = [];
        for( var i = 0; i < this.totalTiles; i++ ) {
          this._onCreateTile( this._onCreateTileCallback );
        }

      },
    }
  });
})();