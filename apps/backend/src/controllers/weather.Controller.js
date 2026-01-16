"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeeklyWeather = exports.getDailyWeather = void 0;
const axios_1 = __importDefault(require("axios"));
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const handleWeatherError = (res, error, context) => {
    console.error(`Failed to fetch ${context} weather data:`, error);
    if (axios_1.default.isAxiosError(error) && error.response) {
        return res.status(error.response.status).json(error.response.data);
    }
    return res.status(500).json({ error: "Failed to fetch weather data" });
};
const getDailyWeather = async (req, res) => {
    const { lat, lon, city } = req.query;
    if (!city && (!lat || !lon)) {
        return res.status(400).json({ error: "Please enter a valid city or allow geolocation" });
    }
    const API_KEY = process.env.API_KEY;
    try {
        const params = {
            appid: API_KEY,
            units: "metric"
        };
        if (city)
            params.q = city;
        else {
            params.lat = lat;
            params.lon = lon;
        }
        const response = await axios_1.default.get(`${BASE_URL}/weather`, {
            params
        });
        const data = {
            temp: response.data.main.temp,
            description: response.data.weather[0].description,
            city: response.data.name,
            humidity: response.data.main.humidity
        };
        return res.json(data);
    }
    catch (error) {
        return handleWeatherError(res, error, "daily");
    }
};
exports.getDailyWeather = getDailyWeather;
const getWeeklyWeather = async (req, res) => {
    const { lat, lon, city } = req.query;
    if (!city && (!lat || !lon)) {
        return res.status(400).json({ error: "Please enter a valid city or allow geolocation" });
    }
    const API_KEY = process.env.API_KEY;
    try {
        const params = {
            appid: API_KEY,
            units: "metric"
        };
        if (city)
            params.q = city;
        else {
            params.lat = lat;
            params.lon = lon;
        }
        const response = await axios_1.default.get(`${BASE_URL}/forecast`, {
            params
        });
        const data = response.data.list
            .filter((item) => item.dt_txt.includes("12:00:00"))
            .map((item) => ({
            temp: item.main.temp,
            description: item.weather[0].description,
            date: item.dt_txt,
            humidity: item.main.humidity
        }));
        return res.json({ city: response.data.city.name, forecast: data });
    }
    catch (error) {
        return handleWeatherError(res, error, "weekly");
    }
};
exports.getWeeklyWeather = getWeeklyWeather;
