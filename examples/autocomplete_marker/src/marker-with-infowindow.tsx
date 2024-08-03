// import React, {useEffect, useState} from 'react';
// import {
//   AdvancedMarker,
//   InfoWindow,
//   useAdvancedMarkerRef,
// } from '@vis.gl/react-google-maps';

// export const MarkerWithInfowindow = ({position}) => {
//   const [infowindowOpen, setInfowindowOpen] = useState(true);
//   const [markerRef, marker] = useAdvancedMarkerRef();
//   return (
//     <>
//       <AdvancedMarker
//         ref={markerRef}
//         onClick={() => setInfowindowOpen(true)}
//         position={position}
//         title={"AdvancedMarker that opens an Infowindow when clicked."}
//       />
//       {infowindowOpen && (
//         <InfoWindow
//           headerContent={<h3> Address: {}</h3>}
//           anchor={marker}
//           maxWidth={200}
//           onCloseClick={() => setInfowindowOpen(false)}>
//             <p> Longitude: {position.lat}</p>
//             <p> Longitude: {position.lng}</p>
//             <p> Time: {}</p>
//             <p> Temperature: {}F({} - {}F)</p>
//             <p> Weather: {}</p>
//             <p> Wind Speed: {} mph, {}</p>
//             <p> Humidity: {}%</p>
//             <p> Pressure: {} hPa</p>
//             <p> Sunrise: {}</p>
//             <p> Sunset: {}</p>

//             <p>Zillow: </p>
//             <p>Redfin: </p>

//             {/* This is an example for the{' '}
//             <code style={{whiteSpace: 'nowrap'}}>&lt;AdvancedMarker /&gt;</code>{' '}
//             combined with an Infowindow.  */}
//         </InfoWindow>
//       )}
//     </>
//   );
// };



// import React, { useEffect, useState } from 'react';
// import {
//   AdvancedMarker,
//   InfoWindow,
//   useAdvancedMarkerRef,
//   useMapsLibrary
// } from '@vis.gl/react-google-maps';

// export const MarkerWithInfowindow = ({ position }) => {
//   const [infowindowOpen, setInfowindowOpen] = useState(false);
//   const [markerRef, marker] = useAdvancedMarkerRef();
//   const [address, setAddress] = useState<string | null>(null);

//   const geocoding = useMapsLibrary('geocoding');

//   useEffect(() => {
//     if (geocoding && position) {
//       getAddressFromLatLng(position.lat, position.lng);
//     }
//   }, [geocoding, position]);

//   const getAddressFromLatLng = (lat: number, lng: number) => {
//     const geocoder = new geocoding.Geocoder();
//     const latlng = { lat, lng };

//     geocoder.geocode({ location: latlng }, (results, status) => {
//       if (status === 'OK' && results[0]) {
//         setAddress(results[0].formatted_address);
//       } else {
//         console.error('Geocode was not successful for the following reason: ' + status);
//       }
//     });
//   };

//   return (
//     <>
//       <AdvancedMarker
//         ref={markerRef}
//         onClick={() => setInfowindowOpen(true)}
//         position={position}
//         title={"AdvancedMarker that opens an Infowindow when clicked."}
//       />
//       {infowindowOpen && (
//         <InfoWindow
//           headerContent={<h3> Address: {address}</h3>}
//           anchor={marker}
//           maxWidth={200}
//           onCloseClick={() => setInfowindowOpen(false)}>
//           <p>Latitude: {position.lat.toFixed(5)}</p>
//           <p>Longitude: {position.lng.toFixed(5)}</p>
//           <p>Time: {new Date().toLocaleTimeString()}</p>
//           <p>Temperature: {/* temperature data */}F ({/* min temp */} - {/* max temp */}F)</p>
//           <p>Weather: {/* weather description */}</p>
//           <p>Wind Speed: {/* wind speed */} mph, {/* wind direction */}</p>
//           <p>Humidity: {/* humidity */}%</p>
//           <p>Pressure: {/* pressure */} hPa</p>
//           <p>Sunrise: {/* sunrise time */}</p>
//           <p>Sunset: {/* sunset time */}</p>

//           <p>Zillow: {/* Zillow link */}</p>
//           <p>Redfin: {/* Redfin link */}</p>

//           {/* This is an example for the{' '}
//           <code style={{whiteSpace: 'nowrap'}}>&lt;AdvancedMarker /&gt;</code>{' '}
//           combined with an Infowindow.  */}
//         </InfoWindow>
//       )}
//     </>
//   );
// };



// import React, { useEffect, useState } from 'react';
// import {
//   AdvancedMarker,
//   InfoWindow,
//   useAdvancedMarkerRef,
//   useMapsLibrary
// } from '@vis.gl/react-google-maps';

// export const MarkerWithInfowindow = ({ position, weatherData }) => {
//   const [infowindowOpen, setInfowindowOpen] = useState(false);
//   const [markerRef, marker] = useAdvancedMarkerRef();
//   const [address, setAddress] = useState<string | null>(null);

//   const geocoding = useMapsLibrary('geocoding');

//   useEffect(() => {
//     if (geocoding && position) {
//       getAddressFromLatLng(position.lat, position.lng);
//     }
//   }, [geocoding, position]);

//   const getAddressFromLatLng = (lat: number, lng: number) => {
//     const geocoder = new geocoding.Geocoder();
//     const latlng = { lat, lng };

//     geocoder.geocode({ location: latlng }, (results, status) => {
//       if (status === 'OK' && results[0]) {
//         setAddress(results[0].formatted_address);
//       } else {
//         console.error('Geocode was not successful for the following reason: ' + status);
//       }
//     });
//   };

//   return (
//     <>
//       <AdvancedMarker
//         ref={markerRef}
//         onClick={() => setInfowindowOpen(true)}
//         position={position}
//         title={"AdvancedMarker that opens an Infowindow when clicked."}
//       />
//       {infowindowOpen && (
//         <InfoWindow
//           headerContent={ <><p>Address:</p><h3>{address}</h3></>}
//           anchor={marker}
//           maxWidth={200}
//           onCloseClick={() => setInfowindowOpen(false)}>
//           <p>Latitude: {position.lat.toFixed(5)}</p>
//           <p>Longitude: {position.lng.toFixed(5)}</p>
//           <p>Time: {new Date(weatherData?.dt * 1000).toLocaleTimeString()} EST</p>
//           <p>Temperature: <b>{weatherData?.main?.temp} °F</b> ({weatherData?.main?.temp_min} - {weatherData?.main?.temp_max}°F)</p>
//           <p>Weather: {weatherData?.weather[0]?.description}</p>
//           <p>Wind Speed: {weatherData?.wind?.speed} mph, {weatherData?.wind?.deg} degrees</p>
//           <p>Humidity: {weatherData?.main?.humidity}%</p>
//           <p>Pressure: {weatherData?.main?.pressure} hPa</p>
//           <p>Sunrise: {new Date(weatherData?.sys?.sunrise * 1000).toLocaleTimeString()} EST</p>
//           <p>Sunset: {new Date(weatherData?.sys?.sunset * 1000).toLocaleTimeString()} EST</p>

//           <p>Zillow: {/* Zillow link */}</p>
//           <p>Redfin: {/* Redfin link */}</p>

//           {/* This is an example for the{' '}
//           <code style={{whiteSpace: 'nowrap'}}>&lt;AdvancedMarker /&gt;</code>{' '}
//           combined with an Infowindow.  */}
//         </InfoWindow>
//       )}
//     </>
//   );
// };



import React, { useEffect, useState } from 'react';
import {
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef,
  useMapsLibrary
} from '@vis.gl/react-google-maps';

export const MarkerWithInfowindow = ({ position, weatherData }) => {
  const [infowindowOpen, setInfowindowOpen] = useState(false);
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [address, setAddress] = useState<string | null>(null);

  const geocoding = useMapsLibrary('geocoding');

  useEffect(() => {
    if (geocoding && position) {
      getAddressFromLatLng(position.lat, position.lng);
    }
  }, [geocoding, position]);

  const getAddressFromLatLng = (lat: number, lng: number) => {
    const geocoder = new geocoding.Geocoder();
    const latlng = { lat, lng };

    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === 'OK' && results[0]) {
        setAddress(results[0].formatted_address);
      } else {
        console.error('Geocode was not successful for the following reason: ' + status);
      }
    });
  };

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        onClick={() => setInfowindowOpen(true)}
        position={position}
        title={"AdvancedMarker that opens an Infowindow when clicked."}
      />
      {infowindowOpen && (
        <InfoWindow
          headerContent={ <><p>Address:</p><h3>{address}</h3></>}
          anchor={marker}
          // maxWidth={200}
          onCloseClick={() => setInfowindowOpen(false)}
          // style={{ padding: '10px', fontSize: '14px', lineHeight: '1.5' }}
        >

        {/* <div style={{ width: '100px', padding: '10px', fontSize: '14px', lineHeight: '1.5', maxWidth: '200px' }}> */}
            {weatherData && (
              <>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img src={weatherData.weatherIconUrl} alt="Weather Icon" style={{ width: '50px', height: '50px' }} />
                  <div>
                    <p>Temperature: <b>{weatherData?.main?.temp} °F</b> ({weatherData?.main?.temp_min} - {weatherData?.main?.temp_max}°F)</p>
                    <p>{weatherData.weather[0].description}</p>
                  </div>
                </div>
                <p>Time: {new Date(weatherData?.dt * 1000).toLocaleTimeString()} EST</p>
                <p>Latitude: {position.lat.toFixed(5)}</p>
                <p>Longitude: {position.lng.toFixed(5)}</p>
                <p>Humidity: {weatherData.main.humidity}%</p>
                <p>Pressure: {weatherData.main.pressure} hPa</p>
                <p>Wind Speed: {weatherData.wind.speed} mph</p>
                <p>Sunrise: {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()} EST</p>
                <p>Sunset: {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()} EST</p>
              </>
            )}
          <p>Zillow: {/* Zillow link */}</p>
          <p>Redfin: {/* Redfin link */}</p>
        {/* </div> */}

        </InfoWindow>
      )}
    </>
  );
};

