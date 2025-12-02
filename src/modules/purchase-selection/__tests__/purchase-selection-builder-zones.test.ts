import {createEmptyBuilder} from '../purchase-selection-builder';
import {
  TEST_INPUT,
  TEST_PRODUCT,
  TEST_SELECTION,
  TEST_ZONE_WITH_MD,
} from './test-utils';
import type {PurchaseSelectionType} from '../types';

describe('purchaseSelectionBuilder - zones', () => {
  it('Should apply a valid from zone', () => {
    const selection = createEmptyBuilder(TEST_INPUT)
      .fromSelection(TEST_SELECTION)
      .fromZone({...TEST_ZONE_WITH_MD, id: 'T2'})
      .build();

    expect(selection.zones?.from.id).toBe('T2');
    expect(selection.zones?.to.id).toBe(TEST_SELECTION.zones?.to.id);
  });

  it('Should apply a valid to zone', () => {
    const selection = createEmptyBuilder(TEST_INPUT)
      .fromSelection(TEST_SELECTION)
      .toZone({...TEST_ZONE_WITH_MD, id: 'T2'})
      .build();

    expect(selection.zones?.from.id).toBe(TEST_SELECTION.zones?.from.id);
    expect(selection.zones?.to.id).toBe('T2');
  });

  it('Should not apply from zone when no zones object', () => {
    const selection = createEmptyBuilder(TEST_INPUT)
      .fromSelection({...TEST_SELECTION, zones: undefined})
      .fromZone({...TEST_ZONE_WITH_MD, id: 'T2'})
      .build();

    expect(selection.zones?.from.id).toBe(undefined);
    expect(selection.zones?.to.id).toBe(undefined);
  });

  it('Should not apply to zone when no zones object', () => {
    const selection = createEmptyBuilder(TEST_INPUT)
      .fromSelection({...TEST_SELECTION, zones: undefined})
      .toZone({...TEST_ZONE_WITH_MD, id: 'T2'})
      .build();

    expect(selection.zones?.from.id).toBe(undefined);
    expect(selection.zones?.to.id).toBe(undefined);
  });

  it('Should not apply a from zone which is not in product limitations', () => {
    const originalSelection: PurchaseSelectionType = {
      ...TEST_SELECTION,
      preassignedFareProduct: {
        ...TEST_PRODUCT,
        limitations: {
          ...TEST_PRODUCT.limitations,
          fareZoneRefs: ['T1', 'T3'],
        },
      },
    };

    const selection = createEmptyBuilder(TEST_INPUT)
      .fromSelection(originalSelection)
      .fromZone({...TEST_ZONE_WITH_MD, id: 'T2'})
      .build();

    expect(selection).toStrictEqual(originalSelection);
  });

  it('Should not apply a to zone which is not in product limitations', () => {
    const originalSelection: PurchaseSelectionType = {
      ...TEST_SELECTION,
      preassignedFareProduct: {
        ...TEST_PRODUCT,
        limitations: {
          ...TEST_PRODUCT.limitations,
          fareZoneRefs: ['T1', 'T3'],
        },
      },
    };

    const selection = createEmptyBuilder(TEST_INPUT)
      .fromSelection(originalSelection)
      .toZone({...TEST_ZONE_WITH_MD, id: 'T2'})
      .build();

    expect(selection).toStrictEqual(originalSelection);
  });
});
