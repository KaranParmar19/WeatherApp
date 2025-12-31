// Simplified Climate Knowledge Base for major cities
// Used to answer "When is the best time to visit?" queries

export const CLIMATE_DATA = {
    "london": {
        best_months: ["May", "June", "September"],
        description: "Late spring and early autumn are mild and pleasant. Summer can be busy, and winter is often grey and rainy."
    },
    "new york": {
        best_months: ["May", "June", "September", "October"],
        description: "Spring and Autumn offer comfortable temperatures (15-25°C). Summers can be very hot and humid, while winters are freezing."
    },
    "paris": {
        best_months: ["June", "September", "October"],
        description: "Paris is beautiful in late spring and early autumn. Avoid August as many shops close for holidays."
    },
    "tokyo": {
        best_months: ["March", "April", "October", "November"],
        description: "Visit in Spring for cherry blossoms (Sakura) or Autumn for colorful foliage. Summers are extremely hot and humid."
    },
    "dubai": {
        best_months: ["November", "December", "January", "February"],
        description: "Winter is perfect (20-25°C). Summer (May-Sept) is dangerously hot (>40°C) and humid."
    },
    "mumbai": {
        best_months: ["November", "December", "January", "February"],
        description: "Winter months are dry and pleasant. Monsoon (June-Sept) brings heavy flooding."
    },
    "sydney": {
        best_months: ["September", "October", "November", "March", "April"],
        description: "Spring and Autumn are ideal. Summer (Dec-Feb) is great for beaches but can be very hot."
    },
    "rome": {
        best_months: ["April", "May", "September", "October"],
        description: "Spring and Autumn are perfect for sightseeing. July and August are often too hot for walking tours."
    },
    "singapore": {
        best_months: ["February", "March", "April"],
        description: "It's hot and humid year-round, but Feb-April is slightly drier. Avoid the haze season if possible."
    },
    "bangkok": {
        best_months: ["November", "December", "January", "February"],
        description: "Cool season is best. March-May is very hot, and June-October is the rainy season."
    }
};

export const findClimateAdvice = (city) => {
    const key = city.toLowerCase().trim();

    // Direct match
    if (CLIMATE_DATA[key]) return CLIMATE_DATA[key];

    // Partial match (e.g. "new york city" -> "new york")
    const match = Object.keys(CLIMATE_DATA).find(k => key.includes(k));
    if (match) return CLIMATE_DATA[match];

    return null;
};
