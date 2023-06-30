import {FareProductTypeConfig} from '@atb/configuration';
import {StopPlace} from '@atb/api/types/stopPlaces';
import {PreassignedFareProduct} from '@atb/reference-data/types';

export type Root_PurchaseHarborSearchScreenParams = {
  fareProductTypeConfig: FareProductTypeConfig;
  preassignedFareProduct: PreassignedFareProduct;
  fromHarbor?: StopPlace;
};
