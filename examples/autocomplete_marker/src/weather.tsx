export const fetchWeatherData = async (lat: number, lng: number) => {
    const OpenWeather_API_KEY = '691424e55c852703dee06f72acbc5263';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${OpenWeather_API_KEY}&units=imperial`;
  
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      const data = await response.json();
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
