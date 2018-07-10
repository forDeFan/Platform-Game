'use strict';

var customMethods = 
{
  newText: function (x, y, text, fontSize = 16, anchorX = 0.5, anchorY = 0.5, alignment = 'center', textColor = 'white', strokeColor = 'white', strokeSize = 4)
    {
        var text = Platformowa.game.add.text(x, y, text, {font: (fontSize + 'px Autour One'), fill: textColor, align: alignment, stroke: strokeColor, strokeThickness: strokeSize});
        
        text.anchor.setTo(anchorX, anchorY);
        
        return text;
    },
    
    newSprite: function(x, y, key, frame = 0, anchorX = 0.5, anchorY = 0.5, scaleX = 1, scaleY = 1, tint = 0xffffff)
    {
        var sprite = Platformowa.game.add.sprite(x, y, key, frame);
        
        sprite.anchor.setTo(anchorX, anchorY);
        sprite.scale.setTo(scaleX, scaleY);
        
        sprite.tint = tint;
        
        return sprite;
    },
    
    newButton: function (x, y, key, callback, context, fixed = true, onInputDownEvent = null, onInputOverEvent = null, anchorX = 0.5, anchorY = 0.5)
    {
        var button = Platformowa.game.add.button(x, y, key, callback, context, 0, 1, 2, 3);
        
        button.anchor.setTo(anchorX, anchorY);
        
        //for sound playing on click
        if(onInputDownEvent != null)
        {
           button.onInputDown.add(onInputDownEvent, context); 
        }
        
        //for sound playing on hover
        if(onInputOverEvent != null)
        {
            button.onInputOver.add(onInputOverEvent, context);
        }
        
        button.fixedToCamera = fixed;
        
        return button;
    },
    
    newGroup: function (limit, key, physicsEnabled = true, frame = 0, exists = false, anchorX = 0.5, anchorY = 0.5)
    {
        var group = Platformowa.game.add.group();
        
        group.enableBody = physicsEnabled;
        
        this.type = key;
        
        group.createMultiple (limit, key, frame, exists);
        group.setAll('anchor x', anchorX);
        group.setAll('anchor y', anchorY);
        
        return group;
    }
};