const apiKey = "f2015de3037498f86f491dd2167601a9";
const apiUrlZip = "https://api.openweathermap.org/data/2.5/weather?units=imperial&zip=";
const apiUrlCity = "https://api.openweathermap.org/data/2.5/weather?units=imperial&q=";

const searchBoxZip = document.querySelector("#zipcode");
const searchBoxCity = document.querySelector("#city");
const searchBoxState = document.querySelector("#state");
const searchBtn = document.querySelector("#search-btn");
const toggleSearchBtn = document.querySelector("#toggle-search-btn");
const toggleTempBtn = document.querySelector("#toggle-temp-btn");
const weatherIcon = document.querySelector(".weather-icon");

let isFahrenheit = true;
let useZip = true;

async function checkWeather(query, isZip = true) {
    const apiUrl = isZip ? `${apiUrlZip}${query},US&appid=${apiKey}` : `${apiUrlCity}${query}&appid=${apiKey}`;
    const response = await fetch(apiUrl);

    if (response.status == 404) {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weather").style.display = "none";
    } else {
        let data = await response.json();

        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°F";
        document.querySelector(".temp-hi-lo").innerHTML = `Hi: ${Math.round(data.main.temp_max)}°F | Lo: ${Math.round(data.main.temp_min)}°F`;
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + " mph";

        const date = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        document.querySelector(".date").innerHTML = `Date: ${date.toLocaleDateString(undefined, options)}`;

        if (data.weather[0].main == "Clouds") {
            weatherIcon.src = "images/clouds.png";
        } else if (data.weather[0].main == "Clear") {
            weatherIcon.src = "images/clear.png";
        } else if (data.weather[0].main == "Rain") {
            weatherIcon.src = "images/rain.png";
        } else if (data.weather[0].main == "Drizzle") {
            weatherIcon.src = "images/drizzle.png";
        } else if (data.weather[0].main == "Mist") {
            weatherIcon.src = "images/mist.png";
        }

        document.querySelector(".weather").style.display = "block";
        document.querySelector(".error").style.display = "none";
    }
}

function convertTemperature() {
    const tempElement = document.querySelector(".temp");
    const hiLoElement = document.querySelector(".temp-hi-lo");

    let temp = parseFloat(tempElement.innerHTML);
    let [hi, lo] = hiLoElement.innerHTML.match(/\d+/g).map(Number);

    if (isFahrenheit) {
        temp = (temp - 32) * 5 / 9;
        hi = (hi - 32) * 5 / 9;
        lo = (lo - 32) * 5 / 9;

        tempElement.innerHTML = `${Math.round(temp)}°C`;
        hiLoElement.innerHTML = `Hi: ${Math.round(hi)}°C | Lo: ${Math.round(lo)}°C`;
        toggleTempBtn.innerHTML = "Convert to Fahrenheit";
    } else {
        temp = (temp * 9 / 5) + 32;
        hi = (hi * 9 / 5) + 32;
        lo = (lo * 9 / 5) + 32;

        tempElement.innerHTML = `${Math.round(temp)}°F`;
        hiLoElement.innerHTML = `Hi: ${Math.round(hi)}°F | Lo: ${Math.round(lo)}°F`;
        toggleTempBtn.innerHTML = "Convert to Celsius";
    }

    isFahrenheit = !isFahrenheit;
}

function toggleSearchMode() {
    useZip = !useZip;
    if (useZip) {
        searchBoxZip.style.display = "block";
        searchBoxCity.style.display = "none";
        searchBoxState.style.display = "none";
        toggleSearchBtn.innerHTML = "Search by City/State";
    } else {
        searchBoxZip.style.display = "none";
        searchBoxCity.style.display = "block";
        searchBoxState.style.display = "block";
        toggleSearchBtn.innerHTML = "Search by ZIP Code";
    }
}

searchBtn.addEventListener("click", () => {
    if (useZip) {
        checkWeather(searchBoxZip.value, true);
    } else {
        const cityStateQuery = `${searchBoxCity.value},${searchBoxState.value}`;
        checkWeather(cityStateQuery, false);
    }
});

toggleSearchBtn.addEventListener("click", toggleSearchMode);
toggleTempBtn.addEventListener("click", convertTemperature);
