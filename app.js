const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");

require("dotenv").config();

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.get("/", function(req, res) {
  // res.sendFile(__dirname + "/index.html");
  res.render("index");
});

app.post("/", function(req, res) {

  const query = req.body.cityName + "," + req.body.countryName;
  const cityName = _.capitalize(req.body.cityName);
  // const apiKey = "ddf348689efa33687dceb8b5f5b2be2b";
  const unit = "imperial";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + process.env.API_KEY + "&units=" + unit;


  https.get(url, function(response) {
    console.log(response);

    response.on("data", function(data) {
      const weatherData = JSON.parse(data);
      console.log(query);
      console.log(weatherData);
      const temp = weatherData.main.temp;
      const feelTemp = weatherData.main.feels_like;
      const highTemp = weatherData.main.temp_max;
      const lowTemp = weatherData.main.temp_min;
      const pressure = weatherData.main.pressure;
      const humidity = weatherData.main.humidity;
      const windSpeed = weatherData.wind.speed;
      const country = weatherData.sys.country;

      const icon = weatherData.weather[0].icon;
      const description = weatherData.weather[0].description;
      res.render("result", {
        tempR: temp,
        descriptionR: description,
        iconR: icon,
        cityNameR: cityName,
        feelTempR: feelTemp,
        highTempR: highTemp,
        lowTempR: lowTemp,
        pressureR: pressure,
        humidityR: humidity,
        windSpeedR: windSpeed,
        countryR: country,
      });
    });
  });
})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
};
app.listen(port, function() {
  console.log("Server has started successfully");
});


//
// app.listen(3000, function() {
//   console.log("Server is running on port 3000")
// });
