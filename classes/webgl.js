function webgl(parent, vertexShader, fragmentShader) {
	this.canvas = document.createElement("canvas");
	this.canvas.id = "canvas";
	this.canvas.width = 1024;
	this.canvas.height = 663;
	parent.appendChild(this.canvas);
	this.gl;
	
	// Constants
	this.shaderMode = 0;
	
	// Members
	this.vertexPositionBuffer;
	this.vertexColorBuffer;
	this.vertexIndexBuffer;
	
	//Model, View, Projection
	this.mvMatrix = mat4.create();
	this.mvMatrixStack = [];
	this.pMatrix = mat4.create();

	//Transformations and Animation
	this.lastTime = new Date().getTime();
	this.rotation = 0;
	//Shader Program
	this.shaderProgram;
	
	//Shaders
	this.fragment = fragmentShader;	
	this.vertex = vertexShader;

	this.init();
}

webgl.prototype.init = function() {
	this.initGL();
	this.initShaders();
	this.initBuffers();
	this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
	this.gl.enable(this.gl.DEPTH_TEST);
	this.tick();
}

webgl.prototype.tick = function() {
	//requestAnimFrame(_self.tick); // webgl-utils.js from google
	this.drawScene();
    this.animate();
    setTimeout(this.tick.bind(this), 1000/60);
}
webgl.prototype.initGL = function() {
	try {
		this.gl = this.canvas.getContext("moz-webgl");
    if (!this.gl)
        this.gl = this.canvas.getContext("webkit-3d");
    if(!this.gl) 
    	this.gl = this.canvas.getContext("webgl");
    if(!this.gl)
		this.gl = this.canvas.getContext("experimental-webgl");
		this.gl.viewportWidth = this.canvas.width;
		this.gl.viewportHeight = this.canvas.height;
	} catch(e) {
		alert("Error on initialize!");
	}
	if(!this.gl) {
		alert("No WebGL");
	}
}

webgl.prototype.initShaders = function() {
	var fragmentShader = this.getFragmentShader(this.shaderMode);
	var vertexShader = this.getVertexShader(this.shaderMode);

	this.shaderProgram = this.gl.createProgram();
	this.gl.attachShader(this.shaderProgram, vertexShader);
	this.gl.attachShader(this.shaderProgram, fragmentShader);
	this.gl.linkProgram(this.shaderProgram);

	if(!this.gl.getProgramParameter(this.shaderProgram, this.gl.LINK_STATUS)) {
		alert("Could not initialise shaders");
	}

	this.gl.useProgram(this.shaderProgram);

	// Set VertexPositions to shader
	this.shaderProgram.vertexPositionAttribute = this.gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
	this.gl.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);
	// Set VertexColorAttribute to shader
	this.shaderProgram.vertexColorAttribute = this.gl.getAttribLocation(this.shaderProgram, "aVertexColor");
    this.gl.enableVertexAttribArray(this.shaderProgram.vertexColorAttribute);
    
	//Set uniforms
	this.shaderProgram.pMatrixUniform = this.gl.getUniformLocation(this.shaderProgram, "uPMatrix");
	this.shaderProgram.mvMatrixUniform = this.gl.getUniformLocation(this.shaderProgram, "uMVMatrix");
}

webgl.prototype.getVertexShader = function(id) {
	var code = "";
	switch(id) {
		case 0:
			code = this.vertex;
			break;
	}

	var shader = this.gl.createShader(this.gl.VERTEX_SHADER);

	this.gl.shaderSource(shader, code);
	this.gl.compileShader(shader);

	if(!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
		alert(this.gl.getShaderInfoLog(shader));
		return null;
	}

	return shader;
}
webgl.prototype.getFragmentShader = function(id) {
	var code = "";
	switch(id) {
		case 0:
			code = this.fragment;
			break;
	}

	var shader = this.gl.createShader(this.gl.FRAGMENT_SHADER);

	this.gl.shaderSource(shader, code);
	this.gl.compileShader(shader);

	if(!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
		alert(this.gl.getShaderInfoLog(shader));
		return null;
	}

	return shader;
}
webgl.prototype.initBuffers = function() {
	// Vertex Buffer
	this.vertexPositionBuffer = this.gl.createBuffer();
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexPositionBuffer);
	var vertices = [
        // Front face
      -1.0, -1.0,  1.0,
       1.0, -1.0,  1.0,
       1.0,  1.0,  1.0,
      -1.0,  1.0,  1.0,

      // Back face
      -1.0, -1.0, -1.0,
      -1.0,  1.0, -1.0,
       1.0,  1.0, -1.0,
       1.0, -1.0, -1.0,

      // Top face
      -1.0,  1.0, -1.0,
      -1.0,  1.0,  1.0,
       1.0,  1.0,  1.0,
       1.0,  1.0, -1.0,

      // Bottom face
      -1.0, -1.0, -1.0,
       1.0, -1.0, -1.0,
       1.0, -1.0,  1.0,
      -1.0, -1.0,  1.0,

      // Right face
       1.0, -1.0, -1.0,
       1.0,  1.0, -1.0,
       1.0,  1.0,  1.0,
       1.0, -1.0,  1.0,

      // Left face
      -1.0, -1.0, -1.0,
      -1.0, -1.0,  1.0,
      -1.0,  1.0,  1.0,
      -1.0,  1.0, -1.0];
	this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
	this.vertexPositionBuffer.itemSize = 3;
	this.vertexPositionBuffer.numItems = 24;
	
	// Color Buffer
    this.vertexColorBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexColorBuffer);
    var colors = [
      [1.0, 0.0, 0.0, 1.0],     // Front face
      [1.0, 1.0, 0.0, 1.0],     // Back face
      [0.0, 1.0, 0.0, 1.0],     // Top face
      [1.0, 0.5, 0.5, 1.0],     // Bottom face
      [1.0, 0.0, 1.0, 1.0],     // Right face
      [0.0, 0.0, 1.0, 1.0]      // Left face
    ];
    var unpackedColors = [];
    for (var i in colors) {
      var color = colors[i];
      for (var j=0; j < 4; j++) {
        unpackedColors = unpackedColors.concat(color);
      }
    }
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(unpackedColors), this.gl.STATIC_DRAW);
    this.vertexColorBuffer.itemSize = 4;
    this.vertexColorBuffer.numItems = 24;
    
    // Index Buffer
    this.vertexIndexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
    var vertexIndices = [
      0, 1, 2,      0, 2, 3,    // Front face
      4, 5, 6,      4, 6, 7,    // Back face
      8, 9, 10,     8, 10, 11,  // Top face
      12, 13, 14,   12, 14, 15, // Bottom face
      16, 17, 18,   16, 18, 19, // Right face
      20, 21, 22,   20, 22, 23  // Left face
    ];
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndices), this.gl.STATIC_DRAW);
    this.vertexIndexBuffer.itemSize = 1;
    this.vertexIndexBuffer.numItems = 36;
}

webgl.prototype.drawScene = function() {
	this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
	this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
	mat4.perspective(45, this.gl.viewportWidth / this.gl.viewportHeight, 0.1, 100.0, this.pMatrix);
	mat4.identity(this.mvMatrix);
	mat4.translate(this.mvMatrix, [-1.5, 0.0, -7.0]);
	
	/* Draw + Transformation START */
	this.mvPushMatrix();
    mat4.rotate(this.mvMatrix, this.degToRad(this.rotation), [1, 1, 1]);
    
	// Bind Vertex Buffer
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexPositionBuffer);
	this.gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, this.vertexPositionBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
	// Bind Color Buffer
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexColorBuffer);
    this.gl.vertexAttribPointer(this.shaderProgram.vertexColorAttribute, this.vertexColorBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
	// Bind Index Buffer
	this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
	// Set Uniforms
	this.setMatrixUniforms();
	// Draw
	this.gl.drawElements(this.gl.TRIANGLES, this.vertexIndexBuffer.numItems, this.gl.UNSIGNED_SHORT, 0);

	this.mvPopMatrix();
	/* Draw + Transformation END */
}
webgl.prototype.animate = function() {
	var timeNow = new Date().getTime();
    if (this.lastTime != 0) {
      var elapsed = timeNow - this.lastTime;

      this.rotation += (90 * elapsed) / 1000.0;
    }
    this.lastTime = timeNow;
}
webgl.prototype.mvPushMatrix = function() {
	var copy = mat4.create();
    mat4.set(this.mvMatrix, copy);
    this.mvMatrixStack.push(copy);
}
webgl.prototype.mvPopMatrix = function() {
	if (this.mvMatrixStack.length == 0) {
      throw "Invalid popMatrix!";
    }
    this.mvMatrix = this.mvMatrixStack.pop();
}
webgl.prototype.degToRad = function(degrees) {
	return degrees * Math.PI / 180;
}
webgl.prototype.setMatrixUniforms = function() {
	this.gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, this.pMatrix);
	this.gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, this.mvMatrix);
}