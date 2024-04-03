document.addEventListener("DOMContentLoaded", () => {
    const cityInput = document.querySelector(".city-input");
    const searchButton = document.querySelector(".search-btn");
    const locationButton = document.querySelector(".location-btn");
    const currentWeatherDiv = document.querySelector(".current-weather");
    const weatherCardsDiv = document.querySelector(".weather-cards");
  
    const API_KEY = "9c4973cfe3ad982adf28c82b986a93b9";
    const CHANDIGARH_LATITUDE = 30.7333;
    const CHANDIGARH_LONGITUDE = 76.7794;
  
    const getWeatherDetails = (cityName, latitude, longitude) => {
      const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
  
      fetch(WEATHER_API_URL)
        .then(response => response.json())
        .then(data => {
          // Update the current weather details
          const currentWeatherHTML = `
            <h2>${data.name} (${data.sys.country})</h2>
            <h6>Temperature: ${data.main.temp}°C</h6>
            <h6>Wind: ${data.wind.speed} M/S</h6>
            <h6>Humidity: ${data.main.humidity}%</h6>
          `;
          currentWeatherDiv.innerHTML = currentWeatherHTML;
  
          // Clear previous forecast cards
          weatherCardsDiv.innerHTML = "";
  
          // Fetch further forecast
          return fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
        })
        .then(response => response.json())
        .then(data => {
          // Display further forecast
          const forecastCardsHTML = data.list.slice(0, 5).map(day => `
            <li class="card">
              <h3>${day.dt_txt}</h3>
              <h6>Temp: ${day.main.temp}°C</h6>
              <h6>Wind: ${day.wind.speed} M/S</h6>
              <h6>Humidity: ${day.main.humidity}%</h6>
            </li>
          `).join("");
          weatherCardsDiv.innerHTML = forecastCardsHTML;
        })
        .catch(error => {
          console.error("Error fetching weather data:", error);
          alert("An error occurred while fetching the weather data.");
        });
    };
  
    const getCityCoordinates = () => {
      const cityName = cityInput.value.trim();
      if (cityName === "") return;
      // Use Chandigarh coordinates for demonstration
      getWeatherDetails(cityName, CHANDIGARH_LATITUDE, CHANDIGARH_LONGITUDE);
    };
    
    const getUserCoordinates = () => {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`)
            .then(response => response.json())
            .then(data => {
              const cityName = data[0]?.name;
              if (cityName) {
                getWeatherDetails(cityName, latitude, longitude);
              } else {
                alert("City name not found for the provided coordinates.");
              }
            })
            .catch(error => {
              console.error("Error fetching city name from coordinates:", error);
              alert("An error occurred while fetching the city name.");
            });
        },
        error => {
          if (error.code === error.PERMISSION_DENIED) {
            alert("Geolocation request denied. Please reset location permission to grant access again.");
          } else {
            alert("Geolocation request error. Please reset location permission.");
          }
        }
      );
    };
  
    locationButton.addEventListener("click", getUserCoordinates);
    searchButton.addEventListener("click", getCityCoordinates);
    cityInput.addEventListener("keyup", (e) => e.key === "Enter" && getCityCoordinates());
  });