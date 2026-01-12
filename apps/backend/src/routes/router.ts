import express from 'express'
import { getDailyWeather } from '../controllers/dailyweather.Controller';


export const router=express.Router();

router.get("/daily",getDailyWeather)