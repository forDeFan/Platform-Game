'use strict'; 

var Platformowa = Platformowa || {}; 

Platformowa.lvl5 = function(game) {};

Platformowa.lvl5.prototype = 
{   
    init: function(starsCollected)
    {
        //level no
        this.levelNumber = 'Finałowy !';
        
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
        this.hero = new Hero(this.game, 10, 400, 'hero', 0.6, 0);
        gmMan.hero = this.hero;
        
        //enemy - boss
        this.boss = new Enemy(this.game, 1130, 180, 'boss', 3, 8);
        this.boss.body.gravity.y = 0;
        this.boss.body.setSize(90, 70, 15, 40);
        this.boss.health = 20;
        this.boss.maxHealth = this.boss.health;
        
        //boss fly mode by tween
        this.bossTween = this.game.add.tween(this.boss).to({y: this.game.height * 0.45}, 800, Phaser.Easing.Linear.None, true);
        this.bossTween.yoyo(900, true).loop(true);
        
        //showing enemy actual hitpoints abowe health bar
        this.HPcounter = customMethods.newText(0, -40, this.boss.health, 8, 0.5, 0.5, 'center', 'orange', 'black', 0.1);
        
        //enemy health bar
        this.emptyHB = customMethods.newSprite(-25, -35, 'healthBar', 0, 0, 0, 0.2, 0.1);
        this.fullHB = customMethods.newSprite(this.emptyHB.x, this.emptyHB.y, 'healthBar', 1, 0, 0, 0.2, 0.1);
        this.rectHB = new Phaser.Rectangle(0, 0, this.emptyHB.width / this.emptyHB.scale.x, this.emptyHB.height / this.emptyHB.scale.y);
        
        //health bar hidden until hero pick up blue bullet
        this.emptyHB.alpha = this.fullHB.alpha = this.rectHB.alpha = this.HPcounter.alpha = 0;
        
        //attaching HB to boss for tracking
        this.boss.addChild(this.emptyHB);
        this.boss.addChild(this.fullHB);
        this.boss.addChild(this.HPcounter);
        
        //hero bullets
        this.bullets = this.add.group();
        this.heroB = this.add.weapon(86, 'bullet', 70, this.bullets)
        this.heroB.bulletGravity.y = 0;
        this.heroB.bulletSpeed = 600;
        this.heroB.fireRate = 1000;
        this.heroB.trackSprite(gmMan.hero, 0, -40, false);
        this.heroB.autofire = false;
        this.heroB.bulletKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS;
        
        //boss bombs
        this.bombs = this.add.group();
        this.bossBombs = this.add.weapon(86, 'bullet', 20, this.bombs)
        this.bossBombs.bulletGravity.y = 500;
        this.bossBombs.bulletSpeed = 300;
        this.bossBombs.bulletSpeedVariance = 100;
        this.bossBombs.fireRate = 1200;
        this.bossBombs.fireRateVariance = 200;
        this.bossBombs.trackSprite(this.boss, -80, -20, false);
        this.bossBombs.autofire = true;
        this.bossBombs.bulletKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS;
        
        //boss bullets
        this.bossB = this.add.group();
        this.bossB = this.add.weapon(86, 'bullet', 50, this.bullets)
        this.bossB.bulletGravity.y = 50;
        this.bossB.bulletSpeed = 600;
        this.bossB.bulletSpeedVariance = 100;
        this.bossB.fireRate = 2200;
        this.bossB.fireRateVariance = 400;
        this.bossB.trackSprite(this.boss, 0, -40, false);
        this.bossB.autofire = false;
        this.bossB.bulletKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS;
        
        //ammo pickup to start shooting
        this.ammo = customMethods.newSprite(900, 500, 'bullet', 70);
        this.game.physics.arcade.enable(this.ammo);
        this.ammo.enableBody = true;
        this.ammoTween = this.game.add.tween(this.ammo).to({y: this.ammo.y/0.9}, 800, Phaser.Easing.Linear.None, true);
        this.ammoTween.yoyo(900, true).loop(true);
        
        //weapon sounds
        this.heroShotSound = this.game.add.audio('buttonSelect');
        this.bossShotSound = this.game.add.audio('buttonClick');
        this.bossBombSound = this.game.add.audio('starCollected');
        
        this.heroB.onFire.add(function()
        {
            this.heroShotSound.play('', 0, 0.06, false, true);
            
        }, this);
        
        this.bossB.onFire.add(function()
        {
            this.bossShotSound.play('', 0, 0.06, false, true);
            
        }, this);
        
        this.bossBombs.onFire.add(function()
        {
            this.bossBombSound.play('', 0, 0.06, false, true);
            
        }, this);
        
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
        //hp counter text for boss healthbar react for decreasing HP
        this.HPcounter.text = this.boss.health;
        
        //conditions at boss death
        if(this.boss.dead)
        {
            //hiding boss healtbar at geath
            this.emptyHB.visible = this.fullHB.visible = this.rectHB.visible = this.HPcounter.visible = false;
          
            //boss fly tween stop at death
            this.bossTween.stop();
            
            //rolling boss out of the scene in tween
            this.game.add.tween(this.boss.scale).to({ x:0.01, y:0.01}, 1500, Phaser.Easing.Linear.None, true);
            this.boss.angle += 4;
            
            //stopping boss and hero shoot
            this.heroB.autofire = this.bossBombs.autofire = this.bossB.autofire = false;
            this.hero.bulletFetched = false;
            
            //all bullest and bombs destroyed
            this.bullets.destroy();
            this.bombs.destroy();
            
            //winning text show up
            uiMan.eventTextShow('ZWYCIĘSTWO !', this.game.width * 0.5, (this.game.height * 0.5) - 10, 80, 900, 1000);
            
            //showing of Game Over state
            this.game.time.events.add(7000, function() 
            {      
                this.state.start('gameOver', true, false);
            }, this);
        }
        
        //hero bullet pick up action
        if(gmMan.hero.bulletFetched)
        {
            //bullet shot by boss toward hero
            this.bossB.fireAtSprite(gmMan.hero);
            
            //bullet shot by hero toward boss aiming on mouse pointer
            this.heroB.fireAtPointer();
            
            this.heroB.autofire = true;
            this.bossB.autofire = true;
            
            //boss health bar go visible
            this.emptyHB.alpha = this.fullHB.alpha = this.rectHB.alpha = this.HPcounter.alpha = 0.4;
        }
    
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
        this.game.physics.arcade.collide([this.boss, gmMan.hero], this.groundLayer);
        
        //enemy collisions
        this.game.physics.arcade.collide(this.boss, gmMan.hero, this.collideEnemy, null, this);
        
        //bullets and bombs collisions/ overlaps
        this.game.physics.arcade.overlap(this.ammo, gmMan.hero, this.bulletFetch, null, this);
        this.game.physics.arcade.collide([this.bossBombs.bullets, this.bossB.bullets, this.heroB.bullets], this.groundLayer, this.bulletObstacle, null, this);
        this.game.physics.arcade.overlap(this.bossB.bullets, gmMan.hero, this.heroCollideBullet, null, this);
        this.game.physics.arcade.overlap(this.bossBombs.bullets, gmMan.hero, this.heroCollideBomb, null, this);
        this.game.physics.arcade.overlap(this.heroB.bullets, this.boss, this.enemyCollideBullet, null, this);
    },
    
    //Identify for interaction called in update
    collideEnemy: function(a, b)
    {
        b.dead(a);
        a.attack(b);
    },
    
    bulletFetch: function(a, b)
    {
        a.kill();
        this.hero.bulletFetched = true;
    },
    
    //when bullet or bomb hit ground or world bounds
    bulletObstacle: function(a, b)
    {
        a.kill();
    },
    
    heroCollideBomb: function(a, b)
    {
        b.kill();
        
        this.bombHit = this.boss.dmgRate * 2;
        gmMan.hero.health = a.health - this.bombHit;
        
        //hero damage amount shown on hit
        this.heroLifetText = uiMan.hitpointsText(gmMan.hero.x, gmMan.hero.y - 60, '- ' + this.bombHit + ' HP', 20, 'red', 'orange', 1, 100, 400);
    },
    
    heroCollideBullet: function(a, b)
    {
        b.kill();
        this.bulletbHit = this.boss.dmgRate * 2.5;
        gmMan.hero.health = a.health - this.bulletbHit;
        
        //hero damage amount shown on hit
        this.heroLifetText = uiMan.hitpointsText(gmMan.hero.x, gmMan.hero.y - 60, '- ' + this.bulletbHit + ' HP', 20, 'red', 'orange', 1, 100, 400);
    },
    
    enemyCollideBullet: function(a, b)
    {
        b.kill();
        this.boss.health = a.health - gmMan.hero.dmgRate;
        
        this.rectHB.width = Math.floor((this.boss.health/ this.boss.maxHealth) * this.emptyHB.width / this.emptyHB.scale.x);
        this.fullHB.crop(this.rectHB);
        
        //boss damage amount text shown on hit
        this.bossLifetText = uiMan.hitpointsText(this.boss.x, this.boss.y - 60, '- ' + gmMan.hero.dmgRate + ' HP', 25, 'red', 'orange', 1, 100, 400);
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