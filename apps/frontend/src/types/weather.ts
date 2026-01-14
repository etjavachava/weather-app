export interface DailyWeather {
    city: string;
    temp: number;
    description: string;
    humidity: number;
}

export interface ForecastItem {
    temp: number;
    description: string;
    date: string;
    humidity: number;
}

export interface WeeklyWeather {
    city: string;
    forecast: ForecastItem[];
}
