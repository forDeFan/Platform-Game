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
    
    this.dmg = 50;
    
    //body size for collisions
    this.body.setSize(40, 70, 20, 7);
    
    //sounds
    this.enemyAttack = this.game.add.audio('enemyAttack');
    
    //enemy move aimations
    this.animations.add('left', [4,5,6,7], 7, true);
    this.animations.add('turnLeft', [0,1,2,3,4,5,6,7], 2, false);
    this.animations.add('right', [8,9,10,11], 7, true);
    this.animations.add('turnRight', [8,9,10,11,12,13,14,15], 2, false);
    this.animations.add('enemyAttack', [0,1,2,3,4,12,13,14,15,8,9,10,11], 5, false);
};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.attack = function(Hero)
{
    if(this.body.touching.left && Hero.body.touching.right || this.body.touching.right && Hero.body.touching.left)
    {
        this.enemyAttack.play('', 0, 0.06, false, true);
        this.animations.play('enemyAttack');
    }
};

Enemy.prototype.damage = function()
{
    
    Phaser.Sprite.prototype.damage.call(this, this.dmg);
    //TODO - dodać reszte efektów w związku z damage bohatera
};


Enemy.prototype.kill = function()
{
    //Hero.Sprite.prototype.kill.call(this);
    //TODO - dodać efekty w chwili śmierci
};
