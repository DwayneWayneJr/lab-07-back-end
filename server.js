// dependancies
const express = require('express');
const cors = require('cors');
require('dotenv').config();
// super agent man thing

// configure environmental variables
const app = express();
app.use(cors());
const PORT = process.env.PORT || 3003;

// route

app.get('/location', handleLocation);


app.get('/weather', handleWeather);

app.get('*', (request, response) => {
  response.status(404).send('Oops');
});

// functions
function handleLocation (request, response) {
  try {
    const city = request.query.data;

    const locationData = searchLatToLong(city);

    response.send(locationData);
  }
  catch (error) {
    console.error(error);
    response.status(500).send('Sorry! Something is not working on our end.');
  }
}

function handleWeather (request, response){
  const data = request.query.data;
  const weather = searchCityWeather(data);
  response.send(weather);
}


function searchLatToLong(location) {

  const geoData = require('./data/geo.json');
  console.log(geoData);

  const locationObject = new Location(location, geoData);

  return locationObject;

}
function searchCityWeather(location) {

  const drkSky = require('./data/darksky.json');
  console.log(drkSky);
  const locationWeather = [];
  drkSky.daily.data.forEach(day => {
    const todaysWeather = new Weather(day);
    locationWeather.push(todaysWeather);
  });
  return locationWeather;
}
// "time": 1540054800,
// "summary": "Mostly Cloudy",
// "icon": "partly-cloudy-day",
// "precipIntensity": 0,
// "precipProbability": 0,
// "temperature": 47.93,
// "apparentTemperature": 47.06,
// "dewPoint": 46.23,
// "humidity": 0.94,
// "pressure": 1023.55,
// "windSpeed": 3.3,
// "windGust": 5.42,
// "windBearing": 356,
// "cloudCover": 0.9,
// "uvIndex": 1,
// "visibility": 3.73,
// "ozone": 246.96

function Weather(day) {
  this.forecast = day.summary;
  this.time = new Date(day.time * 1000).toDateString();

}
function Location(city, geoData) {
  this.search_query = city;
  this.formatted_query = geoData.results[0].formatted_address;
  this.latitude = geoData.results[0].geometry.location.lat;
  this.longitude = geoData.results[0].geometry.location.lng;
}

//turn on the server
app.listen(PORT, () => console.log(`app is listening on ${PORT}`));

