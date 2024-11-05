import {createEmptyBuilder} from '../purchase-selection-builder';
import {TEST_INPUT, TEST_SELECTION} from './test-utils';

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
});
