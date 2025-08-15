import {createEmptyBuilder} from '../purchase-selection-builder';
import {TEST_INPUT, TEST_SELECTION} from './test-utils';
import type {Leg} from '@atb/api/types/trips';
import {Mode} from '@atb/api/types/generated/journey_planner_v3_types';

describe('purchaseSelectionBuilder - legs', () => {
  it('Should apply valid legs when travel date matches', () => {
    const selectionWithTravelDate = {
      ...TEST_SELECTION,
      travelDate: '2023-10-01T10:00:00Z', // Ensure travelDate is defined
    };

    const validLegs: Leg[] = [
      {
        distance: 1000,
        duration: 60,
        aimedStartTime: '2023-10-01T10:00:00Z', // Valid ISO string
        expectedStartTime: '2023-10-01T10:00:00Z', // Valid ISO string
        aimedEndTime: '2023-10-01T10:01:00Z',
        expectedEndTime: '2023-10-01T10:01:00Z',
        fromPlace: {
          quay: {
            id: 'Q1',
            name: 'Quay 1',
            situations: [],
            tariffZones: [],
            stopPlace: {
              id: 'SP1',
              name: 'Stop Place 1',
            },
          },
          longitude: 0.0,
          latitude: 0.0,
        },
        toPlace: {
          quay: {
            id: 'Q2',
            name: 'Quay 2',
            situations: [],
            tariffZones: [],
            stopPlace: {
              id: 'SP2',
              name: 'Stop Place 2',
            },
          },
          longitude: 0.0,
          latitude: 0.0,
        },
        serviceJourney: {
          id: 'SJ1',
          notices: [],
        },
        mode: Mode.Water,
        realtime: false,
        situations: [],
        intermediateEstimatedCalls: [],
        serviceJourneyEstimatedCalls: [],
      },
      {
        distance: 1000,
        duration: 60,
        aimedStartTime: '2023-10-01T10:00:00Z', // Valid ISO string
        expectedStartTime: '2023-10-01T10:00:00Z', // Valid ISO string
        aimedEndTime: '2023-10-01T10:01:00Z',
        expectedEndTime: '2023-10-01T10:01:00Z',
        fromPlace: {
          quay: {
            id: 'Q3',
            name: 'Quay 3',
            situations: [],
            tariffZones: [],
            stopPlace: {
              id: 'SP3',
              name: 'Stop Place 3',
            },
          },
          longitude: 0.0,
          latitude: 0.0,
        },
        toPlace: {
          quay: {
            id: 'Q4',
            name: 'Quay 4',
            situations: [],
            tariffZones: [],
            stopPlace: {
              id: 'SP4',
              name: 'Stop Place 4',
            },
          },
          longitude: 0.0,
          latitude: 0.0,
        },
        serviceJourney: {
          id: 'SJ2',
          notices: [],
        },
        mode: Mode.Water,
        realtime: false,
        situations: [],
        intermediateEstimatedCalls: [],
        serviceJourneyEstimatedCalls: [],
      },
    ];

    const selection = createEmptyBuilder(TEST_INPUT)
      .fromSelection(selectionWithTravelDate)
      .legs(validLegs)
      .build();

    expect(selection.legs).toHaveLength(2);
    expect(selection.legs?.[0].fromPlace.quay?.stopPlace?.id).toBe('SP1');
    expect(selection.legs?.[1].toPlace.quay?.stopPlace?.id).toBe('SP4');
  });

  it('Should not apply legs when travel date does not match', () => {
    const selectionWithTravelDate = {
      ...TEST_SELECTION,
      travelDate: '2023-10-01T10:00:00Z', // Ensure travelDate is defined
    };

    const invalidLegs: Leg[] = [
      {
        distance: 1000,
        duration: 60,
        aimedStartTime: '2023-01-01T10:00:00Z', // Valid ISO string
        expectedStartTime: '2023-01-01T10:00:00Z', // Valid ISO string
        aimedEndTime: '2023-10-01T10:01:00Z',
        expectedEndTime: '2023-10-01T10:01:00Z',
        fromPlace: {
          quay: {
            id: 'Q1',
            name: 'Quay 1',
            situations: [],
            tariffZones: [],
            stopPlace: {
              id: 'SP1',
              name: 'Stop Place 1',
            },
          },
          longitude: 0.0,
          latitude: 0.0,
        },
        toPlace: {
          quay: {
            id: 'Q2',
            name: 'Quay 2',
            situations: [],
            tariffZones: [],
            stopPlace: {
              id: 'SP2',
              name: 'Stop Place 2',
            },
          },
          longitude: 0.0,
          latitude: 0.0,
        },
        serviceJourney: {
          id: 'SJ1',
          notices: [],
        },
        mode: Mode.Water,
        realtime: false,
        situations: [],
        intermediateEstimatedCalls: [],
        serviceJourneyEstimatedCalls: [],
      },
    ];

    const selection = createEmptyBuilder(TEST_INPUT)
      .fromSelection(selectionWithTravelDate)
      .legs(invalidLegs)
      .build();

    expect(selection.legs).toHaveLength(0);
  });

  it('Should not apply legs when no travel date is set', () => {
    const validLegs: Leg[] = [
      {
        distance: 1000,
        duration: 60,
        aimedStartTime: '2023-01-01T10:00:00Z', // Valid ISO string
        expectedStartTime: '2023-01-01T10:00:00Z', // Valid ISO string
        aimedEndTime: '2023-10-01T10:01:00Z',
        expectedEndTime: '2023-10-01T10:01:00Z',
        fromPlace: {
          quay: {
            id: 'Q1',
            name: 'Quay 1',
            situations: [],
            tariffZones: [],
            stopPlace: {
              id: 'SP1',
              name: 'Stop Place 1',
            },
          },
          longitude: 0.0,
          latitude: 0.0,
        },
        toPlace: {
          quay: {
            id: 'Q2',
            name: 'Quay 2',
            situations: [],
            tariffZones: [],
            stopPlace: {
              id: 'SP2',
              name: 'Stop Place 2',
            },
          },
          longitude: 0.0,
          latitude: 0.0,
        },
        serviceJourney: {
          id: 'SJ1',
          notices: [],
        },
        mode: Mode.Water,
        realtime: false,
        situations: [],
        intermediateEstimatedCalls: [],
        serviceJourneyEstimatedCalls: [],
      },
    ];

    const selection = createEmptyBuilder(TEST_INPUT)
      .fromSelection({...TEST_SELECTION, travelDate: undefined}) // No travel date set
      .legs(validLegs)
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
      .legs(TEST_SELECTION.legs)
      .build();

    expect(selection.legs).toEqual(TEST_SELECTION.legs);
  });

  it('Should add all legs if date of any leg matches', () => {
    const selectionWithTravelDate = {
      ...TEST_SELECTION,
      travelDate: '2023-10-01T10:00:00Z', // Ensure travelDate is defined
    };

    const mixedLegs: Leg[] = [
      {
        distance: 1000,
        duration: 60,
        aimedStartTime: '2023-10-01T10:00:00Z', // Valid ISO string
        expectedStartTime: '2023-10-01T10:00:00Z', // Valid ISO string
        aimedEndTime: '2023-10-01T10:01:00Z',
        expectedEndTime: '2023-10-01T10:01:00Z',
        fromPlace: {
          quay: {
            id: 'Q1',
            name: 'Quay 1',
            situations: [],
            tariffZones: [],
            stopPlace: {
              id: 'SP1',
              name: 'Stop Place 1',
            },
          },
          longitude: 0.0,
          latitude: 0.0,
        },
        toPlace: {
          quay: {
            id: 'Q2',
            name: 'Quay 2',
            situations: [],
            tariffZones: [],
            stopPlace: {
              id: 'SP2',
              name: 'Stop Place 2',
            },
          },
          longitude: 0.0,
          latitude: 0.0,
        },
        serviceJourney: {
          id: 'SJ1',
          notices: [],
        },
        mode: Mode.Water,
        realtime: false,
        situations: [],
        intermediateEstimatedCalls: [],
        serviceJourneyEstimatedCalls: [],
      },
      {
        distance: 1000,
        duration: 60,
        aimedStartTime: '2023-01-01T10:00:00Z', // Valid ISO string
        expectedStartTime: '2023-01-01T10:00:00Z', // Valid ISO string
        aimedEndTime: '2023-10-01T10:01:00Z',
        expectedEndTime: '2023-10-01T10:01:00Z',
        fromPlace: {
          quay: {
            id: 'Q3',
            name: 'Quay 3',
            situations: [],
            tariffZones: [],
            stopPlace: {
              id: 'SP3',
              name: 'Stop Place 3',
            },
          },
          longitude: 0.0,
          latitude: 0.0,
        },
        toPlace: {
          quay: {
            id: 'Q4',
            name: 'Quay 4',
            situations: [],
            tariffZones: [],
            stopPlace: {
              id: 'SP4',
              name: 'Stop Place 4',
            },
          },
          longitude: 0.0,
          latitude: 0.0,
        },
        serviceJourney: {
          id: 'SJ2',
          notices: [],
        },
        mode: Mode.Water,
        realtime: false,
        situations: [],
        intermediateEstimatedCalls: [],
        serviceJourneyEstimatedCalls: [],
      },
    ];

    const selection = createEmptyBuilder(TEST_INPUT)
      .fromSelection(selectionWithTravelDate)
      .legs(mixedLegs)
      .build();

    expect(selection.legs).toHaveLength(2);
    expect(selection.legs?.[0].fromPlace.quay?.stopPlace?.id).toBe('SP1');
  });

  it('Should not modify the selection if legs are empty', () => {
    const selection = createEmptyBuilder(TEST_INPUT)
      .fromSelection(TEST_SELECTION)
      .legs([])
      .build();

    expect(selection.legs).toEqual(TEST_SELECTION.legs);
  });
});
