'use strict';

//reference to game
var src = Platformowa.game;

var uiMan = 
{
//LVL PRELOAD
    levelBackground: function()
    {
        this.background = src.add.sprite(0, 0, 'background');
        this.background.scale.setTo(2.3, 0.65);
    },
   
//LVL CREATE
    
    //Level no text
    levelText: function()
    {
        this.levelNameText = customMethods.newText(src.width * 0.5, (src.height * 0.5) - 100, src.state.current, 80, 0.5, 0.5, 'center', 'red', 'orange', 4);
        
        this.levelNameText.alpha = 0;
        src.world.bringToTop(this.levelNameText);
        
        //text appearing
        src.time.events.add(200, function() {      
        src.add.tween(this.levelNameText).to({alpha: 1}, 800, Phaser.Easing.Linear.None, true);}, this);
        
        //text  going up and vanishing
        src.time.events.add(1500, function() {   src.add.tween(this.levelNameText).to({y: 0}, 1600, Phaser.Easing.Linear.None, true);    
        src.add.tween(this.levelNameText).to({alpha: 0}, 1600, Phaser.Easing.Linear.None, true);}, this);
    },
    
    //text popup on event triggered
    eventTextShow: function(text, x, y, size, tStart, tEnd)
    {
        var eventText = customMethods.newText(x, y, text, size, 0.5, 0.5, 'center', 'red', 'orange', 2);
        
        eventText.alpha = 0;

        //text appearing
        src.time.events.add(100, function() {      
            src.add.tween(eventText).to({alpha: 1}, tStart, Phaser.Easing.Linear.None, true);
        }, this);

        //text vanishing
        src.time.events.add(1000, function() {    
            src.add.tween(eventText).to({alpha: 0}, tEnd, Phaser.Easing.Linear.None, true);
        }, this);
    },
    
    //Key menu info in right top corner of game window
    keyMenu: function()
    {
        this.pauseKey = customMethods.newText(src.width * 0.9, src.height * 0.05, '(P) auza, (F) ull Screen', 20, 0.5, 0.5, 'center', 'red', 'orange', 0.4);
        
        this.pauseKey.alpha = 0;
        src.world.bringToTop(this.pauseKey);
        this.pauseKey.fixedToCamera = true;
        
        //text appearing
        src.time.events.add(600, function() {      
        src.add.tween(this.pauseKey).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true);}, this);
    },
    
    //music in lvl, also used in Hero prototype
    playMusic: function()
    {
        this.lvlMusic = src.add.audio('lvlMusic');
        this.lvlMusic.play('', 0, 0.02, true, true );
    },
    
    stopMusic: function()
    {
        this.lvlMusic.stop();
    },
    
    //live counter
    liveCount: function()
    {
        this.lives = src.add.group();
        
        for (var i = 0; i < gmMan.hero.maxLives; i++) 
        { 
            this.lives.create(3000 + (i * 2700), 500, 'live');
            this.lives.fixedToCamera = true;
            this.lives.scale.setTo(0.02);
        }
        
        src.world.bringToTop(this.lives);
    },
    
    //collected stars counter
    starCounter: function()
    {
        this.starSymbol = customMethods.newSprite(300, 30, 'star');
        this.starSymbol.fixedToCamera = true;
        src.world.bringToTop(this.starSymbol);
      
        //text for collected stars
        this.starText = src.add.text(330, 15, this.starsCollected, { fill: '#ffffff', font: '24pt Arial' });
        this.starText.fixedToCamera = true;
        src.world.bringToTop(this.starText);
    },
    
//LVL UPDATE
    
     //lives killer 
    liveKill: function()
    {   
        this.live = uiMan.lives.getFirstAlive();
        
        if(this.live)
        {
            gmMan.hero.maxLives --;
            
            this.killTween = src.add.tween(this.live);
            this.killTween.to({alpha:0}, 500, Phaser.Easing.Linear.None);
        
            this.killTween.onComplete.addOnce(function()
            {    
                this.live.kill();

            }, this);

            this.killTween.start();
            
            return;
        }
    },
    
// CUSTOM ELEMENTS ON THE MAP

    //Spring config
    
    //sound effects for jumping on spring
    springJump: function()
    {
        this.springJump = src.add.audio('springJump');
        this.springJump.play('', 0, 0.1, false, true );
    },
    
    //reference to spring
    springer: function()
    {
        this.spring.frame = 0;
        src.physics.arcade.enable(this.spring);
        this.spring.body.moves = false;
        this.spring.body.setSize(115, 50, 6, 70);
        this.springJump = this.spring.animations.add('bounce', [1, 2 , 3, 4, 5, 6, 7, 8, 9, 10], 10 , false);
    },
    
    //player and spring colliding - started in lvl update
    updatedSpring: function()
    {
        this.springJump = src.add.audio('springJump');
        this.springJump.play('', 0, 0.1, false, true );
        
        if(this.spring.body.touching.up)
        {
            gmMan.hero.body.velocity.y -= 1600;
            this.spring.animations.play('bounce');
        }  
    },

};