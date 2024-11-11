import {createEmptyBuilder} from '../purchase-selection-builder';
import {
  TEST_INPUT,
  TEST_SELECTION,
  TEST_PRODUCT,
  TEST_ZONE,
  TEST_USER_PROFILE,
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
      fromPlace: {id: 'abc', name: 'Trondheim S'},
      toPlace: {id: 'cba', name: 'Solsiden'},
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

  it('Should create new selection with defaults when input selection from-place is invalid', () => {
    const selection = createEmptyBuilder(TEST_INPUT)
      .fromSelection({
        ...TEST_SELECTION,
        preassignedFareProduct: {
          ...TEST_PRODUCT,
          id: 'P_X',
          limitations: {...TEST_PRODUCT.limitations, tariffZoneRefs: ['T1']},
        },
        fromPlace: {...TEST_ZONE, id: 'T_X', resultType: 'zone'},
        travelDate: new Date().toISOString(),
      })
      .build();

    expect(selection.preassignedFareProduct.id).toBe(TEST_PRODUCT.id);
    expect(selection.fromPlace.id).toBe(TEST_ZONE.id);
    expect(selection.travelDate).toBeUndefined();
  });

  it('Should create new selection with defaults when input selection to-place is invalid', () => {
    const selection = createEmptyBuilder(TEST_INPUT)
      .fromSelection({
        ...TEST_SELECTION,
        preassignedFareProduct: {
          ...TEST_PRODUCT,
          id: 'P_X',
          limitations: {...TEST_PRODUCT.limitations, tariffZoneRefs: ['T1']},
        },
        toPlace: {...TEST_ZONE, id: 'T_X', resultType: 'zone'},
        travelDate: new Date().toISOString(),
      })
      .build();

    expect(selection.preassignedFareProduct.id).toBe(TEST_PRODUCT.id);
    expect(selection.toPlace.id).toBe(TEST_ZONE.id);
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
});