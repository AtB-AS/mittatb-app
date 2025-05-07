import {TariffZone} from '@atb/modules/configuration';

export type TariffZoneResultType = 'venue' | 'geolocation' | 'zone';
export type TariffZoneWithMetadata = TariffZone & {
  resultType: TariffZoneResultType;
  venueName?: string;
};
