'use strict';

var src = Platformowa.game;

var Platformowa = Platformowa || {};

Platformowa.splashScreen = function(game) {};

//Object programming by prototypes
Platformowa.splashScreen.prototype = 
{
    init: function(levelNumber, starsCollected)
    {
        
        if(levelNumber <= 3)
        {
            this.nextLevel = levelNumber + 1;
        }
        if(levelNumber >= 4)
        {
            this.nextLevel = 'Finałowy !';
        }
        
        this.starsCollected = starsCollected;
    },
    
    preload: function()
    {
        src.load.script('BlurX', 'https://cdn.rawgit.com/photonstorm/phaser-ce/master/filters/BlurX.js');
        src.load.script('BlurY', 'https://cdn.rawgit.com/photonstorm/phaser-ce/master/filters/BlurY.js');
    },
    
    create: function()
    {
        //music stop for new level music play
        uiMan.stopMusic();
        
        this.splashMusic= src.add.audio('splashMusic');
        this.splashMusic.play('', 0, 0.018, false, true );
        
        //background
        this.background = this.game.add.sprite(0, 0, 'background');
        this.background.scale.setTo(1, 0.65);
        
        var blurX = src.add.filter('BlurX');
        var blurY = src.add.filter('BlurY');

        blurX.blur = 30;
        blurY.blur = 30;
        
        this.background.filters = [blurX, blurY];
        
        //Doors png
        this.success = customMethods.newSprite(this.game.width*0.5, this.game.height*0.5, 'successImage', 0.5, 0.5, true)
        
        //Game over header
        var headerText = customMethods.newText(this.game.width*0.5, this.game.height*0.65, 'Poziom ' + this.nextLevel +'\n' + 'Przygotuj się !', 48, 0.5, 0.5, 'center', 'red', 'orange', 2);
        
    },
    
    update: function()
    {
        var starsCollected = this.starsCollected;
        
        src.time.events.add(2000, function() {      
            
            this.state.start('Poziom' + ' ' + this.nextLevel, true, false, starsCollected);    
        }, this);
    }
};