'use strict'

const $app    = document.querySelector('#app')
const $canvas = $app.querySelector('canvas')
const gl      = $canvas.getContext('webgl')

const metrics = {
  width:      $app.offsetWidth,
  height:     $app.offsetHeight,
  pixelRatio: window.devicePixelRatio
}

/**
 * Triangle setup
 *
 * @returns {Object}
 */
function Triangle() {
  // Create a triangle
  const vertexSize  = 2 // X and Y
  const vertexCount = 3 // Three vertices for a triangle right?

  // An array with 3 vertices with X and Y position
  const positions = [
    // X  // Y
    -1.0, -1.0,
     0.0,  1.0,
     1.0, -1.0
  ]

  const triangleBuffer = gl.createBuffer()

  // Say to WebGL: Hey! I got a buffer of type ARRAY_BUFFER. Use it right now!
  gl.bindBuffer( gl.ARRAY_BUFFER, triangleBuffer )

  // Say to WebGL: Hey buddy! Inside that buffer I give you three vertices. OK?
  gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW )

  // Now, I need to create a program, a vertex shader and a fragment shader to display my triangle

  // Create a new shader object of type VERTEX_SHADER.
  const triangleVertexShader = gl.createShader( gl.VERTEX_SHADER )

  // Associate a string to my shader object
  gl.shaderSource( triangleVertexShader, `
  attribute vec2 v_position;

  void main() {
    gl_Position = vec4(v_position.x, v_position.y, 0.0, 1.0);
  }`)

  // Compile my shader string with the shader object
  gl.compileShader( triangleVertexShader )

  // Tips: I can check the shader compilation success
  if ( !gl.getShaderParameter(triangleVertexShader, gl.COMPILE_STATUS) ) {
    const info = gl.getShaderInfoLog( triangleVertexShader );
    throw "Could not compile WebGL shader. \n\n" + info;
  }

  // Same as the vertex shader. But with a shader object of type FRAGMENT_SHADER
  const triangleFragmentShader = gl.createShader( gl.FRAGMENT_SHADER )
  gl.shaderSource( triangleFragmentShader, `
  void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  }`)
  gl.compileShader( triangleFragmentShader )

  if ( !gl.getShaderParameter(triangleFragmentShader, gl.COMPILE_STATUS) ) {
    const info = gl.getShaderInfoLog( triangleFragmentShader );
    throw "Could not compile WebGL shader. \n\n" + info;
  }

  // Yeah, finally I create a program
  const triangleProgram = gl.createProgram()

  // Attach my shaders to my program
  gl.attachShader( triangleProgram, triangleVertexShader   )
  gl.attachShader( triangleProgram, triangleFragmentShader )

  // Link everything together. Now, they are friends FOREVER.
  gl.linkProgram ( triangleProgram )

  // Tips: Of course, you can check whether they are really friends.
  if (!gl.getProgramParameter(triangleProgram, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog( triangleProgram )
    throw "Could not compile WebGL program. \n\n" + info
  }

  /**
   * OK! Fiou! I am fine. What I have to do right, now? Can I see my triangle ?
   * Soon buddy...soon.
   * Now, create a onDraw() function
   */
  function onDraw() {
    // OK. I have to say to the webgl context which program I use for the drawing.
    gl.useProgram( triangleProgram )

    // I need your attention about that special part.
    // We create an attribute v_position inside our vertex shader. We need to enable it and get its memory location.
    const v_position_location = gl.getAttribLocation( triangleProgram, 'v_position' )
    gl.enableVertexAttribArray( v_position_location )

    // Prepare the buffer with the triangle vertices
    gl.bindBuffer( gl.ARRAY_BUFFER, triangleBuffer )

    // Now, we have the v_position location and our array of position.
    // We need to explain to the program how to associate both.
    gl.vertexAttribPointer( v_position_location, vertexSize, gl.FLOAT, false, 0, 0 )

    // YES! HERE! RIGHT NOW! You can draw a triangle.
    gl.drawArrays( gl.TRIANGLES, 0, vertexCount )
  }

  return {
    draw: onDraw
  }
}

// Setup
const triangle = new Triangle

// RAF
function onUpdate() {
  window.requestAnimationFrame(onUpdate)

  // Tips: Reset frame buffer
  gl.bindFramebuffer( gl.FRAMEBUFFER, null )

  // Setup
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clear( gl.COLOR_BUFFER_BIT )

  // Draw triangle
  triangle.draw()
}

onUpdate()

// Resize
function onResize() {
  metrics.width      = $app.offsetWidth
  metrics.height     = $app.offsetHeight
  metrics.pixelRatio = window.devicePixelRatio

  $canvas.width  = metrics.width
  $canvas.height = metrics.height
  $canvas.style.width  = (metrics.width  * metrics.pixelRatio) + 'px'
  $canvas.style.height = (metrics.height * metrics.pixelRatio) + 'px'
}

onResize()
window.addEventListener('resize', onResize)