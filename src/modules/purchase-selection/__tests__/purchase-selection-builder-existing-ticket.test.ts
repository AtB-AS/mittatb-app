import {type ExistingTicket, PurchaseSelectionEmptyBuilder} from '../types';
import {createEmptyBuilder} from '../purchase-selection-builder';
import {TEST_INPUT, TEST_PRODUCT, TEST_SELECTION} from './test-utils';

describe('PurchaseSelectionBuilder existingTicket', () => {
  let builder: PurchaseSelectionEmptyBuilder;

  beforeEach(() => {
    builder = createEmptyBuilder(TEST_INPUT);
  });

  test('should add an existing ticket to the selection', () => {
    const existingTicket: ExistingTicket = {
      product: {...TEST_PRODUCT, id: 'ET1'},
      endDate: new Date().toISOString(),
    };
    const selection = builder
      .forType('single')
      .existingTicket(existingTicket)
      .build();

    expect(selection.existingTicket).toBe(existingTicket);
  });

  test('should keep existing ticket when using fromSelection', () => {
    const existingTicket: ExistingTicket = {
      product: {...TEST_PRODUCT, id: 'ET1'},
      endDate: new Date().toISOString(),
    };
    const initialSelection = {...TEST_SELECTION, existingTicket};

    const newSelection = builder.fromSelection(initialSelection).build();

    expect(newSelection.existingTicket).toBe(existingTicket);
  });

  test('calling with undefined should delete any set existing ticket', () => {
    const existingProduct = {...TEST_PRODUCT, id: 'ET1'};
    const selectionWithExistingProduct = {...TEST_SELECTION, existingProduct};
    const selection = builder
      .fromSelection(selectionWithExistingProduct)
      .existingTicket(undefined)
      .build();

    expect(selection.existingTicket).toBeUndefined();
  });

  test('should overwrite a previously set existing ticket', () => {
    const oneExistingTicket: ExistingTicket = {
      product: {...TEST_PRODUCT, id: 'ET1'},
      endDate: new Date().toISOString(),
    };
    const anotherExistingTicket: ExistingTicket = {
      product: {...TEST_PRODUCT, id: 'ET2'},
      endDate: new Date().toISOString(),
    };

    const selection = builder
      .forType('single')
      .existingTicket(oneExistingTicket)
      .existingTicket(anotherExistingTicket)
      .build();

    expect(selection.existingTicket).toBe(anotherExistingTicket);
  });

  test('should retain other properties when adding an existing ticket', () => {
    const existingTicket: ExistingTicket = {
      product: {...TEST_PRODUCT, id: 'ET1'},
      endDate: new Date().toISOString(),
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
