import {FareZone} from '@atb/modules/configuration';

export type FareZoneResultType = 'venue' | 'geolocation' | 'zone';
export type FareZoneWithMetadata = FareZone & {
  resultType: FareZoneResultType;
  venueName?: string;
};
