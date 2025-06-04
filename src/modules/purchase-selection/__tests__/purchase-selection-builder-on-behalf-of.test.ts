import {createEmptyBuilder} from '../purchase-selection-builder';
import {TEST_INPUT} from './test-utils';

describe('purchaseSelectionBuilder - isOnBehalfOf', () => {
  it('Should be false by default', () => {
    const selection = createEmptyBuilder(TEST_INPUT).forType('single').build();
    expect(selection.isOnBehalfOf).toBe(false);
  });

  it('Should correctly set and unset isOnBehalfOf using the builder function', () => {
    const selection1 = createEmptyBuilder(TEST_INPUT).forType('single').build();

    expect(selection1.isOnBehalfOf).toBe(false);

    const selection2 = createEmptyBuilder(TEST_INPUT)
      .fromSelection(selection1)
      .isOnBehalfOf(true)
      .build();

    expect(selection2.isOnBehalfOf).toBe(true);

    const selection3 = createEmptyBuilder(TEST_INPUT)
      .fromSelection(selection2)
      .isOnBehalfOf(true)
      .build();

    expect(selection3.isOnBehalfOf).toBe(true);
  });
});
