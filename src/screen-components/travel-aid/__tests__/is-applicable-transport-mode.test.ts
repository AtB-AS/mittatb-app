import {isApplicableTransportMode} from '../utils';
import {
  TransportMode,
  TransportSubmode,
} from '@atb/api/types/generated/journey_planner_v3_types';
import type {ServiceJourneyWithGuaranteedCalls} from '../types';

const withModes = (
  transportMode?: TransportMode,
  transportSubmode?: TransportSubmode,
) => ({transportMode, transportSubmode} as ServiceJourneyWithGuaranteedCalls);

describe('isApplicableTransportMode', () => {
  it('should give true if modes array includes service journey transport mode', () => {
    const res = isApplicableTransportMode(
      [{mode: 'bus'}, {mode: 'rail'}],
      withModes(TransportMode.Bus),
    );
    expect(res).toBe(true);
  });

  it('should give false if modes array does not include service journey transport mode', () => {
    const res = isApplicableTransportMode(
      [{mode: 'bus'}, {mode: 'rail'}],
      withModes(TransportMode.Tram),
    );
    expect(res).toBe(false);
  });

  it('should give false if no service journey transport mode', () => {
    const res = isApplicableTransportMode(
      [{mode: 'bus'}, {mode: 'rail'}],
      withModes(),
    );
    expect(res).toBe(false);
  });

  it('should give true if modes array includes service journey transport mode, and submodes array is empty', () => {
    const res = isApplicableTransportMode(
      [{mode: 'bus', submodes: []}, {mode: 'rail'}],
      withModes(TransportMode.Bus),
    );
    expect(res).toBe(true);
  });

  it('should give true if modes array includes service journey transport mode, and submodes array includes service journey submode', () => {
    const res = isApplicableTransportMode(
      [{mode: 'bus', submodes: ['postBus', 'nightBus']}, {mode: 'rail'}],
      withModes(TransportMode.Bus, TransportSubmode.PostBus),
    );
    expect(res).toBe(true);
  });

  it('should give false if modes array includes service journey transport mode, and submodes array includes some submodes while service journey has another submode', () => {
    const res = isApplicableTransportMode(
      [{mode: 'bus', submodes: ['postBus', 'nightBus']}, {mode: 'rail'}],
      withModes(TransportMode.Bus, TransportSubmode.LocalBus),
    );
    expect(res).toBe(false);
  });

  it('should give false if modes array includes service journey transport mode, and submodes array includes some submodes while service journey submode is empty', () => {
    const res = isApplicableTransportMode(
      [{mode: 'bus', submodes: ['postBus', 'nightBus']}, {mode: 'rail'}],
      withModes(TransportMode.Bus),
    );
    expect(res).toBe(false);
  });
});
