var weatherUrl = "https://api.openweathermap.org/data/2.5/weather";
var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast";
var iconWeatherUrl = "https://openweathermap.org/img/wn/";
var uviUrl = "https://api.openweathermap.org/data/2.5/uvi";
var searchBtn = $("#search");
var APIkey = "appid=792f18fd8a85d6466f0209046266dcb4";
var units = "&units=imperial";
var weatherForecastEl = $("#weatherForecast");
var chosenCityEl = $("#chosenCity");
var iconEl = $("#icon");
var currentDateEl = $("#currentDate");
var temperatureEl = $("#temperature");
var windEl = $("#wind");
var humidityEl = $("#humidity");
var uvIndexEl = $("#uvIndex");
var searchHistoryEl = $("#searchHistory");
var historyArr = [];
var clearHistoryBtn = $("#clearHistory");

function init() {
  weatherForecastEl.hide();
  searchCity();
  historyClick();
  historyClear();
  historyDisplay();
}

function searchCity() {
  searchBtn.on("click", function (event) {
    event.preventDefault();
    var userInputCity = $("#city").val().trim();
    if (userInputCity === "") {
      return;
    }
    weatherCity(userInputCity);
    forecastCity(userInputCity);
  });
}

function historySave(userInputCity) {
  historyArr.push(userInputCity);
  localStorage.setItem("cityHistory", JSON.stringify(historyArr));
  searchHistoryEl.empty();
  historyDisplay();
  console.log(historyArr);
}

function historyDisplay() {
  var getHistory = JSON.parse(localStorage.getItem("cityHistory"));
  for (var i = 0; i < getHistory.length; i++) {
    var cityHistoryLi = $("<li>");
    cityHistoryLi.text(getHistory[i]);
    searchHistoryEl.append(cityHistoryLi);
  }
  return (historyArr = getHistory);
}

function historyClick() {
  searchHistoryEl.on("click", "li", function () {
    var cityLi = $(this).text();
    weatherCity(cityLi);
    forecastCity(cityLi);
  });
}

function historyClear() {
  clearHistoryBtn.on("click", function () {
    searchHistoryEl.empty();
    localStorage.clear();
    historyArr = [];
  });
}

function weatherCity(userInputCity) {
  var queryUrl = weatherUrl + "?q=" + userInputCity + units + "&" + APIkey;

  fetch(queryUrl).then(function (cityResponse) {
    if (cityResponse.ok) {
      cityResponse.json().then(function (resultWeatherCity) {
        weatherForecastEl.show();
        var resultCity = resultWeatherCity;
        var cityName = resultCity.name;
        var dtUnixCurrent = resultCity.dt;
        var currentDay = new Date(dayjs.unix(dtUnixCurrent));
        var dateCurrentjs = currentDay.toLocaleString("en-US", {
          weekday: "short",
          day: "numeric",
          month: "numeric",
          year: "numeric",
        });
        var cityTemperature = resultCity.main.temp.toFixed(0);
        var cityWind = resultCity.wind.speed.toFixed(0);
        var cityHumidity = resultCity.main.humidity;
        var weatherIcon = resultCity.weather[0].icon;
        var iconCompleteUrl = iconWeatherUrl + weatherIcon + ".png";

        function uniqueValuesHistory() {
          if (historyArr.includes(cityName) === false) {
            console.log(historyArr);
            historySave(cityName);
          }
        }
        uniqueValuesHistory(cityName);


        chosenCityEl.text(cityName);
        currentDateEl.text(dateCurrentjs);
        iconEl.attr("src", iconCompleteUrl);
        temperatureEl.text("Temp: " + cityTemperature + " °F");
        windEl.text("Wind: " + cityWind + " mph");
        humidityEl.text("Humidity: " + cityHumidity + " %");

        console.log(resultCity);

        // UV Index - specific URL for UV index

        var latCity = resultCity.coord.lat;
        var lonCity = resultCity.coord.lon;
        var uviQueryUrl =
          uviUrl + "?" + APIkey + "&lat=" + latCity + "&lon=" + lonCity;

        fetch(uviQueryUrl).then(function (uviResponse) {
          if (uviResponse.ok) {
            uviResponse.json().then(function (resultUvi) {
              function colorCode() {
                var UVI = resultUvi.value.toFixed(1);
                uvIndexEl.text(UVI);
                uvIndexEl.each(function (event) {
                  event.preventDefault;
                  if (UVI < 3) {
                    uvIndexEl.addClass("low");
                    uvIndexEl.removeClass("moderate");
                    uvIndexEl.removeClass("high");
                    uvIndexEl.removeClass("veryHigh");
                  } else if (UVI > 3 && UVI < 6) {
                    uvIndexEl.addClass("moderate");
                    uvIndexEl.removeClass("low");
                    uvIndexEl.removeClass("high");
                    uvIndexEl.removeClass("veryHigh");
                  } else if (UVI > 6 && UVI < 8) {
                    uvIndexEl.addClass("high");
                    uvIndexEl.removeClass("low");
                    uvIndexEl.removeClass("moderate");
                    uvIndexEl.removeClass("veryHigh");
                  } else {
                    uvIndexEl.addClass("veryHigh");
                    uvIndexEl.removeClass("low");
                    uvIndexEl.removeClass("moderate");
                    uvIndexEl.removeClass("high");
                  }
                });
              }
              colorCode();
            });
          }
        });
      });
    }
  });
}

// Function - Forecast - 5 days - For Loop

function forecastCity(userInputCity) {
  var forecastQueryUrl =
    forecastUrl + "?q=" + userInputCity + units + "&" + APIkey;
  fetch(forecastQueryUrl).then(function (city5Response) {
    if (city5Response.ok) {
      city5Response.json().then(function (response5) {
        var results5 = response5;
        console.log(results5);

        for (i = 0; i < 5; i++) {
          var cityTemperature1 =
            results5.list[(i + 1) * 8 - 3].main.temp.toFixed(0);
          var date1 = results5.list[(i + 1) * 8 - 3].dt;
          var dateNew1 = new Date(dayjs.unix(date1));
          var date1dayjs = dateNew1.toLocaleString("en-US", {
            weekday: "short",
            day: "numeric",
            month: "numeric",
            year: "numeric",
          });
          var cityWind1 = results5.list[(i + 1) * 8 - 3].wind.speed.toFixed(0);
          var cityHumidity1 = results5.list[(i + 1) * 8 - 3].main.humidity;
          var weatherIcon1 = results5.list[(i + 1) * 8 - 3].weather[0].icon;
          var iconCompleteUrl1 = iconWeatherUrl + weatherIcon1 + ".png";

          $("#forecastTemperature" + i).text(
            "Temp: " + cityTemperature1 + " °F"
          );
          $("#forecastDate" + i).text(date1dayjs);
          $("#forecastIcon" + i).attr("src", iconCompleteUrl1);
          $("#forecastWind" + i).text("Wind: " + cityWind1 + " mph");
          $("#forecastHumidity" + i).text("Humidity: " + cityHumidity1 + " %");
        }
      });
    }
  });
}



init();