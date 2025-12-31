import React from 'react';
import { getOwmIconUrl } from '../utils/weatherUtils';
import './DashboardGrid.css';

const DailyForecastRow = ({ daily }) => {
    // Show 7 days
    const days = daily.time.slice(0, 7);

    return (
        <div className="daily-forecast-container">
            {days.map((time, index) => {
                const date = new Date(time);
                const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
                // Shorten if needed or keep full based on space. 
                // Reference shows "Saturday", "Sunday" etc. 

                return (
                    <div key={index} className="daily-card">
                        <img
                            src={getOwmIconUrl(daily.weather_code[index])}
                            alt="icon"
                            className="daily-icon"
                        />
                        <div className="daily-temp">{Math.round(daily.temperature_2m_max[index])}° C</div>
                        <div className="daily-day">{dayName}</div>
                    </div>
                );
            })}
        </div>
    );
};

export default DailyForecastRow;
