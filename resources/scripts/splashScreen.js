'use strict';

var src = Platformowa.game;

var Platformowa = Platformowa || {};

Platformowa.splashScreen = function(game) {};

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
            this.bossLevel = true;
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
        
        //if boss was defeated
        if(this.bossLevel)
        {
            //boss image
            this.bossImage = customMethods.newSprite(this.game.width*0.5, this.game.height * 0.4, 'boss', 3, 0.5, 0.4, true)
            
            //level header
            this.headerText = customMethods.newText(this.game.width*0.5, this.game.height * 0.5, 'Poziom ' + this.nextLevel, 48, 0.5, 0.5, 'center', 'red', 'orange', 2);
            
            //gaming instruction text
            this.bossInfoText = customMethods.newText(this.game.width*0.5, this.game.height*0.65, 'Pokonaj bossa aby wygrać grę \n\ zbierz niebieski pocisk i zacznij strzelać celując myszką', 28, 0.5, 0.5, 'center', 'red', 'orange', 2);
            
            //boss level starting button
            var startButton = customMethods.newButton(this.game.width*0.5, this.game.height * 0.85, 'Button', function(){this.state.start('Poziom' + ' ' + this.nextLevel, true, false, this.starsCollected);}, this, true, null, null);
            
            var buttonText = customMethods.newText(startButton.x, startButton.y, '!! Start !!', 30, 0.5, 0.5, 'red', 'orange', 2);
        }
        //if normal level not boss level
        else
        {
            //Goblet image in the splash screen
            this.success = customMethods.newSprite(this.game.width*0.5, this.game.height*0.5, 'successImage', 0.5, 0.5, true)
        
            //Game over header
            this.headerText = customMethods.newText(this.game.width*0.5, this.game.height*0.65, 'Poziom ' + this.nextLevel + ' z 5' + '\n' + 'Przygotuj się !', 48, 0.5, 0.5, 'center', 'red', 'orange', 2);
        }
        
    },
    
    update: function()
    {
        var starsCollected = this.starsCollected;
        
        if(!this.bossLevel)
        {
            //starting next level after particular time
            src.time.events.add(2000, function() {      
            
            this.state.start('Poziom' + ' ' + this.nextLevel, true, false, starsCollected);    
        }, this);  
        }
    }
};