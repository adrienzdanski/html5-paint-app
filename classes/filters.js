function filters() {}
filters.prototype.setNewCanvasContext = function(canvas, context) {
	this.canvas = canvas;
	this.context = context;
	this.sourceImg = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
	this.targetImg = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
}
filters.prototype.binarize = function(thrho) {
	var threshold;
	if(thrho > 255) {
		threshold = 255;
	} else if(thrho < 0) {
		threshold = 0;
	} else {
		threshold = thrho;
	}

	for(var x = 0; x < this.sourceImg.width; x++) {
		for(var y = 0; y < this.sourceImg.height; y++) {

			var idx = (x + y * this.sourceImg.width) * 4;

			var r = this.sourceImg.data[idx + 0];
			var g = this.sourceImg.data[idx + 1];
			var b = this.sourceImg.data[idx + 2];
			var a = this.sourceImg.data[idx + 3];

			var mid = (r + g + b) / 3;
			if(mid > threshold) {
				this.targetImg.data[idx + 0] = 255;
				this.targetImg.data[idx + 1] = 255;
				this.targetImg.data[idx + 2] = 255;
			} else {
				this.targetImg.data[idx + 0] = 0;
				this.targetImg.data[idx + 1] = 0;
				this.targetImg.data[idx + 2] = 0;
			}
		}
	}

	this.draw();
}

filters.prototype.grayscale = function() {
	for(var x = 0; x < this.sourceImg.width; x++) {
		for(var y = 0; y < this.sourceImg.height; y++) {

			var idx = (x + y * this.sourceImg.width) * 4;

			var r = this.sourceImg.data[idx + 0];
			var g = this.sourceImg.data[idx + 1];
			var b = this.sourceImg.data[idx + 2];
			var a = this.sourceImg.data[idx + 3];

			var mid = (r + g + b) / 3;
			this.targetImg.data[idx + 0] = mid;
			this.targetImg.data[idx + 1] = mid;
			this.targetImg.data[idx + 2] = mid;
		}
	}

	this.draw();
}

filters.prototype.boxfilter = function(filterkern, weight) {
	var arrSize = this.canvas.width * this.canvas.height;
	for(var x = 0; x < arrSize; x++) {
		var idx = x * 4;
		/* blur r */
		this.targetImg.data[idx + 0] = this.calculateLinearFilter(this.sourceImg, idx, 0, filterkern, weight);
		/* blur g */
		this.targetImg.data[idx + 1] = this.calculateLinearFilter(this.sourceImg, idx, 1, filterkern, weight);
		/* blur b */
		this.targetImg.data[idx + 2] = this.calculateLinearFilter(this.sourceImg, idx, 2, filterkern, weight);
	}

	this.draw();
}
filters.prototype.minMaxMid = function(mode) {
	var arrSize = this.canvas.width * this.canvas.height;
	for(var x = 0; x < arrSize; x++) {
		var idx = x * 4;
		var offset = this.canvas.width * 4;
		/* r */
		this.targetImg.data[idx + 0] = this.calculateMinMaxMid(this.sourceImg, idx, 0, offset, mode);
		/* g */
		this.targetImg.data[idx + 1] = this.calculateMinMaxMid(this.sourceImg, idx, 1, offset, mode);
		/* b */
		this.targetImg.data[idx + 2] = this.calculateMinMaxMid(this.sourceImg, idx, 2, offset, mode);
	}

	this.draw();
}

filters.prototype.draw = function() {

	this.context.putImageData(this.targetImg, 0, 0);
	this.sourceImg = this.targetImg;
}
/* private methods */
filters.prototype.calculateMinMaxMid = function(imgData, idx, channel, offset, mode) {
	var pixels3x3 = [];
	pixels3x3[0] = imgData.data[idx + channel - offset - 1];
	pixels3x3[1] = imgData.data[idx + channel - offset + 0];
	pixels3x3[2] = imgData.data[idx + channel - offset + 1];
	pixels3x3[3] = imgData.data[idx + channel - 1];
	pixels3x3[4] = imgData.data[idx + channel + 0];
	pixels3x3[5] = imgData.data[idx + channel + 1];
	pixels3x3[6] = imgData.data[idx + channel + offset - 1];
	pixels3x3[7] = imgData.data[idx + channel + offset + 0];
	pixels3x3[8] = imgData.data[idx + channel + offset + 1]; (pixels3x3[0] == undefined) ? pixels3x3[0] = pixels3x3[8] : pixels3x3[0] = pixels3x3[0]; (pixels3x3[1] == undefined) ? pixels3x3[1] = pixels3x3[7] : pixels3x3[1] = pixels3x3[1]; (pixels3x3[2] == undefined) ? pixels3x3[2] = pixels3x3[6] : pixels3x3[2] = pixels3x3[2]; (pixels3x3[3] == undefined) ? pixels3x3[3] = pixels3x3[5] : pixels3x3[3] = pixels3x3[3]; (pixels3x3[5] == undefined) ? pixels3x3[5] = pixels3x3[3] : pixels3x3[5] = pixels3x3[5]; (pixels3x3[6] == undefined) ? pixels3x3[6] = pixels3x3[2] : pixels3x3[6] = pixels3x3[6]; (pixels3x3[7] == undefined) ? pixels3x3[7] = pixels3x3[1] : pixels3x3[7] = pixels3x3[7]; (pixels3x3[8] == undefined) ? pixels3x3[8] = pixels3x3[0] : pixels3x3[8] = pixels3x3[8];

	pixels3x3.sort(function(a, b) {
		return a - b
	});
	switch(mode) {
		case 0:
			return pixels3x3[0];
			break;

		case 1:
			return Math.abs((pixels3x3[3] + pixels3x3[4]) / 2);
			break;

		case 2:
			return pixels3x3[8];
			break;
	}
}

filters.prototype.calculateLinearFilter = function(imgData, idx, channel, filterkern, weight) {
	var m00, m01, m02, m10, m11, m12, m20, m21, m22;
	var offset = imgData.width * 4;
	m00 = imgData.data[idx + channel - offset - 1];
	m01 = imgData.data[idx + channel - offset + 0];
	m02 = imgData.data[idx + channel - offset + 1];
	m10 = imgData.data[idx + channel - 1];
	m11 = imgData.data[idx + channel + 0];
	m12 = imgData.data[idx + channel + 1];
	m20 = imgData.data[idx + channel + offset - 1];
	m21 = imgData.data[idx + channel + offset + 0];
	m22 = imgData.data[idx + channel + offset + 1]; (m00 == undefined) ? m00 = m22 : m00 = m00; (m01 == undefined) ? m01 = m21 : m01 = m01; (m02 == undefined) ? m02 = m20 : m02 = m02; (m10 == undefined) ? m10 = m12 : m10 = m10; (m12 == undefined) ? m12 = m10 : m12 = m12; (m20 == undefined) ? m20 = m02 : m20 = m20; (m21 == undefined) ? m21 = m01 : m21 = m21; (m22 == undefined) ? m22 = m00 : m22 = m22;
	var matrix = Matrix.create([[m00, m01, m02], [m10, m11, m12], [m20, m21, m22]]);

	return weight * (matrix.e(0, 0) * filterkern.e(0, 0) + matrix.e(0, 1) * filterkern.e(0, 1) + matrix.e(0, 2) * filterkern.e(0, 2) + matrix.e(1, 0) * filterkern.e(1, 0) + matrix.e(1, 1) * filterkern.e(1, 1) + matrix.e(1, 2) * filterkern.e(1, 2) + matrix.e(2, 0) * filterkern.e(2, 0) + matrix.e(2, 1) * filterkern.e(2, 1) + matrix.e(2, 2) * filterkern.e(2, 2));
}