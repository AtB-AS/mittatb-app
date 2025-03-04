import {Theme, Themes} from '@atb-as/theme';

export type NsrPinIconCode =
  | 'commuterparking'
  | 'ferry'
  | 'tram'
  | 'metroandtram'
  | 'metro'
  | 'ferry'
  | 'plane'
  | 'helicopter'
  | 'train'
  | 'busandtram'
  | 'bus';

export type VehicleIconCode =
  | 'boat'
  | 'citybike'
  | 'citybus'
  | 'scooter'
  | 'sharedcar'
  | 'train'
  | 'tram';

export type StationIconCode = 'sharedcar' | 'citybike';

export type PinScooterCompany = 'generic' | 'voi' | 'ryde' | 'tier'; // todo: change 'tier' to 'dott' when sprite ready

export type LiveVehiclePinState =
  | 'active'
  | 'activeerror'
  | 'activewaiting'
  | 'indicator';

export type PinType = 'vehicle' | 'station' | 'stop';
export type PinIconCode = NsrPinIconCode | VehicleIconCode | StationIconCode;
export type PinState =
  | 'default'
  | 'minimized'
  | 'selected'
  | 'cluster'
  | LiveVehiclePinState;
export type PinTheme = keyof Themes<Theme>; // 'light' | 'dark'

// examples: stoppin_bus_default_light, vehiclepin_scooter_active_light, vehiclepin_scooter_minimized_generic_light
// todo if possible: use for mapbox style expression with type safety (and ensure only existing combinations are allowed in this type)
export type PinIcon =
  | `${PinType}pin_${PinIconCode}_${PinState}_${PinTheme}`
  | `${PinType}pin_${PinIconCode}_${PinState}_${PinScooterCompany}_${PinTheme}`;
