import React, { useState, useRef, useEffect } from 'react';
import './Pages.css';
import { Send, MapPin, Sparkles, User, Bot } from 'lucide-react';

const Assistant = () => {
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState([
        { type: 'bot', text: "Hello! I'm your smart weather advisor. You can ask me things like 'Can I go for a run in London?' or 'Is it safe to drive in New York?'" }
    ]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    // --- LOGIC ENGINE ---

    const ACTIVITIES = {
        RUN: { keywords: ['run', 'jog', 'marathon'], rules: { maxTemp: 25, minTemp: 5, maxRain: 10, maxWind: 25 }, name: 'Running' },
        SWIM: { keywords: ['swim', 'beach', 'pool'], rules: { minTemp: 24, maxRain: 0, maxWind: 15 }, name: 'Swimming' },
        PICNIC: { keywords: ['picnic', 'park', 'camping'], rules: { minTemp: 18, maxRain: 0, maxWind: 15 }, name: 'Picnic' },
        DRIVE: { keywords: ['drive', 'travel', 'car'], rules: { maxRain: 50, maxWind: 40 }, name: 'Driving' },
        HIKE: { keywords: ['hike', 'climb', 'walk'], rules: { maxTemp: 28, minTemp: 10, maxRain: 5, maxWind: 20 }, name: 'Hiking' }
    };

    const parseQuery = (query) => {
        const lowerQ = query.toLowerCase();

        // 0. Detect "Best Time" Intent
        // e.g. "when to visit", "best time", "which month"
        if (lowerQ.includes("when") || lowerQ.includes("month") || lowerQ.includes("best time")) {
            // Extract city: try to capture proper noun sequences or look for "for/to [City]"
            // Simple heuristic: "to [City]", "visit [City]", "for [City]"
            let city = "";
            const patterns = ["visit ", "to ", "for ", "in "];
            for (let p of patterns) {
                if (lowerQ.includes(p)) {
                    city = query.split(new RegExp(p, "i"))[1].trim().replace("?", "");
                    break;
                }
            }
            if (!city) city = query.trim().replace("?", "");

            return { intent: "RECOMMENDATION", city };
        }

        // 1. Detect Activity
        let detectedActivity = null;
        for (const key in ACTIVITIES) {
            if (ACTIVITIES[key].keywords.some(k => lowerQ.includes(k))) {
                detectedActivity = ACTIVITIES[key];
                break;
            }
        }

        // 2. Detect City
        let city = "";
        if (lowerQ.includes(" in ")) {
            city = query.split(/ in /i)[1].trim().replace("?", "");
        } else if (!detectedActivity) {
            city = query.trim().replace("?", "");
        } else {
            return { error: "Where at? Please specify a city (e.g., 'in Tokyo').", activity: detectedActivity };
        }

        return { city, activity: detectedActivity };
    };

    const evaluateWeather = (data, activity) => {
        const current = data.current;
        const temp = current.temp;
        const wind = current.wind_speed;
        const rainProb = data.hourly.precipitation_probability[0]; // approximated current rain prob
        const isDay = current.is_day;

        if (!activity) {
            // General Travel Advice
            if (rainProb > 40) return `It's rainy in ${data.location.name} (${rainProb}% prob). Pack an umbrella! ☔`;
            if (wind > 30) return `It's quite windy in ${data.location.name} (${wind} km/h). 💨`;
            if (temp > 30) return `It's hot in ${data.location.name} (${temp}°C). Stay cool! ☀️`;
            return `Conditions in ${data.location.name} are clear (${temp}°C). Enjoy your day! 👍`;
        }

        // Activity Specific Logic
        const rules = activity.rules;
        let reasons = [];
        let score = 10; // Start perfect

        if (rules.maxTemp && temp > rules.maxTemp) { score -= 4; reasons.push(`too hot (${temp}°C)`); }
        if (rules.minTemp && temp < rules.minTemp) { score -= 4; reasons.push(`too cold (${temp}°C)`); }
        if (rules.maxRain !== undefined && rainProb > rules.maxRain) { score -= 5; reasons.push(`too rainy (${rainProb}%)`); }
        if (rules.maxWind && wind > rules.maxWind) { score -= 3; reasons.push(`too windy (${wind} km/h)`); }

        if (activity.name === 'Swimming' && !isDay) { score -= 50; reasons.push("it's night time"); }

        if (score >= 8) return `Yes! It's perfect for ${activity.name.toLowerCase()} in ${data.location.name}. Go for it! 🏃‍♂️☀️`;
        if (score >= 5) return `You can go ${activity.name.toLowerCase()} in ${data.location.name}, but it's ${reasons.join(' and ')}. Be careful. 😐`;
        return `I wouldn't recommend ${activity.name.toLowerCase()} in ${data.location.name} right now. It is ${reasons.join(' and ')}. 🚫`;
    };

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userMsg = { type: 'user', text: inputValue };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setLoading(true);

        // Process Logic
        const parsed = parseQuery(userMsg.text);

        if (parsed.error) {
            setTimeout(() => {
                setMessages(prev => [...prev, { type: 'bot', text: parsed.error }]);
                setLoading(false);
            }, 500);
            return;
        }

        // Handle Recommender Intent (No API needed)
        if (parsed.intent === "RECOMMENDATION") {
            import('../utils/climateData').then(module => {
                const advice = module.findClimateAdvice(parsed.city);
                setTimeout(() => {
                    if (advice) {
                        const msg = `Best time to visit ${parsed.city}: ${advice.best_months.join(', ')}. ${advice.description} 📅`;
                        setMessages(prev => [...prev, { type: 'bot', text: msg }]);
                    } else {
                        setMessages(prev => [...prev, { type: 'bot', text: `I don't have historical climate data for ${parsed.city} yet. But generally, check for local peak seasons!` }]);
                    }
                    setLoading(false);
                }, 600);
            });
            return;
        }

        try {
            const res = await fetch(`/api/weather/full?city=${parsed.city}`);
            if (!res.ok) throw new Error("City not found");
            const data = await res.json();

            const advice = evaluateWeather(data, parsed.activity);
            setMessages(prev => [...prev, { type: 'bot', text: advice }]);

        } catch (e) {
            setMessages(prev => [...prev, { type: 'bot', text: "I couldn't find weather data for that location. Try a major city name." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container" style={{ height: 'calc(100vh - 100px)' }}>
            <header className="home-header" style={{ marginBottom: '1rem' }}>
                <h1>AI Assistant</h1>
                <p>Ask about specific activities (Run, Swim, Drive)</p>
            </header>

            <div className="assistant-box chat-mode">
                <div className="messages-area">
                    {messages.map((msg, i) => (
                        <div key={i} className={`message-row ${msg.type}`}>
                            <div className={`message-bubble ${msg.type}`}>
                                {msg.type === 'bot' ? <Bot size={18} /> : <User size={18} />}
                                <span>{msg.text}</span>
                            </div>
                        </div>
                    ))}
                    {loading && <div className="message-row bot"><div className="message-bubble bot"><Sparkles className="spin" size={18} /><span>Thinking...</span></div></div>}
                    <div ref={messagesEndRef} />
                </div>

                <div className="input-area chat-input">
                    <input
                        type="text"
                        placeholder="Ask me anything..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button onClick={handleSend} disabled={loading} className="send-btn">
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Assistant;
