import {getShouldShowLiveVehicle} from '../utils';
import {EstimatedCallWithMetadata} from '../use-departure-details-query';

const estimatedCallsWhichDepartInGivenMinutes = (
  minutesToDeparture: number,
): EstimatedCallWithMetadata[] => {
  const date = new Date();
  date.setMinutes(date.getMinutes() + minutesToDeparture);
  return [{aimedDepartureTime: date.toISOString()} as any];
};

describe('getShouldShowLiveVehicle', () => {
  it('returns true if less than 10 minutes since departure time', () => {
    expect(
      getShouldShowLiveVehicle(
        estimatedCallsWhichDepartInGivenMinutes(9),
        true,
      ),
    ).toBe(true);
    expect(
      getShouldShowLiveVehicle(
        estimatedCallsWhichDepartInGivenMinutes(5),
        true,
      ),
    ).toBe(true);
    expect(
      getShouldShowLiveVehicle(
        estimatedCallsWhichDepartInGivenMinutes(1),
        true,
      ),
    ).toBe(true);
  });

  it('returns true if departure time is passed', () => {
    expect(
      getShouldShowLiveVehicle(
        estimatedCallsWhichDepartInGivenMinutes(0),
        true,
      ),
    ).toBe(true);
    expect(
      getShouldShowLiveVehicle(
        estimatedCallsWhichDepartInGivenMinutes(-10),
        true,
      ),
    ).toBe(true);
    expect(
      getShouldShowLiveVehicle(
        estimatedCallsWhichDepartInGivenMinutes(-7200),
        true,
      ),
    ).toBe(true);
  });

  it('returns false if more than 10 minutes until departure time', () => {
    expect(
      getShouldShowLiveVehicle(
        estimatedCallsWhichDepartInGivenMinutes(11),
        true,
      ),
    ).toBe(false);
    expect(
      getShouldShowLiveVehicle(
        estimatedCallsWhichDepartInGivenMinutes(30),
        true,
      ),
    ).toBe(false);
    expect(
      getShouldShowLiveVehicle(
        estimatedCallsWhichDepartInGivenMinutes(7200),
        true,
      ),
    ).toBe(false);
  });

  it('returns false if realtime map is not enabled', () => {
    expect(
      getShouldShowLiveVehicle(
        estimatedCallsWhichDepartInGivenMinutes(15),
        false,
      ),
    ).toBe(false);
    expect(
      getShouldShowLiveVehicle(
        estimatedCallsWhichDepartInGivenMinutes(0),
        false,
      ),
    ).toBe(false);
    expect(
      getShouldShowLiveVehicle(
        estimatedCallsWhichDepartInGivenMinutes(-15),
        false,
      ),
    ).toBe(false);
  });

  it('returns false if estimated call list is empty', () => {
    expect(getShouldShowLiveVehicle([], true)).toBe(false);
  });
});
