function toolBrush() {
	this.brushIsSelected = false;
	this.isDrawing = false;
	this.color = "#000000";
	this.opacity = 100;
	this.rgbaColor;
	this.radius = 10;
	this.degree = 360;
	this.mousemoveHandler;
	this.mousedownHandler;
	this.mouseupHandler;
}
toolBrush.prototype.setColor = function(color) {
	this.color = color;
	this.rgbaColor = hexToRGBA(this.color, this.opacity);
}
toolBrush.prototype.setOpacity = function(opacity) {
	this.opacity = opacity;
	this.rgbaColor = hexToRGBA(this.color, this.opacity);
}
toolBrush.prototype.setShape = function(degree) {
	this.degree = degree;
}
toolBrush.prototype.setRadius = function(radius) {
	this.radius = radius / 2.0;
}
toolBrush.prototype.brushActivated = function(state) {
	this.brushIsSelected = state;
}
toolBrush.prototype.removeOldHandler = function() {
	this.canvas.removeEventListener('mousemove',this.mousemoveHandler,false);
	this.canvas.removeEventListener('mousedown',this.mousedownHandler,false);
	this.canvas.removeEventListener('mouseup',this.mouseupHandler,false);
}
toolBrush.prototype.setNewCanvasContext = function(canvas, context) {
	if(this.canvas) {
		//this.removeOldHandler();
	}
	this.canvas = canvas;
	this.context = context;
	
	var _self = this;
	this.mousemoveHandler = function(event) {
		if(_self.isDrawing && _self.brushIsSelected) {
			var parentOffset = $(this).parent().offset(); 
   			var posX = event.pageX - parentOffset.left;
   			var posY = event.pageY - parentOffset.top;
			
			_self.context.beginPath();
			_self.context.arc(posX, posY, _self.radius, 0, _self.degToRad(_self.degree), true);
			_self.context.closePath();
			_self.context.fillStyle = _self.rgbaColor;
			_self.context.fill();
		}
	};
	this.mousedownHandler = function(event) {
		var posX = event.offsetX;
		var posY = event.offsetY;
		_self.context.moveTo(posX, posY);
		_self.isDrawing = true;
	};
	this.mouseupHandler = function(event) {
		_self.isDrawing = false;
	};
	this.canvas.addEventListener("mousemove", this.mousemoveHandler, false);
	this.canvas.addEventListener("mousedown", this.mousedownHandler, false);
	this.canvas.addEventListener("mouseup", this.mouseupHandler, false);
}

toolBrush.prototype.degToRad = function(degrees) {
	return degrees * Math.PI / 180;
}
