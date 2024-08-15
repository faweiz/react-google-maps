// export const fetchWeatherData = async (lat: number, lng: number) => {
//     const OpenWeather_API_KEY = process.env.OpenWeather_API_KEY;
//     const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${OpenWeather_API_KEY}&units=imperial`;
//     console.log(url)

//     try {
//       const response = await fetch(url);
//       if (!response.ok) {
//         throw new Error('Failed to fetch weather data');
//       }
//       const data = await response.json();
//       console.log(data)
//       return {
//         ...data,
//         weatherIconUrl: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
//       };
//     } catch (error) {
//       console.error('Error fetching weather data:', error);
//       return null;
//     }
//   };

//   export default fetchWeatherData;


// weather.tsx
// Cache to store Weather data
const latCodeCache = new Map<number, any>();
const lngCodeCache = new Map<number, any>();

// Rate limit configuration
const RATE_LIMIT_MS = 10000; // 10 second per request
let lastRequestTime = 0;
export const fetchWeatherData = async (lat: number, lng: number) => {
  if (latCodeCache.has(lat)) {
    return latCodeCache.get(lat);
  }
  if (lngCodeCache.has(lng)) {
    return lngCodeCache.get(lng);
  }

  const OpenWeather_API_KEY = process.env.OpenWeather_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${OpenWeather_API_KEY}&units=imperial`;

  const currentTime = Date.now();
  const timeSinceLastRequest = currentTime - lastRequestTime;

  if (timeSinceLastRequest < RATE_LIMIT_MS) {
    const delay = RATE_LIMIT_MS - timeSinceLastRequest;
    return
    await new Promise(resolve => setTimeout(resolve, delay));
  }
    try {
      lastRequestTime = Date.now();
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      const data = await response.json();
      latCodeCache.set(lat, data);
      lngCodeCache.set(lng, data);
      console.log("Weather Data:")
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