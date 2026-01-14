import express from 'express'
import { getDailyWeather, getWeeklyWeather } from '../controllers/weather.Controller';


export const router=express.Router();

router.get("/daily", getDailyWeather)
router.get("/weekly", getWeeklyWeather)