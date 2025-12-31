import React from 'react';
import './WeatherCard.css';

const WeatherCard = ({ data }) => {
    if (!data) return null;

    // Data structure tailored from Home.jsx mapping
    const { name, main, weather, wind, country } = data;
    const temp = Math.round(main.temp);
    const description = weather[0].description;
    // If iconUrl is provided (new way), use it. Else fall back to old OWM way (legacy support)
    const icon = weather[0].iconUrl || `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

    return (
        <div className="weather-card">
            <div className="card-header">
                <h2>{name}, {country}</h2>
                <p className="description">{description}</p>
            </div>
            <div className="card-body">
                <div className="temp-container">
                    <img src={icon} alt={description} className="weather-icon" />
                    <span className="temperature">{temp}°C</span>
                </div>
                <div className="details">
                    <div className="detail-item">
                        <span>Humidity</span>
                        <span>{main.humidity}%</span>
                    </div>
                    <div className="detail-item">
                        <span>Wind</span>
                        <span>{wind ? wind.speed : 0} km/h</span>
                    </div>
                    <div className="detail-item">
                        <span>Feels Like</span>
                        <span>{Math.round(main.feels_like)}°C</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeatherCard;
