import {type ExistingTicket, PurchaseSelectionEmptyBuilder} from '../types';
import {createEmptyBuilder} from '../purchase-selection-builder';
import {TEST_INPUT, TEST_PRODUCT, TEST_SELECTION} from './test-utils';

describe('PurchaseSelectionBuilder existingProduct', () => {
  let builder: PurchaseSelectionEmptyBuilder;

  beforeEach(() => {
    builder = createEmptyBuilder(TEST_INPUT);
  });

  test('should add an existing product to the selection', () => {
    const existingTicket: ExistingTicket = {
      product: {...TEST_PRODUCT, id: 'EP1'},
      endDate: new Date(),
    };
    const selection = builder
      .forType('single')
      .existingTicket(existingTicket)
      .build();

    expect(selection.existingTicket).toBe(existingTicket);
  });

  test('should keep existing product when using fromSelection', () => {
    const existingTicket: ExistingTicket = {
      product: {...TEST_PRODUCT, id: 'EP1'},
      endDate: new Date(),
    };
    const initialSelection = {...TEST_SELECTION, existingTicket};

    const newSelection = builder.fromSelection(initialSelection).build();

    expect(newSelection.existingTicket).toBe(existingTicket);
  });

  test('calling with undefined should delete any set existing product', () => {
    const existingProduct = {...TEST_PRODUCT, id: 'EP1'};
    const selectionWithExistingProduct = {...TEST_SELECTION, existingProduct};
    const selection = builder
      .fromSelection(selectionWithExistingProduct)
      .existingTicket(undefined)
      .build();

    expect(selection.existingTicket).toBeUndefined();
  });

  test('should overwrite a previously set existing product', () => {
    const oneExistingTicket: ExistingTicket = {
      product: {...TEST_PRODUCT, id: 'EP1'},
      endDate: new Date(),
    };
    const anotherExistingTicket: ExistingTicket = {
      product: {...TEST_PRODUCT, id: 'EP2'},
      endDate: new Date(),
    };

    const selection = builder
      .forType('single')
      .existingTicket(oneExistingTicket)
      .existingTicket(anotherExistingTicket)
      .build();

    expect(selection.existingTicket).toBe(anotherExistingTicket);
  });

  test('should retain other properties when adding an existing product', () => {
    const existingTicket: ExistingTicket = {
      product: {...TEST_PRODUCT, id: 'EP1'},
      endDate: new Date(),
    };
    const selection = builder
      .forType('single')
      .existingTicket(existingTicket)
      .build();

    expect(selection.fareProductTypeConfig.type).toBe('single');
    expect(selection.preassignedFareProduct.id).toBe('P1');
    expect(selection.userProfilesWithCount).toHaveLength(1);
    expect(selection.userProfilesWithCount[0].id).toBe('UP1');
  });
});
