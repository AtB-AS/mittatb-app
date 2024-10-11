export * from '@atb-as/config-specs';
export * from '@atb-as/config-specs/lib/mobility-operators';

export type FirestoreConfigStatus = 'loading' | 'success';

export type PreassignedFareProductId = string;

export type PointToPointValidity = {
  fromPlace: string;
  toPlace: string;
};
