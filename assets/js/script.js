// DOM elements
let fetchButton = $('#search-btn');
let clearButton = $('#clear-btn');
let searchElement = $('#search-input');
let cityElement = $('#search-city');
let tempElement = $('#temp');
let windElement = $('#wind');
let humidityElement = $('#humidity');
let forecastElements = $('.forecast');

// API variables
let apiURL = 'https://api.openweathermap.org/data/2.5/';
let currentAPI = 'weather';
let forecastAPI = 'forecast';
let apiKey = 'bc1d5e6f407cb15f1035b7596c15a052';
let unitsKey = '&units=imperial';

// function for current weather API & runs function to add data to screen, dynamic based on whether or not you click on history or new search
function currentWeatherAPI(event) {
    event.preventDefault();
    let requestUrl;
    //dynamic search query change
    if(event.target.id === "search-btn") {
        let searchLocation = searchElement.val();
        if(searchLocation == '') {return;};
        requestUrl = apiURL + `${currentAPI}?q=${searchLocation}&appid=${apiKey}${unitsKey}`;
    } else {
        let searchLocation = event.target.innerText;
        requestUrl = apiURL + `${currentAPI}?q=${searchLocation}&appid=${apiKey}${unitsKey}`;
    }
    //api fetch & promise
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            addCurrentData(data);
        });
}

// function to call 5 day 3 hour forecast database, & then runs the function below to add to html page, dynamic based on whether or not you click on history or new search
function forecastWeatherAPI(event) {
    event.preventDefault();
    let requestUrl;
    if(event.target.id === "search-btn") {
        let searchLocation = searchElement.val();
        if(searchLocation == '') {return;};
        requestUrl = apiURL + `${forecastAPI}?q=${searchLocation}&appid=${apiKey}${unitsKey}`;
    } else {
        let searchLocation = event.target.innerText;
        requestUrl = apiURL + `${forecastAPI}?q=${searchLocation}&appid=${apiKey}${unitsKey}`;
    }
    //api fetch & promise
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            addForecastCards(data);

        });
}

// function to add the data from the API call to the html elements on screen
function addCurrentData(data) {
    //display main weather content div
    let hiddenCurrent = $('#current-weather');
    hiddenCurrent.removeClass('hidden');

    // getting data and icon from API data to add to main weather ntent div
    cityElement.text(`${data.name}`);
    let icon = data.weather[0].icon;
    let iconImg = $('<img>');
    iconImg.attr('src', 'https://openweathermap.org/img/wn/' + icon + '.png');
    cityElement.append(iconImg);

    tempElement.text(`Temp: ${data.main.temp}${String.fromCharCode(176)}F`);
    windElement.text(`Wind: ${data.wind.speed} MPH`);
    humidityElement.text(`Humidity: ${data.main.humidity}%`);
}

// function to add the data from the API call to create new elements to display on screen
function addForecastCards(data) {
    forecastElements.empty();
    // loop through the data array from API call to select one time from each day (because of the database we had to use) and display the required data on screen
    for(let i = 3; i < (data.list.length); i = i + 8) {
        let hiddenTitle = $('#forecast-title');
        hiddenTitle.removeClass('hidden');

        let forecastDate = data.list[i].dt_txt;
        let forecastTemp = `Temp: ${data.list[i].main.temp}${String.fromCharCode(176)}`;
        let forecastWind = `Wind: ${data.list[i].wind.speed} MPH`;
        let forecastHumidity = `Humidity: ${data.list[i].main.humidity}%`;

        let icon = data.list[i].weather[0].icon;
        let iconImg = $('<img style; height=50px, width=50px>');
        iconImg.attr('src', 'https://openweathermap.org/img/wn/' + icon + '@2x.png');
        // generating a card to hold the elements and data for each day's forecast
        let forecastCards = $('<div class = "card col-lg-2 col-md-4 col-sm-12 p-4  forecast-cards">');
        // creating new elements to hold data from above
        let cardDate = $('<h4>');
        let cardTemp = $('<p>');
        let cardWind = $('<p>');
        let cardHumidity = $('<p>');
        // adding the elements and data generated above to the daily cards
        cardDate.text(moment(forecastDate).format('ll'));
        forecastCards.append(cardDate);
        forecastCards.append(iconImg);
        cardTemp.text(forecastTemp);
        forecastCards.append(cardTemp);
        cardWind.text(forecastWind);
        forecastCards.append(cardWind);
        cardHumidity.text(forecastHumidity);
        forecastCards.append(cardHumidity);
        // adding the new cards to the div that houses the forecast
        forecastElements.append(forecastCards);
    }
}

fetchButton.click(currentWeatherAPI);
fetchButton.click(forecastWeatherAPI);
