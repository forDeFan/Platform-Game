'use strict'; 

var Platformowa = Platformowa || {}; 

Platformowa.lvl4 = function(game) {};

Platformowa.lvl4.prototype = 
{   
    init: function(starsCollected)
    {
        //level no
        this.levelNumber = 4;
        
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
        this.map = this.add.tilemap('lvl4');
        
        //Map resources adding
        this.map.addTilesetImage('tiles', 'ground');
        this.map.addTilesetImage('spikes', 'spikes');
        this.map.addTilesetImage('water', 'water');
        this.map.addTilesetImage('arrow', 'arrow');
        this.map.addTilesetImage('starGold', 'star');
        this.map.addTilesetImage('door', 'door');
        this.map.addTilesetImage('key', 'key');
    },
    
    create: function()
    {
        //hero
        this.hero = new Hero(this.game, 10, 20, 'hero', 0.6, 0);
        gmMan.hero = this.hero;
        
        //enemy
        this.enemy1 = new Enemy(this.game, 1200, 510, 'enemy', 1.4, 8);
        gmMan.enemy1 = this.enemy1;
        
        this.enemy2 = new Enemy(this.game, 1420, 510, 'enemy', 1.4, 8);
        gmMan.enemy2 = this.enemy2;
        
        this.enemy3 = new Enemy(this.game, 1650, 510, 'enemy', 1.4, 8);
        gmMan.enemy3 = this.enemy3;
        
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
        this.crate = this.add.physicsGroup();
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
        this.spikes = this.map.createFromObjects('Objects', 67, 'spikes', 0, true, false, this.spike, Obstacle, true, false);
        this.waters = this.map.createFromObjects('Objects', 65, 'water', 0, true, false, this.water, Obstacle, true, false);
        this.stars = this.map.createFromObjects('Objects', 70, 'star', 0, true, false, this.star, Bonus, true, false);
        this.crates = this.map.createFromObjects('Objects', 66, 'crate', 0, true, false, this.crate, Bonus, true, false);
        
        //TODO usunąć obiekt z grupy i dodac mu fizyke
        this.doors = this.map.createFromObjects('Objects', 68, 'door', 0, true, false, this.door, Obstacle, true, false);
        //condition for open door for next level
        this.keys = this.map.createFromObjects('Objects', 69, 'key', 0, true, false, this.key, Bonus, true, false);
        
        
        //custom objects - spring
        this.spring1 = this.game.add.sprite(260, 460, 'spring');
        uiMan.spring1 = this.spring1;
        uiMan.springer(this.spring1);
        
        this.spring2 = this.game.add.sprite(2070, 460, 'spring');
        uiMan.spring2 = this.spring2;
        uiMan.springer(this.spring2);
        
        this.spring3 = this.game.add.sprite(2775, 460, 'spring');
        uiMan.spring3 = this.spring3;
        uiMan.springer(this.spring3);
        
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
        if(this.enemy1.body.x <= 800)
        {
            this.enemy1.body.velocity.x *= -1;
            this.enemy1.animations.play('turnRight');
            this.enemy1.animations.play('right');
        }
        if(this.enemy1.body.x >= 1715)
        {
            this.enemy1.body.velocity.x *= -1;
            this.enemy1.animations.play('turnLeft');
            this.enemy1.animations.play('left');
        }
        if(this.enemy2.body.x <= 800)
        {
            this.enemy2.body.velocity.x *= -1;
            this.enemy2.animations.play('turnRight');
            this.enemy2.animations.play('right');
        }
        if(this.enemy2.body.x >= 1715)
        {
            this.enemy2.body.velocity.x *= -1;
            this.enemy2.animations.play('turnLeft');
            this.enemy2.animations.play('left');
        }
        if(this.enemy3.body.x <= 800)
        {
            this.enemy3.body.velocity.x *= -1;
            this.enemy3.animations.play('turnRight');
            this.enemy3.animations.play('right');
        }
        if(this.enemy3.body.x >= 1715)
        {
            this.enemy3.body.velocity.x *= -1;
            this.enemy3.animations.play('turnLeft');
            this.enemy3.animations.play('left');
        }
        
        //general map collisions
        this.game.physics.arcade.collide([this.enemy1, this.enemy2, this.enemy3, this.hero], this.groundLayer);
        
        //objects collisions
        this.game.physics.arcade.collide(this.hero, this.spike, this.identifyObstacle, null, this);
        this.game.physics.arcade.collide(this.hero, this.water, this.identifyObstacle, null, this);
        this.game.physics.arcade.collide(this.hero, this.platforms);
        this.game.physics.arcade.collide(this.groundLayer, this.spring);
        this.game.physics.arcade.collide(this.hero, [this.spring1, this.spring2, this.spring3], this.updateSpring, null, this);
        this.game.physics.arcade.collide(this.hero, this.crate, this.identifyBonus, null, this);
        
        //objects overlaps
        this.game.physics.arcade.overlap(this.hero, this.key, this.identifyBonus, null, this);
        this.game.physics.arcade.overlap(this.hero, this.heart, this.identifyBonus, null, this);
        this.game.physics.arcade.overlap(this.hero, this.door, this.nextLvl, null, this);
        this.game.physics.arcade.overlap(this.hero, this.arrow, this.identifyBonus, null, this);
    
        //bonuses overlaps
        this.game.physics.arcade.overlap(this.hero, this.jump, this.identifyBonus, null, this);
        this.game.physics.arcade.overlap(this.hero, this.star, this.identifyBonus, null, this);
        
        //enemy collisions
        this.game.physics.arcade.collide([this.enemy1, this.enemy2, this.enemy3], this.hero, this.collideEnemy, null, this);

    },
    
    //Identify for interaction called in update
    identifyObstacle: function(a, b)
    {
        b.jumpHeroObstacle(a);
    },
    
     updateSpring: function(a, b)
    {
        uiMan.updatedSpring(b);
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
        //this.game.debug.body(this.enemy1);
        //this.game.debug.body(this.enemy2);
        //this.game.debug.body(this.enemy3);
        //this.game.debug.bodyInfo(this.hero, 5, 5);
        //this.game.debug.bodyInfo(this.enemy1, 300, 300);
        //this.game.debug.bodyInfo(this.enemy2, 300, 500);
        //this.game.debug.bodyInfo(this.enemy3, 300, 700);
    }
    
};