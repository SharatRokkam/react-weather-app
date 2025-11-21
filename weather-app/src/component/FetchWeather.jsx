import { useEffect, useState } from "react";
import "./FetchWeather.css";

const FetchWeather = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [query, setQuery] = useState("");

  const API_KEY = "023bd9c799bacb1752a394d693a7f79a";

  const fetchWeatherData = () => {
    if (!query) return;

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${API_KEY}`
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("City not found");
        }
        return res.json(); // IMPORTANT: return JSON
      })
      .then((data) => {
        console.log(data);
        setWeather(data);
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  useEffect(() => {
    fetchWeatherData();
  }, [query]);

  return (
    <div className="weather-app">
      <div className="weather-card">
        <h1>Weather App</h1>

        {/* Search input + button */}
        <div className="search-row">
          <input
            className="city-input"
            value={city}
            placeholder="Enter your city"
            onChange={(e) => setCity(e.target.value)}
          />

          <button
            className="search-btn"
            onClick={() => setQuery(city)}
            disabled={!city.trim()}
          >
            Search
          </button>
        </div>

        {/* Show weather only when available */}
        {weather && (
          <div className="weather-info">
            <div className="left">
              <h3>{weather.name}</h3>

              {/* Convert Kelvin to Celsius */}
              <p className="temp">
                {(weather.main.temp - 273.15).toFixed(1)}°C
              </p>

              <p className="meta">{weather.weather[0].description}</p>
            </div>

            {/* Simple icon box */}
            <div className="weather-icon">
              {weather.weather[0].main === "Clouds" && "☁️"}
              {weather.weather[0].main === "Rain" && "🌧️"}
              {weather.weather[0].main === "Clear" && "☀️"}
              {weather.weather[0].main === "Snow" && "❄️"}
              {weather.weather[0].main === "Haze" && "🌫️"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FetchWeather;
