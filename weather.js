const weather_img = document.querySelector(".weather-img");
const temperature = document.querySelector(".temperature");
const description = document.querySelector(".description");
const humidity = document.getElementById("humidity");
const wind_speed = document.getElementById("wind-speed");
const location_not_found = document.querySelector(".location-not-found");
const location_data = document.querySelector(".location");
const weather_body = document.querySelector(".weather-body");
const unitSelect = document.getElementById("unit-select");

// global variable for unit change
let selectedUnit = "metric";

// Event listener for unit selection dropdown
unitSelect.addEventListener("change", handleUnitChange);

function handleUnitChange() {
  // Get the selected unit from the dropdown
  selectedUnit = unitSelect.value;

  // Update the temperature show in  display
  const currentTemperature = temperature.innerHTML;
  const convertedTemperature = convertTemperature(
    currentTemperature,
    selectedUnit
  );
  temperature.innerHTML = ` ${convertedTemperature}`;

  const cityName = document.getElementById("getCityName").value;
  getWeather(cityName);
}

function convertTemperature(temperature, unit) {
  if (unit === "imperial") {
    // Convert from Celsius to Fahrenheit
    return `${Math.round((parseFloat(temperature) * 9) / 5 + 32)}°F`;
  } else {
    // Default to Celsius
    return `${Math.round(parseFloat(temperature))}°C`;
  }
}

function handleGetWeather() {
  // error massage rest
  location_not_found.style.display = "none";

  const cityName = document.getElementById("getCityName").value;
  getWeather(cityName);
}

function getWeather(cityName) {
  const apiKey = "3e81ecd6221cb9cff68b6d479698fe57";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=${selectedUnit}&appid=${apiKey}`;

  const xhr = new XMLHttpRequest();
  xhr.addEventListener("load", function () {
    if (xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);

      if (data.cod === "404") {
        location_not_found.style.display = "block";
        return;
      }

      // Display weather information
      location_data.innerHTML = ` ${data.name}, ${data.sys.country}`;
      temperature.innerHTML = ` ${Math.round(data.main.temp)}°${
        selectedUnit === "imperial" ? "F" : "C"
      }`;
      const dsc = data.weather[0].main;
      description.innerHTML = dsc;
      humidity.innerHTML = `${data.main.humidity}%`;
      wind_speed.innerHTML = `${data.wind.speed} `;
      document.querySelector(".main").style.backgroundImage =
        "url('https://source.unsplash.com/1600x900/?" + cityName + "')";

      if (dsc == "Clouds") {
        weather_img.src = "/assets/cloud.png";
      } else if (dsc == "Clear") {
        weather_img.src = "/assets/clear.png";
      } else if (dsc == "Rain") {
        weather_img.src = "/assets/rain.png";
      } else if (dsc == "Haze") {
        weather_img.src = "/assets/mist.png";
      } else {
        weather_img.src = "/assets/snow.png";
      }
    } else {
      console.error("Error fetching weather data: ", xhr.statusText);
    }
  });

  xhr.open("GET", url);
  xhr.send();
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      handleGeolocationSuccess,
      handleGeolocationError
    );
  } else {
    console.error("Geolocation is not supported in this browser.");
  }
}

function handleGeolocationSuccess(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  getWeatherByCoordinates(latitude, longitude);
}

function handleGeolocationError(error) {
  console.error("Geolocation error:", error);
}

function getWeatherByCoordinates(latitude, longitude) {
  const geoApiKey = "28da025d659b42c09d99f029ffe7bf87";
  const geo_url = ` https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${geoApiKey}`;

  const xhr = new XMLHttpRequest();
  xhr.addEventListener("load", function () {
    if (xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);
      getWeather(data);
      if (data.cod === "404") {
        location_not_found.style.display = "block";
        return;
      }

      location_data.innerHTML = ` ${data?.results[0].components?.suburb}, ${data.results[0].components.county} ,${data?.results[0]?.components?.state},${data?.results[0]?.components.country}`;

      const temp = Math.round(data?.main?.temp);
      temperature.innerHTML = temp ? temp : "No Data Found";
      const huminy = data.main?.humidity;
      humidity.innerHTML = huminy ? huminy : "No Data Found";
      const w_speed = data.wind?.speed;
      wind_speed.innerHTML = w_speed ? w_speed : "No Data Found";

      const main_location = ` ${data.results[0].components.state}`;
      getWeather(main_location.split(" ")[1]);
    } else {
      console.error("Error fetching weather data: ", xhr.statusText);
    }
  });

  xhr.open("GET", geo_url);
  xhr.send();
}

document
  .getElementById("getCityName")
  .addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
      const cityName = document.getElementById("getCityName").value;
      getWeather(cityName);
    }
  });

// Initialize the app by getting weather based on geolocation
getLocation();
