import React from 'react';
import {ControlPosition, MapControl} from '@vis.gl/react-google-maps';

import {PlaceAutocompleteClassic} from './autocomplete-classic';
import {AutocompleteCustom} from './autocomplete-custom';

import {AutocompleteCustomHybrid} from './autocomplete-custom-hybrid';
import type {AutocompleteMode} from './app';

type CustomAutocompleteControlProps = {
  controlPosition: ControlPosition;
  selectedAutocompleteMode: AutocompleteMode;
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
};

export const CustomMapControl = ({
  controlPosition,
  selectedAutocompleteMode,
  onPlaceSelect,
  zoom,
  onZoomChange
}: CustomAutocompleteControlProps) => {
  const {id} = selectedAutocompleteMode;

  let zoomResult; 

  if(zoom >= 1 && zoom <= 4){
    zoomResult = "Entire World"
  }else if(zoom >= 5 && zoom < 10){
    zoomResult = "Landmass/continent"
  }else if(zoom >= 10 && zoom < 15){
    zoomResult = "City"
  }else if(zoom >= 15 && zoom < 17){
    zoomResult = "Streets"
  }else if(zoom >= 17 && zoom < 23){
    zoomResult = "Buildings"
  }

  return (
    <MapControl position={controlPosition}>
      <div className="autocomplete-control">
        {id === 'classic' && (
          <PlaceAutocompleteClassic onPlaceSelect={onPlaceSelect} />
        )}

        {id === 'custom' && (
          <AutocompleteCustom onPlaceSelect={onPlaceSelect} />
        )}

        {id === 'custom-hybrid' && (
          <AutocompleteCustomHybrid onPlaceSelect={onPlaceSelect} />
        )}
      </div>
      {/* Zoom Control Bar */}
      {/* <div
        style={{
          margin: '10px',
          padding: '1em',
          background: 'rgba(255,255,255,0.4)',
          display: 'flex',
          flexFlow: 'column nowrap'
        }}>
        <label htmlFor={'zoom'}>{zoomResult}: {zoom.toFixed(2)}</label>
        <input
          id={'zoom'}
          type={'range'}
          min={1}
          max={22}
          step={'any'}
          value={zoom}
          onChange={ev => onZoomChange(ev.target.valueAsNumber)}
        />
      </div> */}
    </MapControl>
  );
};
