// import { useMap } from '@vis.gl/react-google-maps';
// import React, { useEffect, useState } from 'react';
// import {MarkerWithInfowindow} from './marker-with-infowindow';

// import fetchWeatherData from "./app";
// // Get Weather Data
// const [placeWeatherData, setPlaceWeatherData] = useState<any>(null);

// interface Props {
//   place: google.maps.places.PlaceResult | null;
// }

// const MapHandler = ({ place }: Props) => {
//   const map = useMap();
//   const [placePosition, setPlacePosition] = useState<{ lat: number; lng: number } | null>(null);

//   useEffect(() => {
//     if (!map || !place) return;

//     if (place.geometry?.location) {
//       const position = {
//         lat: place.geometry.location.lat(),
//         lng: place.geometry.location.lng()
//       };

//       setPlacePosition(position);

//       if (place.geometry?.viewport) {
//         map.fitBounds(place.geometry.viewport);
//       } else {
//         map.setCenter(position);
//         map.setZoom(15);
//       }

//       const weather = fetchWeatherData(placePosition.lat, placePosition.lng);
//       setPlaceWeatherData(weather);
      
//     }
//   }, [map, place]);

//   return (
//     <>
//       {/* {placePosition && <MarkerWithInfowindow position={placePosition} />} */}
//       <MarkerWithInfowindow position={placePosition} weatherData={placeWeatherData} />
//     </>
//   );
// };

// export default React.memo(MapHandler);





// map-handler.tsx
import { useMap } from '@vis.gl/react-google-maps';
import React, { useEffect, useState } from 'react';
import { MarkerWithInfowindow } from './marker-with-infowindow';
import fetchWeatherData from './weather'; // Ensure fetchWeatherData is exported from weather.tsx

interface Props {
  place: google.maps.places.PlaceResult | null;
}

const MapHandler = ({ place }: Props) => {
  const map = useMap();
  const [placePosition, setPlacePosition] = useState<{ lat: number; lng: number } | null>(null);
  const [placeWeatherData, setPlaceWeatherData] = useState<any>(null);

  useEffect(() => {
    if (!map || !place) return;

    if (place.geometry?.location) {
      const position = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      };

      setPlacePosition(position);

      // Fetch weather data asynchronously
      const fetchWeather = async () => {
        const weather = await fetchWeatherData(position.lat, position.lng);
        setPlaceWeatherData(weather);
      };
      fetchWeather();

      if (place.geometry?.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(position);
        map.setZoom(15);
      }
    }
  }, [map, place]);

  return (
    <>
      {placePosition && (
        <MarkerWithInfowindow position={placePosition} weatherData={placeWeatherData} />
      )}
    </>
  );
};

export default React.memo(MapHandler);
