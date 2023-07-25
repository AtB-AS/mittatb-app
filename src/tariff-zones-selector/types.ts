import {TariffZone} from '@atb/reference-data/types';

export type TariffZoneResultType = 'venue' | 'geolocation' | 'zone';
export type TariffZoneWithMetadata = TariffZone & {
  resultType: TariffZoneResultType;
  venueName?: string;
};

export type TariffZoneSelection = {
  from: TariffZoneWithMetadata;
  to: TariffZoneWithMetadata;
  selectNext: 'from' | 'to';
};
