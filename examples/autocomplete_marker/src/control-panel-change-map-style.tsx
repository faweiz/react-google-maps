import * as React from 'react';
import type {MapConfig} from './app';

type ControlPanelProps = {
  mapConfigs: MapConfig[];
  mapConfigId: string;
  onMapConfigIdChange: (id: string) => void;
};

function ControlPanel({
  mapConfigs,
  mapConfigId,
  onMapConfigIdChange
}: ControlPanelProps) {
  return (
    <div className="control-panel">
      <h3>Change Map Styles</h3>
      <div>
        <label>Map Configuration</label>
        <select
          value={mapConfigId}
          onChange={ev => onMapConfigIdChange(ev.target.value)}>
          {mapConfigs.map(({id, label}) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default React.memo(ControlPanel);
