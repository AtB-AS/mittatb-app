import {FareProductTypeConfig} from '@atb/configuration';
import {PreassignedFareProduct} from '@atb/configuration';
import {StopPlaceFragment} from '@atb/api/types/generated/fragments/stop-places';

export type Root_PurchaseHarborSearchScreenParams = {
  fareProductTypeConfig: FareProductTypeConfig;
  preassignedFareProduct: PreassignedFareProduct;
  fromHarbor?: StopPlaceFragment;
};
