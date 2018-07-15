'use strict';

var Bonus = function(game, x, y, typeImg)
{
    Phaser.Sprite.call(this, game, x, y, typeImg);
    game.add.existing(this);
    this.anchor.setTo(0.5, 0.5);
    game.physics.enable(this);
    this.type = typeImg
    this.body.gravity.y = 0;
    this.body.immovable = true;
    
    if(this.type === 'star')
    {
        this.rotationSpeed = 220;
        this.body.angularVelocity = this.rotationSpeed;
        return this.star
    }
    if(this.type === 'jump')
    {
        this.rotationSpeed = -50;
        this.body.angularVelocity = this.rotationSpeed;
        return this.jump
    }
};

Bonus.prototype = Object.create(Phaser.Sprite.prototype);
Bonus.prototype.constructor = Bonus;

Bonus.prototype.jumpHeroBonus = function(Hero)
{
    this.starCollected = this.game.add.audio('starCollected');
    this.bonusCollected = this.game.add.audio('bonusCollected');
    
    switch (this.name)
    {
        case 'key':
            this.kill();
            this.bonusCollected.play('', 0, 0.06, false, true );
            gmMan.hero.openDoor = true;
            
            this.game.time.events.add(1, function() {   this.game.add.tween(gmMan.door).to({alpha:1}, 700, Phaser.Easing.Linear.None, true);}, this);
            
            break;
        
        case 'star':
            this.kill();
            this.starCollected.play('', 0, 0.06, false, true );
            
            this.game.time.events.add(1, function() {   this.game.add.tween(uiMan.starSymbol).to({angle: 360}, 700, Phaser.Easing.Linear.None, true);}, this);
            
            break;
        
        case 'arrow':
            uiMan.eventTextShow('Uwaga ! Ruchome skrzynie !', this.body.x, src.height*0.2, 40, 200, 200, true);
            
            break;
            
        case 'jump':
            gmMan.hero.body.velocity.y -= 550;
            this.kill();
            this.bonusCollected.play('', 0, 0.06, false, true );
            
            break;
            
        case 'crate':
            //when hero 
            this.rotationSpeed = 50;
            this.body.angularVelocity = this.rotationSpeed;
            
            gmMan.hero.body.x += this.body.angularVelocity/15;
            
            break;
    }    
};
