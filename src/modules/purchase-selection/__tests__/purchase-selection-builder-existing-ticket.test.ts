import {
  type FareContractStub,
  PurchaseSelectionEmptyBuilder,
  type PurchaseSelectionType,
} from '../types';
import {createEmptyBuilder} from '../purchase-selection-builder';
import {TEST_INPUT, TEST_PRODUCT, TEST_SELECTION} from './test-utils';

describe('PurchaseSelectionBuilder originFareContract', () => {
  let builder: PurchaseSelectionEmptyBuilder;

  beforeEach(() => {
    builder = createEmptyBuilder(TEST_INPUT);
  });

  test('should add an origin fareContract to the selection', () => {
    const originFareContract: FareContractStub = {
      id: 'FC1',
      product: {...TEST_PRODUCT, id: 'ET1'},
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
    };
    const selection = builder
      .forType('single')
      .originFareContract(originFareContract)
      .build();

    expect(selection.originFareContract).toBe(originFareContract);
  });

  test('should keep origin fareContract when using fromSelection', () => {
    const originFareContract: FareContractStub = {
      id: 'FC1',
      product: {...TEST_PRODUCT, id: 'ET1'},
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
    };
    const initialSelection: PurchaseSelectionType = {
      ...TEST_SELECTION,
      originFareContract: originFareContract,
    };

    const newSelection = builder.fromSelection(initialSelection).build();

    expect(newSelection.originFareContract).toBe(originFareContract);
  });

  test('calling with undefined should delete any set origin fareContract', () => {
    const originFareContract = {
      id: 'FC1',
      product: {...TEST_PRODUCT, id: 'ET1'},
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
    };
    const selectionWithOriginFareContract: PurchaseSelectionType = {
      ...TEST_SELECTION,
      originFareContract,
    };
    const selection = builder
      .fromSelection(selectionWithOriginFareContract)
      .originFareContract(undefined)
      .build();

    expect(selection.originFareContract).toBeUndefined();
  });

  test('should overwrite a previously set origin fareContract', () => {
    const oneOriginFareContract: FareContractStub = {
      id: 'FC1',
      product: {...TEST_PRODUCT, id: 'ET1'},
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
    };
    const anotherOriginFareContract: FareContractStub = {
      id: 'FC2',
      product: {...TEST_PRODUCT, id: 'ET2'},
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
    };

    const selection = builder
      .forType('single')
      .originFareContract(oneOriginFareContract)
      .originFareContract(anotherOriginFareContract)
      .build();

    expect(selection.originFareContract).toBe(anotherOriginFareContract);
  });

  test('should retain other properties when adding an origin FareContract', () => {
    const originFareContract: FareContractStub = {
      id: 'FC1',
      product: {...TEST_PRODUCT, id: 'ET1'},
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
    };
    const selection = builder
      .forType('single')
      .originFareContract(originFareContract)
      .build();

    expect(selection.fareProductTypeConfig.type).toBe('single');
    expect(selection.preassignedFareProduct.id).toBe('P1');
    expect(selection.userProfilesWithCount).toHaveLength(1);
    expect(selection.userProfilesWithCount[0].id).toBe('UP1');
  });
});
