function transformations() {
	this.tempImage;
	this.tempCanvas;
}

transformations.prototype.setNewCanvasContext = function(canvas, context) {
	this.canvas = canvas;
	this.context = context;
}

transformations.prototype.rotate = function(factor) {    
	this.tempCanvas = this.saveCopy();
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	this.context.save();

	this.context.translate(this.canvas.width / 2, this.canvas.height / 2);
	this.context.rotate(factor);
	this.context.translate(-this.canvas.width / 2, -this.canvas.height / 2);

	this.context.drawImage(this.tempCanvas,0,0);
	this.context.restore();
}
transformations.prototype.uniformScale = function(factor) {    
	this.tempCanvas = this.saveCopy();
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	this.context.save();

	this.context.translate(this.canvas.width / 2, this.canvas.height / 2);
	this.context.scale(factor, factor);
	this.context.translate(-this.canvas.width / 2, -this.canvas.height / 2);

	this.context.drawImage(this.tempCanvas,0,0);
	this.context.restore();
}
transformations.prototype.saveCopy = function() {
	var tempCanvas = document.createElement("canvas");
    var tempCtx = tempCanvas.getContext("2d");
	tempCanvas.width = this.canvas.width*2;
	tempCanvas.height = this.canvas.height*2;
	tempCtx.drawImage(this.canvas,0,0,this.canvas.width,this.canvas.height);
	return tempCanvas;
}
