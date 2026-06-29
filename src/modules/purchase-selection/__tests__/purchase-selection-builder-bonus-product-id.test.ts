import {createEmptyBuilder} from '../purchase-selection-builder';
import {TEST_INPUT} from './test-utils';

describe('purchaseSelectionBuilder - bonusProductId', () => {
  it('Should be undefined by default', () => {
    const selection = createEmptyBuilder(TEST_INPUT)
      .forType('single')
      .build().selection;
    expect(selection.bonusProductId).toBeUndefined();
  });

  it('Should set bonusProductId', () => {
    const selection = createEmptyBuilder(TEST_INPUT)
      .forType('single')
      .bonusProductId('some-bonus-id')
      .build().selection;
    expect(selection.bonusProductId).toBe('some-bonus-id');
  });

  it('Should clear bonusProductId when called with undefined', () => {
    const selection1 = createEmptyBuilder(TEST_INPUT)
      .forType('single')
      .bonusProductId('some-bonus-id')
      .build().selection;

    const selection2 = createEmptyBuilder(TEST_INPUT)
      .fromSelection(selection1)
      .bonusProductId(undefined)
      .build().selection;

    expect(selection2.bonusProductId).toBeUndefined();
  });

  it('Should preserve bonusProductId across fromSelection', () => {
    const selection1 = createEmptyBuilder(TEST_INPUT)
      .forType('single')
      .bonusProductId('some-bonus-id')
      .build().selection;

    const selection2 = createEmptyBuilder(TEST_INPUT)
      .fromSelection(selection1)
      .build().selection;

    expect(selection2.bonusProductId).toBe('some-bonus-id');
  });
});
