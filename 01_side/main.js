'use strict'


/**
 * WebGL Setup
 *
 * @param {String} id
 * @returns
 */
function WebGLSetup(id) {
  const $container = document.querySelector(id)
  const metrics    = {
    width: $container.offsetWidth,
    height: $container.offsetHeight
  }

  const scene  = new THREE.Scene
  const camera = new THREE.PerspectiveCamera( 75, metrics.width / metrics.height, 0.1, 1000 )

  // Setup renderer
  const renderer = new THREE.WebGLRenderer
  renderer.setSize( metrics.width, metrics.height )
  $container.appendChild(renderer.domElement)

  // Create a box
  const geometry = new THREE.BoxGeometry( 1, 1, 1 )
  const material = new THREE.MeshBasicMaterial({
    vertexColors: THREE.FaceColors,
    side: THREE.BackSide
  })
  const cube     = new THREE.Mesh( geometry, material )

  // Set face colors
  geometry.faces[0] .color.setHex(0x00ff00)
  geometry.faces[1] .color.setHex(0x00ff00)
  geometry.faces[2] .color.setHex(0xff0000)
  geometry.faces[3] .color.setHex(0xff0000)
  geometry.faces[4] .color.setHex(0x0000ff)
  geometry.faces[5] .color.setHex(0x0000ff)
  geometry.faces[6] .color.setHex(0xff00ff)
  geometry.faces[7] .color.setHex(0xff00ff)
  geometry.faces[8] .color.setHex(0x00ffff)
  geometry.faces[9] .color.setHex(0x00ffff)
  geometry.faces[10].color.setHex(0xffff00)
  geometry.faces[11].color.setHex(0xffff00)

  // Add cube to the scene
  scene.add( cube )

  // Camera is too closed to the cube
  camera.position.z = 5

  // onUpdate function
  function onUpdate() {
    // Rotate box
    cube.rotation.x += 0.0025
    cube.rotation.y += 0.005

    // Render image
    renderer.render( scene, camera )
  }

  function onResize() {
    metrics.width  = $container.offsetWidth
    metrics.height = $container.offsetHeight

    camera.aspect = metrics.width / metrics.height
    camera.updateProjectionMatrix()

    renderer.setSize( metrics.width, metrics.height )
  }

  return {
    update: onUpdate,
    resize: onResize
  }
}

/**
 * Canvas Setup
 *
 * @param {String} id
 * @returns
 */
function CanvasSetup(id) {
  const $container = document.querySelector(id)
  const metrics    = {
    width: $container.offsetWidth,
    height: $container.offsetHeight
  }

  const scene  = new THREE.Scene
  const camera = new THREE.PerspectiveCamera( 75, metrics.width / metrics.height, 0.1, 1000 )

  // Setup renderer
  const renderer = new THREE.CanvasRenderer
  renderer.setSize( metrics.width, metrics.height )
  $container.appendChild(renderer.domElement)

  // Create a box
  const geometry = new THREE.BoxGeometry( 1, 1, 1 )
  const material = new THREE.MeshBasicMaterial({
    vertexColors: THREE.FaceColors,
    overdraw: 1,
    side: THREE.BackSide
  })
  const cube     = new THREE.Mesh( geometry, material )

  // Set face colors
  geometry.faces[0] .color.setHex(0x00ff00)
  geometry.faces[1] .color.setHex(0x00ff00)
  geometry.faces[2] .color.setHex(0xff0000)
  geometry.faces[3] .color.setHex(0xff0000)
  geometry.faces[4] .color.setHex(0x0000ff)
  geometry.faces[5] .color.setHex(0x0000ff)
  geometry.faces[6] .color.setHex(0xff00ff)
  geometry.faces[7] .color.setHex(0xff00ff)
  geometry.faces[8] .color.setHex(0x00ffff)
  geometry.faces[9] .color.setHex(0x00ffff)
  geometry.faces[10].color.setHex(0xffff00)
  geometry.faces[11].color.setHex(0xffff00)

  // Add cube to the scene
  scene.add( cube )

  // Camera is too closed to the cube
  camera.position.z = 5

  // onUpdate function
  function onUpdate() {
    // Rotate box
    cube.rotation.x += 0.0025
    cube.rotation.y += 0.005

    // Render image
    renderer.render( scene, camera )
  }

  function onResize() {
    metrics.width  = $container.offsetWidth
    metrics.height = $container.offsetHeight

    camera.aspect = metrics.width / metrics.height
    camera.updateProjectionMatrix()

    renderer.setSize( metrics.width, metrics.height )
  }

  return {
    update: onUpdate,
    resize: onResize
  }
}

/**
 * CSS3D Setup
 *
 * @param {String} id
 * @returns
 */
function CSS3DSetup(id) {
  const $container = document.querySelector(id)
  const metrics    = {
    width: $container.offsetWidth,
    height: $container.offsetHeight
  }

  const scene  = new THREE.Scene
  const camera = new THREE.PerspectiveCamera( 75, metrics.width / metrics.height, 0.1, 1000 )

  // Setup renderer
  const renderer = new THREE.CSS3DRenderer
  renderer.setSize( metrics.width, metrics.height )
  $container.appendChild(renderer.domElement)

  function Element(face) {
    const $div = document.createElement( 'div' )
    $div.style.width  = '1px'
    $div.style.height = '1px'

    const object = new THREE.CSS3DObject( $div )

    if (face == 'left') {
      object.rotation.y = Math.PI * 0.5
      object.position.x = -0.5
      $div.style.backgroundColor = 'rgba(255, 0, 0, 1)'
    }

    if (face == 'right') {
      object.rotation.y = Math.PI * 0.5
      object.position.x = 0.5
      $div.style.backgroundColor = 'rgba(0, 255, 0, 1)'
    }

    if (face == 'top') {
      object.rotation.x = Math.PI * 0.5
      object.position.y = 0.5
      $div.style.backgroundColor = 'rgba(0, 0, 255, 1)'
    }

    if (face == 'bottom') {
      object.rotation.x = Math.PI * 0.5
      object.position.y = -0.5
      $div.style.backgroundColor = 'rgba(255, 0, 255, 1)'
    }

    if (face == 'forward') {
      object.position.z = -0.5
      $div.style.backgroundColor = 'rgba(255, 255, 0, 1)'
    }

    if (face == 'backward') {
      object.position.z = 0.5
      $div.style.backgroundColor = 'rgba(0, 255, 255, 1)'
    }

    return object
  }

  const cube = new THREE.Group
  cube.add( new Element('left'    ) )
  cube.add( new Element('right'   ) )
  cube.add( new Element('top'     ) )
  cube.add( new Element('bottom'  ) )
  cube.add( new Element('backward') )
  cube.add( new Element('forward' ) )

  // Add cube to the scene
  scene.add( cube )

  // Camera is too closed to the cube
  camera.position.z = 5

  // onUpdate function
  function onUpdate() {
    // Rotate box
    cube.rotation.x += 0.0025
    cube.rotation.y += 0.005

    // Render image
    renderer.render( scene, camera )
  }

  function onResize() {
    metrics.width  = $container.offsetWidth
    metrics.height = $container.offsetHeight

    camera.aspect = metrics.width / metrics.height
    camera.updateProjectionMatrix()

    renderer.setSize( metrics.width, metrics.height )
  }

  return {
    update: onUpdate,
    resize: onResize
  }
}


// RAF
const WebGLRenderer  = WebGLSetup('#app__webgl')
const CSS3DRenderer  = CSS3DSetup('#app__css3d')
const CanvasRenderer = CanvasSetup('#app__canvas')

function onUpdate() {
  window.requestAnimationFrame(onUpdate)

  WebGLRenderer.update()
  CSS3DRenderer.update()
  CanvasRenderer.update()
}

onUpdate()

// Resize
window.addEventListener('resize', function onResize() {
  WebGLRenderer.resize()
  CSS3DRenderer.resize()
  CanvasRenderer.resize()
})
