// zipCode.tsx
export const fetchZipCodeData = async (zipCode: string) => {
  // const url = `http://localhost:5000/zip/${zipCode}`;
  const url = `https://zip-scraper-r57u.onrender.com/zip/${zipCode}`;
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



// // zipCode.tsx
// // Cache to store ZIP code data
// const zipCodeCache = new Map<string, any>();
// const stateCache = new Map<string, any>();
// // Rate limit configuration
// const RATE_LIMIT_MS = 30000; // 1 minute
// let lastRequestTime = 0;

// export const fetchZipCodeData = async (zipCode: string) => {
//   if (zipCodeCache.has(zipCode)) {
//     return zipCodeCache.get(zipCode);
//   }

//   // const url = `http://localhost:5000/zip/${zipCode};
//   const url = `https://zip-scraper-r57u.onrender.com/zip/${zipCode}`;
//   console.log(url);

//   const currentTime = Date.now();
//   const timeSinceLastRequest = currentTime - lastRequestTime;

//   if (timeSinceLastRequest < RATE_LIMIT_MS) {
//     const delay = RATE_LIMIT_MS - timeSinceLastRequest;
//     await new Promise(resolve => setTimeout(resolve, delay));
//   }

//   try {
//     lastRequestTime = Date.now();
//     const response = await fetch(url);
//     if (!response.ok) {
//       throw new Error('Failed to fetch Zip Code data');
//     }
//     const data = await response.json();
//     zipCodeCache.set(zipCode, data);
//     console.log("ZipCode Data:")
//     console.log(data)
//     return data;
//   } catch (error) {
//     console.error('Error fetching Zip Code data:', error);
//     return null;
//   }
// };

// export default fetchZipCodeData;