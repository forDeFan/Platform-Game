'use strict';

var Hero = function(game, x, y, typeImg, scale, frame)
{
    Phaser.Sprite.call(this, game, x, y, typeImg);
    game.add.existing(this);
    this.anchor.setTo(0.5, 0.5);
    game.physics.enable(this);
    this.body.gravity.y = 1000;
    this.body.collideWorldBounds = true;
    this.cursors = game.input.keyboard.createCursorKeys();
    this.scale.setTo(scale);
    this.frame = frame;
    
    //Camera following Hero
    game.camera.follow(this, Phaser.Camera.FOLLOW_LOCKON, 0.2, 0.2);
    
    //Space for jumps
    this.jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    
    //Hero stats
    this.maxLives = 3;
    this.health = 100;
    this.openDoor = false;
    this.hurt = false;
    this.climbing = false;
    
    //Hero body size for collisions
    this.body.setSize(60, 160, 40, 20);
    
    //Hero move animations
    this.animations.add('left', [6,7,8,9], 10, true);
    this.animations.add('right', [0,1,2,3,4], 10, true);
    this.animations.add('jump', [11], 2, true);
    this.animations.add('jumpLeft', [16], 2, true);
    this.animations.add('jumpRight', [12], 2, true);
    
    //Hero death animations
    this.death = customMethods.newSprite(0, 0, 'heroDeath', 0.5, 0.5, 5.5, 2.5, true);
    this.death.animations.add('death', [0,1,2], 10, true);
    this.death.visible = false;

    //sounds
    this.heroDead = this.game.add.audio('heroDead');
    this.heroJump = this.game.add.audio('heroJump');
    this.heroHurt = this.game.add.audio('heroHurt');
    this.headJump = this.game.add.audio('headJump');
    this.heroReviwe = this.game.add.audio('heroReviwe');
    this.heroGhost = this.game.add.audio('heroGhost');
};

Hero.prototype = Object.create(Phaser.Sprite.prototype);
Hero.prototype.constructor = Hero;

Hero.prototype.dead = function(Enemy)
{
    if(Enemy.body.touching.left && this.body.touching.right || Enemy.body.touching.right && this.body.touching.left)
    {
        this.heroHurt.play('', 0 , 0.05, false, true);
        this.hurt = true;
        this.alpha = 0;
        
        Enemy.body.velocity.x = 0;
        
        this.death.visible = true;
        this.death.x = this.x;
        this.death.y = this.y + this.height*2;
        this.death.play('death');
        
        this.heroGhost.play('', 0 , 0.05, false, true);
        
        uiMan.liveKill();
        
        this.killTween = this.game.add.tween(this.death);
        this.killTween.to({y:5}, 1500, Phaser.Easing.Linear.None);
        
        this.killTween.onComplete.addOnce(function()
        {    
            this.death.visible = false;
            
            this.hurt = false;
            this.alpha = 1;
            //spawning hero at the beggining of the map
            this.x = 50;
            this.y = 10;
            
            Enemy.body.velocity.x = 100;
            
            this.heroReviwe.play('', 0 , 0.05, false, true);
            
        }, this);
        
        this.killTween.start();
    }
    
    if(Enemy.body.touching.down && this.body.touching.up)
    {
        this.heroHurt.play('', 0 , 0.05, false, true);
        this.hurt = true;
        this.alpha = 0;
        
        Enemy.body.velocity.x = 0;
        
        this.death.visible = true;
        this.death.x = this.x;
        this.death.y = this.y + this.height*2;
        this.death.play('death');
        
        this.heroGhost.play('', 0 , 0.05, false, true);
        
        uiMan.liveKill();
        
        this.killTween = this.game.add.tween(this.death);
        this.killTween.to({y:5}, 1500, Phaser.Easing.Linear.None);
        
        this.killTween.onComplete.addOnce(function()
        {    
            this.death.visible = false;
            
            this.hurt = false;
            this.alpha = 1;
            //spawning hero at the beggining of the map
            this.x = 50;
            this.y = 10;
            
            Enemy.body.velocity.x = 100;
            
            this.heroReviwe.play('', 0 , 0.05, false, true);
            
        }, this);
        
        this.killTween.start();
    }
    
    else
    {
        this.body.velocity.y -= 350;
        this.headJump.play('', 0, 0.04, false, true);
    }
};

Hero.prototype.update = function()
{   
    //if Hero is Dead start game over state
    if(this.maxLives <= 0 || Hero.health <= 0)
    {
        this.kill();
        this.openDoor = false;
        this.heroDead.play('', 0, 0.04, false, false);
        uiMan.stopMusic();
        
        this.game.time.events.add(800, function() {   
        this.game.state.start('gameOver', true, false, );
        }, this);
        
        return;
    }
   
    //Hero movement 
    
    //Hero on lianes
    if(this.climbing)
    {
        this.body.gravity.y = 0;

        if(this.jumpButton.isDown)
        {
            this.body.gravity.y = 1000;
            this.climbing = false;
        }
    }
    
    //Hero hurt after collision with enemy
    if(this.hurt)
    {
        this.body.velocity.x = 0;
    }
    
    //Hero not colided with enemy
    else
    {
        //Hero speed reset when no key pressed
        this.body.velocity.x = 0;

        //Hero move actions
        if(this.jumpButton.isDown && this.body.blocked.down)
        {
            this.body.velocity.y = -500;
            this.heroJump.play('', 0, 0.04, false, true );

            if(this.cursors.right.isDown)
            {
                this.animations.play('jumpRight');
                this.heroJump.play('', 0, 0.04, false, true );
            }
            if(this.cursors.left.isDown)
            {
                this.animations.play('jumpLeft');
                this.heroJump.play('', 0, 0.04, false, true );
            }   
        }

        if(this.jumpButton.isDown && this.body.touching.down)
        {   
            this.body.velocity.y = -500;

            if(this.cursors.right.isDown)
            {
                this.animations.play('jumpRight');
                this.heroJump.play('', 0, 0.04, false, true );
            }
            if(this.cursors.left.isDown)
            {
                this.animations.play('jumpLeft');
                this.heroJump.play('', 0, 0.04, false, true );
            }
        }

        if(this.cursors.left.isDown)
        {
            this.body.setSize(60, 160, 65, 20);
            this.animations.play('left');
            this.body.velocity.x = -300;
            Phaser.Math.snapTo(this.body.y, -300);

            if(this.jumpButton.isDown)
            {
                this.animations.stop('left');
                this.animations.play('jumpLeft');
            }
        }

        if(this.cursors.left.isUp)
        {
            this.animations.stop('left');
        }

        if(this.cursors.right.isDown)
        {
            this.body.setSize(60, 160, 40, 20);
            this.animations.play('right');
            this.body.velocity.x = 300;
            Phaser.Math.snapTo(this.body.y, 300);

            if(this.jumpButton.isDown)
            {
                this.animations.stop('right');
                this.animations.play('jumpRight');
            }
        }

        if(this.cursors.right.isUp)
        {
            this.animations.stop('right');
        }
    }
};