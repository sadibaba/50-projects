const form = document.querySelector("#searchForm");
const input = document.querySelector("#cityInput");
const statusEl = document.querySelector("#status");

const cityEl = document.querySelector("#city");
const dateEl = document.querySelector("#date");
const temperatureEl = document.querySelector("#temperature");
const conditionEl = document.querySelector("#condition");
const conditionIcon = document.querySelector("#conditionIcon");
const feelsLikeEl = document.querySelector("#feelsLike");
const humidityEl = document.querySelector("#humidity");
const windEl = document.querySelector("#wind");
const cloudsEl = document.querySelector("#clouds");
const tempMaxEl = document.querySelector("#tempMax");
const tempMinEl = document.querySelector("#tempMin");

const STORAGE_KEY = "weather-dashboard-city";

const weatherCodes = {
  0: ["Clear sky", "ri-sun-line"],
  1: ["Mainly clear", "ri-sun-line"],
  2: ["Partly cloudy", "ri-sun-cloudy-line"],
  3: ["Overcast", "ri-cloudy-line"],
  45: ["Fog", "ri-foggy-line"],
  48: ["Depositing rime fog", "ri-foggy-line"],
  51: ["Light drizzle", "ri-drizzle-line"],
  53: ["Drizzle", "ri-drizzle-line"],
  55: ["Dense drizzle", "ri-drizzle-line"],
  61: ["Slight rain", "ri-rainy-line"],
  63: ["Rain", "ri-rainy-line"],
  65: ["Heavy rain", "ri-heavy-showers-line"],
  71: ["Slight snow", "ri-snowy-line"],
  73: ["Snow", "ri-snowy-line"],
  75: ["Heavy snow", "ri-snowy-line"],
  80: ["Rain showers", "ri-showers-line"],
  81: ["Moderate showers", "ri-showers-line"],
  82: ["Violent showers", "ri-heavy-showers-line"],
  95: ["Thunderstorm", "ri-thunderstorms-line"],
  96: ["Thunderstorm with hail", "ri-thunderstorms-line"],
  99: ["Severe thunderstorm", "ri-thunderstorms-line"],
};

function describe(code) {
  return weatherCodes[code] || ["Unknown conditions", "ri-cloud-line"];
}

function setStatus(message) {
  statusEl.textContent = message;
}

async function geocode(city) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("The location service is unavailable.");

  const data = await response.json();
  if (!data.results || data.results.length === 0) {
    throw new Error(`No location found for "${city}".`);
  }

  return data.results[0];
}

async function getWeather(place) {
  const params = new URLSearchParams({
    latitude: place.latitude,
    longitude: place.longitude,
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,cloud_cover,wind_speed_10m",
    daily: "temperature_2m_max,temperature_2m_min",
    timezone: "auto",
  });

  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  if (!response.ok) throw new Error("The weather service is unavailable.");
  return response.json();
}

function render(place, data) {
  const current = data.current;
  const [description, icon] = describe(current.weather_code);
  const location = [place.name, place.admin1, place.country].filter(Boolean).join(", ");

  cityEl.textContent = location;
  dateEl.textContent = new Date(current.time).toLocaleString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "2-digit",
  });

  temperatureEl.textContent = Math.round(current.temperature_2m);
  conditionEl.textContent = description;
  conditionIcon.className = `${icon} text-5xl`;

  feelsLikeEl.textContent = `${Math.round(current.apparent_temperature)}°C`;
  humidityEl.textContent = `${current.relative_humidity_2m}%`;
  windEl.textContent = `${Math.round(current.wind_speed_10m)} km/h`;
  cloudsEl.textContent = `${current.cloud_cover}%`;
  tempMaxEl.textContent = `${Math.round(data.daily.temperature_2m_max[0])}°C`;
  tempMinEl.textContent = `${Math.round(data.daily.temperature_2m_min[0])}°C`;

  setStatus(`Showing weather for ${location}.`);
}

async function search(city) {
  const name = city.trim();
  if (!name) return;

  setStatus("Looking up the city...");

  try {
    const place = await geocode(name);
    const data = await getWeather(place);
    render(place, data);
    localStorage.setItem(STORAGE_KEY, name);
  } catch (error) {
    setStatus(error.message);
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  search(input.value);
});

const savedCity = localStorage.getItem(STORAGE_KEY) || "Karachi";
input.value = savedCity;
search(savedCity);
