import express, { Request,Response } from 'express'
import axios,{isAxiosError} from 'axios'



export const getDailyWeather=async (req:Request,res:Response)=>{
     const city = req.query.city as string;
const API_KEY=process.env.API_KEY;
if(!city.trim || typeof city!=='string'){
return res.status(400).json({error:'please enter a city'})
}
if(!API_KEY){
    console.log("could not find the api key")
    return res.status(500).json({error:"server configuration failed"})
}

const url=`https://api.openweathermap.org/data/2.5/weather`
    try{
        const response=await axios.get(url,{
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
    console.log("Failed to fetch weather data")
    if(axios.isAxiosError(error)&&error.response){
        return res.status(error.response.status).json(error.response.data)
    }
        res.status(500).json({ error: "Failed to fetch weather data" })
}}