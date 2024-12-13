'use strict'
const STORAGE_KEY = 'placeDB'
let gPlaces

_createPlaces()
function getPlaceById(placeId) {
  return gPlaces.find((place) => place.id === placeId)
}

function _createPlace(name, lat, lng, zoom) {
  return {
    id: makeId(),
    name,
    lat,
    lng,
    zoom,
  }
}

function _createPlaces() {
  gPlaces = loadFromStorage(STORAGE_KEY)
  if (gPlaces && gPlaces.length) return

  gPlaces = [_createPlace('Real Madrid City-Valdebebas', 40.480074, -3.606539, 10), _createPlace('Eilat', 29.506087, 35.082485, 15)]

  _savePlacesToStorage()
}

function getPlaces() {
  return gPlaces
}
function addPlace(name, lat, lng, zoom = 12) {
  const place = _createPlace(name, lat, lng, zoom)
  gPlaces.push(place)
  _savePlacesToStorage()
}

function removePlace(placeId) {
  const placeIdx = gPlaces.findIndex((place) => placeId === place.id)
  if (placeIdx !== -1) {
    gPlaces.splice(placeIdx, 1)
    _savePlacesToStorage()
  }
}

function _savePlacesToStorage() {
  saveToStorage(STORAGE_KEY, gPlaces)
}
