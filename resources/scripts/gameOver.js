'use strict'; 

var src = Platformowa.game;

var Platformowa = Platformowa || {};

Platformowa.gameOver = function(game) {};

Platformowa.gameOver.prototype = 
{   
    init: function(saveConfig)
    {
        var config = JSON.parse(localStorage.getItem('this.saveConfig'));
        
        if(config === null)
        {
            this.resetProgress;
            this.starsCollected = 'niezaliczone';
            this.levelReached = '1';
        }
        else
        {
            this.starsCollected = config.starsCount;
            this.levelReached = config.levelNumber;
        }
    },
    
    create: function()
    {
        //this.stage.backgroundColor = '#000000';
        //this.world.setBounds(this.game.width, this.game.height);
        
        //background
        this.background = this.game.add.sprite(0, 0, 'background');
        this.background.scale.setTo(1, 0.65);
        
        var blurX = src.add.filter('BlurX');
        var blurY = src.add.filter('BlurY');

        blurX.blur = 30;
        blurY.blur = 30;
        
        this.background.filters = [blurX, blurY];
        
        //header text
        this.headerText = customMethods.newText(this.game.width*0.5, (this.game.height*0.5) - 220, 'Koniec Gry', 50, 0.5, 0.5, 'center', 'red', 'orange', 2);
        //results text
        this.resultsText = customMethods.newText(this.game.width*0.5, (this.game.height*0.5) - 120, 'Poziom na którym zakończono: ' + this.levelReached + '\n' + 'Zaliczone gwiazdki: ' + this.starsCollected, 30, 0.5, 0.5, 'red', 'orange', 3);

        //main menu groups for buttons and buttons text
        this.mainMenu = this.add.group();
        this.settingsMenu = this.add.group();
        
        this.createMenu();
    },
    
    createMenu: function()
    {
        var buttonHeight = 120;
        var offset = 110;
        
        var mainMenu = ['Zacznij od nowa','Menu Główne'];
        
        //menu music
        var menuMusic = this.game.add.audio('menuMusic');
        menuMusic.play('', 0, 0.06, true, true );
        
        //Sounds for menu elements
        var buttonSelectedSound = this.game.add.audio('buttonSelect');
        buttonSelectedSound.volume = 0.08;
        var buttonClickedSound = this.game.add.audio('buttonClick');
        buttonClickedSound.volume = 0.10;
        
        //Callbacks for button click in menu
        var mmCallback = [function(){this.resetProgress(), this.state.start('Poziom 1'), this.stopSound(menuMusic);}, function(){this.state.start('mainMenu'), this.stopSound(menuMusic)}];
        
        //loop to create buttons and text based on mainMenu
        for(var m = 0; m < mainMenu.length; m++)
        {
            var button = customMethods.newButton(this.game.width*0.5, this.resultsText.y + 240 + (buttonHeight * m) - offset, 'Button', mmCallback[m], this, true, function(){this.playSound(buttonClickedSound);}, function(){this.playSound(buttonSelectedSound);});
            
            var text = customMethods.newText(button.x, button.y, mainMenu[m], 30, 0.5, 0.5, 'red', 'orange', 1);
    
            this.mainMenu.add(button);
            this.mainMenu.add(text);   
        }
    },
    
    playSound: function(sound)
    {
        sound.play();
    },
    
    stopSound: function(sound)
    {
        sound.stop();
    },
    
    resetProgress: function()
    {
        localStorage.removeItem('this.saveConfig')
    }
};
    