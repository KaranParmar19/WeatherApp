import React from 'react';
import { ThermometerSun } from 'lucide-react';
import './DashboardGrid.css';

const RightSidebar = ({ daily, hourly }) => {

    // Chance of Rain (using precipitation_probability from hourly)
    // We'll just take the next 7 days max prob for simplicity or hourly for today
    // Reference shows "Saturday 99%", "Sunday 89%"... so it's likely Daily Chance of Rain.
    // OpenMeteo daily has `precipitation_probability_max`.

    const rainReview = daily.time.slice(0, 7).map((t, i) => ({
        day: new Date(t).toLocaleDateString('en-US', { weekday: 'long' }),
        prob: daily.precipitation_probability_max ? daily.precipitation_probability_max[i] : 0
    }));

    return (
        <div className="right-sidebar">
            {/* Sunrise & Sunset */}
            <div className="highlight-card sidebar-card">
                <div className="highlight-header">
                    <span>Sunrise and Sunset</span>
                </div>
                <div className="sun-times">
                    <div className="sun-item">
                        <ThermometerSun size={28} color="#FFD700" />
                        <div>
                            <div className="sun-label">Sunrise</div>
                            <div className="sun-value">
                                {new Date(daily.sunrise[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                            </div>
                        </div>
                    </div>
                    <div className="sun-item">
                        <ThermometerSun size={28} color="#FFA500" />
                        <div>
                            <div className="sun-label">Sunset</div>
                            <div className="sun-value">
                                {new Date(daily.sunset[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chance of Rain */}
            <div className="highlight-card sidebar-card" style={{ flex: 1 }}>
                <div className="highlight-header">
                    <span>Chance of Rain</span>
                </div>
                <div className="rain-list">
                    {rainReview.map((item, idx) => (
                        <div key={idx} className="rain-item">
                            <span className="rain-day">{item.day}</span>
                            <div className="rain-bar-container">
                                <span className="rain-pill">{item.prob}%</span>
                                <div className="rain-bar-bg">
                                    <div className="rain-bar-fill" style={{ width: `${item.prob}%` }}></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RightSidebar;
