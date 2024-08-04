export const fetchWeatherData = async (lat: number, lng: number) => {
    const OpenWeather_API_KEY = process.env.OpenWeather_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${OpenWeather_API_KEY}&units=imperial`;
    console.log(url)

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      const data = await response.json();
      console.log(data)
      return {
        ...data,
        weatherIconUrl: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return null;
    }
  };

  export default fetchWeatherData;
