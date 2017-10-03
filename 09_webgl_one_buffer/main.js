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
 * Create a shader object
 *
 * @param {String} type
 * @param {String} string
 * @returns
 */
function createShader(type, string) {
  const shader = gl.createShader( type == 'vertex' ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER )

  gl.shaderSource( shader, string)
  gl.compileShader( shader )

  if ( !gl.getShaderParameter(shader, gl.COMPILE_STATUS) ) {
    const info = gl.getShaderInfoLog( shader );
    throw "Could not compile WebGL shader. \n\n" + info;
  }

  return shader
}

function createProgram(vertexShader, fragmentShader) {
  const program = gl.createProgram()

  gl.attachShader( program, vertexShader   )
  gl.attachShader( program, fragmentShader )

  gl.linkProgram ( program )

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog( program )
    throw "Could not compile WebGL program. \n\n" + info
  }

  return program
}

/**
 * Triangle setup
 *
 * @returns {Object}
 */
function Triangle() {
  // Create a triangle
  const vertexPositionSize = 2 // X and Y
  const vertexColorSize    = 3 // Red, Green and Blue
  const vertexCount        = 3 // Three vertices for a triangle right?

  // An array with 3 vertices with X and Y position, RGB color
  const vertices = [
    // X  // Y   // Red // Green // Blue
    -1.0, -1.0,  1.0,   0.0,     0.0,
     0.0,  1.0,  0.0,   1.0,     0.0,
     1.0, -1.0,  0.0,   0.0,     1.0
  ]

  const triangleBuffer = gl.createBuffer()

  gl.bindBuffer( gl.ARRAY_BUFFER, triangleBuffer )
  gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW )

  const triangleVertexShader = createShader( 'vertex', `
  attribute vec2 v_position;
  attribute vec3 v_color;

  varying vec3 f_color;

  void main() {
    f_color = v_color;

    gl_Position = vec4(v_position.x, v_position.y, 0.0, 1.0);
  }`)

  const triangleFragmentShader = createShader( 'fragment', `
  precision mediump float;

  varying vec3 f_color;

  void main() {
    gl_FragColor = vec4(f_color.r, f_color.g, f_color.b, 1.0);
  }`)

  const triangleProgram = createProgram( triangleVertexShader, triangleFragmentShader )

  function onDraw() {
    gl.useProgram( triangleProgram )

    gl.bindBuffer( gl.ARRAY_BUFFER, triangleBuffer )

    // Ok. Let's start.
    // A float correspond to 4 bytes in memory
    // We have X, Y, Red, Blue, Red as a float. So 5 * 4 = 20 bytes
    // The vertex size, in byte, is 20 bytes.
    const vertexByteSize = 5 * 4

    // Now we can manipulate the offset to describe each attribute.
    // Vertex position are X and Y, the two first entries. So the offset is 0 and the size 2. We save the vertexPositionSize above.
    const vertexPositionOffset = 0

    const v_position_location  = gl.getAttribLocation( triangleProgram, 'v_position' )
    gl.enableVertexAttribArray( v_position_location )
    gl.vertexAttribPointer( v_position_location, vertexPositionSize, gl.FLOAT, false, vertexByteSize, vertexPositionOffset )

    // Now when start the color arguments ? After the Y value.
    // So position offset + position size = 0 + 2 = 2
    // We need the offset in byte, so 2 * 4 = 8
    // The vertex color offset is equal to 8. We saved the vertexColorSize above
    const vertexColorOffset = vertexPositionOffset + vertexPositionSize * 4

    const v_color_location  = gl.getAttribLocation( triangleProgram, 'v_color' )
    gl.enableVertexAttribArray( v_color_location )
    gl.vertexAttribPointer( v_color_location, vertexColorSize, gl.FLOAT, false, vertexByteSize, vertexColorOffset )

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

  $canvas.width  = metrics.width  * metrics.pixelRatio
  $canvas.height = metrics.height * metrics.pixelRatio
  $canvas.style.width  = (metrics.width ) + 'px'
  $canvas.style.height = (metrics.height) + 'px'
}

onResize()
window.addEventListener('resize', onResize)