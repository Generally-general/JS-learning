const APIKEY = "b6bbec9d46d655506b924f430969e157";

const weatherDataEl = document.getElementById('weather-data');
const cityInputEl = document.getElementById('city-input');
const formEl = document.querySelector('form');

formEl.addEventListener('submit', (event) => {
  event.preventDefault();
  const cityValue = cityInputEl.value;
  getWeatherData(cityValue);
});

async function getWeatherData(cityValue) {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityValue}&appid=${APIKEY}&units=metric`)
    if(!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    const temperature = Math.round(data.main.temp);

    const description = data.weather[0].description;

    const icon = data.weather[0].icon;

    const details = [
      `Feels Like: ${Math.round(data.main.feels_like)}&#8451;`,
      `Humidity: ${Math.round(data.main.humidity)}%`,
      `Wind speed: ${Math.round(data.wind.speed)}ms`,
    ];
    
    weatherDataEl.querySelector('.icon').innerHTML = `
      <img src="http://openweathermap.org/img/wn/${icon}.png" alt="Weather Icon">
    `

    weatherDataEl.querySelector('.temperature').innerHTML = `${temperature}&#8451;`

    weatherDataEl.querySelector('.description').textContent = `${description}`

    weatherDataEl.querySelector('.details').innerHTML = details.map(detail => `<div>${detail}</div>`).join("");

  } catch (error) {
    
  }
}

