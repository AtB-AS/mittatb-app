import {createEmptyBuilder} from '../purchase-selection-builder';
import {
  TEST_INPUT,
  TEST_PRODUCT,
  TEST_SELECTION,
  TEST_BAGGAGE_PRODUCT,
  TEST_USER_PROFILE,
  TEST_ZONE,
} from './test-utils';

describe('purchaseSelectionBuilder - product', () => {
  it('Should apply a valid product', () => {
    const selection = createEmptyBuilder(TEST_INPUT)
      .fromSelection(TEST_SELECTION)
      .product({...TEST_SELECTION.preassignedFareProduct, id: 'P2'})
      .build();

    expect(selection.preassignedFareProduct.id).toBe('P2');
  });

  it('Should apply product within app versions', () => {
    const selection = createEmptyBuilder({...TEST_INPUT, appVersion: '1.45'})
      .fromSelection(TEST_SELECTION)
      .product({
        ...TEST_SELECTION.preassignedFareProduct,
        id: 'P2',
        limitations: {
          ...TEST_SELECTION.preassignedFareProduct.limitations,
          appVersionMin: '1.44',
          appVersionMax: '1.46',
        },
      })
      .build();

    expect(selection.preassignedFareProduct.id).toBe('P2');
  });

  it('Should not apply product for wrong config type', () => {
    const selection = createEmptyBuilder(TEST_INPUT)
      .fromSelection(TEST_SELECTION)
      .product({
        ...TEST_SELECTION.preassignedFareProduct,
        id: 'P2',
        type: 'other-type',
      })
      .build();

    expect(selection.preassignedFareProduct.id).toBe(
      TEST_SELECTION.preassignedFareProduct.id,
    );
    expect(selection).toBe(TEST_SELECTION);
  });

  it('Should not apply product on to low app version', () => {
    const selection = createEmptyBuilder({...TEST_INPUT, appVersion: '1.45'})
      .fromSelection(TEST_SELECTION)
      .product({
        ...TEST_SELECTION.preassignedFareProduct,
        id: 'P2',
        limitations: {
          ...TEST_SELECTION.preassignedFareProduct.limitations,
          appVersionMin: '1.46',
        },
      })
      .build();

    expect(selection.preassignedFareProduct.id).toBe(
      TEST_SELECTION.preassignedFareProduct.id,
    );
    expect(selection).toBe(TEST_SELECTION);
  });

  it('Should not apply product on to high app version', () => {
    const selection = createEmptyBuilder({...TEST_INPUT, appVersion: '1.45'})
      .fromSelection(TEST_SELECTION)
      .product({
        ...TEST_SELECTION.preassignedFareProduct,
        id: 'P2',
        limitations: {
          ...TEST_SELECTION.preassignedFareProduct.limitations,
          appVersionMax: '1.44',
        },
      })
      .build();

    expect(selection.preassignedFareProduct.id).toBe(
      TEST_SELECTION.preassignedFareProduct.id,
    );
    expect(selection).toBe(TEST_SELECTION);
  });

  it('Should not apply product without distribution channel app', () => {
    const selection = createEmptyBuilder(TEST_INPUT)
      .fromSelection(TEST_SELECTION)
      .product({
        ...TEST_SELECTION.preassignedFareProduct,
        id: 'P2',
        distributionChannel: ['web'],
      })
      .build();

    expect(selection.preassignedFareProduct.id).toBe(
      TEST_SELECTION.preassignedFareProduct.id,
    );
    expect(selection).toBe(TEST_SELECTION);
  });

  it('Should change user profile to one that is within limitations', () => {
    const input = {
      ...TEST_INPUT,
      userProfiles: [
        {...TEST_USER_PROFILE, id: 'UP1', userTypeString: 'ADULT'},
        {...TEST_USER_PROFILE, id: 'UP2', userTypeString: 'CHILD'},
        {...TEST_USER_PROFILE, id: 'UP3', userTypeString: 'SENIOR'},
      ],
      defaultUserTypeString: 'SENIOR',
    };

    const selection = createEmptyBuilder(input)
      .fromSelection(TEST_SELECTION)
      .product({
        ...TEST_PRODUCT,
        limitations: {
          ...TEST_PRODUCT.limitations,
          userProfileRefs: ['UP2', 'UP3'],
        },
        id: 'P2',
      })
      .build();

    expect(selection.preassignedFareProduct.id).toBe('P2');
    expect(selection.userProfilesWithCount.length).toBe(1);
    expect(selection.userProfilesWithCount[0].id).toBe('UP3');
  });

  it('Should remove not selectable user profiles', () => {
    const input = {
      ...TEST_INPUT,
      userProfiles: [
        {...TEST_USER_PROFILE, id: 'UP1', userTypeString: 'ADULT'},
        {...TEST_USER_PROFILE, id: 'UP2', userTypeString: 'CHILD'},
        {...TEST_USER_PROFILE, id: 'UP3', userTypeString: 'SENIOR'},
      ],
      defaultUserTypeString: 'SENIOR',
    };

    const selection = createEmptyBuilder(input)
      .fromSelection({
        ...TEST_SELECTION,
        userProfilesWithCount: [
          {...TEST_USER_PROFILE, id: 'UP1', count: 2},
          {...TEST_USER_PROFILE, id: 'UP2', count: 3},
        ],
      })
      .product({
        ...TEST_SELECTION.preassignedFareProduct,
        limitations: {
          ...TEST_SELECTION.preassignedFareProduct.limitations,
          userProfileRefs: ['UP2', 'UP3'],
        },
        id: 'P2',
      })
      .build();

    expect(selection.preassignedFareProduct.id).toBe('P2');
    expect(selection.userProfilesWithCount.length).toBe(1);
    expect(selection.userProfilesWithCount[0].id).toBe('UP2');
    expect(selection.userProfilesWithCount[0].count).toBe(3);
  });

  it('Should change both zones to default if one is not within limitations', () => {
    const input = {
      ...TEST_INPUT,
      fareZones: [
        {...TEST_ZONE, id: 'T1'},
        {...TEST_ZONE, id: 'T2', isDefault: true},
        {...TEST_ZONE, id: 'T3'},
      ],
    };

    const selection = createEmptyBuilder(input)
      .fromSelection({
        ...TEST_SELECTION,
        zones: {
          from: {...TEST_ZONE, id: 'T3', resultType: 'zone'},
          to: {...TEST_ZONE, id: 'T1', resultType: 'zone'},
        },
      })
      .product({
        ...TEST_PRODUCT,
        id: 'P2',
        limitations: {
          ...TEST_PRODUCT.limitations,
          fareZoneRefs: ['T2', 'T3'],
        },
      })
      .build();

    expect(selection.preassignedFareProduct.id).toBe('P2');
    expect(selection.zones?.from.id).toBe('T2');
    expect(selection.zones?.to.id).toBe('T2');
  });

  it('Should preserve baggage products when product is changed', () => {
    const testBaggageProductWithCount = [
      {
        ...TEST_BAGGAGE_PRODUCT,
        count: 2,
      },
    ];
    const selectionWithSupplement = {
      ...TEST_SELECTION,
      baggageProductsWithCount: testBaggageProductWithCount,
    };

    const selection = createEmptyBuilder(TEST_INPUT)
      .fromSelection(selectionWithSupplement)
      .product({...TEST_SELECTION.preassignedFareProduct, id: 'P2'})
      .build();

    expect(selection.baggageProductsWithCount).toEqual(
      testBaggageProductWithCount,
    );
    expect(selection.preassignedFareProduct.id).toBe('P2');
  });

  it('Should not apply baggage products not allowed by product limitations', () => {
    const productWithLimitations = {
      ...TEST_SELECTION.preassignedFareProduct,
      id: 'P2',
      limitations: {
        ...TEST_SELECTION.preassignedFareProduct.limitations,
        supplementProductRefs: ['SP2'], // Only SP2 is allowed
      },
    };

    const testBaggageProductWithCount = [
      {
        ...TEST_BAGGAGE_PRODUCT,
        id: 'SP1',
        count: 2,
      },
    ];

    const selection = createEmptyBuilder(TEST_INPUT)
      .fromSelection(TEST_SELECTION)
      .product(productWithLimitations)
      .baggageProducts(testBaggageProductWithCount)
      .build();

    expect(selection.baggageProductsWithCount).toEqual([]);
    expect(selection.preassignedFareProduct.id).toBe('P2');
  });

  it('Should apply supplement products allowed by product limitations', () => {
    const productWithLimitations = {
      ...TEST_SELECTION.preassignedFareProduct,
      id: 'P2',
      limitations: {
        ...TEST_SELECTION.preassignedFareProduct.limitations,
        supplementProductRefs: ['SP2'], // Only SP2 is allowed
      },
    };

    const testBaggageProductWithCount = [
      {
        ...TEST_BAGGAGE_PRODUCT,
        id: 'SP2',
        count: 2,
      },
    ];

    const selection = createEmptyBuilder(TEST_INPUT)
      .fromSelection(TEST_SELECTION)
      .product(productWithLimitations)
      .baggageProducts(testBaggageProductWithCount)
      .build();

    expect(selection.baggageProductsWithCount).toEqual(
      testBaggageProductWithCount,
    );
    expect(selection.preassignedFareProduct.id).toBe('P2');
  });
});
