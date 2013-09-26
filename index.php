<!DOCTYPE HTML>
<html>
	<head>
		<title>Webprojekt 2.0</title>
		<!-- Stylesheets -->
		<link rel="stylesheet" type="text/css" href="css/reset.css"/>
		<link rel="stylesheet" type="text/css" href="lib/colorpicker.css"/>
		<link rel="stylesheet" type="text/css" href="lib/jqueryUI/css/ui-lightness/jquery-ui-1.8.18.custom.css"/>
		<link rel="stylesheet" type="text/css" href="css/main.css"/>
		
		<!-- Shaders -->
		<script type="text/javascript">
		<?php
			$vertexFile = "shaders/vertex1.txt";
			$fragmentFile = "shaders/fragment1.txt";
			
			$vertexArr = file($vertexFile);
			$out = 'var vertexShader = "";' . "\n";
			foreach ($vertexArr as $line_number => $line)
			{
				$out .= 'vertexShader += "' . trim($line) . "\";\n";
			}
			echo $out;
			
			$fragmentArr = file($fragmentFile);
			$out = 'var fragmentShader = "";' . "\n";
			foreach ($fragmentArr as $line_number => $line)
			{
				$out .= 'fragmentShader += "' . trim($line) .  "\";\n";
			}
			echo $out;
		?>
		</script>
		
		<!-- Libraries -->
		<script type="text/javascript" src="lib/jquery-1.7.2.min.js"></script>
		<script type="text/javascript" src="lib/jqueryUI/js/jquery-ui-1.8.18.custom.min.js"></script>
		<script type="text/javascript" src="lib/sylvester.js"></script>
		<script type="text/javascript" src="lib/gl-matrix-min.js"></script>
		<script type="text/javascript" src="lib/webgl-utils.js"></script>
		<script type="text/javascript" src="lib/colorpicker.js"></script>
		<script type="text/javascript" src="js/utility.js"></script>
		
		<!-- Classes -->
		<script type="text/javascript" src="classes/layerManager.js"></script>
		<script type="text/javascript" src="classes/filters.js"></script>
		<script type="text/javascript" src="classes/toolPen.js"></script>
		<script type="text/javascript" src="classes/toolBrush.js"></script>
		<script type="text/javascript" src="classes/toolFill.js"></script>
		<script type="text/javascript" src="classes/toolGradient.js"></script>
		<script type="text/javascript" src="classes/toolShapes.js"></script>
		<script type="text/javascript" src="classes/toolFont.js"></script>
		<script type="text/javascript" src="classes/transformations.js"></script>
		<script type="text/javascript" src="classes/charts.js"></script>
		<script type="text/javascript" src="classes/webgl.js"></script>
		
		<!-- Main -->
		<script type="text/javascript" src="js/main.js"></script>
	</head>
	<body>
		<!-- Toolbar -->
		<div id="header">
			<ul>
				<li><a href="#" id="new">New</a></li>
				<li>(Load images -> Drag &amp; Drop)</li>
			</ul>
		</div>
		
		<!-- Content Wrapper -->
		<div id="wrapper">
			<!-- Toolbar -->
			<div id="tools">
				<div class="moduleHeadline">Tools</div>
				<ul>
					<li class="tool" data-id="0"><a href="#" id="toolPen">&nbsp;</a></li>
					<li class="tool" data-id="1"><a href="#" id="toolBrush">&nbsp;</a></li>
					<li class="tool" data-id="2"><a href="#" id="toolFill">&nbsp;</a></li>
					<li class="tool" data-id="3"><a href="#" id="toolGradient">&nbsp;</a></li>
					<li class="tool" data-id="4"><a href="#" id="toolRectangle">&nbsp;</a></li>
					<li class="tool" data-id="5"><a href="#" id="toolCircle">&nbsp;</a></li>
					<li class="tool" data-id="6"><a href="#" id="toolFont">&nbsp;</a></li>
				</ul>
				<div id="colorpickerContainer"></div>
			</div>
			
			<!-- Paintarea -->
			<div class="paintArea" id="paintArea"><!-- Canvas Area --></div>
			
			<!-- Palettes --> 
			<div id="palette">
				<!-- Transformations, Filters, Charts, 3D -->
				<div id="toolBox">
					<div class="toggleToolBox"><img src="images/add.png" alt="+"/></div>
					<div class="moduleHeadline">Transformations</div>
					<ul>
						<li>
							<span class="headline">Rotate: </span>
							<input id="rotation" type="text" value="0.1"/>
							<input type="button" id="btnRotate" value="Rotate"/>
						</li>
						<li>
							<span class="headline">Scale: </span>
							<input id="scale" type="text" value="0.5"/>
							<input type="button" id="btnScale" value="Scale"/>
						</li>
					</ul>
					<div class="moduleHeadline">Filters</div>
					<ul>
						<li>
							<span class="headline">Threshold (0-255)</span>
							<input id="threshold" type="text" value="128"/>
							<input type="button" id="btnThreshold" value="Go"/>
						</li>
						<li>
							<span class="headline">Grayscale</span>
							<input type="button" id="btnGrayscale" value="Go"/>
						</li>
						<li>
							<span class="headline">Box Filter</span>
							<div>
								<input id="blur0" type="text" value="0"/>
								<input id="blur1" type="text" value="-1"/>
								<input id="blur2" type="text" value="0"/>
							</div>
							<div>
								<input id="blur3" type="text" value="-1"/>
								<input id="blur4" type="text" value="4"/>
								<input id="blur5" type="text" value="-1"/>
							</div>
							<div>
								<input id="blur6" type="text" value="0"/>
								<input id="blur7" type="text" value="-1"/>
								<input id="blur8" type="text" value="0"/>
							</div>
							<input type="button" id="btnLinearFilter" value="Go"/>
						</li>
						<li>
							<span class="headline">Minimal</span>
							<input type="button" id="btnMin" value="Go"/>
						</li>
						<li>
							<span class="headline">Median</span>
							<input type="button" id="btnMid" value="Go"/>
						</li>
						<li>
							<span class="headline">Maximum</span>
							<input type="button" id="btnMax" value="Go"/>
						</li>
					</ul>
					<div class="moduleHeadline">Charts</div>
					<ul>
						<li>
							<input type="button" id="btnPiechart" value="Draw Piechart"/>
						</li>
						<li>
							<input type="button" id="btnBarchart" value="Draw Barchart"/>
						</li>
					</ul>
					<div class="moduleHeadline">WebGL</div>
					<ul>
						<li>
							<input type="button" id="btnWebGL" value="Draw 3D"/>
						</li>
					</ul>
				</div>
				
				<!-- Brush / Pen, Gradient, Font -->
				<div id="optionBox">
					<div class="toggleOptionBox"><img src="images/add.png" alt="+"/></div>
					<div class="moduleHeadline brush">Brush</div>
					<div class="brushControls brush">
						<span class="headline">Opacity: <span id="opaVal">100 %</span></span>
						<div id="opacitySlider"></div>
						<span class="headline">Radius: <span id="radVal">10</span></span>
						<div id="radiusSlider"></div>
						<span class="headline">Shape: <span id="shpVal">360 Degree</span></span>
						<div id="shapeSlider"></div>
					</div>
					<div class="moduleHeadline gradient">Gradient</div>
					<div class="gradientControls gradient">
						<input id="graoption1" type="radio" name="gradientmode" value="0" checked="checked" /><label for="graoption1">Linear</label>
						<input id="graoption2" type="radio" name="gradientmode" value="1" /><label for="graoption2">Radial</label>
						<div id="gradientSlider"></div>
						<span class="headline">Color Left:</span>
						<div id="colorpickerGradient1"></div>
						<span class="headline">Opacity Left: <span id="opa1Val">100 %</span></span>
						<div id="gradientSliderOpacity1"></div>
						<span class="headline">Color Right:</span>
						<div id="colorpickerGradient2"></div>
						<span class="headline">Opacity Right: <span id="opa2Val">100 %</span></span>
						<div id="gradientSliderOpacity2"></div>
						<span class="headline">Angle: <span id="angVal">0 Degree</span></span>
						<div id="gradientRotation"></div>
					</div>
					<div class="moduleHeadline brush">Font</div>
					<div class="brushControls brush">
						<div>
							<span class="headline">Text: </span>
							<input type="text" id="fontText" value="Text"/>
						</div>
						<span class="headline">Size: <span id="sizVal">12 px</span></span>
						<div id="fontSizeSlider"></div>
						
					</div>
				</div>
				
				<!-- Layers -->
				<div id="layerBox">
					<div class="toggleLayerBox"><img src="images/add.png" alt="+"/></div>
					<div class="moduleHeadline">Layers</div>
					<div id="layers"><!-- Layers --></div>
					<div id="layerControls">
						<a href="#" id="addNewLayer">New Layer</a>
					</div>
				</div>
				
			</div>
		</div>
		
		<!-- PopUps -->
		<div id="dialogs"><!-- Dialogs --></div>
		
		
		
		<!-- Presentation -->
		
		

	</body>
</html>