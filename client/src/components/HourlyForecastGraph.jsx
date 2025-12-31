import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area
} from 'recharts';
import './DashboardGrid.css';

const HourlyForecastGraph = ({ data }) => {
    // Need to format data for Recharts
    // data.hourly is object of arrays. We need array of objects.
    const chartData = data.hourly.time.slice(0, 24).map((time, index) => {
        return {
            time: new Date(time).toLocaleTimeString([], { hour: '2-digit', hour12: true }),
            temp: data.hourly.temperature_2m[index],
            wind: data.hourly.wind_speed_10m[index]
        };
    });

    return (
        <div className="highlight-card" style={{ gridColumn: '1 / -1', minHeight: '300px' }}>
            <div className="highlight-header">
                <span>Forecast Weather (24h)</span>
            </div>
            <div style={{ width: '100%', height: '100%' }}>
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={chartData} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
                        <defs>
                            {/* No gradient fill in reference, just line */}
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                        <XAxis dataKey="time" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1f1f1f', border: 'none', borderRadius: '8px' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="temp"
                            stroke="#FFA500"
                            strokeWidth={2}
                            dot={{ r: 4, fill: '#FFA500' }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default HourlyForecastGraph;
