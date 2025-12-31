import express from 'express';
import { query, validationResult } from 'express-validator';
import axios from 'axios';
import logger from '../utils/logger.js'; // Importing our Unit I logger

const router = express.Router();

// Validation Middleware
const validateWeatherRequest = [
    query('city').optional().isString().trim(),
    query('query').optional().isString().trim(), // For search suggestions
    query('lat').optional().isNumeric(),
    query('lon').optional().isNumeric(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Unified route for Data (Current + Forecast)
// Routes: GET /api/weather/search
router.get('/search', validateWeatherRequest, async (req, res) => {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: "Query required" });

    try {
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=5&language=en&format=json`;
        const response = await axios.get(geoUrl);
        res.json(response.data.results || []);
    } catch (error) {
        logger.log(`Search API Error: ${error.message}`);
        res.status(500).json({ message: "Search failed" });
    }
});

// Unified route for Data (Current + Forecast)
// Routes: GET /api/weather/full
router.get('/full', validateWeatherRequest, async (req, res) => {
    const { city, lat, lon } = req.query;

    // Log the incoming request using our Event Emitter logger
    logger.log(`Request received for weather data: city=${city}, lat=${lat}, lon=${lon}`);

    if (!city && (!lat || !lon)) {
        return res.status(400).json({ message: "City name OR coordinates required" });
    }

    try {
        let latitude, longitude, name, country;

        if (lat && lon) {
            latitude = lat;
            longitude = lon;
            name = "Your Location";
            country = "";
        } else {
            // 1. Geocoding
            const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`;
            const geoRes = await axios.get(geoUrl);

            if (!geoRes.data.results || geoRes.data.results.length === 0) {
                logger.log(`City not found: ${city}`);
                return res.status(404).json({ message: "City not found" });
            }
            latitude = geoRes.data.results[0].latitude;
            longitude = geoRes.data.results[0].longitude;
            name = geoRes.data.results[0].name;
            country = geoRes.data.results[0].country;
        }

        // 2. Fetch Weather Data
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day,surface_pressure,visibility&hourly=temperature_2m,relative_humidity_2m,weather_code,precipitation_probability,wind_speed_10m,uv_index,visibility,surface_pressure&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,uv_index_max,precipitation_probability_max&timezone=auto`;

        // 3. Fetch Air Quality Data
        const airQualityUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=us_aqi`;

        const [weatherRes, aqRes] = await Promise.all([
            axios.get(weatherUrl),
            axios.get(airQualityUrl)
        ]);

        const data = weatherRes.data;
        const aqData = aqRes.data;

        const responseData = {
            location: { name, country, lat: latitude, lon: longitude, timezone: data.timezone },
            current: {
                temp: data.current.temperature_2m,
                feels_like: data.current.apparent_temperature,
                humidity: data.current.relative_humidity_2m,
                wind_speed: data.current.wind_speed_10m,
                weather_code: data.current.weather_code,
                is_day: data.current.is_day,
                pressure: data.current.surface_pressure,
                visibility: data.current.visibility,
                aqi: aqData.current ? aqData.current.us_aqi : null
            },
            hourly: data.hourly,
            daily: data.daily
        };

        res.json(responseData);

    } catch (error) {
        logger.log(`API Error: ${error.message}`);
        console.error("API Error:", error.message);
        res.status(500).json({ message: "Failed to fetch weather data" });
    }
});

export default router;
