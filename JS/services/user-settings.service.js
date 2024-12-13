'use strict'

const STORAGE_KEY = 'userData'
let user

function getUser() {
  user = loadFromStorage(STORAGE_KEY) || {
    email: '',
    txtColor: '',
    bgColor: '',
    age: '',
    birthDate: '',
    birthTime: '',
  }

  return user
}

function _saveUserToStorage() {
  saveToStorage(STORAGE_KEY, user)
}
