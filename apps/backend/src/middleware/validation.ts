import { Request, Response, NextFunction } from 'express';

export const validateWeatherRequest = (req: Request, res: Response, next: NextFunction) => {
    const city = req.query.city;
    const API_KEY = process.env.API_KEY;

    if (!city || typeof city !== 'string') {
        return res.status(400).json({ error: 'Please enter a valid city' });
    }

    if (!API_KEY) {
        console.error("Could not find the api key");
        return res.status(500).json({ error: "Server configuration failed" });
    }

    next();
};