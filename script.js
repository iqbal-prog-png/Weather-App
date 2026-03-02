const API_KEY = "d245e90c0b0c5c5c72216a978b980425"; // Replace with your actual API key

function getWeatherIcon(main) {
  const icons = {
    clear: "☀️",
    clouds: "☁️",
    rain: "🌧️",
    drizzle: "🌦️",
    thunderstorm: "⛈️",
    snow: "❄️",
    mist: "🌫️",
    fog: "🌫️",
  };
  return icons[main.toLowerCase()] || "☁️";
}

async function fetchWeather(city) {
  const loading = document.getElementById("loading");
  const error = document.getElementById("error");
  const weatherInfo = document.getElementById("weatherInfo");

  loading.style.display = "block";
  error.style.display = "none";
  weatherInfo.style.display = "none";

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`,
    );

    const data = await response.json();

    if (!response.ok) {
      // Handle different error types
      if (response.status === 401) {
        throw new Error(
          "Invalid API key. Please get a valid API key from OpenWeatherMap.",
        );
      } else if (response.status === 404) {
        throw new Error("City not found. Please check the spelling.");
      } else {
        throw new Error(data.message || "Something went wrong");
      }
    }

    displayWeather(data);
  } catch (err) {
    error.textContent = err.message;
    error.style.display = "block";
  } finally {
    loading.style.display = "none";
  }
}

function displayWeather(data) {
  document.getElementById("cityName").textContent = data.name;
  document.getElementById("country").textContent = data.sys.country;
  document.getElementById("weatherIcon").textContent = getWeatherIcon(
    data.weather[0].main,
  );
  document.getElementById("temperature").textContent =
    Math.round(data.main.temp) + "°C";
  document.getElementById("description").textContent =
    data.weather[0].description;
  document.getElementById("humidity").textContent = data.main.humidity + "%";
  document.getElementById("windSpeed").textContent = data.wind.speed + " m/s";
  document.getElementById("pressure").textContent = data.main.pressure + " hPa";
  document.getElementById("visibility").textContent =
    (data.visibility / 1000).toFixed(1) + " km";
  document.getElementById("feelsLike").textContent =
    Math.round(data.main.feels_like) + "°C";
  document.getElementById("minMax").textContent =
    Math.round(data.main.temp_min) +
    "° / " +
    Math.round(data.main.temp_max) +
    "°";

  document.getElementById("weatherInfo").style.display = "block";
}

function searchWeather() {
  const city = document.getElementById("cityInput").value.trim();
  if (city) {
    fetchWeather(city);
  } else {
    const error = document.getElementById("error");
    error.textContent = "Please enter a city name";
    error.style.display = "block";
  }
}

document.getElementById("cityInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchWeather();
  }
});

// window.addEventListener("load", () => {
//   fetchWeather("London");
// });
