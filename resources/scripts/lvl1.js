'use strict'; 

var Platformowa = Platformowa || {}; 

Platformowa.lvl1 = function(game) {};

Platformowa.lvl1.prototype = 
{   
    init: function()
    {
        //param about finished level number passed to next state for splash screen info text
        this.levelNumber = 1;
        
        //Stars counter starts from 0
        this.starsCollected = 0;
        uiMan.starsCollected = this.starsCollected;
    },
    
    preload: function()
    {   
        //Background
        uiMan.levelBackground();
        
        //initial setUps in gmMan
        gmMan.setUp();
        
        //Map adding
        this.map = this.add.tilemap('lvl1');
        
        //Map resources adding
        this.map.addTilesetImage('tiles', 'ground');
        this.map.addTilesetImage('spikes', 'spikes');
        this.map.addTilesetImage('water', 'water');
        this.map.addTilesetImage('ArrowSign', 'arrow');
        this.map.addTilesetImage('starGold', 'star');
        this.map.addTilesetImage('door', 'door');
        this.map.addTilesetImage('jump', 'jump');
        this.map.addTilesetImage('key', 'key');
    },
    
    create: function()
    {
        //hero
        this.hero = new Hero(this.game, 50, 20, 'hero', 0.6, 0);
        gmMan.hero = this.hero;
        
        //enemy
        this.enemy = new Enemy(this.game, 600, 460, 'enemy', 1.4, 8);
        gmMan.enemy = this.enemy;
        
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
        
        //Groups for objects on map - called in Objects for interaction
        this.star = this.add.physicsGroup();
        this.spike = this.add.physicsGroup();
        this.water = this.add.physicsGroup();
        this.jump = this.add.physicsGroup();
        this.door = this.add.physicsGroup();
        this.key = this.add.physicsGroup();
        
        //sending instance to gmMan to change door alpha in bonus when key collected
        gmMan.door = this.door;
        this.door.alpha = 0.1;
        
        //effect on key
        var keyTween = this.game.add.tween(this.key).to({y: -10}, 800, Phaser.Easing.Linear.None, true);
        keyTween.yoyo(900, true).loop(true);
        
        //Objects on map
        this.spikes = this.map.createFromObjects('Objects', 65, 'spikes', 0, true, false, this.spike, Obstacle, true, false);
        this.waters = this.map.createFromObjects('Objects', 66, 'water', 0, true, false, this.water, Obstacle, true, false);
        this.stars = this.map.createFromObjects('Objects', 67, 'star', 0, true, false, this.star, Bonus, true, false);
        this.jumps = this.map.createFromObjects('Objects', 70, 'jump', 0, true, false, this.jump, Bonus, true, false);
        
        //TODO usunąć obiekt z grupy i dodac mu fizyke
        this.doors = this.map.createFromObjects('Objects', 69, 'door', 0, true, false, this.door, Obstacle, true, false);
        //condition for open door for next level
        this.keys = this.map.createFromObjects('Objects', 71, 'key', 0, true, false, this.key, Bonus, true, false);
       
        //Flying platforms
        this.platforms = this.add.physicsGroup();
        this.platform1 = this.platforms.create(1300, 580, 'platform');
        this.platforms.setAll('body.bounce.x', 1);
        this.platforms.setAll('body.immovable', true);
        this.platforms.setAll('body.collideWorldBounds', true);
      
        this.platform1.scale.setTo(0.5);
        this.platform1.body.velocity.x = 100;
        
        //music
        uiMan.playMusic();
        
        //level number text
        uiMan.levelText();
        
        //Pause Menu
        gmMan.pauseMenu();
        
        //Key menu for pause
        uiMan.keyMenu();
        
        //custom objects - spring
        this.spring = this.game.add.sprite(2115, 455, 'spring');
        uiMan.spring = this.spring;
        uiMan.springer();
    },
    
    update: function()
    {
        //Enemy animations update
        if(this.enemy.body.x <= 375)
        {
            //when enemy reach certain point he turn back
            this.enemy.body.velocity.x *= -1;
            this.enemy.animations.play('turnRight');
            this.enemy.animations.play('right');
        }
        if(this.enemy.body.x >= 580)
        {
            this.enemy.animations.play('turnLeft');
            this.enemy.animations.play('left');
        }
        
        //general map collisions
        this.game.physics.arcade.collide([this.enemy, this.hero, this.platforms], this.groundLayer);
        
        //objects collisions
        this.game.physics.arcade.collide(this.hero, this.spike, this.identifyObstacle, null, this);
        this.game.physics.arcade.collide(this.hero, this.water, this.identifyObstacle, null, this);
        this.game.physics.arcade.collide(this.hero, this.platforms);
        this.game.physics.arcade.collide(this.groundLayer, this.spring);
        this.game.physics.arcade.collide(this.hero, this.spring, this.updateSpring, null, this);
        
        //objects overlaps
        this.game.physics.arcade.overlap(this.hero, this.key, this.identifyBonus , null, this);
        this.game.physics.arcade.overlap(this.hero, this.door, this.nextLvl, null, this);
    
        //bonuses overlaps
        this.game.physics.arcade.overlap(this.hero, this.jump, this.identifyBonus, null, this);
        this.game.physics.arcade.overlap(this.hero, this.star, this.identifyBonus, null, this);
        
        //enemy collisions
        this.game.physics.arcade.collide(this.enemy, this.hero, this.collideEnemy, null, this);
    },
    
    identifyObstacle: function(a, b)
    {
        b.jumpHeroObstacle(a);
    },
    
    updateSpring: function()
    {
        uiMan.updatedSpring();
    },
    
    identifyBonus: function(a, b)
    {
        b.jumpHeroBonus(a);
        this.count = this.star.countDead();
        uiMan.starText.setText(this.count);
    },
    
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
        //this.game.debug.body(this.enemy);
        //this.game.debug.body(this.spring);
        //this.game.debug.bodyInfo(this.hero, 5, 5);
        //this.game.debug.bodyInfo(this.enemy, 300, 300);
        //this.game.debug.bodyInfo(this.spring, 300, 300);        
    }
};