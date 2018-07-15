'use strict'; 

var Platformowa = Platformowa || {}; 

Platformowa.lvl2 = function(game) {};

Platformowa.lvl2.prototype = 
{   
    init: function(starsCollected)
    {
        //level no
        this.levelNumber = 2;
        
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
        this.map = this.add.tilemap('lvl2');
        
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
        this.enemy = new Enemy(this.game, 2795, 445, 'enemy', 1.4, 8);
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
        this.liane = this.add.physicsGroup();
    
        //sending instance to gmMan to change door alpha in bonus when key collected
        gmMan.door = this.door;
        this.door.alpha = 0.1;
        
        //movement effect on key
        var keyTween = this.game.add.tween(this.key).to({y: -10}, 800, Phaser.Easing.Linear.None, true);
        keyTween.yoyo(900, true).loop(true);
        
        //Objects on map
        this.spikes = this.map.createFromObjects('Objects', 68, 'spikes', 0, true, false, this.spike, Obstacle, true, false);
        this.waters = this.map.createFromObjects('Objects', 67, 'water', 0, true, false, this.water, Obstacle, true, false);
        this.stars = this.map.createFromObjects('Objects', 70, 'star', 0, true, false, this.star, Bonus, true, false);
        this.jumps = this.map.createFromObjects('Objects', 73, 'jump', 0, true, false, this.jump, Bonus, true, false);
        this.lianes = this.map.createFromObjects('Objects', 75, 'liane', 0, true, false, this.liane, Obstacle, true, false);
        
        //TODO usunąć obiekt z grupy i dodac mu fizyke
        this.doors = this.map.createFromObjects('Objects', 66, 'door', 0, true, false, this.door, Obstacle, true, false);
        //condition for open door for next level
        this.keys = this.map.createFromObjects('Objects', 71, 'key', 0, true, false, this.key, Bonus, true, false);
       
        //Flying platforms
        this.platforms = this.add.physicsGroup();
        
        this.platform1 = this.platforms.create(1485, 390, 'platform');
        this.platform2 = this.platforms.create(1100, 560, 'platform');
        
        this.platforms.setAll('body.collideWorldBounds', true);
        this.platforms.setAll('body.bounce.x', 1);
        this.platforms.setAll('body.immovable', true);
        
        this.platform1.scale.setTo(0.5);
        this.platform2.scale.setTo(0.5);
        this.platform1.body.velocity.x = 100;
        this.platform2.body.velocity.x = 100;
        
        //custom objects - spring
        this.spring = this.game.add.sprite(1605, 400, 'spring');
        uiMan.spring = this.spring;
        uiMan.springer();
        
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
    
        //general map collisions
        this.game.physics.arcade.collide([this.enemy, this.hero, this.platforms], this.groundLayer);
        
        //objects collisions
        this.game.physics.arcade.collide(this.hero, this.spike, this.identifyObstacle, null, this);
        this.game.physics.arcade.collide(this.hero, this.water, this.identifyObstacle, null, this);
        this.game.physics.arcade.collide(this.hero, this.platforms);
        this.game.physics.arcade.collide(this.groundLayer, this.spring);
        this.game.physics.arcade.collide(this.hero, this.spring, this.updateSpring, null, this);
        
        //objects overlaps
        this.game.physics.arcade.overlap(this.hero, this.key, this.identifyBonus, null, this);
        this.game.physics.arcade.overlap(this.hero, this.heart, this.identifyBonus, null, this);
        this.game.physics.arcade.overlap(this.hero, this.door, this.nextLvl, null, this);
    
        //bonuses overlaps
        this.game.physics.arcade.overlap(this.hero, this.jump, this.identifyBonus, null, this);
        this.game.physics.arcade.overlap(this.hero, this.star, this.identifyBonus, null, this);
        
        //enemy collisions
        this.game.physics.arcade.collide(this.enemy, this.hero, this.collideEnemy, null, this);
        
        //just a test for lianes
        this.game.physics.arcade.overlap(this.hero, this.liane, this.jumpOnLiane, null, this);
    },
    
    //function to jump on liane
    jumpOnLiane: function()
    {
        if(gmMan.hero.climbing)
        {
           gmMan.hero.climbing = !gmMan.hero.climbing;
        }        
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
        this.springJump.play('', 0, 0.1, false, true );
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
            var starsCollected = this.count;
            
            this.state.start('splashScreen', true, false, levelNumber, starsCollected);
        }
    },
    
    render: function()
    {
        //this.game.debug.quadTree(this.game.physics.arcade.quadTree);
        //this.game.debug.body(this.hero);
        //this.game.debug.body(this.liane1);
        //this.game.debug.body(this.enemy);
        //this.game.debug.bodyInfo(this.hero, 5, 5);
        //this.game.debug.bodyInfo(this.liane1, 5, 5);
        //this.game.debug.bodyInfo(this.enemy, 300, 300);
    }
    
};