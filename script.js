// --- Get references to HTML elements ---
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const weatherInfoContainer = document.querySelector('.weather-info');
const errorContainer = document.getElementById('error-container');
const errorText = errorContainer.querySelector('p');

const cityNameEl = document.getElementById('city-name');
const weatherIconEl = document.getElementById('weather-icon');
const temperatureEl = document.getElementById('temperature');
const descriptionEl = document.getElementById('description');
const humidityEl = document.getElementById('humidity');
const windSpeedEl = document.getElementById('wind-speed');

// --- API Configuration ---
// Your API key for the "climate" project
const apiKey = '2eb6baf759f8e2eb6296ead8fa79b142'; 
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

// --- Function to fetch and display weather data ---
const getWeatherData = async (city) => {
    // Hide previous results and errors before a new search
    weatherInfoContainer.style.display = 'none';
    errorContainer.style.display = 'none';

    try {
        // Construct the full API URL with the city, API key, and metric units
        const url = `${apiUrl}?q=${city}&appid=${apiKey}&units=metric`;
        
        // Fetch data from the API
        const response = await fetch(url);

        // Check for specific error codes to provide better feedback to the user
        if (response.status === 401) {
            throw new Error('Invalid API Key. Please ensure your key is correct and has been activated.');
        }
        if (response.status === 404) {
            throw new Error(`City '${city}' not found. Please check the spelling.`);
        }
        // Generic error for other non-successful responses
        if (!response.ok) {
            throw new Error(`An error occurred: ${response.statusText}`);
        }

        // Parse the JSON data from the successful response
        const data = await response.json();

        // --- Update the UI with the fetched data ---
        cityNameEl.textContent = data.name;
        temperatureEl.innerHTML = `${Math.round(data.main.temp)}<sup>°C</sup>`;
        descriptionEl.textContent = data.weather[0].description;
        humidityEl.textContent = `${data.main.humidity}%`;
        windSpeedEl.textContent = `${data.wind.speed.toFixed(1)} km/h`;
        
        // Set the weather icon based on the code from the API
        const iconCode = data.weather[0].icon;
        weatherIconEl.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        weatherIconEl.alt = data.weather[0].description;

        // Display the weather info container now that it has data
        weatherInfoContainer.style.display = 'block';
        errorContainer.style.display = 'none';

    } catch (error) {
        // Handle any errors that occurred during the fetch process
        console.error("Error fetching weather data:", error.message);
        
        // Display the specific error message in the UI
        errorText.textContent = error.message;
        weatherInfoContainer.style.display = 'none';
        errorContainer.style.display = 'block';
    }
};

// --- Event Listeners ---

// 1. Trigger a search when the search button is clicked
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim(); // Get city name and remove extra spaces
    if (city) {
        getWeatherData(city);
    } else {
        alert('Please enter a city name.');
    }
});

// 2. Trigger a search when the 'Enter' key is pressed in the input field
cityInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        searchBtn.click(); // Programmatically click the search button
    }
});

// 3. Optional: Load weather for a default city when the page first loads
window.addEventListener('load', () => {
    getWeatherData('Chennai'); // You can change this to any default city
});
