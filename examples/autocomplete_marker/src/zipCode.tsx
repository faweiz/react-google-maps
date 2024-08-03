// zipCode.tsx
export const fetchZipCodeData = async (zipCode: string, state: string) => {
  // const url = `http://localhost:5000/zip/${zipCode}-${state}`;
  // const url = `http://localhost:5000/zip/21076/md`;
  const url = `https://zip-scraper.onrender.com/zip/${zipCode}/${state}`;
  console.log(url);
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch Zip Code data');
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error fetching Zip Code data:', error);
    return null;
  }
};

export default fetchZipCodeData;

