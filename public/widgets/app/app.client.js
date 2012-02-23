feather.ns("catchakitty");
(function() {
  catchakitty.app = feather.Widget.create({
    name: "catchakitty.app",
    path: "widgets/app/",
    prototype: {
      onInit: function( ) {     
        
      },
      onReady: function( ) {
        var me = this;

        me.fsm = new feather.FiniteStateMachine( {
          states: {
            initial: {
              stateStartup: function() {
                me.gameBoardWidget.onCreateBoard( 11, 11 );
              },
              setup: function() {
                return this.states.Setup;
              }
            },
            Setup: {
              stateStartup: function() {
                me.gameBoardWidget.onResetAllTiles( function( ) {
                  me.fsm.fire('SetupBoard')
                });                 
              },
              SetupBoard: function() {
                me.gameBoardWidget.onMakeRandomBoard( function( ) {
                  me.fsm.fire('MoveKitty')
                });                 
              },
              MoveKitty: function() {
                me.gameKittyWidget.onMoveToTile( me.gameBoardWidget.grid[5][5], function( ) {
                  me.fsm.fire('Exit');
                });
              },
              Exit: function( ) {
                return this.states.GamePlayerTurn;
              }
            },
            GamePlayerTurn: {
              stateStartup: function( ) {
                me.gameBoardWidget.onEnableAllTiles( true );
              },
              AiTurn: function( ) {
                return this.states.GameAITurn;
              }
            },
            GameAITurn: {
              stateStartup: function( ) {
                me.gameBoardWidget.onEnableAllTiles( false );
                var result = me.onAiChoose( );
                if( result ){ // do more with result here
                  return this.states.Setup;
                }

              },
              PlayerTurn: function( ) {
                return this.states.GamePlayerTurn;
              }
            }
          }
        });

        this.gameBoardWidget.on( "LoadingDone", function( ) {
          me.fsm.fire('setup');
        });

        this.gameBoardWidget.on( "PlayerDone", function( ) {
          me.fsm.fire('AiTurn');
        });     
        
      },
      onAiChoose: function( ) {
        var me = this;
        var tile = me.gameKittyWidget.tile;
        var direction = [ tile.north, tile.south, tile.neast, tile.nwest, tile.seast, tile.swest ];

        // check for freedom
        for( var i = 0; i < 6; i++ ) {
          if( direction[i] == null ) {
            alert("you lose");
            return -1;
          }
        }

        // check for trapped
        for( var i = 0; i < 6; i++ ) {
          if( direction[i].onGetIsOpen() ) {
            break;
          }
        }
        if( i == 6 )
        {
          alert("you win");
          return 1;
        }

        // pick a tile
        var v = Math.floor( Math.random() * 6 );
        while( direction[v] == null || !direction[v].onGetIsOpen() )
        {
          v = (v+1) % 6;
        }

        me.gameKittyWidget.onMoveToTile( direction[v], function( ) {
          me.fsm.fire('PlayerTurn');
        }); 
        
        return 0;      
      }
    }
  });
})();