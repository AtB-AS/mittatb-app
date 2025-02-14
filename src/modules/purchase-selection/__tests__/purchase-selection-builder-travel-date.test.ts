import {createEmptyBuilder} from '../purchase-selection-builder';
import {TEST_INPUT, TEST_SELECTION} from './test-utils';

describe('purchaseSelectionBuilder - travelDate', () => {
  it('Should apply valid travel date', () => {
    const dateString = new Date().toISOString();
    const selection = createEmptyBuilder(TEST_INPUT)
      .fromSelection(TEST_SELECTION)
      .date(dateString)
      .build();

    expect(selection.travelDate).toEqual(dateString);
  });

  it('Should apply undefined travel date', () => {
    const builder = createEmptyBuilder(TEST_INPUT);
    const selection = builder
      .fromSelection({...TEST_SELECTION, travelDate: new Date().toISOString()})
      .date(undefined)
      .build();

    expect(selection.travelDate).toBeUndefined();
  });

  it('Should not apply an invalid date string', () => {
    const dateString = 'whatever';
    const selection = createEmptyBuilder(TEST_INPUT)
      .fromSelection(TEST_SELECTION)
      .date(dateString)
      .build();

    expect(selection.travelDate).toBeUndefined();
  });
});
