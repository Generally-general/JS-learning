const APIKEY = "b6bbec9d46d655506b924f430969e157";

const weatherDataEl = document.getElementById('weather-data');
const cityInputEl = document.getElementById('city-input');
const formEl = document.querySelector('form');
const body = document.body;
const errorMessageEl = document.getElementById('error-message');

function capitalizeFirst(val) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}


formEl.addEventListener('submit', (event) => {
  event.preventDefault();
  const cityValue = cityInputEl.value.trim();
  if(!cityValue) return;
  getWeatherData(cityValue);
});



async function getWeatherData(cityValue) {
  try {
    errorMessageEl.textContent = "";
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityValue)}&appid=${APIKEY}&units=metric`)
    

    if(!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    const temperature = Math.round(data.main.temp);

    const description = data.weather[0].description;

    const icon = data.weather[0].icon;
    const weatherMain = data.weather[0].main.toLowerCase();
    const timeZone = data.timezone;
    const currentTimeUTC = new Date().getTime();
    const localTime = new Date(currentTimeUTC + timeZone * 1000);

    const details = [
      `Feels Like: ${Math.round(data.main.feels_like)}&#8451;`,
      `Humidity: ${Math.round(data.main.humidity)}%`,
      `Wind speed: ${Math.round(data.wind.speed)}m/s`,
      `Local Time: ${localTime.toUTCString().slice(17, 25)}`
    ];

    const cityTitleEl = weatherDataEl.querySelector('.city-title');
    const iconEl = weatherDataEl.querySelector('.icon');
    const tempEl = weatherDataEl.querySelector('.temperature');
    const descEl = weatherDataEl.querySelector('.description');
    const detailsEl = weatherDataEl.querySelector('.details');

    if (!cityTitleEl || !iconEl || !tempEl || !descEl || !detailsEl) {
      throw new Error("Required elements are missing in DOM");
    }

    cityTitleEl.textContent = capitalizeFirst(cityValue);
    iconEl.innerHTML = `
      <img src="http://openweathermap.org/img/wn/${icon}.png" alt="Weather Icon">
    `
    tempEl.innerHTML = `${temperature}&#8451;`

    descEl.textContent = capitalizeFirst(description);

    detailsEl.innerHTML = details.map(detail => `<div>${detail}</div>`).join("");

    cityInputEl.value = "";
    updateTheme(weatherMain);
  } catch (error) {
    errorMessageEl.textContent = `City not found or API error. ${error}`;

    weatherDataEl.querySelector('.city-title').textContent = "";
    weatherDataEl.querySelector('.icon').innerHTML = "";
    weatherDataEl.querySelector('.temperature').innerHTML = "";
    weatherDataEl.querySelector('.description').textContent = "";
    weatherDataEl.querySelector('.details').innerHTML = "";

    body.style.background = "#f7f7f7";
  }
}

function updateTheme(condition) {
  body.className = "";

  if(condition.includes("clear")) {
    body.style.background = "linear-gradient(to right, #fceabb, #f8b500)";
  } else if (condition.includes("cloud")) {
    body.style.background = "linear-gradient(to right, #bdc3c7, #2c3e50)";
  } else if (condition.includes("rain")) {
    body.style.background = "linear-gradient(to right, #314755, #26a0da)";
  } else if (condition.includes("snow")) {
    body.style.background = "linear-gradient(to right, #e6dada, #274046)";
  } else if (condition.includes("thunderstorm")) {
    body.style.background = "linear-gradient(to right, #141e30, #243b55)";
  } else {
    body.style.background = "#f7f7f7";
  }
}

