'use strict';

var Obstacle = function(game, x, y, typeImg)
{
    Phaser.Sprite.call(this, game, x, y, typeImg);
    game.add.existing(this);
    this.anchor.setTo(0, 0);
    game.physics.enable(this);
    this.body.immovable = true;
    this.body.moves = false;
    this.type = typeImg;
};

Obstacle.prototype = Object.create(Phaser.Sprite.prototype);
Obstacle.prototype.constructor = Obstacle;

Obstacle.prototype.jumpHeroObstacle = function(Hero)
{
    if('water' || 'spikes')
    {
        Hero.heroHurt.play('', 0 , 0.05, false, true);
        Hero.hurt = true;
        Hero.alpha = 0;
        
        Hero.death.visible = true;
        Hero.death.x = Hero.x;
        Hero.death.y = Hero.y + Hero.height*2;
        Hero.death.play('death');
        
        Hero.y = 0;
        
        Hero.heroGhost.play('', 0 , 0.05, false, true);
        
        Hero.body.gravity.y = 0;

        this.killTween = this.game.add.tween(Hero.death);
        this.killTween.to({y:5}, 1500, Phaser.Easing.Linear.None);
        
        this.killTween.onComplete.addOnce(function()
        {    
            Hero.death.visible = false;
            Hero.hurt = false;
            Hero.alpha = 1;
            
            //spawning hero at the beggining of the map
            Hero.body.gravity.y = 1000;
            Hero.x = 50;
            Hero.y = 10;
            
            Hero.heroReviwe.play('', 0 , 0.05, false, true);
            
        }, this);
        
        uiMan.liveKill();
        this.killTween.start();
        return;
    }
};

