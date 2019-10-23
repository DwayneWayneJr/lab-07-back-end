'use strict';

// dependancies

const express = require('express');

const cors = require('cors');

require('dotenv').config();

const superagent = require('superagent');



// configure environmental variables

const app = express();

app.use(cors());

const PORT = process.env.PORT || 3003;




// route
app.get('/', (request, response) => {
  response.send('server running');
});
app.get('/location', handleLocation);

app.get('/weather', handleWeather);

app.get('*', (request, response) => {
  response.status(404).send('Oops');
});



// functions

let locations = {};

function handleLocation(request, response) {
  console.log('handleLocation');
  const city = request.query.data;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=${process.env.GEOCODE_API_KEY}`;
  if (locations[url]) {
    console.log('this works');
    response.send(locations[url]);
  } else {
    console.log('getting data from API');
    superagent.get(url)

      .then(resultsFromSuperagent => {
        const locationObject = new Location(city, resultsFromSuperagent.body.results[0]);
        locations[url] = locationObject;

        response.status(200).send(locationObject);
      })

      .catch((error) => {
        console.error(error);
        response.status(500).send('fix this');
      });
  }
}



function handleWeather(request, response) {
  console.log('handleWeather');
  const weatherObject = request.query.data;
  const url = `https://api.darksky.net/forecast/${process.env.DARK_SKY_API_KEY}/${weatherObject.latitude},${weatherObject.longitude}`;
  superagent.get(url)
    .then(resultsFromSuperAgent => {
      const weeklyWeather = resultsFromSuperAgent.body.daily.data.map(day => {
        return new Weather(day);
      });
      response.status(200).send(weeklyWeather);

    })
    .catch((error) => {
      console.error(error);
      response.status(500).send('Oops, sorry.');
    });
}


function searchLatToLong(location) {

  const geoData = require('./data/geo.json');
  console.log(geoData);



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

function Weather(obj) {
  this.forecast = obj.summary;
  this.time = new Date(obj.time * 1000).toDateString();

}
function Location(city, geoData) {
  this.search_query = city;
  this.formatted_query = geoData.formatted_address;
  this.latitude = geoData.geometry.location.lat;
  this.longitude = geoData.geometry.location.lng;
}



//turn on the server

app.listen(PORT, () => console.log(`app is listening on ${PORT}`));

