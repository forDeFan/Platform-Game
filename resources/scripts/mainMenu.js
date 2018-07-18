'use strict';

var src = Platformowa.game;

var Platformowa = Platformowa || {};

Platformowa.mainMenu = function(game) {};

//Object programming by prototypes
Platformowa.mainMenu.prototype = 
{
    preload: function()
    {
        src.load.script('BlurX', 'https://cdn.rawgit.com/photonstorm/phaser-ce/master/filters/BlurX.js');
        src.load.script('BlurY', 'https://cdn.rawgit.com/photonstorm/phaser-ce/master/filters/BlurY.js');
    },
    
    create: function()
    {  
        //background
        this.background = this.game.add.sprite(0, 0, 'background');
        this.background.scale.setTo(1, 0.65);
        
        //Main menu header
        this.headerText = customMethods.newText(this.game.width*0.5, (this.game.height*0.5) - 220, 'Go Monsters !!', 50, 0.5, 0.5, 'center', 'red', 'orange', 2);
        
        var blurX = src.add.filter('BlurX');
        var blurY = src.add.filter('BlurY');

        blurX.blur = 30;
        blurY.blur = 30;
        
        this.background.filters = [blurX, blurY];
        
        //main menu groups for buttons and buttons text
        this.mainMenu = this.add.group();
        this.settingsMenu = this.add.group();
        
        this.createMenu();
        this.switchWindow(0);
    },
    
    createMenu: function()
    {
        //button set ups
        var buttonHeight = 120;
        var offset = 100;
        var textIconOffset = 150;
        
        //Main menu buttons text
        var mainMenu = ['Start Gry', 'Zapisana Gra', 'Jak Grać'];
        
        //Game loading after click of 'zapisana gra' button
        var settings = ['Wczytaj Grę', 'Wyczyść Zapis'];
        
        //Back button text
        var back = 'Powrót';
        
        //Info text in 
        var infoStars = 'Zbieraj gwiazdki';
        var infoJump = 'Skacz wyżej';
        var infoKey = 'Znajdź klucz do następnego etapu';
        var infoDoor = 'I przejdź przez drzwi';
        
        //menu music
        this.menuMusic = this.game.add.audio('menuMusic');
        this.menuMusic.play('', 0, 0.06, true, true );
        
        //Sounds for menu elements
        this.buttonSelectedSound = this.game.add.audio('buttonSelect');
        this.buttonSelectedSound.volume = 0.08;
        this.buttonClickedSound = this.game.add.audio('buttonClick');
        this.buttonClickedSound.volume = 0.10;
        
        //Callbacks for button click in menu
        var mmCallback = [function(){this.resetProgress(), this.state.start('Poziom 1'), this.stopSound(this.menuMusic);}, function(){this.switchWindow(1);}, function(){this.switchWindow(2);}];
        var smCallback = [this.loadProgress, this.resetProgress];
        
        //loops to create buttons and text based on mainMenu and settings
        for(var m = 0; m < mainMenu.length; m++)
        {
            var button = customMethods.newButton(this.game.width*0.5, this.game.height*0.5+(buttonHeight * m) - offset, 'Button', mmCallback[m], this, true, function(){this.playSound(this.buttonClickedSound);}, function(){this.playSound(this.buttonSelectedSound);});
            
            var text = customMethods.newText(button.x, button.y, mainMenu[m], 30, 0.5, 0.5, 'red', 'orange', 2);
    
            this.mainMenu.add(button);
            this.mainMenu.add(text);   
        }
        
        for(var s = 0; s < settings.length; s++)
        {
            this.settingsButton = customMethods.newButton(this.game.width*0.5, this.game.height*0.5+(buttonHeight * s) - offset, 'Button', smCallback[s], this, true, function(){this.playSound(this.buttonClickedSound);}, function(){this.playSound(this.buttonSelectedSound);});
            var text = customMethods.newText(this.settingsButton.x, this.settingsButton.y, settings[s], 30, 0.5, 0.5, 'red', 'orange', 1);
            
            this.settingsMenu.add(this.settingsButton);
            this.settingsMenu.add(text);
        }
        
        //icons and text on info page
        
        //star
        this.starIcon = customMethods.newSprite(this.game.width*0.4, this.headerText.y + textIconOffset/2, 'star');
        //stars text
        this.infoStars = customMethods.newText(this.starIcon.x + textIconOffset, this.starIcon.y, infoStars, 29, 0.5, 0.5, 'red', 'orange', 1);
        
        //jump
        this.jumpIcon = customMethods.newSprite(this.game.width*0.4, this.starIcon.y + textIconOffset/2.2, 'jump');
        this.jumpIcon.scale.setTo(0.4);
        //jump text
        this.infoJump = customMethods.newText(this.jumpIcon.x + textIconOffset, this.jumpIcon.y, infoJump, 29, 0.5, 0.5, 'red', 'orange', 1);
        
        //key
        this.keyIcon = customMethods.newSprite(this.game.width*0.32, this.jumpIcon.y + textIconOffset/2.2, 'key');
        this.keyIcon.scale.setTo(0.2);
        //key text
        this.infoKey = customMethods.newText(this.keyIcon.x + textIconOffset *1.7, this.keyIcon.y, infoKey, 29, 0.5, 0.5, 'red', 'orange', 1);
        
        //door
        this.doorIcon = customMethods.newSprite(this.game.width*0.37, this.keyIcon.y + textIconOffset/2.2, 'door');
        this.doorIcon.scale.setTo(0.1);
        //door text
        this.infoDoor = customMethods.newText(this.doorIcon.x + textIconOffset*1.2, this.doorIcon.y, infoDoor, 29, 0.5, 0.5, 'red', 'orange', 1);
        
        //'Powrót' button
        this.backButton = customMethods.newButton(this.game.width*0.5, this.game.height - offset*1.5, 'Button', function(){this.switchWindow(0);}, this, true, function(){this.playSound(this.buttonClickedSound);}, function(){this.playSound(this.buttonSelectedSound);}, 0.5, 0);
        
        //'Powrót' button text
        this.backText = customMethods.newText(this.backButton.x, this.backButton.y+52, back, 30, 0.5, 0.5, 'red', 'orange', 2);
    },
    
    playSound: function(sound)
    {
        sound.play();
    },
    
      stopSound: function(sound)
    {
        sound.stop();
    },
    
    switchWindow: function(id)
    {
        this.mainMenu.setAll('visible', id===0);
        this.settingsMenu.setAll('visible', id===1);
        this.infoStars.visible = this.infoJump.visible = this.infoKey.visible = this.infoDoor.visible = (id===2);
        this.starIcon.visible = this.jumpIcon.visible = this.keyIcon.visible = this.doorIcon.visible = (id===2);
        this.backButton.visible = this.backText.visible = (id!=0);
    },

    loadProgress: function()
    {
        var config = JSON.parse(localStorage.getItem('this.saveConfig'));
        this.state.start('Poziom ' + config.levelNumber, true, false, config.starsCount);
        this.stopSound(this.menuMusic);
    },
    
    resetProgress: function()
    {
        localStorage.removeItem('this.saveConfig')
    }
};