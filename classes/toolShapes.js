function toolShapes() {
	this.shapesIsSelected = false;
	this.color = "#000000";
	this.opacity = 100;
	this.rgbaColor;
	this.mode = 4;
	
	this.startX = 0;
	this.startY = 0;
	
	this.mousemoveHandler;
	this.mousedownHandler;
	this.mouseupHandler;
}
toolShapes.prototype.setColor = function(color) {
	this.color = color;
	this.rgbaColor = hexToRGBA(this.color, this.opacity);
}
toolShapes.prototype.setOpacity = function(opacity) {
	this.opacity = opacity;
	this.rgbaColor = hexToRGBA(this.color, this.opacity);
}
toolShapes.prototype.shapesActivated = function(state, mode) {
	this.shapesIsSelected = state;
	this.mode = mode;
}
toolShapes.prototype.removeOldHandler = function() {
	this.canvas.removeEventListener('mousedown',this.mousedownHandler,false);
	this.canvas.removeEventListener('mouseup',this.mouseupHandler,false);
}
toolShapes.prototype.setNewCanvasContext = function(canvas, context) {
	if(this.canvas) {
		//this.removeOldHandler();
	}
	this.canvas = canvas;
	this.context = context;
	
	var _self = this;
	this.mousedownHandler = function(event) {
		var parentOffset = $(this).parent().offset(); 
   		_self.startX = event.pageX - parentOffset.left;
   		_self.startY = event.pageY - parentOffset.top;
		_self.context.moveTo(this.startX, this.startY);
	};
	this.mouseupHandler = function(event) {
		if(_self.shapesIsSelected && _self.mode == 4) {
			var parentOffset = $(this).parent().offset(); 
	   		var posX = event.pageX - parentOffset.left;
	   		var posY = event.pageY - parentOffset.top;
			_self.context.fillStyle = _self.rgbaColor;
			_self.context.fillRect(_self.startX, _self.startY, posX-_self.startX, posY-_self.startY);
		}
		if(_self.shapesIsSelected && _self.mode == 5) {
			var parentOffset = $(this).parent().offset(); 
	   		var posX = event.pageX - parentOffset.left;
	   		var posY = event.pageY - parentOffset.top;
	   		var width = posX - _self.startX;
	   		var height = posY - _self.startY;
			var centerX = width / 2 + (posX - width);
			var centerY = height / 2 + (posY - height);

		    _self.context.beginPath();
		    _self.context.moveTo(centerX, centerY - height / 2);
		
		    _self.context.bezierCurveTo(
		        centerX + width / 2, centerY - height / 2,
		        centerX + width / 2, centerY + height / 2,
		        centerX, centerY + height / 2
		    );
		    _self.context.bezierCurveTo(
		        centerX - width / 2, centerY + height / 2,
		        centerX - width / 2, centerY - height / 2,
		        centerX, centerY - height / 2
		    );
		
		    _self.context.fillStyle = _self.rgbaColor;
		    _self.context.fill();
		    _self.context.closePath();
		}
	};
	this.canvas.addEventListener("mousedown", this.mousedownHandler, false);
	this.canvas.addEventListener("mouseup", this.mouseupHandler, false);
}
