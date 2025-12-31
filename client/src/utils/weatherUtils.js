// WMO Weather interpretation codes (WW)
// https://open-meteo.com/en/docs

export const getWeatherDescription = (code) => {
    switch (code) {
        case 0: return "Clear sky";
        case 1: return "Mainly clear";
        case 2: return "Partly cloudy";
        case 3: return "Overcast";
        case 45: case 48: return "Foggy";
        case 51: case 53: case 55: return "Drizzle";
        case 56: case 57: return "Freezing Drizzle";
        case 61: return "Slight Rain";
        case 63: return "Moderate Rain";
        case 65: return "Heavy Rain";
        case 66: case 67: return "Freezing Rain";
        case 71: return "Slight Snow";
        case 73: return "Moderate Snow";
        case 75: return "Heavy Snow";
        case 77: return "Snow Grains";
        case 80: case 81: case 82: return "Rain Showers";
        case 85: case 86: return "Snow Showers";
        case 95: return "Thunderstorm";
        case 96: case 99: return "Thunderstorm with Hail";
        default: return "Unknown";
    }
}

export const getWeatherIcon = (code, isDay = 1) => {
    // Mapping WMO codes to OpenWeatherMap icon names for reuse
    // or just return emoji/custom logic. Using OWM icon names since we set up that way initially,
    // but the URL will need to change if we want OWM icons, OR we can just return a URL.

    // Simple Emoji implementation for robustness (no ext dependencies)
    switch (code) {
        case 0: return isDay ? "☀️" : "🌙";
        case 1: case 2: return isDay ? "⛅" : "☁️";
        case 3: return "☁️";
        case 45: case 48: return "🌫️";
        case 51: case 53: case 55: return "🌦️";
        case 61: case 63: case 65: return "🌧️";
        case 71: case 73: case 75: return "❄️";
        case 95: case 96: case 99: return "⛈️";
        default: return "🌥️";
    }
}

// Helper to map code to OWM icon ID for compatibility with existing UI if needed
export const getOwmIconUrl = (code, isDay = 1) => {
    let iconCode = "01d";
    if (code === 0) iconCode = isDay ? "01d" : "01n";
    else if (code >= 1 && code <= 3) iconCode = isDay ? "02d" : "02n";
    else if (code >= 45 && code <= 48) iconCode = "50d";
    else if (code >= 51 && code <= 67) iconCode = "10d";
    else if (code >= 71 && code <= 86) iconCode = "13d";
    else if (code >= 95) iconCode = "11d";

    return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
}
