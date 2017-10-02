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
  const vertexPositionSize   = 2 // X and Y
  const vertexPositionOffset = 0
  const vertexColorSize      = 3 // Red, Green and Blue
  const vertexColorOffset    = vertexPositionOffset + vertexPositionSize * 4
  const vertexCount          = 3 // Three vertices for a triangle right?

  // An array with 3 vertices with X and Y position, RGB color
  const vertices = [
    // X  // Y   // Red // Green // Blue
    -1.0, -1.0,  1.0,   0.0,     0.0,
    0.0,  1.0,  0.0,   1.0,     0.0,
    1.0, -1.0,  0.0,   0.0,     1.0
  ]

  const vertexByteSize = (vertices.length / vertexCount) * 4

  const triangleBuffer = gl.createBuffer()

  gl.bindBuffer( gl.ARRAY_BUFFER, triangleBuffer )
  gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW )

  const triangleVertexShader = createShader( 'vertex', `
  attribute vec2 v_position;
  attribute vec3 v_color;

  varying vec3 f_color;

  uniform float u_time;

  void main() {
    f_color = v_color;
    f_color.r = (cos(u_time * 0.001) + 1.0) * 0.5;
    f_color.g = v_color.g - (sin(u_time * 0.0025) + 1.0) * 0.5;

    gl_Position = vec4(v_position.x, v_position.y, 0.0, 1.0);
  }`)

  const triangleFragmentShader = createShader( 'fragment', `
  precision mediump float;

  varying vec3 f_color;

  void main() {
    gl_FragColor = vec4(f_color.r, f_color.g, f_color.b, 1.0);
  }`)

  const triangleProgram = createProgram( triangleVertexShader, triangleFragmentShader )

  function onDraw( time ) {
    gl.useProgram( triangleProgram )

    gl.bindBuffer( gl.ARRAY_BUFFER, triangleBuffer )

    const v_position_location = gl.getAttribLocation( triangleProgram, 'v_position' )
    gl.enableVertexAttribArray( v_position_location )
    gl.vertexAttribPointer( v_position_location, vertexPositionSize, gl.FLOAT, false, vertexByteSize, vertexPositionOffset )

    const v_color_location = gl.getAttribLocation( triangleProgram, 'v_color' )
    gl.enableVertexAttribArray( v_color_location )
    gl.vertexAttribPointer( v_color_location, vertexColorSize, gl.FLOAT, false, vertexByteSize, vertexColorOffset )

    // Get uniform location and set time value
    const u_time_location = gl.getUniformLocation( triangleProgram, 'u_time' )
    gl.uniform1f( u_time_location, time )

    gl.drawArrays( gl.TRIANGLES, 0, vertexCount )
  }

  return {
    draw: onDraw
  }
}

// Setup
const triangle = new Triangle

// RAF
function onUpdate(time) {
  window.requestAnimationFrame(onUpdate)

  // Tips: Reset frame buffer
  gl.bindFramebuffer( gl.FRAMEBUFFER, null )

  // Setup
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clear( gl.COLOR_BUFFER_BIT )

  // Draw triangle
  triangle.draw(time)
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