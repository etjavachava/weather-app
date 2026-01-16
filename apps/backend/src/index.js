"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const router_1 = require("./routes/router");
const app = (0, express_1.default)();
const port = process.env.PORT || 8080;
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    }
    else {
        next();
    }
});
// Health check endpoint: Cloud platforms often ping '/' to see if the app is alive.
app.get("/", (req, res) => {
    res.status(200).send("Weather App Backend is running");
});
app.use("/api/weather", router_1.router);
app.listen(port, () => {
    console.log(`server is listening on port ${port}`);
});
