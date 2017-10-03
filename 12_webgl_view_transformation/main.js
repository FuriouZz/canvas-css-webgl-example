'use strict'

const $app    = document.querySelector('#app')
const $canvas = $app.querySelector('canvas')
const gl      = $canvas.getContext('webgl')

const metrics = {
  width:      $app.offsetWidth,
  height:     $app.offsetHeight,
  pixelRatio: window.devicePixelRatio
}

const { mat4 } = window.glMatrix

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

  const triangleModelMatrix = mat4.create()

  const triangleModel = {
    position: [ 0, 0, -10 ], // Now Z axis works and we can go below than 1 and -1
    scale: [ 0, 0, 0 ],
    angleZ: 0
  }

  const cameraMatrix = mat4.create()

  const camera = {
    fov: 45,
    aspect: metrics.width / metrics.height,
    near: 0.1,
    far: 100.0
  }

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

  uniform mat4 u_model_matrix;
  uniform mat4 u_view_matrix;

  void main() {
    f_color = v_color;

    gl_Position = u_view_matrix * u_model_matrix * vec4(v_position.x, v_position.y, 0.0, 1.0);
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

    // Reset model matrix
    mat4.identity( triangleModelMatrix )

    // Make translation
    triangleModel.position[0] = Math.cos(time * 0.001) * 0.5
    mat4.translate( triangleModelMatrix, triangleModelMatrix, triangleModel.position )

    // Make scale
    triangleModel.scale[0] = triangleModel.scale[1] = triangleModel.scale[2] = Math.abs(Math.sin(time * 0.001))
    mat4.scale( triangleModelMatrix, triangleModelMatrix, triangleModel.scale )

    // Make rotation on Z axis
    triangleModel.angleZ = Math.cos(time * 0.001) * Math.PI
    mat4.rotate( triangleModelMatrix, triangleModelMatrix, triangleModel.angleZ, [ 0, 0, 1 ] )

    // Set model matrix
    const u_model_matrix_location = gl.getUniformLocation( triangleProgram, 'u_model_matrix' )
    gl.uniformMatrix4fv( u_model_matrix_location, false, triangleModelMatrix )

    // Set view matrix
    mat4.perspective( cameraMatrix, camera.fov, camera.aspect, camera.near, camera.far )
    const u_view_matrix_location = gl.getUniformLocation( triangleProgram, 'u_view_matrix' )
    gl.uniformMatrix4fv( u_view_matrix_location, false, cameraMatrix )

    gl.drawArrays( gl.TRIANGLES, 0, vertexCount )
  }

  function onResize() {
    camera.aspect = metrics.width / metrics.height
  }

  return {
    draw: onDraw,
    resize: onResize
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

  $canvas.width  = metrics.width  * metrics.pixelRatio
  $canvas.height = metrics.height * metrics.pixelRatio
  $canvas.style.width  = (metrics.width ) + 'px'
  $canvas.style.height = (metrics.height) + 'px'

  triangle.resize()
}

onResize()
window.addEventListener('resize', onResize)