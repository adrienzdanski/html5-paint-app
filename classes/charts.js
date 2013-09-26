function chart(canvas, context, values) {
	this.canvas = canvas;
	this.context = context;
	this.values = values;
}

chart.prototype.drawPieChart = function() {
	var canvasCenter = {};
	var canvasRadius = 0;
	if(this.canvas.width <= this.canvas.height) {
		canvasRadius = this.canvas.width / 2;
	} else {
		canvasRadius = this.canvas.height / 2;
	}
	canvasCenter.x = this.canvas.width / 2.0;
	canvasCenter.y = this.canvas.height / 2.0;
	var sum = 0;
	var startAngle = 0.0;
	var endAngle;
	var color = '';

	for(var key in this.values) {
		sum += this.values[key][0];
	}
	for(var key in this.values) {
		color = this.values[key][1];
		endAngle = (this.values[key][0] / sum) * (Math.PI * 2.0); 
		endAngle >= (Math.PI * 2.0) ? 0 : endAngle += startAngle;
		this.context.beginPath();
		this.context.moveTo(canvasCenter.x, canvasCenter.y);
		this.context.arc(canvasCenter.x, canvasCenter.y, canvasRadius, startAngle, endAngle, false);
		this.context.closePath();
		this.context.fillStyle = color;
		this.context.fill();
		startAngle = endAngle;
	}
}
chart.prototype.drawBarChart = function() {
	var color = '';
	var barwidth = 20;
	var counter = 0;
	
	for(var key in this.values) {
		color = this.values[key][1];

		this.context.fillRect(20, counter * barwidth * 2 + barwidth, this.values[key][0] / 2, barwidth);

		this.context.fillStyle = color;
		this.context.fill();
		
		counter++;
	}
}
function getRandom(min, max) {
	if(min > max)
		return (-1 );
	if(min == max)
		return (min );
	return (min + parseInt(Math.random() * (max - min + 1)));
}