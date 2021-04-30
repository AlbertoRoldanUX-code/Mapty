'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

//Create global variables so that I can access them inside the functions:
let map, mapEvent;

//Set Geolocation checking if it exists in the browser
if (navigator.geolocation)
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const { latitude } = position.coords;
      const { longitude } = position.coords;
      //Create link on google maps
      console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

      //Load the map and center it according to coords
      map = L.map('map').setView([latitude, longitude], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      //Leaflet event listener (handling clicks on map)
      map.on('click', function (mapE) {
        mapEvent = mapE;
        //////Render workout input form whenever the user clicks on the map
        form.classList.remove('hidden');

        //Immediately focus on Distance field
        inputDistance.focus();
      });
    },
    //Error callback
    function () {
      alert('Could not get your position');
    }
  );

//Display marker when submitting the form
form.addEventListener('submit', function (e) {
  e.preventDefault();
  //Clearing input fields
  inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value =
    '';
  const { latlng } = mapEvent;
  L.marker(latlng)
    .addTo(map)
    .bindPopup(
      L.popup({
        maxWidth: 250,
        minWidth: 100,
        autoClose: false,
        closeOnClick: false,
        className: 'running-popup',
      })
    )
    .setPopupContent('Workout')
    .openPopup();
});

//Toggle hidden class between Cadence and Elevation when clicking on type
inputType.addEventListener('change', function () {
  inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
  inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
});
