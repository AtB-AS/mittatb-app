import {createEmptyBuilder} from '../purchase-selection-builder';
import {
  TEST_INPUT,
  TEST_PRODUCT,
  TEST_USER_PROFILE,
  TEST_ZONE,
} from './test-utils';
import {PurchaseSelectionBuilderInput} from '../types';

describe('purchaseSelectionBuilder - forType', () => {
  it("Throw error if config type doesn't exist", () => {
    const fn = () =>
      createEmptyBuilder(TEST_INPUT).forType('not-existing').build();

    expect(fn).toThrow();
  });

  it('Selected product is the first one if no product specified as default', () => {
    const input = {
      ...TEST_INPUT,
      preassignedFareProducts: [
        {...TEST_PRODUCT, id: 'A'},
        {...TEST_PRODUCT, id: 'B'},
        {...TEST_PRODUCT, id: 'C'},
      ],
    };

    const selection = createEmptyBuilder(input).forType('single').build();

    expect(selection.preassignedFareProduct.id).toBe('A');
  });

  it('Selected product is the product specified as default', () => {
    const input = {
      ...TEST_INPUT,
      preassignedFareProducts: [
        {...TEST_PRODUCT, id: 'A'},
        {...TEST_PRODUCT, id: 'B', isDefault: true},
        {...TEST_PRODUCT, id: 'C'},
      ],
    };

    const selection = createEmptyBuilder(input).forType('single').build();

    expect(selection.preassignedFareProduct.id).toBe('B');
  });

  it('Should select product which is not for distribution channel app', () => {
    const input = {
      ...TEST_INPUT,
      preassignedFareProducts: [
        {...TEST_PRODUCT, id: 'A', distributionChannel: ['web']},
        {...TEST_PRODUCT, id: 'B', distributionChannel: ['web']},
        {...TEST_PRODUCT, id: 'C'},
      ],
    };

    const selection = createEmptyBuilder(input).forType('single').build();

    expect(selection.preassignedFareProduct.id).toBe('C');
  });

  it('Should select product which is for current app version', () => {
    const input = {
      ...TEST_INPUT,
      preassignedFareProducts: [
        {
          ...TEST_PRODUCT,
          id: 'A',
          limitations: {...TEST_PRODUCT.limitations, appVersionMin: '1.21'},
        },
        {
          ...TEST_PRODUCT,
          id: 'B',
          limitations: {...TEST_PRODUCT.limitations, appVersionMax: '1.19'},
        },
        {...TEST_PRODUCT, id: 'C'},
      ],
      appVersion: '1.20',
    };

    const selection = createEmptyBuilder(input).forType('single').build();

    expect(selection.preassignedFareProduct.id).toBe('C');
  });

  it('Should select product for distribution channel app-debug users if profile is debug', () => {
    const input = {
      ...TEST_INPUT,
      preassignedFareProducts: [
        {...TEST_PRODUCT, id: 'A', distributionChannel: ['debug-app']},
        {...TEST_PRODUCT, id: 'B'},
      ],
      customerProfile: {debug: true},
    };

    const selection = createEmptyBuilder(input).forType('single').build();

    expect(selection.preassignedFareProduct.id).toBe('A');
  });

  it('Should not select product for distribution channel app-debug users if profile is not debug', () => {
    const input = {
      ...TEST_INPUT,
      preassignedFareProducts: [
        {...TEST_PRODUCT, id: 'A', distributionChannel: ['debug-app']},
        {...TEST_PRODUCT, id: 'B'},
      ],
    };

    const selection = createEmptyBuilder(input).forType('single').build();

    expect(selection.preassignedFareProduct.id).toBe('B');
  });

  it('Selected place is the first zone if no zone specified as default', () => {
    const input = {
      ...TEST_INPUT,
      tariffZones: [
        {...TEST_ZONE, id: 'T1'},
        {...TEST_ZONE, id: 'T2'},
        {...TEST_ZONE, id: 'T3'},
      ],
    };

    const selection = createEmptyBuilder(input).forType('single').build();

    expect(selection.fromPlace.id).toBe('T1');
    expect(selection.toPlace.id).toBe('T1');
  });

  it('Selected place is the zone specified as default', () => {
    const input = {
      ...TEST_INPUT,
      tariffZones: [
        {...TEST_ZONE, id: 'T1'},
        {...TEST_ZONE, id: 'T2', isDefault: true},
        {...TEST_ZONE, id: 'T3'},
      ],
      currentCoordinates: {latitude: 50, longitude: 50},
    };

    const selection = createEmptyBuilder(input).forType('single').build();

    expect(selection.fromPlace.id).toBe('T2');
    expect(selection.toPlace.id).toBe('T2');
  });

  it('Selected place is the zone within current coordinates', () => {
    const input: PurchaseSelectionBuilderInput = {
      ...TEST_INPUT,
      tariffZones: [
        {...TEST_ZONE, id: 'T1'},
        {...TEST_ZONE, id: 'T2', isDefault: true},
        {
          ...TEST_ZONE,
          id: 'T3',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [40, 40],
                [40, 60],
                [60, 60],
                [60, 40],
                [40, 40],
              ],
            ],
          },
        },
      ],
      currentCoordinates: {latitude: 50, longitude: 50},
    };

    const selection = createEmptyBuilder(input).forType('single').build();

    expect(selection.fromPlace.id).toBe('T3');
    expect(selection.toPlace.id).toBe('T3');
  });

  it('Should select zone which is in product limitations', () => {
    const input = {
      ...TEST_INPUT,
      preassignedFareProducts: [
        {
          ...TEST_PRODUCT,
          limitations: {...TEST_PRODUCT.limitations, tariffZoneRefs: ['T3']},
        },
      ],
      tariffZones: [
        {...TEST_ZONE, id: 'T1'},
        {...TEST_ZONE, id: 'T2', isDefault: true},
        {...TEST_ZONE, id: 'T3'},
      ],
    };

    const selection = createEmptyBuilder(input).forType('single').build();

    expect(selection.fromPlace.id).toBe('T3');
    expect(selection.toPlace.id).toBe('T3');
  });

  it('Selected user profile is the first one if no user type specified as default in preferences', () => {
    const input = {
      ...TEST_INPUT,
      userProfiles: [
        {...TEST_USER_PROFILE, id: 'UP1'},
        {...TEST_USER_PROFILE, id: 'UP2'},
        {...TEST_USER_PROFILE, id: 'UP3'},
      ],
    };

    const selection = createEmptyBuilder(input).forType('single').build();

    expect(selection.userProfilesWithCount).toHaveLength(1);
    expect(selection.userProfilesWithCount[0].id).toBe('UP1');
    expect(selection.userProfilesWithCount[0].count).toBe(1);
  });

  it('Selected user profile is the one specified as default in preferences', () => {
    const input = {
      ...TEST_INPUT,
      userProfiles: [
        {...TEST_USER_PROFILE, id: 'UP1', userTypeString: 'ADULT'},
        {...TEST_USER_PROFILE, id: 'UP2', userTypeString: 'CHILD'},
        {...TEST_USER_PROFILE, id: 'UP3', userTypeString: 'SENIOR'},
      ],
      defaultUserTypeString: 'CHILD',
    };

    const selection = createEmptyBuilder(input).forType('single').build();

    expect(selection.userProfilesWithCount).toHaveLength(1);
    expect(selection.userProfilesWithCount[0].id).toBe('UP2');
    expect(selection.userProfilesWithCount[0].count).toBe(1);
  });

  it('Should select user profile which is in product limitations', () => {
    const input = {
      ...TEST_INPUT,
      preassignedFareProducts: [
        {...TEST_PRODUCT, limitations: {userProfileRefs: ['UP3']}},
      ],
      userProfiles: [
        {...TEST_USER_PROFILE, id: 'UP1', userTypeString: 'ADULT'},
        {...TEST_USER_PROFILE, id: 'UP2', userTypeString: 'CHILD'},
        {...TEST_USER_PROFILE, id: 'UP3', userTypeString: 'SENIOR'},
      ],
      defaultUserTypeString: 'CHILD',
    };

    const selection = createEmptyBuilder(input).forType('single').build();

    expect(selection.userProfilesWithCount).toHaveLength(1);
    expect(selection.userProfilesWithCount[0].id).toBe('UP3');
    expect(selection.userProfilesWithCount[0].count).toBe(1);
  });

  it('Travel date should be undefined', () => {
    const selection = createEmptyBuilder(TEST_INPUT).forType('single').build();

    expect(selection.travelDate).toBeUndefined();
  });
});
