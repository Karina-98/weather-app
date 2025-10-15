const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const weatherResult = document.getElementById("weatherResult");
const body = document.body;

const apiKey = "2d27f182483357e0c3cb91c33552b5c6";

searchBtn.addEventListener("click", getWeather);

cityInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        getWeather();
    }
});


async function getWeather() {
    const city = cityInput.value.trim();
    if (!city) {
        weatherResult.innerHTML = `<p>❗ Please enter a ${city}</p>`;
        return;
    }
    const lang = detectLang(city);  
     try {
        //   данные о погоде
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=${lang}`
        );
        const data = await res.json();

        if (data.cod !== 200) throw new Error(data.message);
        
        const temp = Math.round(data.main.temp);
        const desc = data.weather[0].description;
        const icon = data.weather[0].icon;
        const cityName = data.name;
        const country = data.sys.country;

        
        weatherResult.innerHTML = `
            <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}" class="weather_icon">
            <h2>${cityName}, ${country}</h2>
            <p>${temp}°C, ${desc}</p>
        `;
         
        //  Меняем фон в зависимости от погоды
         changeBackground(icon);
         
         cityInput.value = "";

    } catch (error) {
         weatherResult.innerHTML = `<p> ${city} ${error.message}</p>`;
         cityInput.value = "";
         
    }
}

  function detectLang(city) {
  return /[а-яіїєґ]/i.test(city) ? "ru" : "en";
}

//   фон
function changeBackground(icon) {
    let bgUrl;

    //  День
    if (icon.includes("d")) {
        if (icon.startsWith("01")) {
            // ясно
            bgUrl = "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1600&q=80";
        } else if (icon.startsWith("02") || icon.startsWith("03") || icon.startsWith("04")) {
            // облака
            
            bgUrl = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80";
        } else if (icon.startsWith("09") || icon.startsWith("10")) {
            // дождь
            
            bgUrl = "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1600&q=80";
        } else if (icon.startsWith("11")) {
            // гроза
            
            bgUrl = "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80";
        } else if (icon.startsWith("13")) {
            // снег
            
            bgUrl = "https://images.unsplash.com/photo-1600628421493-7e04f5cd7026?auto=format&fit=crop&w=1600&q=80";
        } else if (icon.startsWith("50")) {
            // туман
            
            bgUrl = "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80";
        } else {
            // резервный дневной фон
            
            bgUrl = "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1600&q=80";
        }
    }
    //  Ночь
    else {
        if (icon.startsWith("01")) {
            
            bgUrl = "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80";
        } else {
           
            bgUrl = "./img/sky_night.jpg";
        }
    }


    // Применяем фон
    body.style.background = `url('${bgUrl}') no-repeat center center/cover`;
}
