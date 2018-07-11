'use strict'; 

var Platformowa = Platformowa || {}; 

Platformowa.lvl3 = function(game) {};

Platformowa.lvl3.prototype = 
{   
    init: function(starsCollected)
    {
        //level no
        this.levelNumber = 3;
        
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
        this.map = this.add.tilemap('lvl3');
        
        //Map resources adding
        this.map.addTilesetImage('tiles', 'ground');
        this.map.addTilesetImage('spikes', 'spikes');
        this.map.addTilesetImage('water', 'water');
        this.map.addTilesetImage('arrow', 'arrow');
        //this.map.addTilesetImage('starGold', 'star');
        this.map.addTilesetImage('door', 'door');
        //this.map.addTilesetImage('jump', 'jump');
        this.map.addTilesetImage('key', 'key');
    },
    
    create: function()
    {
        //hero
        this.hero = new Hero(this.game, 3260, 20, 'hero', 0.6, 0);
        gmMan.hero = this.hero;
        
        //enemy
        //this.enemy = new Enemy(this.game, 2795, 445, 'enemy', 1.4, 8);
        //gmMan.enemy = this.enemy;
        
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
        this.arrow = this.add.physicsGroup();
        this.liane = this.add.physicsGroup();
    
        //sending instance to gmMan to change door alpha in bonus when key collected
        gmMan.door = this.door;
        this.door.alpha = 0.1;
        
        //effect on key
        var keyTween = this.game.add.tween(this.key).to({y: -10}, 800, Phaser.Easing.Linear.None, true);
        keyTween.yoyo(900, true).loop(true);
        
        //Objects on map
        this.spikes = this.map.createFromObjects('Objects', 67, 'spikes', 0, true, false, this.spike, Obstacle, true, false);
        this.waters = this.map.createFromObjects('Objects', 66, 'water', 0, true, false, this.water, Obstacle, true, false);
        //this.stars = this.map.createFromObjects('Objects', 71, 'star', 0, true, false, this.star, Bonus, true, false);
        //this.jumps = this.map.createFromObjects('Objects', 74, 'jump', 0, true, false, this.jump, Bonus, true, false);
        
        //TODO usunąć obiekt z grupy i dodac mu fizyke
        this.doors = this.map.createFromObjects('Objects', 65, 'door', 0, true, false, this.door, Obstacle, true, false);
        this.arrows = this.map.createFromObjects('Objects', 69, 'arrow', 0, true, false, this.arrow, Bonus, true, false);
        //condition for open door for next level
        this.keys = this.map.createFromObjects('Objects', 68, 'key', 0, true, false, this.key, Bonus, true, false);
       
        //Flying platforms
        this.platforms = this.add.physicsGroup();
        
        this.platform1 = this.platforms.create(1105, 520, 'platform');
        this.platform2 = this.platforms.create(2500, 490, 'platform');
        this.platform3 = this.platforms.create(4000, 480, 'platform');
        
        this.platforms.setAll('body.collideWorldBounds', true);
        this.platforms.setAll('body.bounce.x', 1);
        this.platforms.setAll('body.immovable', true);
        
        this.platform1.scale.setTo(0.5);
        this.platform2.scale.setTo(0.5);
        this.platform3.scale.setTo(0.5);
        this.platform1.body.velocity.x = 100;
        this.platform2.body.velocity.x = 100;
        this.platform3.body.velocity.x = 100;
        
        //Bubbles
        this.bubbles = this.add.physicsGroup();
        
        this.bubble1 = this.bubbles.create(3235, 400, 'bubble');
        this.bubble1.body.setSize(100, 70, 50, 45);
        this.bubble1.animations.add('fly', [0,0,0,0,0,0,0,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19, 20], 30, true);
        
        this.game.time.events.add(1000, function() {  
            
            this.bubble1.animations.play('fly');
            this.bubble1Tween = this.game.add.tween(this.bubble1).to({y: 250}, 2600, Phaser.Easing.Linear.None, true).loop(true);
            
        ;}, this);
        
        this.bubble2 = this.bubbles.create(3490, 400, 'bubble');
        this.bubble2.body.setSize(100, 70, 50, 45);
        this.bubble2.animations.add('fly', [0,0,0,0,0,0,0,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19, 20], 30, true);
        this.bubble2.animations.play('fly');
        
        this.bubble2Tween = this.game.add.tween(this.bubble2).to({y: 250}, 2600, Phaser.Easing.Linear.None, true).loop(true);
        
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
        /*
        //Enemy animations update
        if(this.enemy.body.x <= 2355)
        {
            this.enemy.body.velocity.x *= -1;
            this.enemy.animations.play('turnRight');
            this.enemy.animations.play('right');
        }
        if(this.enemy.body.x >= 2800)
        {
            this.enemy.body.velocity.x *= -1;
            this.enemy.animations.play('turnLeft');
            this.enemy.animations.play('left');
        }
        */
    
        //general map collisions
        this.game.physics.arcade.collide([this.enemy, this.hero, this.platforms], this.groundLayer);
        
        //objects collisions
        this.game.physics.arcade.collide(this.hero, this.spike, this.identifyObstacle, null, this);
        this.game.physics.arcade.collide(this.hero, this.water, this.identifyObstacle, null, this);
        this.game.physics.arcade.collide(this.hero, this.platforms);
        this.game.physics.arcade.collide(this.groundLayer, this.spring);
        this.game.physics.arcade.collide(this.hero, this.spring, this.updateSpring, null, this);
        this.game.physics.arcade.collide(this.hero, this.bubbles, this.bubbleCollide, null, this);
        
        //objects overlaps
        this.game.physics.arcade.overlap(this.hero, this.key, this.identifyBonus, null, this);
        this.game.physics.arcade.overlap(this.hero, this.heart, this.identifyBonus, null, this);
        this.game.physics.arcade.overlap(this.hero, this.door, this.nextLvl, null, this);
        this.game.physics.arcade.overlap(this.hero, this.arrow, this.identifyBonus, null, this);
    
        //bonuses overlaps
        this.game.physics.arcade.overlap(this.hero, this.jump, this.identifyBonus, null, this);
        this.game.physics.arcade.overlap(this.hero, this.star, this.identifyBonus, null, this);
        
        //enemy collisions
        this.game.physics.arcade.collide(this.enemy, this.hero, this.collideEnemy, null, this);

    },
    
    //collision with bubbles
    bubbleCollide: function()
    {
        
    },
    
    //Identify for interaction called in update
    identifyObstacle: function(a, b)
    {
        b.jumpHeroObstacle(a);
    },
    
     updateSpring: function()
    {
        uiMan.updatedSpring();
        this.springJump = this.game.add.audio('springJump');
        this.springJump.play('', 0, 0.1, false, true);
    },
    
    identifyBonus: function(a, b)
    {
        b.jumpHeroBonus(a);
        this.count = this.star.countDead() + this.starsCollected;
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
        //this.game.debug.body(this.liane1);
        //this.game.debug.body(this.bubble1);
        //this.game.debug.body(this.bubble2);
        //this.game.debug.body(this.enemy);
        //this.game.debug.bodyInfo(this.hero, 5, 5);
        //this.game.debug.bodyInfo(this.liane1, 5, 5);
        //this.game.debug.bodyInfo(this.enemy, 300, 300);
    }
    
};