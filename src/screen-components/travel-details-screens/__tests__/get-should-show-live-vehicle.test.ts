import {EstimatedCall} from '@atb/api/types/departures';
import {getShouldShowLiveVehicle} from '../utils';

const estimatedCallsWhichDepartInGivenMinutes = (
  minutesToDeparture: number,
): Pick<EstimatedCall, 'aimedDepartureTime'>[] => {
  const date = new Date();
  date.setMinutes(date.getMinutes() + minutesToDeparture);
  return [{aimedDepartureTime: date.toISOString()} as any];
};

describe('getShouldShowLiveVehicle', () => {
  it('returns true if less than 10 minutes since departure time', () => {
    expect(
      getShouldShowLiveVehicle(estimatedCallsWhichDepartInGivenMinutes(9)),
    ).toBe(true);
    expect(
      getShouldShowLiveVehicle(estimatedCallsWhichDepartInGivenMinutes(5)),
    ).toBe(true);
    expect(
      getShouldShowLiveVehicle(estimatedCallsWhichDepartInGivenMinutes(1)),
    ).toBe(true);
  });

  it('returns true if departure time is passed', () => {
    expect(
      getShouldShowLiveVehicle(estimatedCallsWhichDepartInGivenMinutes(0)),
    ).toBe(true);
    expect(
      getShouldShowLiveVehicle(estimatedCallsWhichDepartInGivenMinutes(-10)),
    ).toBe(true);
    expect(
      getShouldShowLiveVehicle(estimatedCallsWhichDepartInGivenMinutes(-7200)),
    ).toBe(true);
  });

  it('returns false if more than 10 minutes until departure time', () => {
    expect(
      getShouldShowLiveVehicle(estimatedCallsWhichDepartInGivenMinutes(11)),
    ).toBe(false);
    expect(
      getShouldShowLiveVehicle(estimatedCallsWhichDepartInGivenMinutes(30)),
    ).toBe(false);
    expect(
      getShouldShowLiveVehicle(estimatedCallsWhichDepartInGivenMinutes(7200)),
    ).toBe(false);
  });

  it('returns false if estimated call list is empty', () => {
    expect(getShouldShowLiveVehicle([])).toBe(false);
  });
});
