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
        this.fade = 0;
        this.visited = -1;
        this.open = true;
        this.north = null; // might want directions in array form
        this.south = null;
        this.neast = null;
        this.seast = null;
        this.nwest = null;
        this.swest = null;

        me.fsm = new feather.FiniteStateMachine( {
          states: {
            initial: {
              stateStartup: function() {
                me.get("#hexTileImage").removeClass();
                me.get("#hexTileImage").addClass("tile");
                me.fire('ActionDone');
                me.fade = 0;
                me.visited = -1;
              },
              Enable: function() {
                return this.states.TileEnable;
              },
              Blocked: function() {
                return this.states.TileBlocked;
              },
              Reset: function() {
                me.fire('ActionDone');
              }

            },
            TileEnable: {
              stateStartup: function() {
                 me.fire('ActionDone');
              },
              mouseEnter: function() {
                me.get("#hexTileImage").addClass("over");
              },
              mouseExit: function() {
                me.get("#hexTileImage").removeClass("over");
              },
              mouseClick: function() {
                return this.states.TileUsed;
              },
              Disable: function() {
                return this.states.TileDisable;
              },
              Reset: function() {
                return this.states.initial;
              },
              Blocked: function() {
                return this.states.TileBlocked;
              }
            },
            TileDisable: {
              stateStartup: function() {
                me.visited = -1;
                me.fire('ActionDone');
                 
              },
              mouseEnter: function() {
                me.get("#hexTileImage").addClass("over");
              },
              mouseExit: function() {
                me.get("#hexTileImage").removeClass("over");
              },
              Enable: function() {
                me.visited = -1;
                return this.states.TileEnable;
              },
              Reset: function() {
                return this.states.initial;
              },
              Disable: function() {
                me.fire('ActionDone');
              }
            },
            TileUsed: {
              stateStartup: function() {
                me.get("#hexTileImage").addClass("used");
                me.open = false;
                me.fire('PlayerDone', me);
              },
              Clear: function() {
                me.open = true;
                me.get("#hexTileImage").removeClass();
                me.get("#hexTileImage").addClass("tile");
                me.fade = 0;
                return this.states.TileEnable;
              },
              Reset: function() {
                me.open = true;
                return this.states.initial;
              },
              Enable: function() {
                me.visited = -1;
                me.fire('ActionDone');
              },
              Disable: function() {
                me.fire('ActionDone');
              }             
            },
            TileBlocked: {
              stateStartup: function() {
                me.get("#hexTileImage").addClass("blocked");
                me.open = false;
                me.fire('ActionDone');
              },
              Reset: function() {
                me.open = true;
                return this.states.initial;
              },
              Enable: function() {
                me.visited = -1;
                me.fire('ActionDone');
              },
              Disable: function() {
                me.fire('ActionDone');
              }
            }
          }
        });

        me.domEvents.bind( me.get("#hexTileImage"), "mouseenter", function( ) { 
          me.fsm.fire('mouseEnter');
        });

        me.domEvents.bind( me.get("#hexTileImage"), "mouseout", function( ) {
          me.fsm.fire('mouseExit');
        });

        me.domEvents.bind( me.get("#hexTileImage"), "click", function( ) {
          me.fsm.fire('mouseClick');
        });

        me.domEvents.bind( me.get("#hexTileImage"), "mousedown", function(event) {
          event.preventDefault();
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
        return 64; // can i calculate this?
      },
      onGetHeight: function( ) {
        return 64;
      },
      onGetPosX: function( ) {
        return this.get("#hexTileImage").position().left;
      },
      onGetPosY: function( ) {
        return this.get("#hexTileImage").position().top;
      },
      onGetIsOpen: function( ) {
        return this.open;
      },
      onCheckPath: function( tile ) {
        return  ( this.north == tile ) ||
                ( this.south == tile ) ||
                ( this.neast == tile ) ||
                ( this.seast == tile ) ||
                ( this.nwest == tile ) ||
                ( this.swest == tile );
      },
      onFindNextPath: function( distance ) {

      /*  console.log( " findnext dist: " + distance );

        console.log( " north dist: " + ((this.north==null)? -1: this.north.visited) );
        console.log( " south dist: " + ((this.south==null)? -1: this.south.visited) );
        console.log( " neast dist: " + ((this.neast==null)? -1: this.neast.visited) );
        console.log( " seast dist: " + ((this.seast==null)? -1: this.seast.visited) );
        console.log( " nwest dist: " + ((this.nwest==null)? -1: this.nwest.visited) );
        console.log( " swest dist: " + ((this.swest==null)? -1: this.swest.visited) );*/

        if( this.north != null && this.north.visited == distance ) {
          return this.north;
        }
        if( this.south != null && this.south.visited == distance ) {
          return this.south;
        }
        if( this.neast != null && this.neast.visited == distance ) {
          return this.neast;
        }
        if( this.seast != null && this.seast.visited == distance ) {
          return this.seast;
        }
        if( this.nwest != null && this.nwest.visited == distance ) {
          return this.nwest;
        }
        if( this.swest != null && this.swest.visited == distance ) {
          return this.swest;
        }

        alert("could not find distance");
      },
      onFade: function( levels ) {
        this.fade++;
        if( this.fade >= levels ) {
          this.get("#hexTileImage").addClass("used4");
        }
        else if( this.fade >= levels-1) {
          this.get("#hexTileImage").addClass("used3");  
        }
        else if( this.fade >= levels-2) {
          this.get("#hexTileImage").addClass("used2");  
        }
        else if( this.fade >= levels-3) {
          this.get("#hexTileImage").addClass("used1");  
        }
      }
    }
  });
})();