function toolPen() {
	this.penIsSelected = false;
	this.isDrawing = false;
	this.color = "#000000";
	this.opacity = 100;
	this.rgbaColor;
	this.penWidth = 1;
	this.mousemoveHandler;
	this.mousedownHandler;
	this.mouseupHandler;
}
toolPen.prototype.setColor = function(color) {
	this.color = color;
	this.rgbaColor = hexToRGBA(this.color, this.opacity);
}
toolPen.prototype.setOpacity = function(opacity) {
	this.opacity = opacity;
	this.rgbaColor = hexToRGBA(this.color, this.opacity);
}
toolPen.prototype.setWidth = function(width) {
	this.penWidth = width;
}
toolPen.prototype.penActivated = function(state) {
	this.penIsSelected = state;
}
toolPen.prototype.removeOldHandler = function() {
	this.canvas.removeEventListener('mousemove',this.mousemoveHandler,false);
	this.canvas.removeEventListener('mousedown',this.mousedownHandler,false);
	this.canvas.removeEventListener('mouseup',this.mouseupHandler,false);
}
toolPen.prototype.setNewCanvasContext = function(canvas, context) {
	if(this.canvas) {
		//this.removeOldHandler();
	}
	this.canvas = canvas;
	this.context = context;
	
	var _self = this;
	this.mousemoveHandler = function(event) {
		if(_self.isDrawing && _self.penIsSelected) {
			var parentOffset = $(this).parent().offset(); 
   			var posX = event.pageX - parentOffset.left;
   			var posY = event.pageY - parentOffset.top;
			
			_self.context.lineTo(posX, posY);
			_self.context.strokeStyle = _self.rgbaColor;
			_self.context.lineWidth = _self.penWidth;
			_self.context.lineCap = 'round';
			_self.context.lineJoin = 'round';
			_self.context.stroke();
		}
	};
	this.mousedownHandler = function(event) {
		var parentOffset = $(this).parent().offset(); 
   		var posX = event.pageX - parentOffset.left;
   		var posY = event.pageY - parentOffset.top;
		_self.context.moveTo(posX, posY);
		_self.isDrawing = true;
		_self.context.beginPath();
	};
	this.mouseupHandler = function(event) {
		_self.isDrawing = false;
		_self.context.closePath();
	};
	this.canvas.addEventListener("mousemove", this.mousemoveHandler, false);
	this.canvas.addEventListener("mousedown", this.mousedownHandler, false);
	this.canvas.addEventListener("mouseup", this.mouseupHandler, false);
}
