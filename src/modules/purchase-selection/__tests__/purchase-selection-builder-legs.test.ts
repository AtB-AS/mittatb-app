import {createEmptyBuilder} from '../purchase-selection-builder';
import {TEST_INPUT, TEST_SELECTION} from './test-utils';
import type {SalesTripPatternLeg} from '@atb/api/types/sales';

describe('purchaseSelectionBuilder - legs', () => {
  it('Should apply valid legs when travel date matches', () => {
    const selectionWithTravelDate = {
      ...TEST_SELECTION,
      travelDate: '2023-10-01T10:00:00Z', // Ensure travelDate is defined
    };

    const validLegs: SalesTripPatternLeg[] = [
      {
        expectedStartTime: '2023-10-01T10:00:00Z',
        fromStopPlaceId: 'SP1',
        toStopPlaceId: 'SP2',
        serviceJourneyId: 'SJ1',
        mode: 'water',
        expectedEndTime: '2023-10-01T10:01:00Z',
      },
      {
        expectedStartTime: '2023-10-01T10:00:00Z',
        fromStopPlaceId: 'SP3',
        toStopPlaceId: 'SP4',
        serviceJourneyId: 'SJ2',
        mode: 'water',
        expectedEndTime: '2023-10-01T10:01:00Z',
      },
    ];

    const selection = createEmptyBuilder(TEST_INPUT)
      .fromSelection(selectionWithTravelDate)
      .legs(validLegs)
      .build();

    expect(selection.legs).toHaveLength(2);
    expect(selection.legs?.[0].fromStopPlaceId).toBe('SP1');
    expect(selection.legs?.[1].toStopPlaceId).toBe('SP4');
  });

  it('Should not apply legs when travel date does not match', () => {
    const selectionWithTravelDate = {
      ...TEST_SELECTION,
      travelDate: '2023-10-01T10:00:00Z', // Ensure travelDate is defined
    };

    const invalidLegs: SalesTripPatternLeg[] = [
      {
        expectedStartTime: '2023-01-01T10:00:00Z', // Valid ISO string
        fromStopPlaceId: 'SP1',
        toStopPlaceId: 'SP2',
        serviceJourneyId: 'SJ1',
        mode: 'water',
        expectedEndTime: '2023-10-01T10:01:00Z',
      },
    ];

    const selection = createEmptyBuilder(TEST_INPUT)
      .fromSelection(selectionWithTravelDate)
      .legs(invalidLegs)
      .build();

    expect(selection.legs).toHaveLength(0);
  });

  it('Should apply legs when no travel date is set', () => {
    const invalidLegs: SalesTripPatternLeg[] = [
      {
        expectedStartTime: '2023-01-01T10:00:00Z', // Valid ISO string
        fromStopPlaceId: 'SP1',
        toStopPlaceId: 'SP2',
        serviceJourneyId: 'SJ1',
        mode: 'water',
        expectedEndTime: '2023-10-01T10:01:00Z',
      },
    ];

    const selection = createEmptyBuilder(TEST_INPUT)
      .fromSelection({...TEST_SELECTION, travelDate: undefined})
      .legs(invalidLegs)
      .build();

    expect(selection.legs).toHaveLength(1);
  });

  it('Should apply an empty legs array', () => {
    const selection = createEmptyBuilder(TEST_INPUT)
      .fromSelection(TEST_SELECTION)
      .legs([])
      .build();

    expect(selection.legs).toHaveLength(0);
  });

  it('Should retain existing legs when no new legs are provided', () => {
    const selection = createEmptyBuilder(TEST_INPUT)
      .fromSelection(TEST_SELECTION)
      .legs(TEST_SELECTION.legs as SalesTripPatternLeg[])
      .build();

    expect(selection.legs).toEqual(TEST_SELECTION.legs);
  });

  it('Should add all legs if date of any leg matches', () => {
    const selectionWithTravelDate = {
      ...TEST_SELECTION,
      travelDate: '2023-10-01T10:00:00Z', // Ensure travelDate is defined
    };

    const mixedLegs: SalesTripPatternLeg[] = [
      {
        expectedStartTime: '2023-10-01T10:00:00Z', // Valid ISO string
        fromStopPlaceId: 'SP1',
        toStopPlaceId: 'SP2',
        serviceJourneyId: 'SJ1',
        mode: 'water',
        expectedEndTime: '2023-10-01T10:01:00Z',
      },
      {
        expectedStartTime: '2023-01-01T10:00:00Z', // Valid ISO string
        fromStopPlaceId: 'SP3',
        toStopPlaceId: 'SP4',
        serviceJourneyId: 'SJ2',
        mode: 'water',
        expectedEndTime: '2023-10-01T10:01:00Z',
      },
    ];

    const selection = createEmptyBuilder(TEST_INPUT)
      .fromSelection(selectionWithTravelDate)
      .legs(mixedLegs)
      .build();

    expect(selection.legs).toHaveLength(2);
    expect(selection.legs?.[0].fromStopPlaceId).toBe('SP1');
  });

  it('Should not modify the selection if legs are empty', () => {
    const selection = createEmptyBuilder(TEST_INPUT)
      .fromSelection(TEST_SELECTION)
      .legs([])
      .build();

    expect(selection.legs).toEqual(TEST_SELECTION.legs);
  });
});
