// marker-with-infowindow.tsx
import React, { useEffect, useState } from 'react';
import {
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef,
  useMapsLibrary
} from '@vis.gl/react-google-maps';
import fetchZipCodeData from './zipCode';

export const MarkerWithInfowindow = ({ position, weatherData }) => {
  const [infowindowOpen, setInfowindowOpen] = useState(false);
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [address, setAddress] = useState<string | null>(null);
  const [zipCodeData, setZipCodeData] = useState<any>(null);
  const [zipCode, setZipCode] = useState<string | null>(null);
  const [state, setState] = useState<string | null>(null);
  const geocoding = useMapsLibrary('geocoding');

  useEffect(() => {
    if (geocoding && position) {
      getAddressFromLatLng(position.lat, position.lng);
    }
  }, [geocoding, position]);

  const getAddressFromLatLng = (lat: number, lng: number) => {
    const geocoder = new geocoding.Geocoder();
    const latlng = { lat, lng };

    geocoder.geocode({ location: latlng }, async (results, status) => {
      if (status === 'OK' && results[0]) {
        setAddress(results[0].formatted_address);
        const zipCodeComponent = results[0].address_components.find(component =>
          component.types.includes('postal_code')
        )?.long_name;
        const stateComponent = results[0].address_components.find(component =>
          component.types.includes('administrative_area_level_1')
        )?.short_name;
        if (zipCodeComponent && stateComponent) {
          setZipCode(zipCodeComponent);
          setState(stateComponent);
          const zipData = await fetchZipCodeData(zipCodeComponent, stateComponent);
          setZipCodeData(zipData);
        }
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
          headerContent={<><p>Address:</p><h3>{address}</h3></>}
          anchor={marker}
          onCloseClick={() => setInfowindowOpen(false)}
        >
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
          {zipCodeData && (
            <>
              <h4>Demographics: </h4>
              <p>Population: <b>{zipCodeData.Population}</b></p>
              <p>Population Growth: <b><a href={`http://www.usa.com/${zipCode}-${state}-population-and-races.htm`} target="_blank">{zipCodeData.PopulationGrowth}</a></b> </p>
              <p>Population Density: {zipCodeData.PopulationDensity}</p>
              <p>Median Household Income: {zipCodeData.MedianHouseholdIncome}</p>
              <p>Median House Price: {zipCodeData.MedianHousePrice}</p>
              {/* <p>Time Zone: {zipCodeData.TimeZone}</p> */}
              <p>Land Area: {zipCodeData.LandArea}</p>
              <p>Water Area: {zipCodeData.WaterArea}</p>
              {/* <p>State: {zipCodeData.State}</p> */}
              <p>Area: {zipCodeData.Area}</p>
              <p>Counties: {zipCodeData.Counties}</p>
              {/* <p>City: {zipCodeData.City}</p> */}
              <p>School District: {zipCodeData.SchoolDistrict}</p>
              <p>Area Code: {zipCodeData.AreaCode}</p>
              <p><a href={zipCodeData.QuickLink} target="_blank">USA.com</a></p>
            </>
          )}
          {/* <p><a href={zipCodeData.QuickLink} target="_blank">Zillow</a></p>
          <p><a href={zipCodeData.QuickLink} target="_blank">Redfin</a></p> */}
        </InfoWindow>
      )}
    </>
  );
};

