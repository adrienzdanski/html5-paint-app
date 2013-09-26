function toolFont() {
	this.color = "#000000";
	this.opacity = 100;
	this.rgbaColor;
	
	this.fontSize = 12;
	this.fontWeight = "normal";
	this.fontFamily = "Arial";
	this.fontText = "Text";
	
	this.activated = false;
	this.mouseupHandler;
}
toolFont.prototype.setColor = function(color) {
	this.color = color;
	this.rgbaColor = hexToRGBA(this.color, this.opacity);
}
toolFont.prototype.setOpacity = function(opacity) {
	this.opacity = opacity;
	this.rgbaColor = hexToRGBA(this.color, this.opacity);
}
toolFont.prototype.setText = function(text) {
	this.fontText = text;
}
toolFont.prototype.setFontSize = function(size) {
	this.fontSize = size;
}
toolFont.prototype.setFontWeight = function(weight) {
	this.fontWeight = weight;
}
toolFont.prototype.setFontFamily = function(family) {
	this.fontFamily = family;
}
toolFont.prototype.removeOldHandler = function() {
	this.canvas.removeEventListener('mouseup',this.mouseupHandler,false);
}
toolFont.prototype.fontActivated = function(active) {
	this.activated = active;
}
toolFont.prototype.setNewCanvasContext = function(canvas, context) {
	if(this.canvas) {
		//this.removeOldHandler();
	}
	this.canvas = canvas;
	this.context = context;
	
	var _self = this;
	this.mouseupHandler = function(event) {
		if(_self.activated) {
			var parentOffset = $(this).parent().offset(); 
			var posX = event.pageX - parentOffset.left;
			var posY = event.pageY - parentOffset.top;
			_self.context.fillStyle = _self.rgbaColor;
			context.font = _self.fontWeight + " " + _self.fontSize + "pt " + _self.fontFamily;
	        context.fillText(_self.fontText, posX, posY);
		}
	}
	this.canvas.addEventListener("mouseup", this.mouseupHandler, false);
}
