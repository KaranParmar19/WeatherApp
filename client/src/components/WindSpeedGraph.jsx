import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import './DashboardGrid.css';

const WindSpeedGraph = ({ hourly }) => {
    // 24 hour slice or sampled
    const data = hourly.time.slice(0, 24).map((t, i) => ({
        time: new Date(t).toLocaleTimeString([], { hour: '2-digit', hour12: false }), // 22, 23, 00...
        speed: hourly.wind_speed_10m[i]
    })).filter((_, i) => i % 3 === 0); // Sample every 3rd hour for cleaner look like reference

    return (
        <div className="highlight-card wind-graph-card">
            <div className="highlight-header">
                <span>Maximum Wind Speed</span>
            </div>
            <div style={{ width: '100%', height: '100%', minHeight: '200px' }}>
                <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorWind" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#FFA500" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#FFA500" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="time" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1f1f1f', border: 'none', borderRadius: '8px' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="speed"
                            stroke="#FFA500"
                            fillOpacity={1}
                            fill="url(#colorWind)"
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default WindSpeedGraph;
