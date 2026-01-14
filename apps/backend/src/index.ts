import 'dotenv/config';
import express from 'express';
import { router } from './routes/router';

const app=express();
const port=process.env.PORT  || 8080


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

app.use("/api/weather", router);

app.listen(port,()=>{
    console.log("server is listening")
})