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
        this.tileActions = 0;
        this.ActionCallback = null;
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
              
              this.tileWidgets[index].on( "PlayerDone", function( data ) {
                me.fire('PlayerDone', data );
              });

              this.tileWidgets[index].on( "ActionDone", function( ) {
                me._onAllTilesDone( );
              });

              this.tileWidgets[index++].onSetTile( xOffset, yOffset );
              xOffset += width;
              yOffset += (x%2)? -halfHeight:halfHeight;
          }
          yOffset += halfHeight;
          xOffset = 0;
        }

        me.fire('LoadingDone');
        
      },
      onEnableAllTiles: function( bool, callback ) {
        this.tileActions = this.totalTiles;
        this.ActionCallback = callback;

        for( var i = 0; i < this.totalTiles; i++ ) {
          if( bool ) {
            this.tileWidgets[i].fsm.fire('Enable');
          }
          else {
            this.tileWidgets[i].fsm.fire('Disable');
          }
        }
      },
      onResetAllTiles: function( callback ) {
        this.tileActions = this.totalTiles;
        this.ActionCallback = callback;        

        for( var i = 0; i < this.totalTiles; i++ ) {
          this.tileWidgets[i].fsm.fire('Reset');
        }
      },
      _onAllTilesDone: function( ) {
        if( --this.tileActions <= 0 ) {
          if( this.ActionCallback != null ) {
            this.ActionCallback( );
            this.ActionCallback = null;
          }
        }
      },
      onCreateBoard: function( width, height ) {
        this.width = width;
        this.height = height;
        this.totalTiles = width * height;

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
     onMakeRandomBoard: function( num, callback ) {
        var blocked = num; // number of tiles
        var x, y;

        this.tileActions = blocked;
        this.ActionCallback = callback;

        while( blocked >= 0 ) {
          x = Math.floor( Math.random() * this.width );
          y = Math.floor( Math.random() * this.height );
          
          if( x == y && x == 5 ) {
            continue;
          }

          if( this.grid[x][y].onGetIsOpen() )
          {
            this.grid[x][y].fsm.fire('Blocked');
            blocked--;
          }
        }
      },
      onCountEnabledTiles: function( ) {
        var score = 0;
        for( var i = 0; i < this.totalTiles; i++ ) {          
          if( this.tileWidgets[i].onGetIsOpen() ) {
            score++;
          }
        }

        return score;
      },
      _onAddNewTiles: function( newList, tile, dist ) {
        var dirs = [ tile.north, tile.south, tile.neast, tile.nwest, tile.seast, tile.swest ];
        var index = 0;
        for( var i = 0; i < 6; i++ ) {
          if( dirs[i] != null && dirs[i].onGetIsOpen() && dirs[i].visited == -1 ) {
            newList[newList.length] = dirs[i];
            dirs[i].visited = dist;
          }
        }
      },
      onCalculatePath: function( startTile ) {
        var dist = 1, index = 0;
        var pathList = [];
        var newList = [];

        pathList[index] = startTile;
        startTile.visited = 0; // cheating!

        // build path, todo put in function
        // if newList is empty we are done
        while( newList.length > 0 || index == 0 )
        {
          newList.splice( 0, newList.length );

          
          // add nearby nodes of pathList into newList
          while( index < pathList.length ) {

            startTile = pathList[index];
            if( pathList[index].onCheckPath( null ) ) // end found
            {
              newList.splice( 0, newList.length );
              break;
            }
            this._onAddNewTiles( newList, pathList[index], dist );
            index++;
          }
          
          dist++;
          // add newlist to end of pathlist and continue
          pathList = pathList.concat( newList );
          
        }
        dist = startTile.visited;
        
        // find the next tile to move to
        while( --dist > 0 ){
          startTile = startTile.onFindNextPath( dist );
          dist = startTile.visited;      
        }        
        return startTile;
      }


    }
  });
})();