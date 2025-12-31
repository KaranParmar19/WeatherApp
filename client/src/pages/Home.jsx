import { useState, useEffect } from 'react'
import { Search, Droplets, Wind, Eye, Gauge, ThermometerSun, MapPin, Loader2, Activity } from 'lucide-react'
import { getOwmIconUrl, getWeatherDescription } from '../utils/weatherUtils'
import { useTheme } from '../context/ThemeContext'
import '../components/DashboardGrid.css'
import HighlightCard from '../components/HighlightCard'
import HourlyForecastGraph from '../components/HourlyForecastGraph'
import DailyForecastRow from '../components/DailyForecastRow'
import WindSpeedGraph from '../components/WindSpeedGraph'
import RightSidebar from '../components/RightSidebar'

function Home() {
    const [city, setCity] = useState('London')
    const [weatherData, setWeatherData] = useState(null)
    const [loading, setLoading] = useState(true) // Start loading immediately
    const [error, setError] = useState(null)
    const [inputVal, setInputVal] = useState('')
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [locating, setLocating] = useState(true); // New state for initial location attempt

    const { setTheme } = useTheme();

    const updateTheme = (isDay, weatherCode) => {
        if (!isDay) {
            setTheme('night');
            return;
        }
        if (weatherCode <= 3) setTheme('sunny');
        else if (weatherCode >= 51 && weatherCode <= 67) setTheme('rainy');
        else if (weatherCode >= 95) setTheme('rainy');
        else setTheme('cloudy');
    };

    const fetchWeather = async (query = '', lat = null, lon = null) => {
        try {
            setLoading(true)
            setError(null)

            let url = `/api/weather/full?`;
            if (lat && lon) url += `lat=${lat}&lon=${lon}`;
            else url += `city=${query}`;

            const response = await fetch(url)

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.message || 'Failed to fetch weather data');
            }

            const fullData = await response.json()
            updateTheme(fullData.current.is_day, fullData.current.weather_code);
            setWeatherData(fullData)
        } catch (err) {
            setError(err.message)
            setWeatherData(null)
            setTheme('default');
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const attemptLocation = async () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        fetchWeather(null, latitude, longitude);
                        setLocating(false);
                    },
                    (err) => {
                        console.warn("Geolocation failed or denied:", err);
                        fetchWeather('London'); // Fallback
                        setLocating(false);
                    },
                    { timeout: 5000 } // Add timeout to not wait forever
                );
            } else {
                fetchWeather('London');
                setLocating(false);
            }
        };
        attemptLocation();
    }, []);

    const handleInputChange = async (e) => {
        const value = e.target.value;
        setInputVal(value);

        // Lower threshold to 1 character for faster feedback
        if (value.length > 1) {
            try {
                const res = await fetch(`/api/weather/search?query=${value}`);
                if (res.ok) {
                    const data = await res.json();
                    setSuggestions(data || []);
                    setShowSuggestions(true);
                }
            } catch (err) {
                console.error("Search error", err);
            }
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setCity(suggestion.name);
        setInputVal(suggestion.name);
        setSuggestions([]);
        setShowSuggestions(false);
        fetchWeather(null, suggestion.latitude, suggestion.longitude);
    };

    // Close suggestions on click outside (simple version: close on submit)
    const handleSubmit = (e) => {
        e.preventDefault()
        setShowSuggestions(false);
        if (inputVal.trim()) {
            setCity(inputVal)
            fetchWeather(inputVal)
        }
    }

    return (
        <div className="page-container">
            <header className="home-header">
                <div>
                    <h1>Weather Forecast</h1>
                    <p style={{ opacity: 0.7 }}>{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>

                <div className="search-container" style={{ position: 'relative' }}>
                    <form onSubmit={handleSubmit} className="search-form">
                        <input
                            type="text"
                            placeholder="Search city e.g. Kolkata..."
                            value={inputVal}
                            onChange={handleInputChange}
                        />
                        <button type="submit"><Search size={20} /></button>
                    </form>

                    {showSuggestions && suggestions.length > 0 && (
                        <ul className="suggestions-list" style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            background: 'rgba(30, 40, 60, 0.95)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            marginTop: '10px',
                            padding: '10px 0',
                            listStyle: 'none',
                            zIndex: 2000,
                            maxHeight: '300px',
                            overflowY: 'auto',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                        }}>
                            {suggestions.map((suggestion) => (
                                <li
                                    key={suggestion.id}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    style={{
                                        padding: '10px 20px',
                                        cursor: 'pointer',
                                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                                        color: 'white',
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    <span style={{ fontWeight: 500 }}>{suggestion.name}</span>
                                    <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>
                                        {suggestion.admin1 ? `${suggestion.admin1}, ` : ''}{suggestion.country}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </header>

            {locating && (
                <div className="loading-indicator" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 150px)', color: 'white', fontSize: '1.2rem' }}>
                    <Loader2 className="spinner" size={48} />
                    <p style={{ marginTop: '20px' }}>Locating your information...</p>
                </div>
            )}

            {!locating && loading && (
                <div className="loading-indicator" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 150px)', color: 'white', fontSize: '1.2rem' }}>
                    <Loader2 className="spinner" size={48} />
                    <p style={{ marginTop: '20px' }}>Loading weather data...</p>
                </div>
            )}

            {error && <div className="error-msg">{error}</div>}

            {!locating && !loading && weatherData && (
                <div className="dashboard-grid fade-in">

                    {/* --- LEFT COLUMN: Current & Highlights --- */}
                    <div className="left-column">
                        <div className="current-weather-large">
                            <img
                                src={getOwmIconUrl(weatherData.current.weather_code, weatherData.current.is_day)}
                                alt="weather icon"
                                style={{ width: '100px', margin: '10px 0' }}
                            />

                            <div>
                                <div className="temp">{Math.round(weatherData.current.temp)}°C</div>
                                <div className="condition">{getWeatherDescription(weatherData.current.weather_code)}</div>
                            </div>

                            <div className="bottom-locs">
                                <div className="mini-loc-tag">Bengaluru 21.4°C</div>
                                <div className="mini-loc-tag">Dibrugarh 30.2°C</div>
                                <div className="mini-loc-tag">Guwahati 28.2°C</div>
                            </div>
                        </div>

                        <div className="highlights-grid">
                            <HighlightCard
                                title="Humidity"
                                value={weatherData.current.humidity}
                                unit="%"
                                icon={Droplets}
                                subText={`${weatherData.current.humidity} RH`}
                            />
                            <HighlightCard
                                title="Wind Speed"
                                value={weatherData.current.wind_speed}
                                unit="Kph"
                                icon={Wind}
                                subText={`${weatherData.current.wind_speed} Kph`}
                            />
                            <HighlightCard
                                title="Visibility"
                                value={(weatherData.current.visibility / 1000).toFixed(0)}
                                unit="Km"
                                icon={Eye}
                                subText={`${(weatherData.current.visibility / 1000).toFixed(0)} Km`}
                            />
                            <HighlightCard
                                title="Pressure"
                                value={weatherData.current.pressure}
                                unit="Hg"
                                icon={Gauge}
                                subText={`${weatherData.current.pressure} Hg`}
                            />
                            <HighlightCard
                                title="Air Quality"
                                value={weatherData.current.aqi}
                                unit="AQI"
                                icon={Activity}
                                subText={weatherData.current.aqi < 50 ? "Good" : weatherData.current.aqi < 100 ? "Moderate" : "Unhealthy"}
                            />
                            <HighlightCard
                                title="Precipitation"
                                value={weatherData.daily.precipitation_sum[0]}
                                unit="mm"
                                icon={Droplets}
                                subText={`${weatherData.daily.precipitation_sum[0]} mm`}
                            />
                        </div>
                    </div>

                    {/* --- CENTER COLUMN: Forecast & Graphs --- */}
                    <div className="center-column">
                        {/* Daily Forecast Row */}
                        <div className="highlight-card" style={{ padding: '15px' }}>
                            <div className="highlight-header"><span>7-Day Forecast</span></div>
                            <DailyForecastRow daily={weatherData.daily} />
                        </div>

                        {/* Forecast Weather Graph */}
                        <div className="highlight-card">
                            <div className="highlight-header"><span>Forecast Weather</span></div>
                            <HourlyForecastGraph data={weatherData} />
                        </div>

                        {/* Maximum Wind Speed Graph */}
                        <WindSpeedGraph hourly={weatherData.hourly} />
                    </div>

                    {/* --- RIGHT SIDEBAR --- */}
                    <RightSidebar daily={weatherData.daily} hourly={weatherData.hourly} />

                </div>
            )}
        </div>
    )
}

export default Home
