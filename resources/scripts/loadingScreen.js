'use strict'; 

var Platformowa = Platformowa || {}; 

Platformowa.loadingScreen = function(game) {};

Platformowa.loadingScreen.prototype = 
{
  preload: function() 
    {        
        //Logo text on loading screen
        this.logoText = customMethods.newText(this.game.width*0.5, (this.game.height*0.5)-50, 'Go Monsters !!!', 80, 0.5, 0.5, 'center', 'red', 'orange', 2);
     
        //Loading bar
        this.emptyBar = this.add.sprite(this.game.width*0.5, (this.game.height*0.5) + 220, 'LoadingBars');
        this.fullBar = this.add.sprite(this.emptyBar.x, this.emptyBar.y, 'LoadingBars', 1);
        this.percentage = this.add.text(this.emptyBar.x, this.emptyBar.y, '0 %');
        this.percentage.addColor('white');
        
        //Loading bars positioning
        this.emptyBar.anchor.setTo(0.5);
        this.fullBar.anchor.setTo(0.5);
        this.percentage.anchor.setTo(0.5);
        
        this.load.setPreloadSprite(this.fullBar);
        
        //Audio files for menu
        this.load.audio('buttonSelect', 'resources/sound/menuSelect.wav');
        this.load.audio('buttonClick', 'resources/sound/menuClick.wav');
        
        //Audio files for music in stages
        this.load.audio('menuMusic', 'resources/sound/menuMusic.wav');
        this.load.audio('lvlMusic', 'resources/sound/lvlMusic.wav');
        this.load.audio('splashMusic', 'resources/sound/splashScreen.wav');
        
        //Audio files for sound effects used in Bonus and Obstacle
        this.load.audio('starCollected', 'resources/sound/star.wav');
        this.load.audio('bonusCollected', 'resources/sound/bonus.wav');
        this.load.audio('springJump', 'resources/sound/springJump.wav');
        //this.load.audio('openDoor', 'resources/sound/door.wav');
        
        //Audio files for Hero
        this.load.audio('heroDead', 'resources/sound/heroDead.wav');
        this.load.audio('heroJump', 'resources/sound/heroJump.wav');
        this.load.audio('heroReviwe', 'resources/sound/heroReviwe.wav');
        this.load.audio('heroGhost', 'resources/sound/heroGhost.wav');
        this.load.audio('heroHurt', 'resources/sound/heroHurt.wav');
        this.load.audio('headJump', 'resources/sound/headJump.wav');
        
        //Audio files for Enemy
        this.load.audio('enemyAttack', 'resources/sound/enemyAttack.wav');
        
        //Button image
        this.load.spritesheet('Button', 'resources/graphic/main/button.png', 300, 100, 3);
        //Background image
        this.load.image('background', 'resources/graphic/main/BG.png');
        //Lives image
        this.load.image('live', 'resources/graphic/objects/heart1.png');
        //Pause Button image
        this.load.image('pauseButton', 'resources/graphic/main/pause.png');
        //No sound button image
        this.load.image('soundButton', 'resources/graphic/main/noSound2.png');
        //Success image on splash screen
        this.load.image('successImage', 'resources/graphic/main/success.png');
        
        //Hero and enemies soritesheets
        this.load.spritesheet('enemy', 'resources/graphic/characters/enemy.png', 80, 80);
        this.load.spritesheet('hero', 'resources/graphic/characters/hero/girl.png', 171, 185.5);
        this.load.spritesheet('heroDeath', 'resources/graphic/characters/hero/ghostt.png', 32, 48);
        
        //Map upload
        this.load.tilemap('lvl1', 'resources/lvlMap/lvl1.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('lvl2', 'resources/lvlMap/lvl2.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('lvl3', 'resources/lvlMap/lvl3.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('lvl4', 'resources/lvlMap/lvl4.json', null, Phaser.Tilemap.TILED_JSON);
        
        //Map tiles
        this.load.image('ground', 'resources/graphic/tiles/tiles.png');
        
        //Map objects
        this.load.image('spikes', 'resources/graphic/objects/spikes.png');
        this.load.image('water', 'resources/graphic/objects/water.png');
        this.load.image('arrow', 'resources/graphic/objects/arrow.png');
        this.load.image('star', 'resources/graphic/objects/starGold.png');
        this.load.image('door', 'resources/graphic/objects/door.png');
        this.load.image('key', 'resources/graphic/objects/key.png');
        this.load.image('bush', 'resources/graphic/objects/bush.png');
        this.load.image('jump', 'resources/graphic/objects/gb.png');
        this.load.image('crate', 'resources/graphic/objects/Crate.png');
        
        //Custom objects on map
        this.load.image('platform', 'resources/graphic/objects/platform.png');
        this.load.image('liane', 'resources/graphic/objects/liane.png');
        this.load.spritesheet('spring', 'resources/graphic/objects/SpringSpriteSheet.png', 125, 126);
        this.load.spritesheet('bubble', 'resources/graphic/objects/bubbleSpriteSheet.png', 192, 190);
    },
    
    create: function()
    {
        this.state.start('mainMenu');
        
        //Testing purposes
        
        //this.state.start('gameOver');
        //this.state.start('Poziom 4');
    },
    
    loadUpdate: function()
    {
        this.percentage.text = this.load.progress + '%';
    }
};