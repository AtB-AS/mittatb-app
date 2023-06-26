import {FareProductTypeConfig} from '@atb/configuration';
import {BoatStopPoint} from '@atb/reference-data/types';

export type Root_PurchaseBoatStopPointSearchScreenParams = {
  fareProductTypeConfig: FareProductTypeConfig;
  fromBoatStopPoint?: BoatStopPoint;
};
