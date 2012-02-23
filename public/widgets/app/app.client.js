feather.ns("catchakitty");
var dialog = null;
var level = 1;
var score = 0;
(function() {
  catchakitty.app = feather.Widget.create({
    name: "catchakitty.app",
    path: "widgets/app/",
    prototype: {
      onInit: function( ) {     
        
      },
      onReady: function( ) {
        var me = this;

        dialog = me.get("#gameDialog").dialog( {
          autoOpen: false,
          title: 'Basic Dialog',
          show: 'slide',
          dialogClass: 'dialog',
          hide: 'slide',
          draggable: false,
          resizable: false,
          buttons: { "Ok": function( ) {
              dialog.dialog("close");
              me.fsm.fire('ReStart');
            }
          }
        });
        
        me.fsm = new feather.FiniteStateMachine( {
          states: {
            initial: {
              stateStartup: function( ) {
                me.gameBoardWidget.onCreateBoard( 11, 11 );
              },
              setup: function( ) {
                return this.states.Setup;
              }
            },
            Setup: {
              stateStartup: function( ) {
                me.gameBoardWidget.onResetAllTiles( function( ) {
                  me.fsm.fire('SetupBoard')
                });                 
              },
              SetupBoard: function( ) {
                var tiles = 35 - level;
                tiles = Math.max( tiles, 2);
                me.gameBoardWidget.onMakeRandomBoard( tiles, function( ) {
                  me.fsm.fire('MoveKitty')
                });                 
              },
              MoveKitty: function( ) {
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
                if( me.onAiChoose( ) ){ // returns if game is over
                  return this.states.GameEnd;
                }

              },
              PlayerTurn: function( ) {
                return this.states.GamePlayerTurn;
              }
            },
            GameEnd: {
              stateStartup: function( ) {
                me.gameBoardWidget.onEnableAllTiles( false );
              },
              ReStart: function( ) {
                return this.states.Setup;
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
      onWin: function( ) {
        dialog.dialog("option", "title", 'You Win');
        dialog.dialog("open");
        level++;
        score += this.gameBoardWidget.onGetScore( )*10; // count enabled tiles
        this.get( '#gameScore' ).html( "Score: " + score);
        this.get( '#gameLevel' ).html( "Level: " + level);
      },
      onLose: function( ) {
        dialog.dialog("option", "title", 'You Lose');
        dialog.dialog("open");
        level = 1;
        score = 0;
        this.get( '#gameScore' ).html( "Score: " + score);
        this.get( '#gameLevel' ).html( "Level: " + level);
      },
      onAiChoose: function( ) {
        var me = this;
        var tile = me.gameKittyWidget.tile;
        var direction = [ tile.north, tile.south, tile.neast, tile.nwest, tile.seast, tile.swest ];

        // check for freedom
        for( var i = 0; i < 6; i++ ) {
          if( direction[i] == null ) {
            me.onLose( );
            return 1;
          }
        }

        // check for trapped
        for( var i = 0; i < 6; i++ ) {
          if( direction[i].onGetIsOpen() ) {
            break;
          }
        }
        if( i == 6 ) {
          me.onWin( );
          return 1;
        }

        // pick a tile
        var v = Math.floor( Math.random() * 6 );
        while( direction[v] == null || !direction[v].onGetIsOpen() ) {
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