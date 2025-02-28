const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const weatherGraph = document.getElementById("weatherGraph");
const weatherInfo = document.getElementById("weather-info");


weatherForm.addEventListener("submit", async event => {
    event.preventDefault();
    const city = cityInput.value;
    if (city) {
        try {
            const weatherData = await getWeatherData(city);
            displayWeatherInfo(weatherData);
            await fetchWeatherGraph(city);
        }
        catch (error) {
            console.error(error);
            alert("Error fetching weather data.");
        }
    } else {
        alert("Please enter a city.");
    }
});

async function getWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=72bbb6e6a585e73075962aaee00347d5&units=metric`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error("Could not fetch weather data");
    }
    return await response.json();
}

function displayWeatherInfo(data) {
    document.getElementById("temperature").textContent = `Temperature: ${data.main.temp}°C`;
    document.getElementById("humidity").textContent = `Humidity: ${data.main.humidity}%`;
    document.getElementById("description").textContent = `Description: ${data.weather[0].description}`;
    document.getElementById("weather-emoji").textContent = getWeatherEmoji(data.weather[0].id);
    weatherInfo.style.display = "block";
}

function getWeatherEmoji(weatherId) {
    if (weatherId >= 200 && weatherId < 300) return "⛈ ⛈ ⛈ ⛈ ";
    if (weatherId >= 300 && weatherId < 600) return "🌧 🌧 🌧 🌧";
    if (weatherId >= 600 && weatherId < 700) return "❄ ❄ ❄ ❄ ❄";
    if (weatherId === 800) return "☀ ☀ ☀ ☀ ☀";
    if (weatherId > 800 && weatherId < 810) return "☁ ☁ ☁ ☁";
    return "❓ ❓ ❓";
}

async function fetchWeatherGraph(city) {
    let response = await fetch(`/weather?city=${city}`);
    let data = await response.json();
    if (data.error) {
        alert("Error: " + data.error);
        return;
    }
    weatherGraph.src = data.graph;
    document.getElementById("weather-display").style.display = "block";
    updateMapLocation(data.latitude, data.longitude);
}
// Function to update the map with new location
function updateMapLocation(lat, lon) {
    if (!map) return;

    let location = new google.maps.LatLng(lat, lon);
    map.setCenter(location);
    map.setZoom(12);

    new google.maps.Marker({
        position: location,
        map: map
    });
}

/* Go Maps Pro Map Initialization */
let map, autocomplete;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 20.5937, lng: 78.9629 }, // Default: India
        zoom: 5
    });

    const input = document.getElementById('pac-input');
    autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);

    autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
            alert("No details available for: " + place.name);
            return;
        }
        map.setCenter(place.geometry.location);
        map.setZoom(12);

        new google.maps.Marker({
            position: place.geometry.location,
            map: map
        });
    });
}

/* AI Assistant */
document.getElementById("send-btn").addEventListener("click", async () => {
    let userMessage = document.getElementById("chat-input").value;
    if (!userMessage) return;

    let response = await fetch("/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userMessage })
    });
    let data = await response.json();
    alert("AI Response: " + data.reply);
});

async function getAIResponse(userInput) {
    const apiKey = "ZwjmCoxKTQiM2uBFKjHIOqlPHiBrdQ9TsEPO9dfyz1_VUyh01ngaYrT3BlbkFJUaaNF8ChCWbdRZ7DAlZ0SAdvUQGuuxivrDSk7AojtIyUnLTtfuNcK_C3YKRmy3NAWE813YzNIA";

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [{ role: "user", content: userInput }],
                temperature: 0.3
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error("Error fetching AI response:", error);
        return "Sorry, I couldn't process your request.";
    }
}


const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = "en-US";
recognition.continuous = false;

document.getElementById("voice-btn").addEventListener("click", () => {
    recognition.start();
});

recognition.onresult = async (event) => {
    let userMessage = event.results[0][0].transcript;
    document.getElementById("chat-input").value = userMessage;
    await sendMessage(userMessage);
};

async function sendMessage(userMessage) {
    if (!userMessage) return;

    let response = await fetch("/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userMessage })
    });

    let data = await response.json();
    
    if (data.error) {
        alert("Error: " + data.error);
    } else {
        speakResponse(data.reply);
    }
}

function speakResponse(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
}

/*
async function getAIResponse(userInput) {
    const apiKey = "ZwjmCoxKTQiM2uBFKjHIOqlPHiBrdQ9TsEPO9dfyz1_VUyh01ngaYrT3BlbkFJUaaNF8ChCWbdRZ7DAlZ0SAdvUQGuuxivrDSk7AojtIyUnLTtfuNcK_C3YKRmy3NAWE813YzNIA";

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [{ role: "user", content: userInput }],
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error("Error fetching AI response:", error);
        return "Sorry, I couldn't process your request.";
    }
}
*/