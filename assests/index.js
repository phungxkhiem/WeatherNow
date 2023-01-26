var weatherUrl = "https://api.openweathermap.org/data/2.5/weather";
var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast";

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
