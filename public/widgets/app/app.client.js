feather.ns("catchakitty");
var appMoves = 6;
(function() {
  catchakitty.app = feather.Widget.create({
    name: "catchakitty.app",
    path: "widgets/app/",
    prototype: {
      onInit: function( ) {     
        
      },
      onReady: function( ) {
        var me = this;

        this.appScore = 0;
        this.appLevel = 1;
        this.moveList = [];
        this.appTurns = 0;
        this.appDialog = me.get("#gameDialog").dialog( {
          autoOpen: false,
          title: 'Basic Dialog',
          show: 'slide',
          dialogClass: 'dialog',
          hide: 'slide',
          draggable: false,
          resizable: false,
          buttons: { "Ok": function( ) {
              me.appDialog.dialog("close");
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
                var tiles = 35 - me.appLevel;
                tiles = Math.max( tiles, 10);
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
                me.gameBoardWidget.onEnableAllTiles( false, function() {
                  me.fsm.fire('AiMove');
                });
              },
              AiMove: function( ) {
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

        this.gameBoardWidget.on( "PlayerDone", function( data ) {
          me.onPlayersTurn( data );
          me.fsm.fire('AiTurn');
        });     
        
      },
      onPlayersTurn: function( data ) {
        if( this.moveList.length >= appMoves ) {
          this.moveList[0].fsm.fire('Clear');
          this.moveList.splice( 0, 1); // remove first tile
        }
        
        this.appTurns++;
        
        this.moveList[this.moveList.length] = data; // save the tile
        
        for( var i = 0; i < this.moveList.length; i++ ) {
          this.moveList[i].onFade( appMoves );
        }
      },
      onWin: function( ) {
        this.appDialog.dialog("option", "title", 'You Win');
        this.appDialog.dialog("open");
        this.appLevel++;
        //this.appScore += this.gameBoardWidget.onCountEnabledTiles( )*10; // count enabled tiles
        this.appScore += Math.max( (1000 - (this.appTurns*10)), 100 );
        this.get( '#gameScore' ).html( "Score: " + this.appScore);
        this.get( '#gameLevel' ).html( "Level: " + this.appLevel);
        this.moveList.splice( 0, this.moveList.length );
        this.appTurns = 0;
      },
      onLose: function( ) {
        this.appDialog.dialog("option", "title", 'You Lose');
        this.appDialog.dialog("open");
        this.appLevel = 1;
        this.appScore = 0;
        this.get( '#gameScore' ).html( "Score: " + this.appScore);
        this.get( '#gameLevel' ).html( "Level: " + this.appLevel);
        this.moveList.splice( 0, this.moveList.length );
        this.appTurns = 0;
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

        tile = me.gameBoardWidget.onCalculatePath( me.gameKittyWidget.onGetCurrentTile() );

        // pick a tile
        /*var v = Math.floor( Math.random() * 6 );
        while( direction[v] == null || !direction[v].onGetIsOpen() ) {
          v = (v+1) % 6;
        }*/

        me.gameKittyWidget.onMoveToTile( tile, function( ) {
          me.fsm.fire('PlayerTurn');
        }); 
        
        return 0;      
      }
    }
  });
})();