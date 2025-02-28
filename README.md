# Weather_web

Weather Forecast Website

Overview

This is a Flask-based weather forecast web application that provides real-time weather updates for any city. Users can search for weather conditions, view temperature forecasts, and interact with an AI-powered chatbot.

Features

Live Weather Updates: Get real-time weather conditions for any city.

Search Functionality: Enter a city name to retrieve weather details.

Temperature Forecast Graph: Displays a graphical representation of upcoming temperature trends.

Weather Icons & Emoji Representation: Enhances UI with weather-related emojis.

Interactive Map: View the searched city's location.

Voice Assistance: Allows users to interact via voice input.

User Authentication: Sign-in and logout features for personalized experience.

AI Chatbot: Uses OpenAI API to provide weather-related assistance.

Technologies Used

Frontend: HTML, CSS, JavaScript

Backend: Flask (Python)

APIs Used:

OpenWeatherMap API (for weather data)

Google Maps API (for interactive maps)

OpenAI API (for chatbot integration)

Libraries: Requests, Matplotlib, Flask-Session

Installation & Setup

Prerequisites

Python 3.x installed

Flask framework installed

API keys for OpenWeatherMap, Google Maps, and OpenAI
Steps to Run Locally

Clone the repository:

git clone (https://github.com/Tannistha24/Weather_web.git)

cd weather-website

Install required dependencies:

pip install flask requests matplotlib openai

Set up environment variables for API keys:

export WEATHER_API_KEY=your_openweathermap_api_key
export GOOGLE_MAPS_API_KEY=your_google_maps_api_key
export OPENAI_API_KEY=your_openai_api_key

Run the Flask server:

python app.py

Open your browser and visit:

http://127.0.0.1:5000/

Usage

Enter a city name in the search box and click "Get Weather."

View weather details such as temperature, humidity, and description.

Check the temperature forecast graph.

Use the interactive map to see the city's location.

Ask the AI chatbot weather-related questions.

Optionally, sign in for a personalized experience.

Future Enhancements

Add historical weather data visualization.

Implement user preferences for favorite locations.

Enhance UI with dynamic animations and themes.

Add multi-language support.

Improve AI chatbot accuracy with more training data.
