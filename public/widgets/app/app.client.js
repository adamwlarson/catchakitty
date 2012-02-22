feather.ns("catchakitty");
(function() {
  catchakitty.app = feather.Widget.create({
    name: "catchakitty.app",
    path: "widgets/app/",
    prototype: {
      onInit: function( ) {

        var me = this;

        
        
      },
      onReady: function( ) {
        var me = this;

        me.fsm = new feather.FiniteStateMachine( {
          states: {
            initial: {
              stateStartup: function() {
                alert(" enter loading ");

                me.gameBoardWidget.onCreateBoard( 11, 11, me.gameKittyWidget );    
              },
              Exit: function( ) {
                alert(" exit loading ");

                return this.states.Game;
              }
            },
          /*  MainMenu: {

            },*/
            Game: {
              stateStartup: function( ) {
                alert(" enter Game ");
                me.gameKittyWidget.onMoveToTile( me.gameBoardWidget.grid[5][5] );
              }              
            },
          /*  EndGame: {
              
            },
            Pause: {
              
            }*/
          }
        });

        this.gameBoardWidget.on( "LoadingDone", function( ) {
          alert(" LoadingDone ");
          me.fsm.fire('Exit');
        });
       
        
      }
    }
  });
})();