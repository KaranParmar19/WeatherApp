import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import './Pages.css';
import { Search } from 'lucide-react';

const Analytics = () => {
    const [data, setData] = useState(null);
    const [inputVal, setInputVal] = useState('');

    const fetchData = async (c) => {
        try {
            const res = await fetch(`/api/weather/full?city=${c}`);
            if (!res.ok) return;
            const json = await res.json();
            setData(json);
        } catch (e) { console.error(e); }
    }

    useEffect(() => { fetchData('London') }, []);

    // Transform Hourly data for Recharts (Next 24 hours)
    const chartData = data ? data.hourly.time.slice(0, 24).map((timeStr, i) => ({
        time: timeStr.split('T')[1].slice(0, 5), // '2023-10-10T13:00' -> '13:00'
        temp: data.hourly.temperature_2m[i],
        humidity: data.hourly.relative_humidity_2m[i],
        rainProb: data.hourly.precipitation_probability[i]
    })) : [];

    return (
        <div className="page-container">
            <header className="home-header">
                <h1>Weather Analytics</h1>
                <p>24-Hour Trends: Temperature & Rain Probability</p>
                <form onSubmit={(e) => { e.preventDefault(); fetchData(inputVal); }} className="search-form">
                    <input value={inputVal} onChange={e => setInputVal(e.target.value)} placeholder="City..." />
                    <button type="submit"><Search size={20} /></button>
                </form>
            </header>

            {data && (
                <div className="charts-container fade-in">
                    <div className="chart-box">
                        <h3>Temperature Trend (°C)</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ff7c7c" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#ff7c7c" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="time" stroke="#ddd" />
                                <YAxis stroke="#ddd" />
                                <Tooltip contentStyle={{ backgroundColor: '#1e3c72', color: '#fff', border: 'none' }} />
                                <Area type="monotone" dataKey="temp" stroke="#ff7c7c" fillOpacity={1} fill="url(#colorTemp)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="chart-box">
                        <h3>Rain Probability (%)</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="time" stroke="#ddd" />
                                <YAxis stroke="#ddd" />
                                <Tooltip contentStyle={{ backgroundColor: '#1e3c72', color: '#fff', border: 'none' }} />
                                <Line type="monotone" dataKey="rainProb" stroke="#82ca9d" strokeWidth={3} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Analytics;
