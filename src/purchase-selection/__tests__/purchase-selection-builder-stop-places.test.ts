import {createEmptyBuilder} from '../purchase-selection-builder';
import {TEST_INPUT, TEST_SELECTION} from './test-utils';

describe('purchaseSelectionBuilder - stop places', () => {
  it('Should apply a valid from stop', () => {
    const selection = createEmptyBuilder(TEST_INPUT)
      .fromSelection({
        ...TEST_SELECTION,
        zones: undefined,
        stopPlaces: {from: undefined, to: undefined},
      })
      .fromStopPlace({id: 'a-stop-id', name: 'Trondheim Kai'})
      .build();

    expect(selection.stopPlaces?.from?.id).toBe('a-stop-id');
    expect(selection.stopPlaces?.to?.id).toBe(undefined);
  });

  it('Should apply a valid to stop', () => {
    const selection = createEmptyBuilder(TEST_INPUT)
      .fromSelection({
        ...TEST_SELECTION,
        zones: undefined,
        stopPlaces: {from: undefined, to: undefined},
      })
      .toStopPlace({id: 'a-stop-id', name: 'Trondheim Kai'})
      .build();

    expect(selection.stopPlaces?.from?.id).toBe(undefined);
    expect(selection.stopPlaces?.to?.id).toBe('a-stop-id');
  });

  it('Should not apply from stop when no stop places object', () => {
    const selection = createEmptyBuilder(TEST_INPUT)
      .fromSelection(TEST_SELECTION)
      .fromStopPlace({id: 'a-stop-id', name: 'Trondheim Kai'})
      .build();

    expect(selection.stopPlaces?.from?.id).toBe(undefined);
    expect(selection.stopPlaces?.to?.id).toBe(undefined);
  });

  it('Should not apply from to when no stop places object', () => {
    const selection = createEmptyBuilder(TEST_INPUT)
      .fromSelection(TEST_SELECTION)
      .toStopPlace({id: 'a-stop-id', name: 'Trondheim Kai'})
      .build();

      expect(selection.stopPlaces?.from?.id).toBe(undefined);
      expect(selection.stopPlaces?.to?.id).toBe(undefined);
  });
});
