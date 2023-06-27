import {FareProductTypeConfig} from '@atb/configuration';
import {StopPlace} from '@atb/api/types/stopPlaces';

export type Root_PurchaseHarborSearchScreenParams = {
  fareProductTypeConfig: FareProductTypeConfig;
  fromHarbor?: StopPlace;
};
