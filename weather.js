const express = require("express");
const https = require("https");
const Bodyparser = require("body-parser");
const app = express();

app.use(Bodyparser.urlencoded({ extended: true }));
app.get("/", function(request, response) {
   response.sendFile(__dirname + "/index.html");
});

app.post("/", function(request, response) {
    const query = request.body.cityName;
    const apikey = "48d8297fc08db4d811229289c46283cb";
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&APPID=" + apikey + "&units=" + unit;

    https.get(url, function(res) {
        res.on("data", function(data) {
            const weatherData = JSON.parse(data);
            console.log(weatherData);
            const temp = weatherData.main.temp;
            console.log(temp);
            const weatherDescription = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imageURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
            
            // Extract additional weather data
            const humidity = weatherData.main.humidity;
            const windSpeed = weatherData.wind.speed;

            // Get current date and time
            const currentDate = new Date().toLocaleDateString();
            const currentTime = new Date().toLocaleTimeString();

            // Generate Wikipedia link based on the city name
            const wikiLink = "https://en.wikipedia.org/wiki/" + query;
            
            // Send the response to the client
            response.write("<p>The weather is currently " + weatherDescription + "<p>");
            response.write("<h2>The temperature in " + query + " is " + temp + " degrees Celsius</h2>");
            response.write("<p>Current Date: " + currentDate + "</p>");
            response.write("<p>Current Time: " + currentTime + "</p>");
            response.write("<p>Humidity: " + humidity + "%</p>");
            response.write("<p>Wind Speed: " + windSpeed + " m/s</p>");
            response.write("<a href='" + wikiLink + "'>Learn more about " + query + " weather on Wikipedia</a>");
            response.write("<img src=" + imageURL + ">");
            response.send();
        });
    });
});

app.listen(3000, function() {
   console.log("app is running");
});
