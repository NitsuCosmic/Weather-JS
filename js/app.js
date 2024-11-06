import { API_KEY, BASE_URL } from "./config.js";

const weatherContainer = document.querySelector("#weather-body");
const form = document.querySelector("#form");
const formInput = document.querySelector("#city-name-input");

let weatherInfo = null; // Initialize weatherInfo to avoid potential errors
const loadingText = document.createElement("p");
loadingText.classList.add("loading-text"); // Add a CSS class for styling
loadingText.textContent = "Loading...";

// Error handling function
function handleError(error) {
	console.error(error);
	weatherContainer.textContent = "An error occurred. Please try again.";
}

form.addEventListener("submit", (e) => {
	// Use submit event for form validation
	e.preventDefault();
	const cityName = formInput.value.trim(); // Trim leading/trailing whitespace

	if (cityName) {
		showLoading();
		searchCity(cityName);
	} else {
		weatherContainer.textContent = "Please enter a city name.";
	}
});

async function searchCity(cityName) {
	try {
		const response = await fetch(`${BASE_URL}?key=${API_KEY}&q=${cityName}`);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		weatherInfo = data;
		renderUI();
	} catch (error) {
		handleError(error);
	}
}

function renderUI() {
	if (weatherInfo) {
		const { location, current } = weatherInfo;
		const html = `
      <section class="weather__info">
        <h3 class="weather__info__time">${location.localtime}</h3>
        <h2 class="weather__info__city">${location.name}</h2>
        <h3 class="weather__info__country">${location.country}</h3>
        <section class="weather__conditions">
          <div class="weather__conditions__main">
            <h2 class="weather__conditions__temp">${current.temp_c}°C</h2>
            <h4 class="weather__conditions__condition">${current.condition.text}</h4>
          </div>
          <div class="weather__conditions__extra">
            <div><h4>Real feel: ${current.feelslike_c}°C</h4></div>
            <div><h4>Humidity: ${current.humidity}%</h4></div>
            <div><h4>Wind: ${current.wind_kph}km/h</h4></div>
          </div>
        </section>
      </section>
    `;
		weatherContainer.innerHTML = html;
	}
}

function showLoading() {
	weatherContainer.textContent = "";
	weatherContainer.appendChild(loadingText);
}
