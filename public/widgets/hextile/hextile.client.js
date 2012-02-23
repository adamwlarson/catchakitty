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
                me.get("#hexTileImage").removeClass("over");
                me.get("#hexTileImage").removeClass("blocked");
                me.fire('ActionDone');
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
                 
              },
              mouseEnter: function() {
                me.get("#hexTileImage").addClass("over");
              },
              mouseExit: function() {
                me.get("#hexTileImage").removeClass("over");
              },
              mouseClick: function() {
                return this.states.TileBlocked;
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
                 
              },
              mouseEnter: function() {
                me.get("#hexTileImage").addClass("over");
              },
              mouseExit: function() {
                me.get("#hexTileImage").removeClass("over");
              },
              Enable: function() {
                return this.states.TileEnable;
              },
              Reset: function() {
                return this.states.initial;
              }
            },
            TileBlocked: {
              stateStartup: function() {
                me.get("#hexTileImage").addClass("blocked");
                me.open = false;
                me.fire('PlayerDone');
                me.fire('ActionDone');
              },
              Reset: function() {
                me.open = true;
                return this.states.initial;
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
      }
    }
  });
})();