import {PurchaseSelectionEmptyBuilder} from '../types';
import {createEmptyBuilder} from '../purchase-selection-builder';
import {TEST_INPUT, TEST_PRODUCT, TEST_SELECTION} from './test-utils';

describe('PurchaseSelectionBuilder existingProduct', () => {
  let builder: PurchaseSelectionEmptyBuilder;

  beforeEach(() => {
    builder = createEmptyBuilder(TEST_INPUT);
  });

  test('should add an existing product to the selection', () => {
    const existingProduct = {...TEST_PRODUCT, id: 'EP1'};
    const selection = builder
      .forType('single')
      .existingProduct(existingProduct)
      .build();

    expect(selection.existingProduct).toBe(existingProduct);
  });

  test('should keep existing product when using fromSelection', () => {
    const existingProduct = {...TEST_PRODUCT, id: 'EP1'};
    const initialSelection = {...TEST_SELECTION, existingProduct};

    const newSelection = builder.fromSelection(initialSelection).build();

    expect(newSelection.existingProduct).toBe(existingProduct);
  });

  test('calling with undefined should delete any set existing product', () => {
    const existingProduct = {...TEST_PRODUCT, id: 'EP1'};
    const selectionWithExistingProduct = {...TEST_SELECTION, existingProduct};
    const selection = builder
      .fromSelection(selectionWithExistingProduct)
      .existingProduct(undefined)
      .build();

    expect(selection.existingProduct).toBeUndefined();
  });

  test('should overwrite a previously set existing product', () => {
    const oneExistingProduct = {...TEST_PRODUCT, id: 'EP1'};
    const anotherExistingProduct = {...TEST_PRODUCT, id: 'EP2'};

    const selection = builder
      .forType('single')
      .existingProduct(oneExistingProduct)
      .existingProduct(anotherExistingProduct)
      .build();

    expect(selection.existingProduct).toBe(anotherExistingProduct);
  });

  test('should retain other properties when adding an existing product', () => {
    const existingProduct = {...TEST_PRODUCT, id: 'EP1'};
    const selection = builder
      .forType('single')
      .existingProduct(existingProduct)
      .build();

    expect(selection.fareProductTypeConfig.type).toBe('single');
    expect(selection.preassignedFareProduct.id).toBe('P1');
    expect(selection.userProfilesWithCount).toHaveLength(1);
    expect(selection.userProfilesWithCount[0].id).toBe('UP1');
  });
});
