function toolFill() {
	this.color = "#000000";
	this.rgbaColor;
	this.opacity = 100;
}

toolFill.prototype.setNewCanvasContext = function(canvas, context) {
	this.canvas = canvas;
	this.context = context;
}
toolFill.prototype.setColor = function(color) {
	this.color = color;
	this.rgbaColor = hexToRGBA(this.color, this.opacity);
}
toolFill.prototype.setOpacity = function(opacity) {
	this.opacity = opacity;
	this.rgbaColor = hexToRGBA(this.color, this.opacity);
}

toolFill.prototype.fillArea = function() {
	this.context.fillStyle = this.rgbaColor;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
}
