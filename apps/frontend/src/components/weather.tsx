import React, { useState, useEffect } from 'react';
import axios from 'axios';
import type{ DailyWeather,WeeklyWeather } from '../types/weather';

const WeatherApp: React.FC = () => {
    const [city, setCity] = useState<string>('');
    const [daily, setDaily] = useState<DailyWeather | null>(null);
    const [weekly, setWeekly] = useState<WeeklyWeather | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    fetchWeather(position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    console.error("Geolocation error:", error);
                },
                { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
            );
        }
    }, []);

    const fetchWeather = async (lat?: number, lon?: number) => {
        const isLocation = lat !== undefined && lon !== undefined;
        if (!city && !isLocation) return;
        setLoading(true);
        setDaily(null);
        setWeekly(null);

        if (isLocation) {
            setCoords({ lat: lat!, lon: lon! });
        } else {
            setCoords(null);
        }

        const params = isLocation ? { lat, lon } : { city };

        try {
            const dailyRes = await axios.get<DailyWeather>('http://localhost:8080/api/weather/daily', {
                params
            });
            setDaily(dailyRes.data);
        } catch (error) {
            console.error("Error fetching daily weather:", error);
            if (axios.isAxiosError(error)) {
                const data = error.response?.data;
                const errorMessage = data?.error || data?.message || (typeof data === 'string' ? data : '');
                const fallbackMessage = !error.response ? "Network Error: Check backend connection and CORS" : `Failed to fetch daily weather: ${errorMessage || error.response.statusText}`;
                alert(fallbackMessage);
            }
        }

        try {
            const weeklyRes = await axios.get<WeeklyWeather>('http://localhost:8080/api/weather/weekly', {
                params
            });
            setWeekly(weeklyRes.data);
        } catch (error) {
            console.error("Error fetching weekly weather:", error);
            if (axios.isAxiosError(error)) {
                const data = error.response?.data;
                const errorMessage = data?.error || data?.message || (typeof data === 'string' ? data : '');
                const fallbackMessage = !error.response ? "Network Error: Check backend connection and CORS" : `Failed to fetch weekly weather: ${errorMessage || error.response.statusText}`;
                alert(fallbackMessage);
            }
        } finally {
            setLoading(false);
        }
    };

  

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center py-12 px-4">
            <div className="w-full max-w-md space-y-6">
                <h1 className="text-4xl font-extrabold text-slate-800 text-center tracking-tight">Weather Forecast</h1>
                
                <div className="flex shadow-lg rounded-xl overflow-hidden bg-white ring-1 ring-black/5">
                    <input 
                        className="flex-1 px-5 py-4 outline-none text-gray-700 placeholder-gray-400 bg-transparent"
                        type="text" 
                        value={city} 
                        onChange={(e) => setCity(e.target.value)} 
                        placeholder="Enter city name..." 
                    />
                    <button 
                        onClick={() => fetchWeather()} 
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 font-semibold transition-colors disabled:bg-blue-400"
                    >
                        {loading ? '...' : 'Search'}
                    </button>
                </div>

                {coords && (
                    <div className="text-center text-xs text-gray-500 font-mono bg-white/50 py-1 rounded-lg mx-auto w-fit px-3">
                        📍 {coords.lat.toFixed(4)}, {coords.lon.toFixed(4)}
                    </div>
                )}

                {daily && (
                    <div className="bg-white rounded-3xl shadow-xl p-8 text-center border border-white/20 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-1">{daily.city}</h2>
                        <div className="flex flex-col items-center justify-center my-6">
                            <span className="text-7xl font-black text-slate-800 tracking-tighter">{Math.round(daily.temp)}°</span>
                            <span className="text-lg text-blue-600 font-medium capitalize mt-2 bg-blue-50 px-3 py-1 rounded-full">{daily.description}</span>
                        </div>
                        <div className="border-t border-gray-100 pt-4 mt-4">
                            <p className="text-gray-500 text-sm font-medium">Humidity: <span className="text-gray-800">{daily.humidity}%</span></p>
                        </div>
                    </div>
                )}
            </div>
            
            {weekly && (
                <div className="w-full max-w-5xl mt-12 px-4">
                    <h3 className="text-xl font-bold text-slate-700 mb-6 pl-2 border-l-4 border-blue-500">5-Day Forecast</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                        {weekly.forecast.map((item, idx) => (
                            <div key={idx} className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-shadow border border-slate-100 flex flex-col items-center justify-between group">
                                <span className="text-gray-400 font-medium text-sm uppercase tracking-wider">
                                    {new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' })}
                                </span>
                                <span className="text-xs text-gray-400 mb-2">
                                    {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </span>
                                <div className="text-3xl font-bold text-slate-800 my-2 group-hover:scale-110 transition-transform">
                                    {Math.round(item.temp)}°
                                </div>
                                <span className="text-xs text-center text-slate-500 font-medium capitalize line-clamp-2">
                                    {item.description}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default WeatherApp;