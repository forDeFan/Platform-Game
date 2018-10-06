'use strict';

//reference to game
var src = Platformowa.game;

var gmMan = 
{
    initialize: function()
    {
        this.gameStopped = false;
    },
    
//LVL PRELOAD
    
    //setup settings
    setUp: function()
    {
        src.physics.startSystem(Phaser.Physics.ARCADE); 
        
        //Fullscreen mode
        src.input.keyboard.addKey(Phaser.Keyboard.F).onDown.add(gmMan.switchFullscreen, this); 
    },
    
    //game switch to full screen
    switchFullscreen: function()
    {
        if(src.scale.isFullScreen)
        {
            src.scale.stopFullScreen();
        }
        else
        {
            src.scale.startFullScreen(true, true);
        }  
    },
    
    //Blurred background effect in menus
     blurPreloaded: function()
    {
        src.load.script('BlurX', 'https://cdn.rawgit.com/photonstorm/phaser-ce/master/filters/BlurX.js');
        src.load.script('BlurY', 'https://cdn.rawgit.com/photonstorm/phaser-ce/master/filters/BlurY.js');
    },
    
    blurAdded: function()
    {
        var blurX = src.add.filter('BlurX');
        var blurY = src.add.filter('BlurY');

        blurX.blur = 30;
        blurY.blur = 30;
        
        src.filters = [blurX, blurY];
    },
    
//LVL CREATE
    
    //Pause menu initialization
    pauseMenu: function()
    {
        //Pause menu
        this.pauseHeader = customMethods.newText(src.width * 0.5, (src.height * 0.5) - 200, "PAUZA", 90, 0.5, 0.5, 'center', 'red', 'orange', 4);
        this.unpasueText = customMethods.newText(src.width * 0.5, (src.height * 0.5) - 50, "aby wznowić grę wciśnij 'P'", 40, 0.5, 0.5, 'center', 'red', 'white', 2);
        this.restartText = customMethods.newText(src.width * 0.5, src.height * 0.5, "aby zrestartować poziom wciśnij 'R'", 40, 0.5, 0.5, 'center', 'red', 'white', 2);
        
        this.pauseHeader.visible = this.unpasueText.visible = this.restartText.visible = false; 
        this.pauseHeader.fixedToCamera = this.unpasueText.fixedToCamera = this.restartText.fixedToCamera = true;
        
        //P key will pause game
        src.input.keyboard.addKey(Phaser.Keyboard.P).onDown.add(this.pauseGame, this);
        //R key will restart current state and flash will blink in white
        src.input.keyboard.addKey(Phaser.Keyboard.R).onDown.add(this.restartGame, src.camera.flash(0xffffff, 300), this);
    },
    
//LVL UPDATE
    
    //Pause functions
    pauseGame: function()
    {
        src.paused = !src.paused;
        this.pauseHeader.visible = this.unpasueText.visible = this.restartText.visible = src.paused;

        if(src.paused)
        {
            uiMan.lvlMusic.pause();
        }
        else
        {
            uiMan.lvlMusic.resume();
        }
    },
    
    restartGame: function()
    {
        if(src.paused)
        {
            src.paused = false;
            uiMan.stopMusic();
            src.state.start(src.state.current);
        }
    }
};