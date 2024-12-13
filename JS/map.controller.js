'use strict'

let gZoomLevel = 15
let gMap
let gMarkers = []
let gEditPlaceId = null // Tracks if we're editing a place

function onInit() {
  renderPlaces()
}

function renderPlaces() {
  const places = getPlaces()
  const elPlacesList = document.querySelector('.places-list')

  const strHtmls = places.map(
    (place) => `
          <li>
              <span class="place-name">${place.name}</span>
              <div class="place-actions">
                <button class="remove-btn" onclick="onRemovePlace('${place.id}')" title="Remove place">X</button>
                <button class="pan-btn" onclick="onPanToPlace('${place.id}')" title="Go to Location">Go</button>
              </div>
          </li>
          `
  )

  elPlacesList.innerHTML = strHtmls.join('')
}

function initMap(lat = 40.453053, lng = -3.688344) {
  const elMap = document.querySelector('.map')
  const mapOptions = {
    center: { lat, lng },
    zoom: gZoomLevel,
  }
  gMap = new google.maps.Map(elMap, mapOptions)

  const markerOptions = {
    position: { lat, lng },
    map: gMap,
    title: 'Santiago Bernabéu',
  }
  const marker = new google.maps.Marker(markerOptions)

  renderMarkers()
  setupMap(gMap)
}

function setupMap() {
  gMap.addListener('click', (ev) => {
    const lat = ev.latLng.lat()
    const lng = ev.latLng.lng()
    openAddPlaceModal(lat, lng)
  })
}

function renderMarkers() {
  const places = getPlaces()
  gMarkers.forEach((marker) => marker.setMap(null)) // Clear existing markers
  gMarkers = places.map((place) => {
    const marker = new google.maps.Marker({
      position: { lat: place.lat, lng: place.lng },
      map: gMap,
      title: place.name,
    })

    marker.addListener('click', () => {
      openEditPlaceModal(place.lat, place.lng, place.name, place.id)
    })

    return marker
  })
}

function onPanToPlace(placeId) {
  const place = getPlaceById(placeId)
  gMap.setCenter({ lat: place.lat, lng: place.lng })
  gMap.setZoom(place.zoom)
}

function onUserLocation() {
  if (!navigator.geolocation) {
    alert('HTML5 Geolocation is not supported in your browser')
    return
  }

  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords
    const userPos = { lat: latitude, lng: longitude }
    gMap.setCenter(userPos)
  })
}

function onRemovePlace(placeId) {
  removePlace(placeId)
  renderPlaces()
  renderMarkers()
}

// Modal Handling
function openAddPlaceModal(lat = '', lng = '') {
  gEditPlaceId = null // Reset edit mode
  document.getElementById('modal-title').innerText = 'Add Place'
  document.getElementById('place-name').value = ''
  document.getElementById('place-lat').value = lat
  document.getElementById('place-lng').value = lng
  document.getElementById('place-modal').classList.remove('hidden')
}

function openEditPlaceModal(lat, lng, name, placeId) {
  gEditPlaceId = placeId // Set edit mode
  document.getElementById('modal-title').innerText = 'Edit Place'
  document.getElementById('place-name').value = name
  document.getElementById('place-lat').value = lat
  document.getElementById('place-lng').value = lng
  document.getElementById('place-modal').classList.remove('hidden')
}

function closeModal() {
  document.getElementById('place-modal').classList.add('hidden')
}

function onAddOrUpdatePlace(event) {
  event.preventDefault()
  const name = document.getElementById('place-name').value
  const lat = parseFloat(document.getElementById('place-lat').value)
  const lng = parseFloat(document.getElementById('place-lng').value)

  if (gEditPlaceId) {
    // Update place
    const place = getPlaceById(gEditPlaceId)
    place.name = name
    _savePlacesToStorage()
  } else {
    // Add new place
    addPlace(name, lat, lng, gMap.getZoom())
  }

  renderPlaces()
  renderMarkers()
  closeModal()
}

//close modal
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeModal()
})
