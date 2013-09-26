function layerManager(parent, layerContainer) {
	this.layers = [];
	this.parent = parent;
	this.context;
	this.container = layerContainer;
	this.currentID = 0;
	this.width = 0;
	this.height = 0;
}

layerManager.prototype.createNewDocument = function(width, height) {
	this.layers.length = 0;
	this.currentID = 0;
	this.width = width;
	this.height = height;
	this.parent.style.width = width + "px";
	this.parent.style.height = height + "px";
	var canvas = document.createElement("canvas");
	canvas.id = "canvas" + this.currentID;
	canvas.width = width;
	canvas.height = height;
	this.parent.appendChild(canvas);
	this.layers[this.currentID] = {};
	this.layers[this.currentID].id = this.currentID;
	this.layers[this.currentID].canvas = canvas;
	this.layers[this.currentID].label = "Background";
	this.addDragAndDropEvents(this.getCurrentCanvas(this.currentID), this.getCurrentContext(this.currentID));
	this.currentID++;
	this.updateLayerBox();
}
layerManager.prototype.addNewLayer = function() {
	if(this.width == 0 || this.height == 0) {
		this.width = 800;
		this.height = 600;
	}
	var canvas = document.createElement("canvas");
	canvas.id = "canvas" + this.currentID;
	canvas.width = this.width;
	canvas.height = this.height;
	this.parent.appendChild(canvas);
	this.layers[this.currentID] = {};
	this.layers[this.currentID].id = this.currentID;
	this.layers[this.currentID].canvas = canvas;
	this.layers[this.currentID].label = "Layer " + this.currentID;
	this.addDragAndDropEvents(this.getCurrentCanvas(this.currentID), this.getCurrentContext(this.currentID));
	this.currentID++;
	this.updateLayerBox();
}
layerManager.prototype.removeLayer = function(id) {
	this.layers[id] = null;
	$('#canvas' + id).remove();
	this.updateLayerBox();
}
layerManager.prototype.getCurrentContext = function(id) {
	return this.layers[id].canvas.getContext ? this.context = this.layers[id].canvas.getContext('2d') : alert("No Canvas support!");
}
layerManager.prototype.getCurrentCanvas = function(id) {
	return this.layers[id].canvas;
}
layerManager.prototype.updateLayerBox = function() {
	this.container.innerHTML = "";
	var html = "<ul>";
	for(var i = 0; i < this.layers.length; i++) {
		if(this.layers[i] != null){
			var deleteLink = '';
			if(i != 0) {
				deleteLink = '<a href="#" class="delete">&nbsp;</a>';
			}
			if($('#canvas' + this.layers[i].id).is(":visible")) {
				html += '<li class="layerItem" id="layer' + this.layers[i].id + '"><a href="#" class="hide visibleIcon">&nbsp;</a><span>' + this.layers[i].label + '</span>' + deleteLink + '</li>';
			} else {
				html += '<li class="layerItem" id="layer' + this.layers[i].id + '"><a href="#" class="hide hiddenIcon">&nbsp;</a><span>' + this.layers[i].label + '</span>' + deleteLink + '</li>';
			}
		}
	}
	html += "</ul>";
	this.container.innerHTML = html;
}
layerManager.prototype.addDragAndDropEvents = function(currentCanvas, currentContext) {
	var img = document.createElement("img");

	img.addEventListener("load", function () {
		currentContext.drawImage(img, 0, 0);
	}, false);
	
	currentCanvas.addEventListener("dragover", function (e) {
		e.preventDefault();
	}, false);

	currentCanvas.addEventListener("drop", function (e) {
		var ctx = this.getContext('2d');
		ctx.clearRect(0, 0, this.width, this.height);
		
		var files = e.dataTransfer.files;
		if (files.length > 0) {
			var file = files[0];
			if (typeof FileReader !== "undefined" && file.type.indexOf("image") != -1) {
				var reader = new FileReader();
				// Note: addEventListener doesn't work in Google Chrome for this event
				reader.onload = function (e) {
					img.src = e.target.result;
				};
				reader.readAsDataURL(file);
			}
		}
		e.preventDefault();
	}, false);
}