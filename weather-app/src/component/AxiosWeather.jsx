import { useEffect, useState } from "react";
import "./FetchWeather.css";
import axios from "axios";

const AxiosWeather = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]); // 4 days
  const [query, setQuery] = useState(localStorage.getItem("lastCity") || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [unit, setUnit] = useState("C"); // C / F / K
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const API_KEY = "023bd9c799bacb1752a394d693a7f79a";

  // 🔥 Convert Kelvin to selected unit
  const convertTemp = (tempK) => {
    const c = tempK - 273.15;
    if (unit === "C") return `${c.toFixed(1)}°C`;
    if (unit === "F") return `${(c * 1.8 + 32).toFixed(1)}°F`;
    return `${tempK.toFixed(1)}K`;
  };

  // 🔥 Toggle light/dark theme
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const fetchForecast = async (lat, lon) => {
    try {
      const res = await axios.get(
        "https://api.openweathermap.org/data/2.5/forecast",
        {
          params: {
            lat,
            lon,
            appid: API_KEY,
          },
        }
      );

      // 4-day forecast (every 24 hours: index 8,16,24,32)
      //   const fourDays = [
      //     res.data.list[7],
      //     res.data.list[15],
      //     res.data.list[23],
      //     res.data.list[31],
      //   ];

      const sixDays = [
        res.data.list[7],
        res.data.list[15],
        res.data.list[23],
        res.data.list[31],
        res.data.list[39],
        res.data.list[39], // repeat last (OpenWeather only has 5 full days)
      ];
      

      setForecast(sixDays);
    } catch (err) {
      console.log("Forecast Error", err);
    }
  };

  const fetchWeatherData = async () => {
    if (!query) return;

    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        "https://api.openweathermap.org/data/2.5/weather",
        {
          params: {
            q: query,
            appid: API_KEY,
          },
        }
      );

      setWeather(response.data);
      localStorage.setItem("lastCity", query);

      // fetch next 4 days using coordinates
      const { lat, lon } = response.data.coord;
      fetchForecast(lat, lon);
    } catch (error) {
      setError("City not found. Try a different name.");
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, [query]);

  return (
    <div className={`weather-app ${theme}`}>
      <div className="weather-card">
        <h1>Weather App</h1>

        {/* Theme Toggle */}
        <button className="theme-btn" onClick={toggleTheme}>
          {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </button>

        {/* Search Row */}
        <div className="search-row">
          <input
            className="city-input"
            value={city}
            placeholder="Enter your city"
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && setQuery(city)}
          />

          <button
            className="search-btn"
            onClick={() => setQuery(city)}
            disabled={!city.trim()}
          >
            Search
          </button>
        </div>

        {error && <p className="error-box">{error}</p>}
        {loading && <p className="loading">Loading...</p>}

        {/* Current Weather */}
        {weather && !loading && (
          <div className="weather-info">
            <div className="left">
              <h3>{weather.name}</h3>
              <p className="temp">{convertTemp(weather.main.temp)}</p>
              <p className="meta">{weather.weather[0].description}</p>

              <div className="details">
                <p>Humidity: {weather.main.humidity}%</p>
                <p>Wind: {weather.wind.speed} m/s</p>
                <p>Feels Like: {convertTemp(weather.main.feels_like)}</p>
              </div>
            </div>

            <div className="weather-icon">
              {weather.weather[0].main === "Clouds" && "☁️"}
              {weather.weather[0].main === "Rain" && "🌧️"}
              {weather.weather[0].main === "Clear" && "☀️"}
              {weather.weather[0].main === "Snow" && "❄️"}
              {weather.weather[0].main === "Haze" && "🌫️"}
            </div>
          </div>
        )}

        {/* Temperature Unit Toggle */}
        <div className="unit-toggle">
          <button
            className={unit === "C" ? "active" : ""}
            onClick={() => setUnit("C")}
          >
            °C
          </button>
          <button
            className={unit === "F" ? "active" : ""}
            onClick={() => setUnit("F")}
          >
            °F
          </button>
          <button
            className={unit === "K" ? "active" : ""}
            onClick={() => setUnit("K")}
          >
            K
          </button>
        </div>

        {/* Next 4 Days Forecast */}
        {forecast.length > 0 && (
          <div className="forecast-container">
            <h2>Next 4 Days</h2>
            <div className="forecast-grid">
              {forecast.map((day, i) => (
                <div className="forecast-card" key={i}>
                  <p className="date">
                    {new Date(day.dt * 1000).toDateString()}
                  </p>
                  <p className="forecast-temp">{convertTemp(day.main.temp)}</p>
                  <p>{day.weather[0].description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AxiosWeather;
