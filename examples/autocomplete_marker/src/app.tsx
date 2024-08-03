// import React, { useState, useEffect } from 'react';
// import { createRoot } from 'react-dom/client';
// import { APIProvider, ControlPosition, Map, MapMouseEvent, AdvancedMarker } from '@vis.gl/react-google-maps';
// import ControlPanelChangeMapStyle from './control-panel-change-map-style';
// import { CustomMapControl } from './map-control';
// import MapHandler from './map-handler';
// import { MarkerWithInfowindow } from './marker-with-infowindow';

// import "./App.css";

// // Google Map API Key
// // const API_KEY = globalThis.GOOGLE_MAPS_API_KEY ?? (process.env.GOOGLE_MAPS_API_KEY as string);

// // AutoComplete
// export type AutocompleteMode = { id: string; label: string };
// const autocompleteModes: Array<AutocompleteMode> = [
//   { id: 'classic', label: 'Google Autocomplete Widget' },
//   { id: 'custom', label: 'Custom Build' },
//   { id: 'custom-hybrid', label: 'Custom w/ Select Widget' }
// ];

// // Click Marker
// export interface ClickMarkers {
//   lat: number;
//   lng: number;
// }

// // Map Style
// const MapTypeId = {
//   HYBRID: 'hybrid',
//   ROADMAP: 'roadmap',
//   SATELLITE: 'satellite',
//   TERRAIN: 'terrain'
// };
// export type MapConfig = {
//   id: string;
//   label: string;
//   mapTypeId?: string;
// };
// const MAP_CONFIGS: MapConfig[] = [
//   {
//     id: 'light',
//     label: 'Light',
//     mapTypeId: MapTypeId.ROADMAP
//   },
//   {
//     id: 'satellite',
//     label: 'Satellite (no mapId)',
//     mapTypeId: MapTypeId.SATELLITE
//   },
//   {
//     id: 'hybrid',
//     label: 'Hybrid (no mapId)',
//     mapTypeId: MapTypeId.HYBRID
//   },
//   {
//     id: 'terrain',
//     label: 'Terrain (no mapId)',
//     mapTypeId: MapTypeId.TERRAIN
//   },
// ];

// const App = () => {
//   const [selectedAutocompleteMode, setSelectedAutocompleteMode] =
//     useState<AutocompleteMode>(autocompleteModes[0]);
//   const [selectedPlace, setSelectedPlace] =
//     useState<google.maps.places.PlaceResult | null>(null);
//   const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
//   const [zoom, setZoom] = useState(15);
//   const [mapConfig, setMapConfig] = useState<MapConfig>(MAP_CONFIGS[0]);

//   // Handle click on map with marker
//   const [clickedMarker, setClickedMarkers] = useState<ClickMarkers | null>(null);
//   const handleClickedMarker = (event: MapMouseEvent) => {
//     if (event.detail.latLng) {
//       console.log("Map clicked at: ", event.detail.latLng.lat, event.detail.latLng.lng);
//       const newMarker: ClickMarkers = {
//         lat: event.detail.latLng.lat,
//         lng: event.detail.latLng.lng,
//       };
//       setClickedMarkers(newMarker); // Set the latest marker, replacing the previous one
//       console.log("New marker added: ", newMarker);
//     } else {
//       console.log("Click event does not have latLng.");
//     }
//   };

//   // Get user current location (Browser) from GeoLocation
//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (currentLocation) => {
//           setCurrentLocation({
//             lat: currentLocation.coords.latitude,
//             lng: currentLocation.coords.longitude
//           });
//         },
//         (error) => {
//           console.error("Error getting the user's location: ", error);
//           // Set a default currentLocation if there is an error
//           setCurrentLocation({ lat: 38.9073, lng: -77.0365 });
//         }
//       );
//     } else {
//       console.error("Geolocation is not supported by this browser.");
//       // Set a default currentLocation if geolocation is not supported
//       setCurrentLocation({ lat: 38.9073, lng: -77.0365 });
//     }
//   }, []);

//   return (
//       <APIProvider apiKey={API_KEY}>
//         {currentLocation && (
//           <Map
//             style={{ width: '100%', height: '100%' }}
//             defaultCenter={currentLocation}
//             gestureHandling={'greedy'}
//             disableDefaultUI={false}
//             zoom={zoom}
//             mapId='84a1e53cc9fd2267'
//             //mapId={mapConfig.mapId}
//             mapTypeId={mapConfig.mapTypeId}
//             onZoomChanged={ev => setZoom(ev.detail.zoom)}
//             onClick={handleClickedMarker}
//           >
//             {/* <AdvancedMarker/> combined with an Infowindow. */}
//             <MarkerWithInfowindow position={currentLocation} />

//             {/* Click on map with marker */}
//             {clickedMarker && (
//               <MarkerWithInfowindow position={{ lat: clickedMarker.lat, lng: clickedMarker.lng }} />
//             )}

//             {/* Map Style control panel */}
//             {/* <ControlPanelChangeMapStyle
//                   mapConfigs={MAP_CONFIGS}
//                   mapConfigId={mapConfig.id}
//                   onMapConfigIdChange={id =>
//                     setMapConfig(MAP_CONFIGS.find(s => s.id === id)!)
//                   }
//                 /> */}

//             {/* AutoComplete Search */}
//             <MapHandler place={selectedPlace} />
//             <CustomMapControl
//               controlPosition={ControlPosition.TOP_LEFT}
//               selectedAutocompleteMode={selectedAutocompleteMode}
//               onPlaceSelect={setSelectedPlace}
//               zoom={zoom}
//               onZoomChange={zoom => setZoom(zoom)} />
//           </Map>
//         )}
//       </APIProvider>
//   );
// };

// export default App;

// export function renderToDom(container: HTMLElement) {
//   const root = createRoot(container);
//   root.render(<App />);
// }



import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { APIProvider, ControlPosition, Map, MapMouseEvent } from '@vis.gl/react-google-maps';

import ControlPanelChangeMapStyle from './control-panel-change-map-style';
import { CustomMapControl } from './map-control';
import MapHandler from './map-handler';
import { MarkerWithInfowindow } from './marker-with-infowindow';
import fetchWeatherData from './weather'; // Ensure fetchWeatherData is exported from weather.tsx

// Google Map API Key
const API_KEY = globalThis.GOOGLE_MAPS_API_KEY ?? (process.env.GOOGLE_MAPS_API_KEY as string);

// AutoComplete
export type AutocompleteMode = { id: string; label: string };

const autocompleteModes: Array<AutocompleteMode> = [
  { id: 'classic', label: 'Google Autocomplete Widget' },
  { id: 'custom', label: 'Custom Build' },
  { id: 'custom-hybrid', label: 'Custom w/ Select Widget' }
];

// Click Marker
export interface ClickMarkers {
  lat: number;
  lng: number;
}

// Map Style
const MapTypeId = {
  HYBRID: 'hybrid',
  ROADMAP: 'roadmap',
  SATELLITE: 'satellite',
  TERRAIN: 'terrain'
};

export type MapConfig = {
  id: string;
  label: string;
  mapId?: string;
  mapTypeId?: string;
};

const MAP_CONFIGS: MapConfig[] = [
  {
    id: 'light',
    label: 'Light',
    mapTypeId: MapTypeId.ROADMAP
  },
  {
    id: 'satellite',
    label: 'Satellite (no mapId)',
    mapTypeId: MapTypeId.SATELLITE
  },
  {
    id: 'hybrid',
    label: 'Hybrid (no mapId)',
    mapTypeId: MapTypeId.HYBRID
  },
  {
    id: 'terrain',
    label: 'Terrain (no mapId)',
    mapTypeId: MapTypeId.TERRAIN
  },
];

const App = () => {
  const [selectedAutocompleteMode, setSelectedAutocompleteMode] = useState<AutocompleteMode>(autocompleteModes[0]);
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [zoom, setZoom] = useState(15);
  const [mapConfig, setMapConfig] = useState<MapConfig>(MAP_CONFIGS[2]);
  // Handle click on map with marker
  const [clickedMarker, setClickedMarkers] = useState<ClickMarkers | null>(null);
  // Get Weather Data
  const [markerWeatherData, setMarkerWeatherData] = useState<any>(null);
  const [currentWeatherData, setCurrentWeatherData] = useState<any>(null);

  const handleClickedMarker = async (event: MapMouseEvent) => {
    if (event.detail.latLng) {
      const newMarker: ClickMarkers = {
        lat: event.detail.latLng.lat,
        lng: event.detail.latLng.lng,
      };
      setClickedMarkers(newMarker); // Set the latest marker, replacing the previous one
      const weather = await fetchWeatherData(newMarker.lat, newMarker.lng);
      setMarkerWeatherData(weather);
    }
  };

  // Get user current location (Browser) from GeoLocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (currentLocation) => {
          setCurrentLocation({
            lat: currentLocation.coords.latitude,
            lng: currentLocation.coords.longitude
          });
          const weather = await fetchWeatherData(currentLocation.coords.latitude, currentLocation.coords.longitude);
          setCurrentWeatherData(weather);
        },
        (error) => {
          console.error("Error getting the user's location: ", error);
          // Set a default currentLocation if there is an error
          setCurrentLocation({ lat: 38.9073, lng: -77.0365 });
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      // Set a default currentLocation if geolocation is not supported
      setCurrentLocation({ lat: 38.9073, lng: -77.0365 });
    }
  }, []);

  return (
    <APIProvider apiKey={API_KEY}>
      {currentLocation && (
        <Map
          style={{ width: '100%', height: '100%' }}
          defaultCenter={currentLocation}
          gestureHandling={'greedy'}
          disableDefaultUI={false}
          mapId={"84a1e53cc9fd2267"}
	        mapTypeId={mapConfig.mapTypeId}
          zoom={zoom}
          onZoomChanged={ev => setZoom(ev.detail.zoom)}
          onClick={handleClickedMarker}
        >
            {/* <AdvancedMarker/> combined with an Infowindow. */}
          <MarkerWithInfowindow position={currentLocation} weatherData={currentWeatherData} />
            {/* Click on map with marker */}
          {clickedMarker && (
            <MarkerWithInfowindow position={{ lat: clickedMarker.lat, lng: clickedMarker.lng }} weatherData={markerWeatherData} />
          )}

           {/* Map Style control panel */}
            {/* <ControlPanelChangeMapStyle
                  mapConfigs={MAP_CONFIGS}
                  mapConfigId={mapConfig.id}
                  onMapConfigIdChange={id =>
                    setMapConfig(MAP_CONFIGS.find(s => s.id === id)!)
                  }
                /> */}

            {/* AutoComplete Search */}
            <MapHandler place={selectedPlace} />
            <CustomMapControl
              controlPosition={ControlPosition.TOP_LEFT}
              selectedAutocompleteMode={selectedAutocompleteMode}
              onPlaceSelect={setSelectedPlace}
              zoom={zoom}
              onZoomChange={zoom => setZoom(zoom)} />
        </Map>
      )}
    </APIProvider>
  );
};



// export const fetchWeatherData = async (lat: number, lng: number) => {
//   const OpenWeather_API_KEY = '691424e55c852703dee06f72acbc5263';
//   const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${OpenWeather_API_KEY}&units=imperial`;

//   try {
//     const response = await fetch(url);
//     if (!response.ok) {
//       throw new Error('Failed to fetch weather data');
//     }
//     const data = await response.json();
//     return {
//       ...data,
//       weatherIconUrl: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
//     };
//   } catch (error) {
//     console.error('Error fetching weather data:', error);
//     return null;
//   }
// };



export default App;

export function renderToDom(container: HTMLElement) {
  const root = createRoot(container);
  root.render(<App />);
}