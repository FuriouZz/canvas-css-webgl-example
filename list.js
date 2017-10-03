'use strict'

const $select = document.createElement('select')
document.body.appendChild($select)

$select.addEventListener('change', function(e) {
  window.location.href = $select.value
})

document.addEventListener('keyup', function(e) {
  let index = 0
  if (e.key == 'ArrowRight') {
    index = ($select.selectedIndex + 1) % $select.options.length
  } else if (e.key == 'ArrowLeft') {
    index = ($select.selectedIndex - 1 + $select.options.length) % $select.options.length
  }

  $select.selectedIndex = index
  $select.dispatchEvent(new Event('change'))
})

const xhr = new XMLHttpRequest
xhr.responseType = 'json'
xhr.overrideMimeType('text/json')

xhr.open('GET', '../projects.json')
xhr.onload = function() {
  xhr.response.forEach(function(item) {
    const $option = document.createElement('option')
    $option.textContent = item
    $option.value = '../' + item

    const regex = new RegExp("^/"+item+"/$", 'gi')

    if (window.location.pathname.match(regex)) {
      $option.selected = true
    }

    $select.appendChild($option)
  })
}
xhr.send()
