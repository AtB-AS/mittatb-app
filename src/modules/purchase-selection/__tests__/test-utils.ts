import {
  FareProductTypeConfig,
  PreassignedFareProduct,
  FareZone,
  UserProfile,
} from '@atb-as/config-specs';
import type {
  PurchaseSelectionBuilderInput,
  PurchaseSelectionType,
} from '../types';
import type {FareZoneWithMetadata} from '@atb/fare-zones-selector';
import {BaggageProduct} from '@atb/modules/configuration';

export const TEST_TYPE_CONFIG: FareProductTypeConfig = {
  type: 'single',
  name: [{lang: 'no', value: 'Produkttype1'}],
  description: [{lang: 'no', value: 'Beskrivelse'}],
  transportModes: [{mode: 'bus', subMode: 'localBus'}],
  isCollectionOfAccesses: false,
  configuration: {
    travellerSelectionMode: 'multiple',
    productSelectionMode: 'productAlias',
    zoneSelectionMode: 'single',
    timeSelectionMode: 'datetime',
    requiresLogin: false,
    onBehalfOfEnabled: false,
  },
};

export const TEST_PRODUCT: PreassignedFareProduct = {
  id: 'P1',
  type: 'single',
  name: {lang: 'no', value: 'Produkt1'},
  version: 'v1',
  limitations: {userProfileRefs: []},
  distributionChannel: ['app'],
};

export const TEST_ZONE: FareZone = {
  id: 'T1',
  name: {lang: 'no', value: 'Sone 1'},
  version: 'v1',
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [10, 10],
        [10, 20],
        [20, 20],
        [20, 10],
        [10, 10],
      ],
    ],
  },
};

export const TEST_ZONE_WITH_MD: FareZoneWithMetadata = {
  ...TEST_ZONE,
  resultType: 'zone',
};

export const TEST_USER_PROFILE: UserProfile = {
  id: 'UP1',
  name: {lang: 'no', value: 'Passasjerprofil1'},
  version: 'v1',
  userType: 0,
  userTypeString: 'ADULT',
};

export const TEST_BAGGAGE_PRODUCT: BaggageProduct = {
  id: 'S1',
  name: {lang: 'no', value: 'Sykkel'},
  version: 'v1',
  distributionChannel: ['app'],
  isBaggageProduct: true,
  baggageType: 'BICYCLE',
};

export const TEST_INPUT: PurchaseSelectionBuilderInput = {
  fareProductTypeConfigs: [TEST_TYPE_CONFIG],
  preassignedFareProducts: [TEST_PRODUCT],
  fareZones: [TEST_ZONE],
  userProfiles: [TEST_USER_PROFILE],
  customerProfile: undefined,
  currentCoordinates: undefined,
  appVersion: '1.0',
  defaultUserTypeString: undefined,
};

export const TEST_SELECTION: PurchaseSelectionType = {
  fareProductTypeConfig: TEST_TYPE_CONFIG,
  preassignedFareProduct: TEST_PRODUCT,
  zones: {
    from: TEST_ZONE_WITH_MD,
    to: TEST_ZONE_WITH_MD,
  },
  stopPlaces: undefined,
  userProfilesWithCount: [{...TEST_USER_PROFILE, count: 1}],
  baggageProductsWithCount: [],
  travelDate: undefined,
  legs: [],
  isOnBehalfOf: false,
};
