const apiKey = config.API_KEY;

const  convert = (kelvin) => {
    return ((kelvin-273.15)*1.8)+32
}

const weatherImages = {
    'Thunderstorm': 'assets/images/thunderstorm.jpg',
    'Drizzle': 'assets/images/drizzle.jpg',
    'Rain': 'assets/images/rain.jpg',
    'Snow': 'assets/images/snow.jpg',
    'Clear': 'assets/images/clear.jpg',
    'Clouds': 'assets/images/clouds.jpg',
    'Fog': 'assets/images/fog.jpg',
    'Mist': 'assets/images/fog.jpg',
    'Smoke': 'assets/images/fog.jpg',
    'Haze': 'assets/images/fog.jpg',
    'Dust': 'assets/images/fog.jpg',
    'Sand': 'assets/images/fog.jpg',
    'Ash': 'assets/images/fog.jpg',
    'Tornado': 'assets/images/wind.jpg'
}

let city = document.getElementById('city');
city.addEventListener("keydown", function(event) {
    if (event.repeat) {return}
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("cityBtn").click();
    }
});

let state = document.getElementById('state');
state.addEventListener("keydown", function(event) {
    if (event.repeat) {return}
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("cityBtn").click();
    }
});

let zip = document.getElementById('zip');
zip.addEventListener("keydown", function(event) {
    if (event.repeat) {return}
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("zipBtn").click();
    }
});

const getCity = async () => {
    let result;
    if (state.value) {
        console.log(state.value);
        result = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city.value},${state}&appid=${apiKey}`)
    } else {
        console.log('no state');
        result = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city.value}&appid=${apiKey}`);
    }
    const data = await result.json();
    if (data.cod == 404) {
        alert("Invalid City name, please try again.")
    } else {
        city.value = '';
        state.selectedIndex = 0;
    }
    return data
};

const loadCity = async () => {
    const city = await getCity();
    createList(city);
};

const getZip = async () => {
    const result = await fetch(`https://api.openweathermap.org/data/2.5/weather?zip=${zip.value}&appid=${apiKey}`);
    const data = await result.json()
    if (data.cod == 404) {
        alert("Invalid Zip Code, please try again.")
    } else {
        zip.value = '';
    }
    return data
};

const loadZip = async () => {
    const zip = await getZip();
    createList(zip);
};

const createList = (weatherData) => {
    const weatherCard = document.createElement('div');
    const city = weatherData.name;
    weatherCard.className = 'weathercard';
    weatherCard.id = city;
    const currentWeather = weatherData.weather[0].main;
    const highTemp = parseInt(convert(weatherData.main.temp_max));
    const lowTemp = parseInt(convert(weatherData.main.temp_min));
    const humidity = weatherData.main.humidity;
    const feelsLike = parseInt(convert(weatherData.main.feels_like));
    let weatherImg = weatherImages[currentWeather];
    const cardString = `<div class="weathercard-top"><h2 class="weathercard-city">${city}</h2>` + 
    `<h3 class="close"><button class=closebtn onclick='closeCard(${city})'>&#10006;</button></h3>` + 
    '</div><hr style="margin:5px 0px"></hr>' + '<div class="weathercard-bottom"><div class="weathercard-bottom-left">' + 
    `<div class="weather-item"><div class="card-key"><h5>Current Weather</div><div class="card-value">${currentWeather}</h5></div></div>` + 
    `<div class="weather-item"><div class="card-key"><h5>High Temp</div><div class="card-value">${highTemp}&#176;F</h5></div></div>` +
    `<div class="weather-item"><div class="card-key"><h5>Low Temp</div><div class="card-value">${lowTemp}&#176;F</h5></div></div>` + 
    `<div class="weather-item"><div class="card-key"><h5>Humidity</div><div class="card-value">${humidity}%</h5></div></div>` + 
    `<div class="weather-item"><div class="card-key"><h5>Feels Like</div><div class="card-value">${feelsLike}&#176;F</h5></div></div></div>` + 
    `<div class="weather-image"><img class="responsive" src="${weatherImg}"></div></div>    `;
    
    weatherCard.innerHTML = cardString;
    document.querySelector('section#weather').insertAdjacentElement("afterbegin", weatherCard)
};

const currentLocation = async () => {
    const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };
    
    const success = async (pos) => {
        const crd = pos.coords;
        console.log(crd)
        const result = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${crd.latitude}&lon=${crd.longitude}&appid=${apiKey}`);
        const data = await result.json();
        if (data.cod == 404) {
            alert("There was an issue with the location, please try again.");
        }
        createList(data);
    };
    
    const error = (err) => {
        console.warn(`ERROR(${err.code}): ${err.message}`);
        alert("There was an issue with the location, please try again.");
    };
    
    navigator.geolocation.getCurrentPosition(success, error, options);
};

const loadCurrentLocation = async () => {
    const location = await currentLocation();
    createList(location);
}

const closeCard = (id) => {
    id.remove();
};