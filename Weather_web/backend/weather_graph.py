import requests
import matplotlib.pyplot as plt
from datetime import datetime
import os

def get_weather_data(city, api_key):
    url = f"http://api.openweathermap.org/data/2.5/forecast?q={city}&appid={api_key}&units=metric"
    
    response = requests.get(url)

    if response.status_code == 200:
        return response.json()
    else:
        print("Error fetching data:", response.status_code, response.text)
        return None

# Ask the user to enter a city dynamically
api_key = os.environ.get("OPENWEATHER_API")  # Replace with your actual API key
city = input("Enter city name: ").strip()  # User inputs the city

weather_data = get_weather_data(city, api_key)

if weather_data:
    # Extracting data
    forecasts = weather_data['list']
    
    Dates= [datetime.strptime(entry['dt_txt'], "%Y-%m-%d %H:%M:%S") for entry in forecasts]
    Temperatures = [entry['main']['temp'] for entry in forecasts]

    # Plotting the data
    plt.figure(figsize=(10, 5))
    plt.plot(Dates, Temperatures, marker='o', linestyle='-', color='b')
    plt.title(f'Temperature Forecast for {city}')
    plt.xlabel('Date')
    plt.ylabel('Temperature (°C)')
    plt.xticks(rotation=45)
    plt.grid()
    plt.tight_layout()
    plt.show()
