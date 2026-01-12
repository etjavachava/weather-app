import 'dotenv/config';
import express from 'express';
import { router } from './routes/router';

const app=express();
const port=process.env.PORT  || 8080


app.use("/", router);

app.listen(port,()=>{
    console.log("server is listening")
})