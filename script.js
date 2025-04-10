let cityInput = document.getElementById('cityInput'),
searchBtn = document.getElementById('search-btn'),
api_key = 'ebc85bf0b3487c8fdb52f925caf2e678',

cityDisplay = document.getElementById('cityDisplay'),
description = document.getElementById('description');
weatherInfoCard = document.querySelector('.weather-info'),
otherDetailsCard = document.querySelector('.info-details-2'),
fouDaysCard = document.querySelector('.daily-forecast-box')





function getWeatherDetails(name, lat, lon, country, state){
    let FORECAST_API_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`,
        WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`,
        days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            
    
    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
        console.log(data)
        let date = new Date();
        cityDisplay.innerHTML = `<h4 id="cityDisplay"><i class="fa-solid fa-location-dot"></i> ${name} , ${country}</h4>`
        description.innerHTML = `<p id="description">${data.weather[0].description}</p>`
        weatherInfoCard.innerHTML = `
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" id="iconImg" alt="Weather icon" />
          <h3 id="temp">${Math.round(data.main.temp).toFixed(1)}&deg;C</h3>
          <div class="info-details">
            <p id="realFell">
              <i class="fa-solid fa-temperature-three-quarters"></i> Real Fell :
              ${Math.round(data.main.feels_like)}&deg;C
            </p>
            <p id="humidity"><i class="fa-solid fa-droplet"></i> Humidity : ${data.main.humidity} %</p>
            <p id="windSpeed"><i class="fa-solid fa-wind"></i> Wind : ${data.wind.speed} Km/Hr</p>
          </div>
        `

        otherDetailsCard.innerHTML = `
            <p id="pressure"><i class="fa-solid fa-globe"></i> Pressure : ${data.main.pressure} hPa</p>
            <p id="highTemp"><i class="fa-solid fa-temperature-full"></i> High : ${Math.round(data.main.temp_max).toFixed(2)}&deg;C</p>
            <p id="lowTemp"><i class="fa-solid fa-temperature-low"></i> Low : ${Math.round(data.main.temp_min).toFixed(2)}&deg;C</p>
        `
    }).catch(() => {
        alert('Failed to fetch Current Weather');
    })

    fetch(FORECAST_API_URL).then(res => res.json()).then(data => {
        console.log(data)
        let uniqueForecastDays = [];
        let fourDaysForecast = data.list.filter(forecast =>{
            let forecasteDate = new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecasteDate)){
                return uniqueForecastDays.push(forecasteDate);
            }
        });
        console.log(fourDaysForecast);
        fouDaysCard.innerHTML = '';
        for(i=1; i<fourDaysForecast.length-1;i++){
            let date = new Date(fourDaysForecast[i].dt_txt);
            fouDaysCard.innerHTML += `
        <div class="daily-forecast-box-1">
            <p>${days[date.getDay()]}</p>
            <img src="https://openweathermap.org/img/wn/${fourDaysForecast[i].weather[0].icon}@2x.png" alt="" />
            <p>${Math.round(fourDaysForecast[i].main.temp).toFixed(1)}&deg;C</p>
        </div>
            `
        }

    }).catch(() => {
        alert('Failed to fetch forecast data')
    })

}




function getCityCoordinates(){
    let cityName = cityInput.value.trim();
    cityInput.value = '';
    if(!cityName) return;
    let GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_key}`;
    fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
        // console.log(data)
        let {name, lat, lon, country, state} = data[0];
        getWeatherDetails(name, lat, lon, country, state);
    }).catch(() => {
        alert(`Failed to fetch coordinates of ${cityName}`);
    })
}

searchBtn.addEventListener('click', getCityCoordinates)
