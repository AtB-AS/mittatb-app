import {getStopButtonAvailability} from '../utils';
import type {EstimatedCallWithQuayFragment} from '@atb/api/types/generated/fragments/estimated-calls';
import type {StopSignalButtonConfigType} from '@atb-as/config-specs';

const config = {
  activationWindowStartMinutesBefore: 60,
  activationWindowEndMinutesBefore: 2,
  modes: [{mode: 'bus'}],
} as StopSignalButtonConfigType;

const call = (realtime: boolean) =>
  ({
    realtime,
    expectedArrivalTime: '2024-10-18T12:00:00+02:00',
  }) as EstimatedCallWithQuayFragment;

const at = (time: string) => new Date(`2024-10-18T${time}+02:00`);

describe('getStopButtonAvailability', () => {
  it('is noRealtime when the call has no realtime data', () => {
    expect(getStopButtonAvailability(call(false), config, at('11:30:00'))).toBe(
      'noRealtime',
    );
  });

  it('is noRealtime when the call has no expected arrival time', () => {
    const callWithoutArrival = {
      realtime: true,
      expectedArrivalTime: undefined,
    } as EstimatedCallWithQuayFragment;
    expect(
      getStopButtonAvailability(callWithoutArrival, config, at('11:30:00')),
    ).toBe('noRealtime');
  });

  it('is tooEarly before the activation window starts', () => {
    expect(getStopButtonAvailability(call(true), config, at('10:30:00'))).toBe(
      'tooEarly',
    );
  });

  it('is tooEarly exactly at the window start', () => {
    expect(getStopButtonAvailability(call(true), config, at('11:00:00'))).toBe(
      'tooEarly',
    );
  });

  it('is available inside the activation window', () => {
    expect(getStopButtonAvailability(call(true), config, at('11:30:00'))).toBe(
      'available',
    );
  });

  it('is tooLate exactly at the window end', () => {
    expect(getStopButtonAvailability(call(true), config, at('11:58:00'))).toBe(
      'tooLate',
    );
  });

  it('is tooLate after the activation window ends', () => {
    expect(getStopButtonAvailability(call(true), config, at('11:59:00'))).toBe(
      'tooLate',
    );
  });
});
