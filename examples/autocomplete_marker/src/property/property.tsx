// property.tsx
export const fetchPropertyData = async (address: string) => {
    const url = `https://zillow-working-api.p.rapidapi.com/pro/byaddress?propertyaddress=${address}`;
    const RapidAPI_API_KEY = process.env.RapidAPI_API_KEY;
    console.log(url);
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key':  RapidAPI_API_KEY,
        'x-rapidapi-host': 'zillow-working-api.p.rapidapi.com'
      }
    };
    
    try {
      const response = await fetch(url, options);
      console.log("response: ", response);
      if (!response.ok) {
        throw new Error('Failed to fetch property data');
      }
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error('Error fetching property data:', error);
      return null;
    }
  };
  export default fetchPropertyData;
  