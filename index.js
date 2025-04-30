let cityInput = document.getElementById('cityInput'),
    searchBtn = document.getElementById('search-btn'),
    locationBtn = document.getElementById('current-btn'),
    api_key = 'ebc85bf0b3487c8fdb52f925caf2e678',
    cityDisplay = document.getElementById('cityDisplay'),
    description = document.getElementById('description'),
    weatherInfoCard = document.querySelector('.weather-info'),
    otherDetailsCard = document.querySelector('.info-details-2'),
    fouDaysCard = document.querySelector('.daily-forecast-box');

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

async function getUserCoordinates() {
    try {
        const position = await new Promise((resolve, reject) =>
            navigator.geolocation.getCurrentPosition(resolve, reject)
        );
        const { latitude, longitude } = position.coords;

        const reverseUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${api_key}`;
        const response = await fetch(reverseUrl);
        const data = await response.json();

        const { name, country, state } = data[0];
        await getWeatherDetails(name, latitude, longitude, country, state);
    } catch (error) {
        alert('User Coordinates Failed to Fetch');
        console.error(error);
    }
}

async function getWeatherDetails(name, lat, lon, country, state) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`;

    try {
        const weatherRes = await fetch(weatherUrl);
        const weatherData = await weatherRes.json();

        cityDisplay.innerHTML = `<h4><i class="fa-solid fa-location-dot"></i> ${name}, ${country}</h4>`;
        description.innerHTML = `<p>${weatherData.weather[0].description}</p>`;
        weatherInfoCard.innerHTML = `
            <img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png" alt="Weather icon" />
            <h3>${Math.round(weatherData.main.temp).toFixed(1)}&deg;C</h3>
            <div class="info-details">
                <p><i class="fa-solid fa-temperature-three-quarters"></i> Feels Like: ${Math.round(weatherData.main.feels_like)}&deg;C</p>
                <p><i class="fa-solid fa-droplet"></i> Humidity: ${weatherData.main.humidity}%</p>
                <p><i class="fa-solid fa-wind"></i> Wind: ${weatherData.wind.speed} Km/Hr</p>
            </div>`;

        otherDetailsCard.innerHTML = `
            <p><i class="fa-solid fa-globe"></i> Pressure: ${weatherData.main.pressure} hPa</p>
            <p><i class="fa-solid fa-temperature-full"></i> High: ${Math.round(weatherData.main.temp_max).toFixed(2)}&deg;C</p>
            <p><i class="fa-solid fa-temperature-low"></i> Low: ${Math.round(weatherData.main.temp_min).toFixed(2)}&deg;C</p>`;
    } catch (error) {
        alert('Failed to fetch Current Weather');
        console.error(error);
    }

    try {
        const forecastRes = await fetch(forecastUrl);
        const forecastData = await forecastRes.json();

        let uniqueDays = [];
        let dailyForecast = forecastData.list.filter(forecast => {
            let date = new Date(forecast.dt_txt).getDate();
            if (!uniqueDays.includes(date)) {
                uniqueDays.push(date);
                return true;
            }
            return false;
        });

        fouDaysCard.innerHTML = '';
        for (let i = 1; i < dailyForecast.length - 1; i++) {
            let date = new Date(dailyForecast[i].dt_txt);
            fouDaysCard.innerHTML += `
                <div class="daily-forecast-box-1">
                    <p>${days[date.getDay()]}</p>
                    <img src="https://openweathermap.org/img/wn/${dailyForecast[i].weather[0].icon}@2x.png" alt="" />
                    <p>${Math.round(dailyForecast[i].main.temp).toFixed(1)}&deg;C</p>
                </div>`;
        }
    } catch (error) {
        alert('Failed to fetch forecast data');
        console.error(error);
    }
}

async function getCityCoordinates() {
    let cityName = cityInput.value.trim();
    cityInput.value = '';
    if (!cityName) return;

    try {
        const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_key}`;
        const response = await fetch(geoUrl);
        const data = await response.json();
        const { name, lat, lon, country, state } = data[0];
        await getWeatherDetails(name, lat, lon, country, state);
    } catch (error) {
        alert(`Failed to fetch coordinates of ${cityName}`);
        console.error(error);
    }
}

searchBtn.addEventListener('click', getCityCoordinates);
locationBtn.addEventListener('click', getUserCoordinates);
cityInput.addEventListener('keyup', e => e.key === 'Enter' && getCityCoordinates());
window.addEventListener('load', getUserCoordinates);
