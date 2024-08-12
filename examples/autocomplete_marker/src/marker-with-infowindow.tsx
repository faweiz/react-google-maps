// marker-with-infowindow.tsx
import React, { useEffect, useState, useRef } from 'react';
import {
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef,
  useMapsLibrary
} from '@vis.gl/react-google-maps';
import fetchUSAZipCodeData from './usaZipCode';
import fetchZipCodeData from './zipCode';
import { AgCharts } from "ag-charts-react";

export const MarkerWithInfowindow = ({ position, weatherData }) => {
  const [infowindowOpen, setInfowindowOpen] = useState(false);
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [address, setAddress] = useState<string | null>(null);
  const [usaZipCodeData, setUSAZipCodeData] = useState<any>(null); // usa
  const [zipCodeData, setZipCodeData] = useState<any>(null); // zip-codes
  const [zipCode, setZipCode] = useState<string | null>(null);
  const [state, setState] = useState<string | null>(null);
  const geocoding = useMapsLibrary('geocoding');

  const chartContainerRef = useRef(null);

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
          const usaZipData = await fetchUSAZipCodeData(zipCodeComponent, stateComponent);
          setUSAZipCodeData(usaZipData);
          // zip-codes
          const zipData = await fetchZipCodeData(zipCodeComponent);
          setZipCodeData(zipData);
        }
      } else {
        console.error('Geocode was not successful for the following reason: ' + status);
      }
    });
  };


  function getPopulationRaceData() {
    let whitePopulation = 0, whitePopulationPercent = 0;
    let blackPopulation = 0, blackPopulationPercent = 0;
    let hispanicPopulation = 0, hispanicPopulationPercent = 0;
    let asianPopulation = 0, asianPopulationPercent = 0;
    let americanIndianPopulation = 0, americanIndianPopulationPercent = 0;
    let hawaiianPopulation = 0, hawaiianPopulationPercent = 0;
    let otherPopulation = 0, otherPopulationPercent = 0;

    if (zipCodeData) {
        // Remove commas and parse the population string into an integer
        whitePopulation = parseInt(zipCodeData.whitePopulation.replace(/,/g, ''), 10); whitePopulationPercent = parseFloat(zipCodeData.whitePopulationPercent);
        blackPopulation = parseInt(zipCodeData.blackPopulation.replace(/,/g, ''), 10); blackPopulationPercent = parseFloat(zipCodeData.blackPopulationPercent);
        hispanicPopulation = parseInt(zipCodeData.hispanicPopulation.replace(/,/g, ''), 10); hispanicPopulationPercent = parseInt(zipCodeData.hispanicPopulationPercent);
        asianPopulation = parseInt(zipCodeData.asianPopulation.replace(/,/g, ''), 10); asianPopulationPercent = parseInt(zipCodeData.asianPopulationPercent);
        americanIndianPopulation = parseInt(zipCodeData.americanIndianPopulation.replace(/,/g, ''), 10); americanIndianPopulationPercent = parseInt(zipCodeData.americanIndianPopulationPercent);
        hawaiianPopulation = parseInt(zipCodeData.hawaiianPopulation.replace(/,/g, ''), 10); hawaiianPopulationPercent = parseInt(zipCodeData.hawaiianPopulationPercent);
        otherPopulation = parseInt(zipCodeData.otherPopulation.replace(/,/g, ''), 10); otherPopulationPercent = parseInt(zipCodeData.otherPopulationPercent);
    }

    return [
        { asset: "White", population: whitePopulation, populationPercent: whitePopulationPercent },
        { asset: "Black", population: blackPopulation, populationPercent: blackPopulationPercent },
        { asset: "Hispanic", population: hispanicPopulation, populationPercent: hispanicPopulationPercent },
        { asset: "Asian", population: asianPopulation, populationPercent: asianPopulationPercent },
        { asset: "American Indian", population: americanIndianPopulation, populationPercent: americanIndianPopulationPercent },
        { asset: "Hawaiian", population: hawaiianPopulation, populationPercent: hawaiianPopulationPercent },
        { asset: "Other:", population: otherPopulation, populationPercent: otherPopulationPercent },
    ];
  }

  const PopulationPieChart = () => {
      const [options, setOptions] = useState(null);

      useEffect(() => {
          const populationData = getPopulationRaceData();
          setOptions({
              data: populationData,
              title: {
                  text: "Population by Race",
              },
              series: [
                  {
                      type: "pie",
                      angleKey: "population",
                      calloutLabelKey: "asset",
                      sectorLabelKey: "populationPercent", //"population",
                      sectorLabel: {
                          color: "white",
                          fontWeight: "bold",
                          // formatter: ({ value }) => `$${(value / 1000).toFixed(0)}K`,
                      },
                  },
              ],
          });
      }, [zipCodeData]); // Update when zipCodeData changes

      return options ? <AgCharts options={options} /> : <div>Loading chart...</div>;
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
                <img src={weatherData.weatherIconUrl} alt="Weather Icon" />
                <h2>{weatherData?.main?.temp} °F</h2>
              </div>
              <h3>{weatherData.weather[0].description}</h3>
              <p>Time: {new Date(weatherData?.dt * 1000).toLocaleTimeString()} EST</p>
              <table style={{ width: "100%"}}>
                <tbody>
                  <tr>
                    <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}>Latitude</td>
                    <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}>{position.lat.toFixed(5)}</td>
                    <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}>Longitude</td>
                    <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}>{position.lng.toFixed(5)}</td>
                  </tr>
                  <tr style={{ backgroundColor:'#f2f2f2' }}>
                    <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}>High/Low</td>
                    <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}>{weatherData?.main?.temp_max} - {weatherData?.main?.temp_min}°F</td>
                    <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}>Wind</td>
                    <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}>{weatherData.wind.speed} mph</td>
                  </tr>
                  <tr>
                    <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}>Humidity</td>
                    <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}>{weatherData.main.humidity}%</td>
                    <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}>Pressure</td>
                    <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}>{weatherData.main.pressure} hPa</td>
                  </tr>
                  <tr style={{ backgroundColor:'#f2f2f2' }}>
                    <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}>Sunrise</td>
                    <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}>{new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()} EST</td>
                    <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}>Sunset</td>
                    <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}>{new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()} EST</td>
                  </tr>
                </tbody>
              </table>
            </>
          )}
          {/* usa */}
          {/* {usaZipCodeData && (
            <>
              <h4>Zip Code <a href={usaZipCodeData.QuickLink} target="_blank"><b>{zipCode}</b></a> Demographics: </h4>
              <p>Population: <b>{usaZipCodeData.Population}</b></p>
              <p>Population Growth: <b><a href={`http://www.usa.com/${zipCode}-${state}-population-and-races.htm`} target="_blank">{usaZipCodeData.PopulationGrowth}</a></b> </p>
              <p>Population Density: {usaZipCodeData.PopulationDensity}</p>
              <p>Median Household Income: {usaZipCodeData.MedianHouseholdIncome}</p>
              <p>Median House Price: {usaZipCodeData.MedianHousePrice}</p>
              <p>Time Zone: {usaZipCodeData.TimeZone}</p>
              <p>Land Area: {usaZipCodeData.LandArea}</p>
              <p>Water Area: {usaZipCodeData.WaterArea}</p>
              <p>State: {usaZipCodeData.State}</p>
              <p>Area: {usaZipCodeData.Area}</p>
              <p>Counties: {usaZipCodeData.Counties}</p>
              <p>City: {usaZipCodeData.City}</p>
              <p>School District: {usaZipCodeData.SchoolDistrict}</p>
              <p>Area Code: {usaZipCodeData.AreaCode}</p> 
              <p><a href={usaZipCodeData.QuickLink} target="_blank">USA.com</a></p>
            </>
          )} */}
          {/* zip-codes */}
          {zipCodeData && usaZipCodeData && (
              <>
                <h4>Zip Code <a href={zipCodeData.QuickLink} target="_blank"><b>{zipCode}</b></a> Demographics: </h4>
                <table style={{ width: "100%"}}>
                  <tbody>
                    <tr>
                      <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}>Population Growth</td>
                      <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}><b><a href={`http://www.usa.com/${zipCode}-${state}-population-and-races.htm`} target="_blank">{usaZipCodeData.PopulationGrowth}</a></b></td>
                    </tr>
                    <tr>
                      <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}>Current Population</td>
                      <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}><b>{zipCodeData.CurrentPopulation}</b></td>
                      <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}>Households</td>
                      <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}>{zipCodeData.Households}</td>
                    </tr>
                    <tr style={{ backgroundColor:'#f2f2f2' }}>
                      <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}>2020 Population</td>
                      <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}><b>{zipCodeData.TwentyPopulation}</b></td>
                      <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}>Average House Value</td>
                      <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}><b>{zipCodeData.AverageHouseValue}</b></td>
                    </tr>
                    <tr>
                      <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}>Population Density</td>
                      <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}>{zipCodeData.PopulationDensity}</td>
                      <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}>Persons Per Household</td>
                      <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}>{zipCodeData.PersonsPerHousehold}</td>
                    </tr>
                    <tr style={{ backgroundColor:'#f2f2f2' }}>
                      <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}>Average Income</td>
                      <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}><b>{zipCodeData.AverageIncome}</b></td>
                      <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}>Average Family Size</td>
                      <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}>{zipCodeData.AverageFamilySize}</td>
                    </tr>
                  </tbody>
                </table>
                {/* show Population By Race with Pie Chart */}
                <PopulationPieChart />
              </>
          )}
        </InfoWindow>
      )}
    </>
  );
};


