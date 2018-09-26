'use strict'; 

var Platformowa = Platformowa || {}; 

Platformowa.lvl5 = function(game) {};

Platformowa.lvl5.prototype = 
{   
    init: function(starsCollected)
    {
        //level no
        this.levelNumber = 5;
        
        //initial setup for stars with collected from last level
        this.starsCollected = starsCollected;
        uiMan.starsCollected = this.starsCollected;  
            
        //JSON saving config for game load
        this.saveConfig = 
        {
            levelNumber: this.levelNumber,
            starsCount: this.starsCollected,
        }
        //JSON stingify for loading in next level
        localStorage.setItem('this.saveConfig', JSON.stringify(this.saveConfig));
    },
    
    preload: function()
    {
        //Background
        uiMan.levelBackground();
        
        //initial setUps in gmMan
        gmMan.setUp();
        
        //Map adding
        this.map = this.add.tilemap('lvl5');
        
        //Map resources adding
        this.map.addTilesetImage('tiles', 'ground');
    },
    
    create: function()
    {
        //hero
        this.hero = new Hero(this.game, 10, 20, 'hero', 0.6, 0);
        gmMan.hero = this.hero;
        
        //hero shot bullets
        this.heroB = this.add.group();
        this.heroB = this.add.weapon(86, 'bullet', 70, this.bullets)
        this.heroB.bulletGravity.y = 0;
        this.heroB.bulletSpeed = 600;
        this.heroB.fireRate = 1000;
        this.heroB.trackSprite(gmMan.hero, 0, -40, false);
        this.heroB.autofire = true;
        this.heroB.bulletKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS;
        
        //enemy - boss
        this.boss = new Enemy(this.game, 1130, 300, 'boss', 3, 8);
        this.boss.body.gravity.y = 0;
        this.boss.body.setSize(90, 70, 15, 40);
        
        //boss fly movement mod
        var bossTween = this.game.add.tween(this.boss).to({y: 160}, 800, Phaser.Easing.Linear.None, true);
        bossTween.yoyo(900, true).loop(true);
        
        //boss dropping bombs
        this.bombs = this.add.group();
        this.wBombs = this.add.weapon(86, 'bullet', 20, this.bombs)
        this.wBombs.bulletGravity.y = 500;
        this.wBombs.bulletSpeed = 300;
        this.wBombs.bulletSpeedVariance = 100;
        this.wBombs.fireRate = 1200;
        this.wBombs.fireRateVariance = 200;
        this.wBombs.trackSprite(this.boss, -80, -20, false);
        this.wBombs.autofire = true;
        this.wBombs.bulletKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS;
        
        //boss shot bullets
        this.bossB = this.add.group();
        this.bossB = this.add.weapon(86, 'bullet', 50, this.bullets)
        this.bossB.bulletGravity.y = 50;
        this.bossB.bulletSpeed = 600;
        this.bossB.bulletSpeedVariance = 100;
        this.bossB.fireRate = 2200;
        this.bossB.fireRateVariance = 400;
        this.bossB.trackSprite(this.boss, 0, -40, false);
        this.bossB.autofire = true;
        this.bossB.bulletKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS;
        
        //Lives counter in upper left game area
        uiMan.lives = this.lives;
        uiMan.liveCount();
       
        //star counter in upper left game area
        uiMan.starCounter();
        
        //Layers for map as in Tiled
        this.groundLayer = this.map.createLayer('Ground');
        this.groundLayer.resizeWorld(); 
        this.groundLayer.immovable = true; 
        //tuning up performance in FPS on big screen by command below
        this.groundLayer.renderSettings.enableScrollDelta = false;
        
        //Colissions for map layer
        this.map.setCollisionBetween(0, 40, true, 'Ground');
        
        //music
        uiMan.playMusic();
        
        //level number text
        uiMan.levelText();
        
        //Pause Menu
        gmMan.pauseMenu();
        
        //Key menu for pause
        uiMan.keyMenu();
    },
    
    update: function()
    {
        //bullet shot by boss toward hero
        this.bossB.fireAtSprite(this.hero);
        //bullet shot by hero toward boss
        this.heroB.fireAtPointer();
        
        //Boss animations update
        if(this.boss.body.x <= 260)
        {
            this.boss.body.velocity.x *= -1;
            this.boss.animations.play('bossRight');
        }
        if(this.boss.body.x >= 1000)
        {
            this.boss.body.velocity.x *= -1;
            this.boss.animations.play('bossLeft');
        }
    
        //general map collisions
        this.game.physics.arcade.collide([this.boss, this.hero], this.groundLayer);
        this.game.physics.arcade.collide(this.weapon, this.groundLayer);
        
        //enemy collisions
        this.game.physics.arcade.collide(this.boss, this.hero, this.collideEnemy, null, this);

    },
    
    //Identify for interaction called in update
    collideEnemy: function(a, b)
    {
        b.dead(a);
        a.attack(b);
        b.damage(a);
    },
    
    nextLvl: function()
    { 
        //when hero collected the key
        if(this.hero.openDoor)
        {
            var levelNumber = this.levelNumber;
            this.starsCollected = this.count;
            var starsCollected = this.starsCollected;
            
            this.state.start('splashScreen', true, false, levelNumber, starsCollected);
        }
    },
    
    render: function()
    {
        //this.game.debug.quadTree(this.game.physics.arcade.quadTree);
        //this.game.debug.body(this.hero);
        //this.game.debug.body(this.boss);
        //this.game.debug.bodyInfo(this.hero, 5, 5);
        //this.game.debug.bodyInfo(this.boss, 300, 300);
    
    }
    
};