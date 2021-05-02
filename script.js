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

//Implement the rest of the classes
class Workout {
  data = new Date();
  id = (Date.now() + '').slice(-10);

  constructor(coords, distance, duration) {
    this.coords = coords; // [lat, lng]
    this.distance = distance; // in km
    this.duration = duration; // in min
  }
}

//Child classes
class Running extends Workout {
  type = 'running';
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    //Calculate pace
    this.calcPace();
  }

  calcPace() {
    // min/km
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  type = 'cycling';
  constructor(coords, distance, duration, elevGain) {
    super(coords, distance, duration);
    this.elevGain = elevGain;
    this.calcSpeed();
  }
  calcSpeed() {
    // km/h
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

/////////////////////////////////////
// Application architecture
class App {
  //Use a private class field to define map and mapEvent as properties of the object
  #map;
  #mapEvent;
  //Create empty array for workouts
  #workout = [];

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
    //Check if inputs are numbers
    const validInputs = (...inputs) =>
      inputs.every(inp => Number.isFinite(inp));

    //Check if respective inputs are greater than 0
    const allPositive = (...inputs) => inputs.every(inp => inp > 0);

    e.preventDefault();

    //Get data from form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    //Put workout variable outside of the block
    let workout;

    //If the workout is running, create running object
    if (type === 'running') {
      const cadence = +inputCadence.value;
      //Check if data is valid
      if (
        !validInputs(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      )
        return alert('Inputs have to be positive numbers!');
      //Create object
      workout = new Running([lat, lng], distance, duration, cadence);
    }
    //If the workout is cycling, create cycling object
    if (type === 'cycling') {
      const elevation = +inputElevation.value;
      //Check if data is valid
      if (
        !validInputs(distance, duration, elevation) ||
        !allPositive(distance, duration)
      )
        return alert('Inputs have to be positive numbers!');
      //Create object
      workout = new Cycling([lat, lng], distance, duration, elevation);
    }

    //Add new object to workout array
    this.#workout.push(workout);
    console.log(workout);

    //Render workout on map as a marker
    this.renderWorkoutMarker(workout);

    //Render workout on list

    //Hide the form

    //Clearing input fields
    inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value =
      '';
  }

  renderWorkoutMarker(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(workout.type)
      .openPopup();
  }
}

//Create object
const app = new App();

//////////////////Use classes to create workouts from the form
//////1º Render workout on the map (next video)
//////2º Render workout on the list (next video)

//FOR TO-DO-LIST
//////////////////////////////////////////
// const number = 30;

// const task = number + Number(recoger la mesa);

// const numbers = [12, 42, 43, 32, task, 32, 44, 5];

// console.log(numbers.sort((a, b) => a - b));

// //Check if data is valid
// const validInputs = (...inputs) => inputs.every(inp => inp > 0);

// if (!validInputs(distance, duration, cadence))
//   return alert('Inputs have to be positive numbers!');
