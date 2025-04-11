import React, { useEffect, useState } from "react";
import axios from "axios";

const Country = ({ capital }) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_API_KEY;
    const fetchWeather = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&appid=${apiKey}`
        );
        setWeather(response.data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeather();
  }, [capital]);

  if (!weather) {
    return <p>Loading weather data...</p>;
  }

  return (
    <div>
      <h2>Weather in {capital}</h2>
      <p>Temperature: {weather.main.temp}° Celsius</p>
      <p>Weather: {weather.weather[0].description}</p>
      <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt="Weather icon"
      />
      <p>Wind: {weather.wind.speed} m/s direction {weather.wind.deg}°</p>
    </div>
  );
};

export default Country;