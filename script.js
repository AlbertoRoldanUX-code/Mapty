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

// Implement app class
class App {
  //Use a private class field to define map and mapEvent as properties of the object
  #map;
  #mapEvent;

  constructor() {
    //Call getPosition method to trigger Geolocation API as soon as a new object is created
    this._getPosition();

    //Display marker when submitting the form
    form.addEventListener('submit', this._newWorkout.bind(this));

    //Toggle hidden class between Cadence and Elevation when clicking on type
    inputType.addEventListener('change', this._toggleElevationField);
  }

  _getPosition() {
    //Set Geolocation checking if it exists in the browser
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        //Error callback
        function () {
          alert('Could not get your position');
        }
      );
  }

  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;

    //Load the map and center it according to coords
    this.#map = L.map('map').setView([latitude, longitude], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    //Leaflet event listener (handling clicks on map)
    this.#map.on('click', this._showForm.bind(this));
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    //Render workout input form whenever the user clicks on the map
    form.classList.remove('hidden');

    //Immediately focus on Distance field
    inputDistance.focus();
  }

  _toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(e) {
    e.preventDefault();
    //Clearing input fields
    inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value =
      '';
    const { latlng } = this.#mapEvent;
    L.marker(latlng)
      .addTo(this.#map)
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
  }
}

//Create object
const app = new App();

/////////Implement the rest of the classes
