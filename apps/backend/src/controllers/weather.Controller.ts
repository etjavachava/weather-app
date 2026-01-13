import  { Request,Response } from 'express'
import axios from 'axios'

const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const handleWeatherError = (res: Response, error: unknown, context: string) => {
    console.error(`Failed to fetch ${context} weather data:`, error);
    if (axios.isAxiosError(error) && error.response) {
        return res.status(error.response.status).json(error.response.data);
    }
    return res.status(500).json({ error: "Failed to fetch weather data" });
};

export const getDailyWeather=async (req:Request,res:Response)=>{
     const city = req.query.city as string;
const API_KEY=process.env.API_KEY;
    try{
        const response=await axios.get(`${BASE_URL}/weather`,{
params:{
    q:city,
    appid:API_KEY,
    units:"metric"
}
        })
        const data={
        temp: response.data.main.temp,
         description: response.data.weather[0].description,
         city: response.data.name,
         humidity: response.data.main.humidity
        } 
return res.json(data)
    }
    catch(error){
        return handleWeatherError(res, error, "daily");
}}

export const getWeeklyWeather = async (req: Request, res: Response) => {
const city = req.query.city as string;
const API_KEY=process.env.API_KEY;
    try{
        const response=await axios.get(`${BASE_URL}/forecast`,{
params:{
    q:city,
    appid:API_KEY,
    units:"metric"
}
        })
        const data = response.data.list
            .filter((item: any) => item.dt_txt.includes("12:00:00"))
            .map((item: any) => ({
                temp: item.main.temp,
                description: item.weather[0].description,
                date: item.dt_txt,
                humidity: item.main.humidity
            }));
        return res.json({ city: response.data.city.name, forecast: data })
    }
    catch(error){
        return handleWeatherError(res, error, "weekly");
}}
 
   