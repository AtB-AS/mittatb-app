import {createEmptyBuilder} from '../purchase-selection-builder';
import {
  TEST_INPUT,
  TEST_PRODUCT,
  TEST_SELECTION,
  TEST_SUPPLEMENT_PRODUCT,
  TEST_USER_PROFILE,
  TEST_ZONE,
} from './test-utils';

describe('purchaseSelectionBuilder - product', () => {
  it('Should apply a valid product', () => {
    const selection = createEmptyBuilder(TEST_INPUT)
      .fromSelection(TEST_SELECTION)
      .product({...TEST_SELECTION.preassignedFareProduct, id: 'P2'})
      .build().selection;

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
      .build().selection;

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
      .build().selection;

    expect(selection.preassignedFareProduct.id).toBe(
      TEST_SELECTION.preassignedFareProduct.id,
    );
    expect(selection).toStrictEqual(TEST_SELECTION);
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
      .build().selection;

    expect(selection.preassignedFareProduct.id).toBe(
      TEST_SELECTION.preassignedFareProduct.id,
    );
    expect(selection).toStrictEqual(TEST_SELECTION);
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
      .build().selection;

    expect(selection.preassignedFareProduct.id).toBe(
      TEST_SELECTION.preassignedFareProduct.id,
    );
    expect(selection).toStrictEqual(TEST_SELECTION);
  });

  it('Should not apply product without distribution channel app', () => {
    const selection = createEmptyBuilder(TEST_INPUT)
      .fromSelection(TEST_SELECTION)
      .product({
        ...TEST_SELECTION.preassignedFareProduct,
        id: 'P2',
        distributionChannel: ['web'],
      })
      .build().selection;

    expect(selection.preassignedFareProduct.id).toBe(
      TEST_SELECTION.preassignedFareProduct.id,
    );
    expect(selection).toStrictEqual(TEST_SELECTION);
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
          userProfiles: [{userProfileRef: 'UP2'}, {userProfileRef: 'UP3'}],
        },
        id: 'P2',
      })
      .build().selection;

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
          userProfiles: [{userProfileRef: 'UP2'}, {userProfileRef: 'UP3'}],
        },
        id: 'P2',
      })
      .build().selection;

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
      .build().selection;

    expect(selection.preassignedFareProduct.id).toBe('P2');
    expect(selection.zones?.from.id).toBe('T2');
    expect(selection.zones?.to.id).toBe('T2');
  });

  it('Should preserve baggage products when product is changed', () => {
    const testSupplementProductWithCount = [
      {
        ...TEST_SUPPLEMENT_PRODUCT,
        count: 2,
      },
    ];
    const selectionWithSupplement = {
      ...TEST_SELECTION,
      supplementProductsWithCount: testSupplementProductWithCount,
    };

    const selection = createEmptyBuilder(TEST_INPUT)
      .fromSelection(selectionWithSupplement)
      .product({...TEST_SELECTION.preassignedFareProduct, id: 'P2'})
      .build().selection;

    expect(selection.supplementProductsWithCount).toEqual(
      testSupplementProductWithCount,
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
        ...TEST_SUPPLEMENT_PRODUCT,
        id: 'SP1',
        count: 2,
      },
    ];

    const selection = createEmptyBuilder(TEST_INPUT)
      .fromSelection(TEST_SELECTION)
      .product(productWithLimitations)
      .supplementProducts(testBaggageProductWithCount)
      .build().selection;

    expect(selection.supplementProductsWithCount).toEqual([]);
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
        ...TEST_SUPPLEMENT_PRODUCT,
        id: 'SP2',
        count: 2,
      },
    ];

    const selection = createEmptyBuilder(TEST_INPUT)
      .fromSelection(TEST_SELECTION)
      .product(productWithLimitations)
      .supplementProducts(testBaggageProductWithCount)
      .build().selection;

    expect(selection.supplementProductsWithCount).toEqual(
      testBaggageProductWithCount,
    );
    expect(selection.preassignedFareProduct.id).toBe('P2');
  });

  it('Should filter supplement products against the new product limitations, not the previous product', () => {
    // Previous product (TEST_PRODUCT) allows SP1; new product does NOT.
    // If the filter is applied against the previous product, SP1 would be kept.
    const newProduct = {
      ...TEST_PRODUCT,
      id: 'P2',
      limitations: {
        ...TEST_PRODUCT.limitations,
        supplementProductRefs: ['SP2'],
      },
    };
    const selectionWithSupplement = {
      ...TEST_SELECTION,
      supplementProductsWithCount: [
        {...TEST_SUPPLEMENT_PRODUCT, id: 'SP1', count: 2},
      ],
    };

    const selection = createEmptyBuilder(TEST_INPUT)
      .fromSelection(selectionWithSupplement)
      .product(newProduct)
      .build().selection;

    expect(selection.preassignedFareProduct.id).toBe('P2');
    expect(selection.supplementProductsWithCount).toEqual([]);
  });

  it('Should drop only supplement products not allowed by the new product limitations', () => {
    const newProduct = {
      ...TEST_PRODUCT,
      id: 'P2',
      limitations: {
        ...TEST_PRODUCT.limitations,
        supplementProductRefs: ['SP1'],
      },
    };
    const selectionWithSupplements = {
      ...TEST_SELECTION,
      supplementProductsWithCount: [
        {...TEST_SUPPLEMENT_PRODUCT, id: 'SP1', count: 2},
        {...TEST_SUPPLEMENT_PRODUCT, id: 'SP2', count: 1},
      ],
    };

    const selection = createEmptyBuilder(TEST_INPUT)
      .fromSelection(selectionWithSupplements)
      .product(newProduct)
      .build().selection;

    expect(selection.preassignedFareProduct.id).toBe('P2');
    expect(selection.supplementProductsWithCount).toHaveLength(1);
    expect(selection.supplementProductsWithCount[0].id).toBe('SP1');
    expect(selection.supplementProductsWithCount[0].count).toBe(2);
  });
});

describe('purchaseSelectionBuilder - product forced changes', () => {
  it('Should report no forced changes for a fully compatible product change', () => {
    const {forcedChanges} = createEmptyBuilder(TEST_INPUT)
      .fromSelection(TEST_SELECTION)
      .product({...TEST_SELECTION.preassignedFareProduct, id: 'P2'})
      .build();

    expect(forcedChanges).toEqual([]);
  });

  it('Should report no forced changes when the product is rejected', () => {
    const {forcedChanges} = createEmptyBuilder(TEST_INPUT)
      .fromSelection(TEST_SELECTION)
      .product({
        ...TEST_SELECTION.preassignedFareProduct,
        id: 'P2',
        type: 'other-type',
      })
      .build();

    expect(forcedChanges).toEqual([]);
  });

  it('Should report userProfile when the user profile is swapped to default', () => {
    const input = {
      ...TEST_INPUT,
      userProfiles: [
        {...TEST_USER_PROFILE, id: 'UP1', userTypeString: 'ADULT'},
        {...TEST_USER_PROFILE, id: 'UP2', userTypeString: 'CHILD'},
        {...TEST_USER_PROFILE, id: 'UP3', userTypeString: 'SENIOR'},
      ],
      defaultUserTypeString: 'SENIOR',
    };

    const {selection, forcedChanges} = createEmptyBuilder(input)
      .fromSelection(TEST_SELECTION)
      .product({
        ...TEST_PRODUCT,
        limitations: {
          ...TEST_PRODUCT.limitations,
          userProfiles: [{userProfileRef: 'UP2'}, {userProfileRef: 'UP3'}],
        },
        id: 'P2',
      })
      .build();

    expect(selection.userProfilesWithCount[0].id).toBe('UP3');
    expect(forcedChanges).toEqual(['userProfile']);
  });

  it('Should report userProfile when invalid profiles are filtered out', () => {
    const input = {
      ...TEST_INPUT,
      userProfiles: [
        {...TEST_USER_PROFILE, id: 'UP1', userTypeString: 'ADULT'},
        {...TEST_USER_PROFILE, id: 'UP2', userTypeString: 'CHILD'},
        {...TEST_USER_PROFILE, id: 'UP3', userTypeString: 'SENIOR'},
      ],
      defaultUserTypeString: 'SENIOR',
    };

    const {forcedChanges} = createEmptyBuilder(input)
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
          userProfiles: [{userProfileRef: 'UP2'}, {userProfileRef: 'UP3'}],
        },
        id: 'P2',
      })
      .build();

    expect(forcedChanges).toEqual(['userProfile']);
  });

  it('Should report zone when zones are auto-corrected', () => {
    const input = {
      ...TEST_INPUT,
      fareZones: [
        {...TEST_ZONE, id: 'T1'},
        {...TEST_ZONE, id: 'T2', isDefault: true},
        {...TEST_ZONE, id: 'T3'},
      ],
    };

    const {forcedChanges} = createEmptyBuilder(input)
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

    expect(forcedChanges).toEqual(['zone']);
  });

  it('Should report both userProfile and zone when both are auto-corrected', () => {
    const input = {
      ...TEST_INPUT,
      userProfiles: [
        {...TEST_USER_PROFILE, id: 'UP1', userTypeString: 'ADULT'},
        {...TEST_USER_PROFILE, id: 'UP2', userTypeString: 'CHILD'},
        {...TEST_USER_PROFILE, id: 'UP3', userTypeString: 'SENIOR'},
      ],
      defaultUserTypeString: 'SENIOR',
      fareZones: [
        {...TEST_ZONE, id: 'T1'},
        {...TEST_ZONE, id: 'T2', isDefault: true},
        {...TEST_ZONE, id: 'T3'},
      ],
    };

    const {forcedChanges} = createEmptyBuilder(input)
      .fromSelection({
        ...TEST_SELECTION,
        zones: {
          from: {...TEST_ZONE, id: 'T1', resultType: 'zone'},
          to: {...TEST_ZONE, id: 'T1', resultType: 'zone'},
        },
      })
      .product({
        ...TEST_PRODUCT,
        id: 'P2',
        limitations: {
          ...TEST_PRODUCT.limitations,
          userProfiles: [{userProfileRef: 'UP2'}, {userProfileRef: 'UP3'}],
          fareZoneRefs: ['T2', 'T3'],
        },
      })
      .build();

    expect(forcedChanges).toEqual(['userProfile', 'zone']);
  });

  it('Should report supplementProduct when a supplement product is dropped', () => {
    const newProduct = {
      ...TEST_PRODUCT,
      id: 'P2',
      limitations: {
        ...TEST_PRODUCT.limitations,
        supplementProductRefs: ['SP2'],
      },
    };

    const {forcedChanges} = createEmptyBuilder(TEST_INPUT)
      .fromSelection({
        ...TEST_SELECTION,
        supplementProductsWithCount: [
          {...TEST_SUPPLEMENT_PRODUCT, id: 'SP1', count: 2},
        ],
      })
      .product(newProduct)
      .build();

    expect(forcedChanges).toEqual(['supplementProduct']);
  });

  it('Should not report supplementProduct when all supplement products remain valid', () => {
    const newProduct = {
      ...TEST_PRODUCT,
      id: 'P2',
      limitations: {
        ...TEST_PRODUCT.limitations,
        supplementProductRefs: ['SP1'],
      },
    };

    const {forcedChanges} = createEmptyBuilder(TEST_INPUT)
      .fromSelection({
        ...TEST_SELECTION,
        supplementProductsWithCount: [
          {...TEST_SUPPLEMENT_PRODUCT, id: 'SP1', count: 2},
        ],
      })
      .product(newProduct)
      .build();

    expect(forcedChanges).toEqual([]);
  });

  it('Should replace, not accumulate, forced changes across multiple product calls', () => {
    const input = {
      ...TEST_INPUT,
      userProfiles: [
        {...TEST_USER_PROFILE, id: 'UP1', userTypeString: 'ADULT'},
        {...TEST_USER_PROFILE, id: 'UP2', userTypeString: 'CHILD'},
        {...TEST_USER_PROFILE, id: 'UP3', userTypeString: 'SENIOR'},
      ],
      defaultUserTypeString: 'SENIOR',
    };

    const productWithLimitations = {
      ...TEST_PRODUCT,
      id: 'P2',
      limitations: {
        ...TEST_PRODUCT.limitations,
        userProfiles: [{userProfileRef: 'UP2'}, {userProfileRef: 'UP3'}],
      },
    };

    const productWithoutLimitations = {
      ...TEST_PRODUCT,
      id: 'P3',
    };

    const {selection, forcedChanges} = createEmptyBuilder(input)
      .fromSelection(TEST_SELECTION)
      .product(productWithLimitations) // forces userProfile change
      .product(productWithoutLimitations) // no forced change
      .build();

    expect(forcedChanges).toEqual([]);
    expect(selection.userProfilesWithCount[0].id).toBe('UP1');
  });
});
