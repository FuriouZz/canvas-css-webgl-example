'use strict'

const $app    = document.querySelector('#app')
const $canvas = $app.querySelector('canvas')
const gl      = $canvas.getContext('webgl')

const metrics = {
  width:      $app.offsetWidth,
  height:     $app.offsetHeight,
  pixelRatio: window.devicePixelRatio
}

// RAF
function onUpdate() {
  window.requestAnimationFrame(onUpdate)

  // Tips: Reset frame buffer
  gl.bindFramebuffer( gl.FRAMEBUFFER, null )

  // Setup
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
  gl.clearColor(1.0, 0.0, 0.0, 1.0)
  gl.clear( gl.COLOR_BUFFER_BIT )

  // Draw a square
  const half_size = 100
  gl.enable( gl.SCISSOR_TEST )
  gl.scissor( gl.drawingBufferWidth * 0.5 - half_size, gl.drawingBufferHeight * 0.5 - half_size, half_size * 2, half_size * 2 )
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