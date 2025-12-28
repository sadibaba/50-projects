// DOM selectors
const cityEl = document.querySelector('.city');
const dateTime = document.querySelector('.date');
const mainDegree = document.querySelector('.main-degree');
const el = document.querySelector('.search-bar');
const elButton = document.querySelector('.search-button');
const tempMax = document.querySelector('.temp-max');
const tempMin = document.querySelector('.temp-min');
const humidityEl = document.querySelector('.humidity');
const cloudy = document.querySelector('.cloudy');
const windEl = document.querySelector('.wind');

let api;
let apiKey = "b190a0605344cc4f3af08d0dd473dd25"; // that's a public api so that's why i didn't hide it .env LoL 

// Trigger by button click
elButton.addEventListener('click', () => {
  if (el.value.trim() !== '') {
    requestApi(el.value.trim());
  }
});

// Trigger by Enter key
el.addEventListener('keyup', (e) => {
  if (e.key === 'Enter' && el.value.trim() !== '') {
    requestApi(el.value.trim());
  }
});

// Build API URL
function requestApi(cityName) {
  api = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`;
  fetchData();
}

// Fetch data
function fetchData() {
  fetch(api)
    .then(res => res.json())
    .then(data => weatherDetails(data))
    .catch(err => console.log(err));
}

// Inject data into DOM
function weatherDetails(info) {
  const {
    name: cityName,
    sys: { country: countryName },
    weather: [{ description, id }],
    main: { temp, feels_like, humidity },
    wind: { speed },
    dt,
    clouds
  } = info;

  const weatherDate = new Date(dt * 1000).toLocaleString('en', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });

  mainDegree.innerText = Math.round(temp);
  cityEl.innerText = `${cityName}, ${countryName}`;
  tempMin.innerText = Math.round(feels_like);
  tempMax.innerText = Math.round(temp); 
  humidityEl.innerText = `${humidity}%`;
  windEl.innerText = `${speed} km/h`;
  dateTime.innerText = weatherDate;
  cloudy.innerText = `${clouds.all}%`;
}