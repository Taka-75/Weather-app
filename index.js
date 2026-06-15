require('dotenv').config();

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const APIKey = process.env.OPENWEATHER_API_KEY;

app.use(express.static(__dirname));

app.get('/weather', async (req, res) => {
    const city = req.query.city;

    if (!city) {
        return res.status(400).json({ cod: '400', message: 'city is required' });
    }

    if (!APIKey) {
        return res.status(500).json({ cod: '500', message: 'missing OpenWeather API key' });
    }

    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${APIKey}`;
        const response = await fetch(url);
        const data = await response.json();

        res.status(response.status).json(data);
    } catch (error) {
        res.status(500).json({ cod: '500', message: 'failed to fetch weather data' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Weather app server running at http://localhost:${PORT}`);
});
