import express from 'express'
import { getDailyWeather, getWeeklyWeather } from '../controllers/weather.Controller';
import { validateWeatherRequest } from '../middleware/validation';


export const router=express.Router();

router.get("/daily", validateWeatherRequest, getDailyWeather)
router.get("/weekly", validateWeatherRequest, getWeeklyWeather)