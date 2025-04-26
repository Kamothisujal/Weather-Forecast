const apiKey = '65488db48fff5308c4608e17d2d34395';

// DOM Elements
const searchBtn = document.getElementById('searchBtn');
const geoBtn = document.getElementById('geoBtn');
const locationInput = document.getElementById('locationInput');

// Event Listeners
searchBtn.addEventListener('click', () => {
  const location = locationInput.value.trim();
  if (location) {
    fetchWeatherData(location);
  } else {
    alert('Please enter a location.');
  }
});

geoBtn.addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      fetchWeatherByCoords(latitude, longitude);
    }, () => {
      alert('Unable to access your location.');
    });
  } else {
    alert('Geolocation is not supported by your browser.');
  }
});

// Fetch current weather using location name
async function fetchWeatherData(location) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (response.ok) {
      updateCurrentWeather(data);
      fetchForecastData(data.coord.lat, data.coord.lon);
    } else {
      alert('Location not found. Please enter a valid location.');
    }
  } catch (error) {
    console.error(error);
    alert('Error fetching weather data. Please try again later.');
  }
}

// Fetch current weather using coordinates
async function fetchWeatherByCoords(lat, lon) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (response.ok) {
      updateCurrentWeather(data);
      fetchForecastData(lat, lon);
    } else {
      alert('Error fetching weather data for your location.');
    }
  } catch (error) {
    console.error(error);
    alert('Error fetching weather data. Please try again later.');
  }
}

// Fetch 5-day forecast
async function fetchForecastData(lat, lon) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (response.ok) {
      updateWeatherForecast(data);
    } else {
      alert('Error fetching forecast data.');
    }
  } catch (error) {
    console.error(error);
    alert('Error fetching forecast data. Please try again later.');
  }
}

// Update current weather UI
function updateCurrentWeather(data) {
  const currentTemp = document.getElementById('currentTemp');
  const currentCondition = document.getElementById('currentCondition');
  const currentHumidity = document.getElementById('currentHumidity');
  const currentWind = document.getElementById('currentWind');
  const weatherIcon = document.getElementById('weatherIcon');

  currentTemp.textContent = `Temperature: ${data.main.temp.toFixed(1)}°C`;
  currentCondition.textContent = `Condition: ${data.weather[0].description}`;
  currentHumidity.textContent = `Humidity: ${data.main.humidity}%`;
  currentWind.textContent = `Wind Speed: ${data.wind.speed} km/h`;

  const iconCode = data.weather[0].icon;
  weatherIcon.innerHTML = `<img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="Weather Icon">`;
}

// Update forecast UI
function updateWeatherForecast(data) {
  const forecastContainer = document.getElementById('forecastContainer');
  forecastContainer.innerHTML = '';

  const daily = {};

  data.list.forEach(item => {
    const date = item.dt_txt.split(' ')[0];
    if (!daily[date] && item.dt_txt.includes('12:00:00')) {
      daily[date] = item;
    }
  });

  Object.values(daily).forEach(day => {
    const date = new Date(day.dt_txt);
    const iconCode = day.weather[0].icon;
    const temp = day.main.temp.toFixed(1);
    const condition = day.weather[0].description;

    const forecastDay = document.createElement('div');
    forecastDay.classList.add('forecast-day');
    forecastDay.innerHTML = `
      <h4>${date.toLocaleDateString(undefined, { weekday: 'short' })}</h4>
      <img src="https://openweathermap.org/img/wn/${iconCode}.png" alt="${condition}">
      <p>${temp}°C</p>
      <p>${condition}</p>
    `;

    forecastContainer.appendChild(forecastDay);
  });
}

const resetBtn = document.getElementById('resetBtn'); // Grab reset button

resetBtn.addEventListener('click', () => {
  locationInput.value = ''; // Clear the input field
  resetWeatherDisplay();    // Clear weather data
});

// Function to reset displayed weather and forecast
function resetWeatherDisplay() {
  document.getElementById('currentTemp').textContent = 'Temperature: --°C';
  document.getElementById('currentCondition').textContent = 'Condition: --';
  document.getElementById('currentHumidity').textContent = 'Humidity: --%';
  document.getElementById('currentWind').textContent = 'Wind Speed: -- km/h';
  document.getElementById('weatherIcon').innerHTML = ''; // Remove icon
  document.getElementById('forecastContainer').innerHTML = ''; // Clear forecast
}
