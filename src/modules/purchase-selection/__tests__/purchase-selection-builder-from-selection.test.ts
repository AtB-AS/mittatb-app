import {createEmptyBuilder} from '../purchase-selection-builder';
import {
  TEST_INPUT,
  TEST_SELECTION,
  TEST_PRODUCT,
  TEST_ZONE,
  TEST_USER_PROFILE,
  TEST_ZONE_WITH_MD,
} from './test-utils';
import type {PurchaseSelectionType} from '../types';

describe('purchaseSelectionBuilder - fromSelection', () => {
  it('Should return same selection unaltered', () => {
    const selection = createEmptyBuilder(TEST_INPUT)
      .fromSelection(TEST_SELECTION)
      .build();

    expect(selection).toBe(TEST_SELECTION);
  });

  it('Should return same selection unaltered, with stop places', () => {
    const originalSelection: PurchaseSelectionType = {
      ...TEST_SELECTION,
      stopPlaces: {
        from: {id: 'abc', name: 'Trondheim S'},
        to: {id: 'cba', name: 'Solsiden'},
      },
    };

    const selection = createEmptyBuilder(TEST_INPUT)
      .fromSelection(originalSelection)
      .build();

    expect(selection).toBe(originalSelection);
  });

  it('Should create new selection with defaults when input selection product is invalid', () => {
    const selection = createEmptyBuilder(TEST_INPUT)
      .fromSelection({
        ...TEST_SELECTION,
        preassignedFareProduct: {...TEST_PRODUCT, id: 'P5', type: 'other'},
        travelDate: new Date().toISOString(),
      })
      .build();

    expect(selection.preassignedFareProduct.id).toBe(TEST_PRODUCT.id);
    expect(selection.travelDate).toBeUndefined();
  });

  it('Should create new selection with defaults when input selection from-zone is invalid', () => {
    const selection = createEmptyBuilder(TEST_INPUT)
      .fromSelection({
        ...TEST_SELECTION,
        preassignedFareProduct: {
          ...TEST_PRODUCT,
          id: 'P_X',
          limitations: {...TEST_PRODUCT.limitations, fareZoneRefs: ['T1']},
        },
        zones: {
          from: {...TEST_ZONE_WITH_MD, id: 'T_X'},
          to: TEST_ZONE_WITH_MD,
        },
        travelDate: new Date().toISOString(),
      })
      .build();

    expect(selection.preassignedFareProduct.id).toBe(TEST_PRODUCT.id);
    expect(selection.zones?.from.id).toBe(TEST_ZONE.id);
    expect(selection.travelDate).toBeUndefined();
  });

  it('Should create new selection with defaults when input selection to-zone is invalid', () => {
    const selection = createEmptyBuilder(TEST_INPUT)
      .fromSelection({
        ...TEST_SELECTION,
        preassignedFareProduct: {
          ...TEST_PRODUCT,
          id: 'P_X',
          limitations: {...TEST_PRODUCT.limitations, fareZoneRefs: ['T1']},
        },
        zones: {
          from: TEST_ZONE_WITH_MD,
          to: {...TEST_ZONE_WITH_MD, id: 'T_X'},
        },
        travelDate: new Date().toISOString(),
      })
      .build();

    expect(selection.preassignedFareProduct.id).toBe(TEST_PRODUCT.id);
    expect(selection.zones?.to.id).toBe(TEST_ZONE.id);
    expect(selection.travelDate).toBeUndefined();
  });

  it('Should create new selection with defaults when input selection user profile is invalid', () => {
    const selection = createEmptyBuilder(TEST_INPUT)
      .fromSelection({
        ...TEST_SELECTION,
        preassignedFareProduct: {
          ...TEST_PRODUCT,
          id: 'P_X',
          limitations: {...TEST_PRODUCT.limitations, userProfileRefs: ['U1']},
        },
        userProfilesWithCount: [{...TEST_USER_PROFILE, id: 'U_X', count: 1}],
        travelDate: new Date().toISOString(),
      })
      .build();

    expect(selection.preassignedFareProduct.id).toBe(TEST_PRODUCT.id);
    expect(selection.userProfilesWithCount[0].id).toBe(TEST_USER_PROFILE.id);
    expect(selection.travelDate).toBeUndefined();
  });

  it('Should create new selection with defaults when input selection travel date is invalid', () => {
    const selection = createEmptyBuilder(TEST_INPUT)
      .fromSelection({
        ...TEST_SELECTION,
        preassignedFareProduct: {...TEST_PRODUCT, id: 'P5'},
        travelDate: 'whatever',
      })
      .build();

    expect(selection.preassignedFareProduct.id).toBe(TEST_PRODUCT.id);
    expect(selection.travelDate).toBeUndefined();
  });

  it('Should correctly handle selection.isOnBehalfOf', () => {
    const selection = createEmptyBuilder(TEST_INPUT)
      .fromSelection({
        ...TEST_SELECTION,
        isOnBehalfOf: true,
      })
      .build();

    expect(selection.isOnBehalfOf).toBe(true);
  });
});
