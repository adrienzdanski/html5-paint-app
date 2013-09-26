function toolGradient() {
	this.color1 = "#000000";
	this.color2 = "#ffffff";
	this.rgbaColor1;
	this.rgbaColor2;
	this.opacity1 = 100;
	this.opacity2 = 100;
	this.lowerPivot = 0;
	this.upperPivot = 100;
	this.angle = 0;
	this.mode = 0; // 0 = linear; 1 = radial
}

toolGradient.prototype.setNewCanvasContext = function(canvas, context) {
	this.canvas = canvas;
	this.context = context;
}
toolGradient.prototype.setMode = function(mode){
	this.mode = mode;
}
toolGradient.prototype.setAngle = function(angle) {
	this.angle = angle;
}
toolGradient.prototype.setColors = function(color1, color2) {
	this.color1 = color1;
	this.rgbaColor1 = hexToRGBA(this.color1, this.opacity1);
	this.color2 = color2;
	this.rgbaColor2 = hexToRGBA(this.color2, this.opacity2);
}
toolGradient.prototype.setOpacity = function(opacity1, opacity2) {
	this.opacity1 = opacity1;
	this.rgbaColor1 = hexToRGBA(this.color1, this.opacity1);
	this.opacity2 = opacity2;
	this.rgbaColor2 = hexToRGBA(this.color2, this.opacity2);
}
toolGradient.prototype.setPivots = function(lower, upper) {
	this.lowerPivot = lower;
	this.upperPivot = upper;
}
toolGradient.prototype.fillArea = function() {
	this.context.save();
	switch(this.mode) {
		case 0:
			var x1, x2, y1, y2;
			switch(this.angle) {
				case 0:
				case 360:
					x1 = 0; y1 = 0;
					x2 = this.canvas.width; y2 = 0;
					break;
				case 45:
					x1 = 0; y1 = 0;
					x2 = this.canvas.width; y2 = this.canvas.height;
					break;
				case 90:
					x1 = 0; y1 = 0;
					x2 = 0; y2 = this.canvas.height;
					break;
				case 135:
					x1 = this.canvas.width; y1 = 0;
					x2 = 0; y2 = this.canvas.height;
					break;
				case 180:
					x1 = this.canvas.width; y1 = 0;
					x2 = 0; y2 = 0;
					break;
				case 225:
					x1 = this.canvas.width; y1 = this.canvas.height;
					x2 = 0; y2 = 0;
					break;
				case 270:
					x1 = 0; y1 = this.canvas.height;
					x2 = 0; y2 = 0;
					break;
				case 315:
					x1 = 0; y1 = this.canvas.height;
					x2 = this.canvas.width; y2 = 0;
					break;
			}
			var linearGradient = this.context.createLinearGradient(x1, y1, x2, y2);
	
			linearGradient.addColorStop(this.lowerPivot / 100, this.rgbaColor1);
			linearGradient.addColorStop(this.upperPivot / 100, this.rgbaColor2);
	
			this.context.fillStyle = linearGradient;
			this.context.fillRect(0,0,this.canvas.width,this.canvas.height);
			break;
			
		case 1:
			var centerX = this.canvas.width / 2;
			var centerY = this.canvas.height / 2;
			var radialGradient = this.context.createRadialGradient(centerX, centerY, 0, centerX, centerY, this.canvas.width);
		    radialGradient.addColorStop(this.lowerPivot / 100, this.rgbaColor1);
		    radialGradient.addColorStop(this.upperPivot / 100, this.rgbaColor2);
		
		    this.context.fillStyle = radialGradient;
		    this.context.fillRect(0,0,this.canvas.width,this.canvas.height);
			break;
	}
	this.context.restore();
}
