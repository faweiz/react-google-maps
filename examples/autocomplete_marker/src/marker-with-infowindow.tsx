// marker-with-infowindow.tsx
import React, { useEffect, useState, useRef } from 'react';
import {
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef,
  useMapsLibrary
} from '@vis.gl/react-google-maps';
import { AgCharts } from "ag-charts-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import fetchUSAZipCodeData from './usaZipCode';
import fetchZipCodeData from './zipCode';
import fetchPropertyData from './property/property';

// import propertyData from './property/properData.json';

export const MarkerWithInfowindow = ({ position, weatherData }) => {
  const [infowindowOpen, setInfowindowOpen] = useState(false);
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [address, setAddress] = useState<string | null>(null);
  const [usaZipCodeData, setUSAZipCodeData] = useState<any>(null); // usa
  const [zipCodeData, setZipCodeData] = useState<any>(null); // zip-codes
  const [zipCode, setZipCode] = useState<string | null>(null);
  const [propertyData, setPropertyData] = useState<any>(null); // property Detail
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
      if (status === 'OK' && results != null) {
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

        const addressComponent = results[0].formatted_address
        if(addressComponent){
          const propertyValue = await fetchPropertyData(addressComponent);
          setPropertyData(propertyValue)
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

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    // autoplay: true,
    // autoplaySpeed: 1000,
    arrows: true, // Enable arrows
  };

  const getPhotos = () => {
    return propertyData.propertyDetails.originalPhotos.map((photoSet, index) => {
      // You can choose the appropriate image size you want to display here
      const imageUrl = photoSet.mixedSources.jpeg[0].url; // For example, using the first jpeg image
      return (
        <div key={index}>
          <div className="img-body">
            <img src={imageUrl} alt={`Property ${index}`} style={{ width: '100%', height: 'auto' }} />
          </div>
        </div>
      );
    });
  };

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

          {propertyData && (
            <>
            <h4>Property Details: <a href={propertyData.zillowURL} target="_blank">{propertyData.propertyDetails.streetAddress}</a></h4>
              <table style={{ width: "100%"}}>
                <tbody>
                  <tr style={{textAlign: 'center'}}>
                    <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}><b>${propertyData.propertyDetails.zestimate}</b></td>
                    <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}>{propertyData.propertyDetails.bedrooms}</td>
                    <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}>{propertyData.propertyDetails.bathrooms}</td>
                    <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}>{propertyData.propertyDetails.livingArea}</td>
                  </tr>
                  <tr style={{textAlign: 'center'}}>
                    <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}>Estimate</td>
                    <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}>Beds</td>
                    <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}>Bath</td>
                    <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}>SqFt</td>
                  </tr>
                  <tr>
                    <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}>Type</td>
                    <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}>{propertyData.propertyDetails.propertyTypeDimension}</td>
                    <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}>Zestimate per sqft</td>
                    {propertyData.propertyDetails.resoFacts.pricePerSquareFoot && (  
                      <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}>${propertyData.propertyDetails.resoFacts.pricePerSquareFoot}</td>
                    )}
                  </tr>
                  <tr style={{ backgroundColor:'#f2f2f2' }}>
                    <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}>Rental Estimate</td>
                    <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}><b>${propertyData.propertyDetails.rentZestimate}</b>/Month</td>
                    <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}>Mortgage Payment</td>
                    <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}>$1000/Month</td>
                  </tr>
                  <tr style={{ backgroundColor:'#f2f2f2' }}>
                    <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}>Property taxes</td>
                    <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}><b>${propertyData.propertyDetails.resoFacts.taxAnnualAmount}</b></td>
                    <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}>Tax Assessed Value</td>
                    <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}>${propertyData.propertyDetails.resoFacts.taxAssessedValue}</td>
                  </tr>
                  <tr>
                    <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}>Year built</td>
                    <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}>{propertyData.propertyDetails.yearBuilt}</td>
                    <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}>Last sold</td>
                    {propertyData.propertyDetails.priceHistory[0] && (  
                      <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}><b>${propertyData.propertyDetails.lastSoldPrice}</b> ({propertyData.propertyDetails.priceHistory[0].date})</td>
                    )}
                  </tr>
                  <tr style={{ backgroundColor:'#f2f2f2' }}>
                    <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}>Lot Size</td>
                    <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}>{propertyData.propertyDetails.lotSize} Sqft</td>
                    <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}>GreatSchool Score</td>
                    <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}><a href={propertyData.propertyDetails.schools[0].link}target="_blank">{propertyData.propertyDetails.schools[0].rating}</a>/<a href={propertyData.propertyDetails.schools[1].link}target="_blank">{propertyData.propertyDetails.schools[1].rating}</a>/<a href={propertyData.propertyDetails.schools[2].link}target="_blank">{propertyData.propertyDetails.schools[2].rating}</a></td>
                  </tr>
                  <tr style={{ backgroundColor:'#f2f2f2' }}>
                    <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}>Has HOA?</td>
                    <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}><b>{propertyData.propertyDetails.resoFacts.hoaFee}</b></td>
                    <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}>Has Garage ?</td>
                    <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}>{propertyData.propertyDetails.resoFacts.parkingFeatures} ({propertyData.propertyDetails.resoFacts.parkingCapacity} Total) </td>
                  </tr>
                  <tr style={{ backgroundColor:'#f2f2f2' }}>
                    <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}>Day on Martket</td>
                    <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}>{propertyData.propertyDetails.daysOnZillow}</td>
                  </tr>
                </tbody>
              </table>
              <p>{propertyData.propertyDetails.description}</p>
              
              <h5>Price History</h5>
              <table style={{ width: "100%"}}>
                <tbody>
                  <tr>
                    <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}><b>Date</b></td>
                    <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}><b>Event</b></td>
                    <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}><b>Price</b></td>
                  </tr>
                  {propertyData.propertyDetails.priceHistory && propertyData.propertyDetails.priceHistory.map((priceHistory, index) => {
                    const priceChangeColor = priceHistory.priceChangeRate >= 0 ? 'green' : 'red';
                    return (
                      <tr key={index}>
                        <td style={{ borderTop: '1px solid #ddd', padding: '4px' }}>{priceHistory.date}</td>
                        <td style={{ borderTop: '1px solid #ddd', padding: '4px' }}>{priceHistory.event}</td>
                        <td style={{ borderTop: '1px solid #ddd', padding: '4px' }}>${priceHistory.price} 
                          <span style={{ color: priceChangeColor }}>
                            {priceHistory.priceChangeRate >= 0 ? ' +' : ''}{ (priceHistory.priceChangeRate * 100).toFixed(2) }%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <h5>Tax History</h5>
              <table style={{ width: "100%"}}>
                <tbody>
                  <tr>
                    <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}><b>Year</b></td>
                    <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}><b>Property Taxes</b></td>
                    <td style={{ borderTop: '1px solid #ddd', padding: '4px'}}><b>Tax Assessment</b></td>
                  </tr>
                  {propertyData.propertyDetails.taxHistory && propertyData.propertyDetails.taxHistory.map((taxHistory, index) => {
                    const year = new Date(taxHistory.time).getFullYear();
                    const taxIncreaseColor = taxHistory.taxIncreaseRate >= 0 ? 'green' : 'red';
                    const valueIncreaseColor = taxHistory.valueIncreaseRate >= 0 ? 'green' : 'red';
                    return (
                      <tr key={index}>
                        <td style={{ borderTop: '1px solid #ddd', padding: '4px' }}>{year}</td>
                        <td style={{ borderTop: '1px solid #ddd', padding: '4px' }}>${taxHistory.taxPaid} 
                          <span style={{ color: taxIncreaseColor }}>
                            {taxHistory.taxIncreaseRate >= 0 ? ' +' : ''}{ (taxHistory.taxIncreaseRate * 100).toFixed(2) }%
                          </span>
                        </td>
                        <td style={{ borderTop: '1px solid #ddd', padding: '4px' }}>${taxHistory.value} 
                          <span style={{ color: valueIncreaseColor }}>
                            {taxHistory.valueIncreaseRate >= 0 ? ' +' : ''}{ (taxHistory.valueIncreaseRate * 100).toFixed(2) }%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <Slider {...sliderSettings}>
                {getPhotos()}
              </Slider>
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


