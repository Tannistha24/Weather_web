from flask import Flask, request, jsonify, render_template, url_for, redirect, session
import requests
import matplotlib.pyplot as plt
from datetime import datetime
import io
import base64
import os
import openai

app = Flask(__name__, template_folder="template", static_folder="static")

API_KEY = os.env.get("OPENWEATHER_API")  # Replace with your actual OpenWeather API key

openai.api_key = os.env.get("OPENAI_API")  # Replace with your actual OpenAI API key

@app.route('/ai', methods=['POST'])
def ai_chat():
    data = request.get_json()
    user_query = data.get("query", "")

    if not user_query:
        return jsonify({"error": "Empty query"}), 400

    try:
        response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": user_query}],
        temperature=0.7
        )

        reply = response.choices[0].message['content']

        reply = response['choices'][0]['message']['content']
        return jsonify({"reply": reply})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def get_weather_data(city):
    """Fetch weather data from OpenWeather API"""
    url = f"http://api.openweathermap.org/data/2.5/forecast?q={city}&appid={API_KEY}&units=metric"
    response = requests.get(url)
    
    if response.status_code == 200:
        return response.json()
    else:
        return None

def generate_weather_graph(city):
    """Generate temperature forecast graph and return as base64"""
    weather_data = get_weather_data(city)
    
    if not weather_data:
        return None

    forecasts = weather_data['list']
    times = [datetime.strptime(entry['dt_txt'], "%Y-%m-%d %H:%M:%S") for entry in forecasts]
    temperatures = [entry['main']['temp'] for entry in forecasts]

    plt.figure(figsize=(10, 5))
    plt.plot(times, temperatures, marker='o', linestyle='-', color='r')
    plt.title(f'Temperature Forecast for {city}')
    plt.xlabel('Date')
    plt.ylabel('Temperature (°C)')
    plt.xticks(rotation=45)
    plt.grid()
    plt.tight_layout()

    # Convert plot to base64 string
    img = io.BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)
    img_base64 = base64.b64encode(img.read()).decode()

    return img_base64

@app.route('/')
def home():
   user = session.get('user')  # Get logged-in user
   return render_template('weather.html', user=user)

@app.route('/weather', methods=['GET'])
def weather():
    city = request.args.get('city')
    if not city:
        return jsonify({"error": "City is required"}), 400
    weather_data = get_weather_data(city)

    if not weather_data:
        return jsonify({"error": "Unable to fetch data"}), 500
    img_base64 = generate_weather_graph(city)

    lat = weather_data["city"]["coord"]["lat"]
    lon = weather_data["city"]["coord"]["lon"]

    return jsonify({
        "city": city,
        "graph": f"data:image/png;base64,{img_base64}",
        "latitude": lat,
        "longitude": lon
    })

@app.route('/sign')
def sign():
    return render_template('sign.html')

@app.route('/submit-signin', methods=['POST'])
def submit_signin():
    name = request.form['name']
    email = request.form['email']
    password = request.form['password']
    if not name:
        return "Error: Name is required", 400  # Error handling
    
    session['user'] = name
    return redirect(url_for('home')) 

    # Store user details (for now, just print them)
    print(f"User signed in: {name}, {email}")

    return jsonify({"message": "Sign-in successful", "name": name, "email": email})
app.secret_key = "supersecretkey"  # Required for sessions

 # Redirect to main page

@app.route('/logout')
def logout():
    session.pop('user', None)  # Remove user from session
    return redirect(url_for('home'))

if __name__ == '__main__':
    app.run(debug=True)
