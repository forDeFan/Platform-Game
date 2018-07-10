'use strict';

var Platformowa = Platformowa || {};

Platformowa.launcher = function(game) {};

Platformowa.launcher.prototype = 
{
    init: function ()
    {   
        //Number of touch events on the device
        this.game.input.maxPointers = 1; 
        //Game pause when we open additional tab in web browser
        this.game.stage.disableVisibilityChange = true;
        //Pixels smoothing
        this.game.renderer.renderSession.roundPixels = true;
        //Background color for the stage
        this.game.stage.backgroundColor = 'rgba(0, 7, 33, 2, 0.7)';
        
        //full screen
        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
    },
    
    preload: function() 
    {
        //Scaling up game to device screen parameters
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
        this.game.forceLandscape = true;
        
        this.load.spritesheet('LoadingBars', 'resources/graphic/main/loadingBars.png', 256, 64); 
    },
    
    create: function ()
    {
        this.state.start('LoadingScreen');
    }
};