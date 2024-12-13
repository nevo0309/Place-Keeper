'use srtict'

function onSubmit(ev) {
  ev.preventDefault()

  const elForm = document.querySelector('form')
  user.email = elForm.querySelector('[name="email"]').value
  user.age = elForm.querySelector('[name="age"]').value
  user.txtColor = elForm.querySelector('[name="color"]').value
  user.bgColor = elForm.querySelector('[name="backgroundColor"]').value
  user.birthDate = elForm.querySelector('[name="date"]').value
  user.birthTime = elForm.querySelector('[name="time"]').value

  _saveUserToStorage()
  renderUserPrefs()
  console.log(user)
  ev.target.reset()
}

function renderUserPrefs() {
  const user = getUser()

  document.body.style.color = user.txtColor
  document.body.style.backgroundColor = user.bgColor
}

function showAge(newVal) {
  document.getElementById('sAge').innerHTML = newVal
}
