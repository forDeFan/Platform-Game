'use strict';

var Platformowa = Platformowa || {}; 
var configuration =
{
    width: window.innerWidth < 480 ? 480 : window.innerHeight,
    height: window.innerHeight -32 <320 ? 320 : window.innerHeight,
    //forcing canvas for better FPS ratio on large screen
    render: Phaser.CANVAS
};

//Starting phaser config from var configuration
Platformowa.game = new Phaser.Game(configuration);

//Game states declaration
Platformowa.game.state.add('Launcher', Platformowa.launcher);  
Platformowa.game.state.add('LoadingScreen', Platformowa.loadingScreen);
Platformowa.game.state.add('gameOver', Platformowa.gameOver);
Platformowa.game.state.add('mainMenu', Platformowa.mainMenu);
Platformowa.game.state.add('splashScreen', Platformowa.splashScreen);
Platformowa.game.state.add('Poziom 1', Platformowa.lvl1);
Platformowa.game.state.add('Poziom 2', Platformowa.lvl2);
Platformowa.game.state.add('Poziom 3', Platformowa.lvl3);

//Game state start
Platformowa.game.state.start('Launcher'); 
