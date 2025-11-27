export * from '@atb-as/config-specs';
export * from '@atb-as/config-specs/lib/mobility';

export type FirestoreConfigStatus = 'loading' | 'success';

export type PointToPointValidity = {
  fromPlace: string;
  toPlace: string;
};
