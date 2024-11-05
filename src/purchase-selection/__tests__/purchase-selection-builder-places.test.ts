import {createEmptyBuilder} from '../purchase-selection-builder';
import {TEST_INPUT, TEST_PRODUCT, TEST_SELECTION} from './test-utils';
import type {PurchaseSelectionType} from '../types';

describe('purchaseSelectionBuilder - places', () => {
  it('Should apply a valid from zone', () => {
    const selection = createEmptyBuilder(TEST_INPUT)
      .fromSelection(TEST_SELECTION)
      .from({...TEST_SELECTION.fromPlace, id: 'T2'})
      .build();

    expect(selection.fromPlace.id).toBe('T2');
    expect(selection.toPlace.id).toBe(TEST_SELECTION.toPlace.id);
  });

  it('Should apply a valid to zone', () => {
    const selection = createEmptyBuilder(TEST_INPUT)
      .fromSelection(TEST_SELECTION)
      .to({...TEST_SELECTION.toPlace, id: 'T2'})
      .build();

    expect(selection.fromPlace.id).toBe(TEST_SELECTION.fromPlace.id);
    expect(selection.toPlace.id).toBe('T2');
  });

  it('Should apply a valid from stop', () => {
    const selection = createEmptyBuilder(TEST_INPUT)
      .fromSelection(TEST_SELECTION)
      .from({id: 'a-stop-id', name: 'Trondheim Kai'})
      .build();

    expect(selection.fromPlace.id).toBe('a-stop-id');
    expect(selection.toPlace.id).toBe(TEST_SELECTION.toPlace.id);
  });

  it('Should apply a valid to stop', () => {
    const selection = createEmptyBuilder(TEST_INPUT)
      .fromSelection(TEST_SELECTION)
      .to({id: 'a-stop-id', name: 'Trondheim Kai'})
      .build();

    expect(selection.fromPlace.id).toBe(TEST_SELECTION.toPlace.id);
    expect(selection.toPlace.id).toBe('a-stop-id');
  });

  it('Should not apply a from zone which is not in product limitations', () => {
    const originalSelection: PurchaseSelectionType = {
      ...TEST_SELECTION,
      preassignedFareProduct: {
        ...TEST_PRODUCT,
        limitations: {
          ...TEST_PRODUCT.limitations,
          tariffZoneRefs: ['T1', 'T3'],
        },
      },
    };

    const selection = createEmptyBuilder(TEST_INPUT)
      .fromSelection(originalSelection)
      .from({...TEST_SELECTION.fromPlace, id: 'T2'})
      .build();

    expect(selection).toBe(originalSelection);
  });

  it('Should not apply a to zone which is not in product limitations', () => {
    const originalSelection: PurchaseSelectionType = {
      ...TEST_SELECTION,
      preassignedFareProduct: {
        ...TEST_PRODUCT,
        limitations: {
          ...TEST_PRODUCT.limitations,
          tariffZoneRefs: ['T1', 'T3'],
        },
      },
    };

    const selection = createEmptyBuilder(TEST_INPUT)
      .fromSelection(originalSelection)
      .to({...TEST_SELECTION.fromPlace, id: 'T2'})
      .build();

    expect(selection).toBe(originalSelection);
  });
});
