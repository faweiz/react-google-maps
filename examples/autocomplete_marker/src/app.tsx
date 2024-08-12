import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { APIProvider, ControlPosition, Map, MapMouseEvent, useMap, InfoWindow } from '@vis.gl/react-google-maps';

import ControlPanelChangeMapStyle from './control-panel-change-map-style';
import { CustomMapControl } from './map-control';
import MapHandler from './map-handler';
import { MarkerWithInfowindow } from './marker-with-infowindow';
import fetchWeatherData from './weather'; // Ensure fetchWeatherData is exported from weather.tsx

let featureLayer: google.maps.FeatureLayer;
let lastInteractedFeatureIds: string[] = [];
let lastClickedFeatureIds: string[] = [];

// Google Map API Key
const API_KEY = globalThis.GOOGLE_MAPS_API_KEY ?? (process.env.GOOGLE_MAPS_API_KEY as string);
// const API_KEY = globalThis.GOOGLE_MAPS_API_KEY;
const MAP_ID = process.env.GOOGLE_MAP_ID;

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
  const [zoom, setZoom] = useState(5);
  const [mapConfig, setMapConfig] = useState<MapConfig>(MAP_CONFIGS[0]);
  // Handle click on map with marker
  const [clickedMarker, setClickedMarkers] = useState<ClickMarkers | null>(null);
  // Get Weather Data
  const [markerWeatherData, setMarkerWeatherData] = useState<any>(null);
  const [currentWeatherData, setCurrentWeatherData] = useState<any>(null);
  // InfoWindow for Boundary
  const [infoWindowContent, setInfoWindowContent] = useState<string | null>(null);
  const [infoWindowPosition, setInfoWindowPosition] = useState<google.maps.LatLng | null>(null);

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

  // Handler to clear InfoWindow state when closed
  const handleInfoWindowCloseClick = () => {
    setInfoWindowContent(null);
    setInfoWindowPosition(null);
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
          mapId={MAP_ID}
          mapTypeId={mapConfig.mapTypeId}
          zoom={zoom}
          onZoomChanged={ev => setZoom(ev.detail.zoom)}
          onClick={handleClickedMarker}
        >
          {/* <MapFeatures /> */}
            {/* <AdvancedMarker/> combined with an Infowindow. */}
          <MarkerWithInfowindow position={currentLocation} weatherData={currentWeatherData} />
            {/* Click on map with marker */}
          {clickedMarker && (
            <MarkerWithInfowindow position={{ lat: clickedMarker.lat, lng: clickedMarker.lng }} weatherData={markerWeatherData} />
          )}

          {infoWindowPosition && infoWindowContent && (
            <InfoWindow position={infoWindowPosition} onCloseClick={handleInfoWindowCloseClick}>
              <div dangerouslySetInnerHTML={{ __html: infoWindowContent }} />
            </InfoWindow>
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

            <MapFeatures
              onLocalityClick={handleClickedMarker}
              setInfoWindowContent={setInfoWindowContent}
              setInfoWindowPosition={setInfoWindowPosition}
              zoom={zoom}
            />
        </Map>
      )}
    </APIProvider>
  );
};

// Data-Drive Styling for Boundaries
// const MapFeatures = ({ onLocalityClick, setInfoWindowContent, setInfoWindowPosition, zoom }) => {
//   const map = useMap();
//   useEffect(() => {
//     if (map) {
//       // featureLayer = map.getFeatureLayer(google.maps.FeatureType.COUNTRY); // Country
//       // featureLayer = map.getFeatureLayer(google.maps.FeatureType.ADMINISTRATIVE_AREA_LEVEL_1); // State
//       // featureLayer = map.getFeatureLayer(google.maps.FeatureType.ADMINISTRATIVE_AREA_LEVEL_2); // County
//       // featureLayer = map.getFeatureLayer(google.maps.FeatureType.SCHOOL_DISTRICT); // School
//       // featureLayer = map.getFeatureLayer(google.maps.FeatureType.LOCALITY); // City
//       // featureLayer = map.getFeatureLayer(google.maps.FeatureType.POSTAL_CODE); // Zip Code


//       if(zoom >= 1 && zoom <= 4){
//        // zoomResult = "Entire World"
//        featureLayer = map.getFeatureLayer(google.maps.FeatureType.COUNTRY); // Country
//        console.log("zoom = Country = ", {zoom})
//       }else if(zoom >= 5 && zoom < 10){
//        // zoomResult = "Landmass/continent"
//        featureLayer = map.getFeatureLayer(google.maps.FeatureType.ADMINISTRATIVE_AREA_LEVEL_1); // State
//        console.log("zoom = State = ", {zoom})
//       }else if(zoom >= 10 && zoom < 15){
//        // zoomResult = "City"
//        featureLayer = map.getFeatureLayer(google.maps.FeatureType.ADMINISTRATIVE_AREA_LEVEL_2); // County
//        console.log("zoom = County = ", {zoom})
//       }else if(zoom >= 15 && zoom < 17){
//       //  zoomResult = "Streets"
//       featureLayer = map.getFeatureLayer(google.maps.FeatureType.POSTAL_CODE); // Zip Code
//       console.log("zoom = Zip Code = ", {zoom})
//       }else if(zoom >= 17 && zoom < 23){
//        // zoomResult = "Buildings"
//       }

      
//       // Add the event listeners for the feature layer.
//       featureLayer.addListener('click', handleClick);
//       featureLayer.addListener('mousemove', handleMouseMove);
//       // Map event listener.
//       map.addListener('mousemove', () => {
//         // If the map gets a mousemove, that means there are no feature layers
//         // with listeners registered under the mouse, so we clear the last
//         // interacted feature ids.
//         if (lastInteractedFeatureIds?.length) {
//           lastInteractedFeatureIds = [];
//           featureLayer.style = applyStyle;
//         }
//       });
//       // Apply style on load, to enable clicking.
//       featureLayer.style = applyStyle;

//       // Click Map Marker
//       featureLayer.addListener('click', (event) => {
//         const clickedLatLng = event.latLng;
//         if (clickedLatLng) {
//           const clickedLocation = clickedLatLng;
//           onLocalityClick({ detail: { latLng: { lat: clickedLocation.lat(), lng: clickedLocation.lng() } } });
//         } else {
//           console.error('Unexpected event structure:', event);
//         }
//       });
//     }
//   }, [map, onLocalityClick]);
//   // Modify handleClick and handleMouseMove to use the passed setters
//   function handleClick(/* MouseEvent */ e) {
//     lastClickedFeatureIds = e.features.map(f => f.placeId);
//     lastInteractedFeatureIds = [];
//     featureLayer.style = applyStyle;
//     createInfoWindow(e, setInfoWindowContent, setInfoWindowPosition);
//   }
//   function handleMouseMove(/* MouseEvent */ e) {
//     lastInteractedFeatureIds = e.features.map(f => f.placeId);
//     featureLayer.style = applyStyle;
//   }
//   return null;
// };










const MapFeatures = ({ onLocalityClick, setInfoWindowContent, setInfoWindowPosition, zoom }) => {
  const map = useMap();
  let currentFeatureLayer;
  let previousFeatureLayer: google.maps.FeatureLayer;
  let clickListener = null;
  let mouseMoveListener = null;
  let mapMouseMoveListener;

  useEffect(() => {
    if (!map) return;

    // Function to update the feature layer based on zoom level
    const updateFeatureLayer = () => {
      // Remove previous feature layer listeners and clear styles if they exist
      if (previousFeatureLayer) {
        previousFeatureLayer.style = null; // Clear the previous style
        if (clickListener) {
          google.maps.event.removeListener(clickListener);
        }
        if (mouseMoveListener) {
          google.maps.event.removeListener(mouseMoveListener);
        }
        if (mapMouseMoveListener) {
          google.maps.event.removeListener(mapMouseMoveListener);
        }
      }

      if (zoom >= 0 && zoom < 4) {
        currentFeatureLayer = map.getFeatureLayer(google.maps.FeatureType.COUNTRY); // Country
        console.log("zoom = Country = ", zoom);
      } else if (zoom >= 4 && zoom < 8) {
        currentFeatureLayer = map.getFeatureLayer(google.maps.FeatureType.ADMINISTRATIVE_AREA_LEVEL_1); // State
        console.log("zoom = State = ", zoom);
      } else if (zoom >= 8 && zoom < 12) {
        currentFeatureLayer = map.getFeatureLayer(google.maps.FeatureType.ADMINISTRATIVE_AREA_LEVEL_2); // County
        console.log("zoom = County = ", zoom);
      } else if (zoom >= 12 && zoom < 23) {
        currentFeatureLayer = map.getFeatureLayer(google.maps.FeatureType.POSTAL_CODE);// Zip Code
        console.log("zoom = Zip Code = ", zoom);
      }

      // Apply style and add new listeners to the current feature layer
      if (currentFeatureLayer) {
        currentFeatureLayer.style = applyStyle;
        clickListener = currentFeatureLayer.addListener('click', handleClick);
        mouseMoveListener = currentFeatureLayer.addListener('mousemove', handleMouseMove);

        // Add a listener to clear interacted feature ids
        mapMouseMoveListener = map.addListener('mousemove', clearInteractedFeatureIds);

      }

      // Set the current layer as the previous one for the next zoom change
      previousFeatureLayer = currentFeatureLayer;

      // Click Map Marker
      currentFeatureLayer.addListener('click', (event) => {
        const clickedLatLng = event.latLng;
        if (clickedLatLng) {
          const clickedLocation = clickedLatLng;
          onLocalityClick({ detail: { latLng: { lat: clickedLocation.lat(), lng: clickedLocation.lng() } } });
        } else {
          console.error('Unexpected event structure:', event);
        }
      });

    };

    updateFeatureLayer();

    // Cleanup previous feature layer when component unmounts or zoom changes
    return () => {
      if (previousFeatureLayer) {
        previousFeatureLayer.style = null; 
        if (clickListener) {
          google.maps.event.removeListener(clickListener);
        }
        if (mouseMoveListener) {
          google.maps.event.removeListener(mouseMoveListener);
        }
        if (mapMouseMoveListener) {
          google.maps.event.removeListener(mapMouseMoveListener);
        }
      }
    };
  }, [map, zoom]);

  // Handle click event on the feature layer
  const handleClick = (e) => {
    lastClickedFeatureIds = e.features.map(f => f.placeId);
    lastInteractedFeatureIds = [];
    currentFeatureLayer.style = applyStyle;
    createInfoWindow(e, setInfoWindowContent, setInfoWindowPosition);
  };

  // Handle mouse move event on the feature layer
  const handleMouseMove = (e) => {
    lastInteractedFeatureIds = e.features.map(f => f.placeId);
    currentFeatureLayer.style = applyStyle;
  };

  // Clear interacted feature ids when mouse moves off the layer
  const clearInteractedFeatureIds = () => {
    if (lastInteractedFeatureIds.length) {
      lastInteractedFeatureIds = [];
      currentFeatureLayer.style = applyStyle;
    }
  };

  return null;
};









// Helper function for the infowindow.
async function createInfoWindow(event, setInfoWindowContent, setInfoWindowPosition) {
  let feature = event.features[0];
  if (!feature.placeId) return;

  // Update the infowindow.
  const place = await feature.fetchPlace();
  let content =
      '<span style="font-size:small">Display name: ' + place.displayName +
      '<br/> Place ID: ' + feature.placeId +
      '<br/> Feature type: ' + feature.featureType + '</span>';

  setInfoWindowContent(content);
  setInfoWindowPosition(event.latLng);
}
// Define styles.
// Stroke and fill with minimum opacity value.
const styleDefault = {
  strokeColor: '#810FCB',
  strokeOpacity: 1.0,
  strokeWeight: 2.0,
  fillColor: 'white',
  fillOpacity: 0.1,  // Polygons must be visible to receive events.
};
// Style for the clicked polygon.
const styleClicked = {
  ...styleDefault,
  fillColor: '#810FCB',
  fillOpacity: 0.5,
};
// Style for polygon on mouse move.
const styleMouseMove = {
  ...styleDefault,
  strokeWeight: 4.0,
};
// Apply styles using a feature style function.
function applyStyle(/* FeatureStyleFunctionOptions */ params) {
  const placeId = params.feature.placeId;
  //@ts-ignore
  if (lastClickedFeatureIds.includes(placeId)) {
    return styleClicked;
  }
  //@ts-ignore
  if (lastInteractedFeatureIds.includes(placeId)) {
    return styleMouseMove;
  }
  return styleDefault;
}

export default App;
export function renderToDom(container: HTMLElement) {
  const root = createRoot(container);
  root.render(<App />);
}
