const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const weatherResult = document.getElementById("weatherResult");
const body = document.body;

const apiKey = "098f61a4500eb34c67e36dfdb47b6610";

const weatherDescriptions = {
    "clear sky": { ru: "Ясно", en: "Clear sky" },
    "few clouds": { ru: "Мало облаков", en: "Few clouds" },
    "scattered clouds": { ru: "Рассеянные облака", en: "Scattered clouds" },
    "broken clouds": { ru: "Облачно", en: "Broken clouds" },
    "overcast clouds": { ru: "Сплошная облачность", en: "Overcast clouds" },
    "shower rain": { ru: "Ливень", en: "Shower rain" },
    "rain": { ru: "Дождь", en: "Rain" },
    "thunderstorm": { ru: "Гроза", en: "Thunderstorm" },
    "snow": { ru: "Снег", en: "Snow" },
    "mist": { ru: "Туман", en: "Mist" }
};

function getDescription(desc, lang) {
    if (weatherDescriptions[desc]) {
        return lang === "ru" ? weatherDescriptions[desc].ru : weatherDescriptions[desc].en;
    }
    return desc; 
}

searchBtn.addEventListener("click", getWeather);
cityInput.addEventListener("keypress", e => {
    if (e.key === "Enter") getWeather();
});

async function getWeather() {
    const city = cityInput.value.trim();
    if (!city) {
        weatherResult.innerHTML = `<p>❗ Please write ${city}</p>`;
        return;
    }

    const lang = detectLang(city);

    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&lang=${lang}&appid=${apiKey}`);
        const data = await res.json();
        if (data.cod !== "200" && data.cod !== 200) throw new Error(data.message);

       
        const daily = [];
    const usedDates = new Set();

data.list.forEach(item => {
    const dateStr = new Date(item.dt * 1000).toLocaleDateString(); 
    if (!usedDates.has(dateStr) && daily.length < 5) {
        const apiDesc = item.weather[0].description; 
        daily.push({
            dt: item.dt,
            tempDay: Math.round(item.main.temp),
            desc: getDescription(apiDesc, lang),
            icon: item.weather[0].icon
        });
        usedDates.add(dateStr);
    }
});

        displayDailyWeather(daily, data.city.name);
        changeBackground(daily[0].icon);
        cityInput.value = "";
    } catch (error) {
        weatherResult.innerHTML = `<p>${error.message}</p>`;
        cityInput.value = "";
    }
}

function detectLang(city) {
    return /[а-яіїєґ]/i.test(city) ? "ru" : "en";
}


function displayDailyWeather(daily, cityName, lang) {
    weatherResult.innerHTML = `<h2>${cityName}</h2>`;
    const container = document.createElement('div');
    container.className = 'daily_weather';

    daily.forEach(day => {
        const dateObj = new Date(day.dt * 1000);
        const options = { weekday: 'short', day: 'numeric', month: 'short' };
        const dayName = dateObj.toLocaleDateString(lang === "ru" ? "ru-RU" : "en-US", options);

        const dayCard = document.createElement('div');
        dayCard.className = 'day_card';
        dayCard.innerHTML = `
            <h3>${dayName}</h3>
            <img src="https://openweathermap.org/img/wn/${day.icon}@2x.png" alt="${day.desc}">
            <p>${day.tempDay}°C</p>
            <p>${day.desc}</p>
        `;
        container.appendChild(dayCard);
    });

    weatherResult.appendChild(container);
}



function changeBackground(icon) {
    let bgUrl;
    if (icon.includes("d")) {
        if (icon.startsWith("01")) bgUrl = "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1600&q=80";
        else if (["02","03","04"].some(i => icon.startsWith(i))) bgUrl = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80";
        else if (["09","10"].some(i => icon.startsWith(i))) bgUrl = "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1600&q=80";
        else if (icon.startsWith("11")) bgUrl = "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80";
        else if (icon.startsWith("13")) bgUrl = "https://images.unsplash.com/photo-1600628421493-7e04f5cd7026?auto=format&fit=crop&w=1600&q=80";
        else if (icon.startsWith("50")) bgUrl = "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80";
        else bgUrl = "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1600&q=80";
    } else {
        bgUrl = "./img/sky_night.jpg";
    }
    body.style.background = `url('${bgUrl}') no-repeat center center/cover`;
    body.style.transition = "background 0.8s ease-in-out";
}
