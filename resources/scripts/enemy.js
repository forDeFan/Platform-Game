'use strict';

var Enemy = function(game, x, y, typeImg, scale, frame)
{
    Phaser.Sprite.call(this, game, x, y, typeImg);
    game.add.existing(this);
    this.anchor.setTo(0.5, 0.5);
    game.physics.enable(this);
    this.collideWorldBounds = true;
    this.body.gravity.y = 1000;
    this.body.velocity.x = 100;
    this.body.bounce.x = 1;
    this.body.collideWorldBounds = true;
    this.body.immovable = true;
    this.type = typeImg;
    this.scale.setTo(scale);
    this.frame = frame;
    
    this.dmgRate = 10;
    this.dead = false;
    
    //enemy hurt sound
    this.enemyHurt = this.game.add.audio('enemyHurt');
    
    //body size for collisions
    this.body.setSize(40, 70, 20, 7);
    
    //sounds
    this.enemyAttack = this.game.add.audio('enemyAttack');
    
    //enemy move aimations
    this.animations.add('left', [4,5,6,7], 7, true);
    this.animations.add('bossLeft', [3,4,5], 5, true);
    this.animations.add('turnLeft', [0,1,2,3,4,5,6,7], 2, false);
    this.animations.add('right', [8,9,10,11], 7, true);
    this.animations.add('bossRight', [7,8,9], 5, true);
    this.animations.add('turnRight', [8,9,10,11,12,13,14,15], 2, false);
    this.animations.add('enemyAttack', [0,1,2,3,4,12,13,14,15,8,9,10,11], 5, false);
    this.animations.add('bossAttack', [0,1,2,3,4,12,13,14,15,8,9,10,11,0,1,2,3,4,12,13,14,15,8,9,10,11], 2, false);
    this.animations.add('bossDie', [1,2,3,13,14,15], 10, false);
};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function()
{
    //boss die animation
    if(this.health <= 0)
    {
        this.body.velocity.x = 0;
        this.dead = true;
        this.animations.play('bossDie');
    }
}

Enemy.prototype.attack = function(Hero)
{
    //enemy attack animations
    if(this.body.touching.left && Hero.body.touching.right || this.body.touching.right && Hero.body.touching.left)
    {
        this.enemyAttack.play('', 0, 0.06, false, true);
        this.animations.play('enemyAttack');
    }
    
    //boss movement animations
    if(this.body.touching.down && Hero.body.touching.up)
    {
        this.enemyAttack.play('', 0, 0.06, false, true);
        this.animations.play('bossAttack');
        
        src.time.events.add(800, function() {    
            this.animations.play('bossRight');
        }, this);
    }
};

