import {TransportModeType, TransportSubmodeType} from '@atb/configuration';

export type TransportModePair = {
  mode: TransportModeType;
  subMode?: TransportSubmodeType;
};
