/* Global variables */
var layerManager;
var currentLayerID = 0;
var currentCanvas;
var currentContext;
var currentColor = "#000000";
var currentOpacity = 100;
var currentBrushRadius = 10;
var currentBrushShape = 360;

var currentGradientColor1 = "#000000";
var currentGradientColor2 = "#ffffff";
var currentGradientOpacity1 = 100;
var currentGradientOpacity2 = 100;
var currentGradientLower = 0;
var currentGradientUpper = 100;
var currentGradientAngle = 0;
var filter;

var currentFontSize;
var currentFontWeight;

var toolPen;
var toolBrush;
var toolFill;
var toolGradient;
var toolShapes;
var toolFont;

var toolMode = -1;

var transformations;
var menuIsVisible = false;
var layerIsVisible = true;
var optionIsVisible = true;
var toolIsVisible = true;

/* Window onload */
window.onload = function() {
	
	/* Initialization */
	var paintArea = document.getElementById('paintArea');
	var layerContainer = document.getElementById('layers');
	initModules(paintArea, layerContainer);
	initColorpicker();
	initSliders();
	
	/* Register Delegates */
	$("body").on("click", "canvas", function(e) {
		switch(toolMode) {
			case 0:
				//Penaction
				break;
			case 1: 
				//Brushaction
				break;
			case 2:
				toolFill.fillArea();
				break;
			case 3:
				toolGradient.fillArea();
				break;
			case 4:
				//Rectangleaction
				break;
			case 5:
				//Circleaction
				break;
			case 6:
				//Fontaction
				break;
			default:
				break;
		}
	});
	$("body").on("click", ".layerItem", function(e) {
  		e.preventDefault();
  		$('.layerItem').removeClass('highlighted');
  		$(this).addClass('highlighted');
		var id = $(this).attr('id');
		id = id.split("layer");
		refreshContext(id[1]);
	});
	$("body").on("click", ".tool", function(e) {
  		e.preventDefault();
  		$('.tool').removeClass('highlighted');
  		$(this).addClass('highlighted');
		//ToolMode
		if($(this).attr('data-id') == 0) {
			toolMode = 0; //PenMode
			toolPen.penActivated(true);
			toolBrush.brushActivated(false);
			toolShapes.shapesActivated(false, toolMode);
			toolFont.fontActivated(false);
		}
		if($(this).attr('data-id') == 1) {
			toolMode = 1; //PenMode
			toolPen.penActivated(false);
			toolBrush.brushActivated(true);
			toolShapes.shapesActivated(false, toolMode);
			toolFont.fontActivated(false);
		}
		if($(this).attr('data-id') == 2) {
			toolMode = 2; //FillMode
			toolPen.penActivated(false);
			toolBrush.brushActivated(false);
			toolShapes.shapesActivated(false, toolMode);
			toolFont.fontActivated(false);
		}
		if($(this).attr('data-id') == 3) {
			toolMode = 3; //GradientMode
			toolPen.penActivated(false);
			toolBrush.brushActivated(false);
			toolShapes.shapesActivated(false, toolMode);
			toolFont.fontActivated(false);
		}
		if($(this).attr('data-id') == 4) {
			toolMode = 4; //RectangleMode
			toolPen.penActivated(false);
			toolBrush.brushActivated(false);
			toolShapes.shapesActivated(true, toolMode);
			toolFont.fontActivated(false);
		}
		if($(this).attr('data-id') == 5) {
			toolMode = 5; //CircleMode
			toolPen.penActivated(false);
			toolBrush.brushActivated(false);
			toolShapes.shapesActivated(true, toolMode);
			toolFont.fontActivated(false);
		}
		if($(this).attr('data-id') == 6) {
			toolMode = 6; //FontMode
			toolPen.penActivated(false);
			toolBrush.brushActivated(false);
			toolShapes.shapesActivated(false, toolMode);
			toolFont.fontActivated(true);
		}
	});
	$("body").on("click", ".hide", function(e) {
  		e.preventDefault();
  		var id = $(this).parent().attr('id');
		id = id.split("layer");
		if($('#canvas' + id[1]).is(":visible")) {
			$('#canvas' + id[1]).hide();
			$(this).removeClass('visibleIcon').addClass('hiddenIcon');
		} else {
			$('#canvas' + id[1]).show();
			$(this).removeClass('hiddenIcon').addClass('visibleIcon');
		}
	});
	$("body").on("change", "#fontText", function(e) {
		toolFont.setText($(this).val());
	});
	$("body").on("click", ".delete", function(e) {
  		e.preventDefault();
  		var id = $(this).parent().attr('id');
		id = id.split("layer");
		layerManager.removeLayer(id[1]);		
	});
	
	/* Register Events */
	document.getElementById('new').onclick = newDocumentWindow;
	document.getElementById('addNewLayer').onclick = function() {
		layerManager.addNewLayer();
		refreshContext(currentLayerID);
	}
	$('#graoption1, #graoption2').change(function() {
  		var selectedValue = $("input[name='gradientmode']:checked").val();
  		toolGradient.setMode(parseInt(selectedValue));
	});
	$("#presButton").on("click", function() {
		if(menuIsVisible) {
			$("#presNav").fadeOut(500,
				 function() { $("#presWrapper, #presNav").css({"width": "0px", "height" : "0px"}); 
			});
		} else {
			$("#presNav").fadeIn(500,
				function() { $("#presWrapper, #presNav").css({"width" : "100%", "height" : "155px"}); 
			});
		}
		menuIsVisible = !menuIsVisible;
	});
	$(".fancybox").on("click", function() {
		$("#presNav").fadeOut(500,
			function() { $("#presWrapper, #presNav").css({"width": "0px", "height" : "0px"}); 
		});
		menuIsVisible = false;
	});
	$(".toggleLayerBox").on("click", function() {
		if(layerIsVisible) {
			$("#layerBox .moduleHeadline, #layerBox #layers, #layerBox #layerControls").fadeOut(100);
			$("#layerBox").css({"width" : "32px"});
		} else {
			$("#layerBox .moduleHeadline, #layerBox #layers, #layerBox #layerControls").fadeIn(500);
			$("#layerBox").css({"width" : "250px"});
		}
		layerIsVisible = !layerIsVisible;
	});
	$(".toggleToolBox").on("click", function() {
		if(toolIsVisible) {
			$("#toolBox .moduleHeadline, #toolBox ul").fadeOut(100);
			$("#toolBox").css({"width" : "32px"});
		} else {
			$("#toolBox .moduleHeadline, #toolBox ul").fadeIn(500);
			$("#toolBox").css({"width" : "250px"});
		}
		toolIsVisible = !toolIsVisible;
	});
	$(".toggleOptionBox").on("click", function() {
		if(optionIsVisible) {
			$("#optionBox .moduleHeadline, .brushControls, .gradientControls, .brushControls").fadeOut(100);
			$("#optionBox").css({"width" : "32px"});
		} else {
			$("#optionBox .moduleHeadline, .brushControls, .gradientControls, .brushControls").fadeIn(500);
			$("#optionBox").css({"width" : "250px"});
		}
		optionIsVisible = !optionIsVisible;
	});
	
	/* Transformations */
	document.getElementById('btnRotate').onclick = function() {
		transformations.rotate(document.getElementById('rotation').value);
	}
	document.getElementById('btnScale').onclick = function() {
		transformations.uniformScale(document.getElementById('scale').value);
	}
	/* Filters */
	document.getElementById('btnThreshold').onclick = function() {
		refreshContext(currentLayerID);
		filter.binarize(parseInt(document.getElementById('threshold').value));
	}
	document.getElementById('btnGrayscale').onclick = function() { 
		refreshContext(currentLayerID);
		filter.grayscale();
	}
	document.getElementById('btnLinearFilter').onclick = function() {
		refreshContext(currentLayerID);
		var filterkern = Matrix.create([[parseInt(document.getElementById('blur0').value), parseInt(document.getElementById('blur1').value), parseInt(document.getElementById('blur2').value)], [parseInt(document.getElementById('blur3').value), parseInt(document.getElementById('blur4').value), parseInt(document.getElementById('blur5').value)], [parseInt(document.getElementById('blur6').value), parseInt(document.getElementById('blur7').value), parseInt(document.getElementById('blur8').value)]]);
		var weight = parseInt(document.getElementById('blur0').value) + parseInt(document.getElementById('blur1').value) + parseInt(document.getElementById('blur2').value) + parseInt(document.getElementById('blur3').value) + parseInt(document.getElementById('blur4').value) + parseInt(document.getElementById('blur5').value) + parseInt(document.getElementById('blur6').value) + parseInt(document.getElementById('blur7').value) + parseInt(document.getElementById('blur8').value); (weight == 0) ? weight = 1 : weight = weight;
		filter.boxfilter(filterkern, 1 / weight);
	}
	document.getElementById('btnMin').onclick = function() {
		refreshContext(currentLayerID);
		filter.minMaxMid(0);
	}
	document.getElementById('btnMid').onclick = function() {
		refreshContext(currentLayerID);
		filter.minMaxMid(1);
	}
	document.getElementById('btnMax').onclick = function() {
		refreshContext(currentLayerID);
		filter.minMaxMid(2);
	}
	/* Charts */
	document.getElementById('btnPiechart').onclick = function() {
		var pie = new chart(layerManager.getCurrentCanvas(currentLayerID), layerManager.getCurrentContext(currentLayerID), [[getRandom(1, 1000), '#ff0000'], [getRandom(1, 1000), '#00ff00'], [getRandom(1, 1000), '#0000ff'], [getRandom(1, 1000), '#ffff00'], [getRandom(1, 1000), '#ff00ff'], [getRandom(1, 1000), '#00ffff']]);
		pie.drawPieChart();
	};
	document.getElementById('btnBarchart').onclick = function() {
		var bar = new chart(layerManager.getCurrentCanvas(currentLayerID), layerManager.getCurrentContext(currentLayerID), [[getRandom(1, 1000), '#ff0000'], [getRandom(1, 1000), '#00ff00'], [getRandom(1, 1000), '#0000ff'], [getRandom(1, 1000), '#ffff00'], [getRandom(1, 1000), '#ff00ff'], [getRandom(1, 1000), '#00ffff']]);
		bar.drawBarChart();
	};
	/* WebGL */
	document.getElementById('btnWebGL').onclick = function() {
		paintArea.innerHTML = "";
		var o = new webgl(document.getElementById('paintArea'), vertexShader, fragmentShader);
	};
}

/*************/
/* Functions */
/*************/

/* New Document PopUp */
var newDocumentWindow = function() {
	var html = '<div class="transparentLayer"><div id="newDocumentWindow">';
	html += '<span>Width: </span><input id="newDocWidth" type="text" value="800"/><span> px</span><br/>';
	html += '<span>Height: </span><input id="newDocHeight" type="text" value="600"/><span> px</span>';
	html += '<div id="newDocControls"><a href="#" id="newDocOK">OK</a><a href="#" id="newDocCancel">Cancel</a></div>';
	html += '</div></div>';
	$('#dialogs').append(html);
	$('#newDocCancel').on('click', function() {
		$('.transparentLayer').remove();
	});
	$('#newDocOK').on('click', function() {
		$('#paintArea').empty();
		var width = $('#newDocWidth').val();
		var height = $('#newDocHeight').val();
		layerManager.createNewDocument(width, height);
		refreshContext(0);
		
		$('.transparentLayer').remove();
		$('#palette, #tools').fadeIn(500);
	});
}

/* Init Modules */
var initModules = function(paintArea, layerContainer) {
	layerManager = new layerManager(paintArea, layerContainer);
	filter = new filters();
	toolPen = new toolPen();
	toolBrush = new toolBrush();
	toolFill = new toolFill();
	toolGradient = new toolGradient();
	toolShapes = new toolShapes();
	toolFont = new toolFont();
	transformations = new transformations();
}

/* Init Colorpickers */
var initColorpicker = function() {
	$('#colorpickerContainer').ColorPicker({
		color: '#000000',
		onShow: function (colpkr) {
			$(colpkr).fadeIn(500);
			return false;
		},
		onHide: function (colpkr) {
			$(colpkr).fadeOut(500);
			return false;
		},
		onChange: function (hsb, hex, rgb) {
			$('#colorpickerContainer').css('backgroundColor', '#' + hex);
			currentColor = '#' + hex;
			toolPen.setColor(currentColor);
			toolBrush.setColor(currentColor);
			toolFill.setColor(currentColor);
			toolShapes.setColor(currentColor);
			toolFont.setColor(currentColor);
		}
	});
	$('#colorpickerGradient1').ColorPicker({
		color: '#000000',
		onShow: function (colpkr) {
			$(colpkr).fadeIn(500);
			return false;
		},
		onHide: function (colpkr) {
			$(colpkr).fadeOut(500);
			return false;
		},
		onChange: function (hsb, hex, rgb) {
			$('#colorpickerGradient1').css('backgroundColor', '#' + hex);
			currentGradientColor1 = '#' + hex;
			toolGradient.setColors(currentGradientColor1, currentGradientColor2);
		}
	});
	$('#colorpickerGradient2').ColorPicker({
		color: '#ffffff',
		onShow: function (colpkr) {
			$(colpkr).fadeIn(500);
			return false;
		},
		onHide: function (colpkr) {
			$(colpkr).fadeOut(500);
			return false;
		},
		onChange: function (hsb, hex, rgb) {
			$('#colorpickerGradient2').css('backgroundColor', '#' + hex);
			currentGradientColor2 = '#' + hex;
			toolGradient.setColors(currentGradientColor1, currentGradientColor2);
		}
	});
}

/* Init Sliders */
var initSliders = function() {
	$( "#opacitySlider" ).slider({
		value:100,
		min: 0,
		max: 100,
   		slide: function(event, ui) { 
   			currentOpacity = ui.value; 
   			toolPen.setOpacity(currentOpacity);
   			toolBrush.setOpacity(currentOpacity);
   			toolFill.setOpacity(currentOpacity);
   			toolShapes.setOpacity(currentOpacity);
   			toolFont.setOpacity(currentOpacity);
   			$('#opaVal').html(ui.value + "%"); 
   		}
	});
	$( "#radiusSlider" ).slider({
		value:10,
		min: 1,
		max: 200,
   		slide: function(event, ui) { 
   			currentBrushRadius = ui.value; 
   			toolBrush.setRadius(currentBrushRadius);
   			toolPen.setWidth(currentBrushRadius);
   			$('#radVal').html(ui.value + "px"); 
   		}
	});
	$( "#shapeSlider" ).slider({
		value:360,
		min: 1,
		max: 360,
   		slide: function(event, ui) { 
   			currentBrushShape = ui.value; 
   			toolBrush.setShape(currentBrushShape);
   			$('#shpVal').html(ui.value + " Degree"); 
   		}
	});
	$( "#gradientSlider" ).slider({
			range: true,
			min: 0,
			max: 100,
			values: [ 0, 100 ],
			slide: function( event, ui ) {
				currentGradientLower = ui.values[0];
				currentGradientUpper = ui.values[1];
				toolGradient.setPivots(currentGradientLower, currentGradientUpper);
			}
		});
	$( "#gradientSliderOpacity1" ).slider({
		value:100,
		min: 0,
		max: 100,
   		slide: function(event, ui) { 
   			currentGradientOpacity1 = ui.value; 
   			toolGradient.setOpacity(currentGradientOpacity1, currentGradientOpacity2);
   			$('#opa1Val').html(ui.value + "%"); 
   		}
	});
	$( "#gradientSliderOpacity2" ).slider({
		value:100,
		min: 0,
		max: 100,
   		slide: function(event, ui) { 
   			currentGradientOpacity2 = ui.value; 
   			toolGradient.setOpacity(currentGradientOpacity1, currentGradientOpacity2);
   			$('#opa2Val').html(ui.value + "%"); 
   		}
	});
	$( "#gradientRotation" ).slider({
		value:0,
		min: 0,
		max: 360,
		step: 45,
   		slide: function(event, ui) { 
   			currentGradientAngle = ui.value; 
   			toolGradient.setAngle(currentGradientAngle);
   			$('#angVal').html(ui.value + " Degree"); 
   		}
	});
	$( "#fontSizeSlider" ).slider({
		value: 12,
		min: 1,
		max: 100,
   		slide: function(event, ui) { 
   			currentFontSize = ui.value; 
   			toolFont.setFontSize(currentFontSize);
   			$('#sizVal').html(ui.value + "px"); 
   		}
	});
}

/* Refresh Context */
var refreshContext = function(id) {
	currentLayerID = id;
	currentCanvas = layerManager.getCurrentCanvas(currentLayerID);
	currentContext = layerManager.getCurrentContext(currentLayerID);
	filter.setNewCanvasContext(currentCanvas, currentContext);
	toolPen.setNewCanvasContext(currentCanvas, currentContext);
	toolPen.setColor(currentColor);
	toolPen.setWidth(currentBrushRadius);
	toolBrush.setNewCanvasContext(currentCanvas, currentContext);
	toolBrush.setColor(currentColor);
	toolBrush.setRadius(currentBrushRadius);
	toolFill.setNewCanvasContext(currentCanvas, currentContext);
	toolFill.setColor(currentColor);
	toolGradient.setNewCanvasContext(currentCanvas, currentContext);
	toolGradient.setColors(currentGradientColor1, currentGradientColor2);
	toolShapes.setNewCanvasContext(currentCanvas, currentContext);
	toolShapes.setColor(currentColor);
	toolFont.setNewCanvasContext(currentCanvas, currentContext);
	toolFont.setColor(currentColor);
	transformations.setNewCanvasContext(currentCanvas, currentContext);
}

