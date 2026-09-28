import {addMinutes} from 'date-fns';
import {FareContractType, TravelRightType} from '@atb-as/utils';
import {Leg} from '@atb/api/types/trips';
import {
  Mode,
  TransportSubmode,
} from '@atb/api/types/generated/journey_planner_v3_types';
import {
  FareProductTypeConfig,
  PreassignedFareProduct,
} from '@atb/modules/configuration';
import {
  canActivateCarnetForTrip,
  getValidityEndAtFirstBoarding,
  isFareContractApplicableToTrip,
} from '../utils';

const A = 'ATB:FareZone:10';
const B1 = 'ATB:FareZone:6';
const C1 = 'ATB:FareZone:4';

const tripStart = new Date('2026-09-24T14:00:00+02:00');
const at = (minutes: number) => addMinutes(tripStart, minutes);

const leg = (
  startMinutes: number,
  mode = Mode.Bus,
  transportSubmode: TransportSubmode | undefined = TransportSubmode.LocalBus,
): Leg =>
  ({
    mode,
    transportSubmode,
    expectedStartTime: at(startMinutes).toISOString(),
  }) as unknown as Leg;

const preassignedFareProducts = [
  {id: 'ATB:PreassignedFareProduct:single', type: 'single'},
  {id: 'ATB:PreassignedFareProduct:carnet', type: 'carnet'},
  {id: 'ATB:PreassignedFareProduct:boat', type: 'boat-single'},
] as PreassignedFareProduct[];

const busModes = [
  {mode: 'bus'},
  {mode: 'tram'},
] as FareProductTypeConfig['transportModes'];
const fareProductTypeConfigs = [
  {type: 'single', transportModes: busModes},
  {type: 'carnet', transportModes: busModes},
  {
    type: 'boat-single',
    transportModes: [{mode: 'water', subMode: 'highSpeedPassengerService'}],
  },
] as FareProductTypeConfig[];

const travelRight = (overrides: Partial<TravelRightType> = {}) =>
  ({
    fareProductRef: 'ATB:PreassignedFareProduct:single',
    fareZoneRefs: [A, B1, C1],
    startDateTime: at(-5),
    endDateTime: at(90),
    ...overrides,
  }) as TravelRightType;

const fareContract = (...travelRights: TravelRightType[]) =>
  ({travelRights}) as FareContractType;

type UsedAccess = {startDateTime: Date; endDateTime: Date};

const carnet = (usedAccesses: UsedAccess[], overrides = {}) =>
  fareContract(
    travelRight({
      fareProductRef: 'ATB:PreassignedFareProduct:carnet',
      startDateTime: at(-60 * 24),
      endDateTime: at(60 * 24 * 30),
      maximumNumberOfAccesses: 10,
      numberOfUsedAccesses: usedAccesses.length,
      usedAccesses,
      ...overrides,
    }),
  );

const zonesAtoC1 = [[A], [B1], [C1]];

describe('isFareContractApplicableToTrip', () => {
  const isApplicable = (
    legs: Leg[],
    fareZoneIdsPerStop: string[][],
    fc: FareContractType,
  ) =>
    isFareContractApplicableToTrip(
      legs,
      fareZoneIdsPerStop,
      fc,
      preassignedFareProducts,
      fareProductTypeConfigs,
    );

  it('is applicable when zones and modes match', () => {
    expect(
      isApplicable([leg(0), leg(30)], zonesAtoC1, fareContract(travelRight())),
    ).toBe(true);
  });

  it('does not check validity in time', () => {
    const fc = fareContract(travelRight({endDateTime: at(-60)}));
    expect(isApplicable([leg(0)], zonesAtoC1, fc)).toBe(true);
  });

  describe('zones', () => {
    it('is not applicable when a stop is in a zone the ticket lacks', () => {
      const fc = fareContract(travelRight({fareZoneRefs: [A, C1]}));
      expect(isApplicable([leg(0)], zonesAtoC1, fc)).toBe(false);
    });

    it('accepts either zone of a stop on a zone border', () => {
      const fc = fareContract(travelRight({fareZoneRefs: [A]}));
      expect(isApplicable([leg(0)], [[A], [A, B1]], fc)).toBe(true);
    });

    it('is not applicable when the ticket has no fare zones', () => {
      const fc = fareContract(travelRight({fareZoneRefs: undefined}));
      expect(isApplicable([leg(0)], zonesAtoC1, fc)).toBe(false);
    });
  });

  describe('transport modes', () => {
    it('is not applicable when a leg uses a mode the product does not allow', () => {
      const legs = [leg(0), leg(30, Mode.Rail, TransportSubmode.Local)];
      expect(isApplicable(legs, zonesAtoC1, fareContract(travelRight()))).toBe(
        false,
      );
    });

    it('matches the sub mode when the product specifies one', () => {
      const fc = fareContract(
        travelRight({fareProductRef: 'ATB:PreassignedFareProduct:boat'}),
      );
      const boatLeg = leg(
        0,
        Mode.Water,
        TransportSubmode.HighSpeedPassengerService,
      );
      const otherBoatLeg = leg(
        0,
        Mode.Water,
        TransportSubmode.HighSpeedVehicleService,
      );
      expect(isApplicable([boatLeg], zonesAtoC1, fc)).toBe(true);
      expect(isApplicable([otherBoatLeg], zonesAtoC1, fc)).toBe(false);
    });

    it('is not applicable when the product is unknown', () => {
      const fc = fareContract(
        travelRight({fareProductRef: 'ATB:PreassignedFareProduct:unknown'}),
      );
      expect(isApplicable([leg(0)], zonesAtoC1, fc)).toBe(false);
    });
  });

  it('is applicable when any of the travel rights fits the trip', () => {
    const fc = fareContract(
      travelRight({fareZoneRefs: [A]}),
      travelRight({fareZoneRefs: [A, B1, C1]}),
    );
    expect(isApplicable([leg(0)], zonesAtoC1, fc)).toBe(true);
  });

  it('is not applicable for a trip without legs that need a ticket', () => {
    const fc = fareContract(travelRight());
    expect(isApplicable([leg(0, Mode.Foot, undefined)], [], fc)).toBe(false);
  });
});

describe('getValidityEndAtFirstBoarding', () => {
  it('returns the end of the ticket valid at the first boarding', () => {
    const fc = fareContract(travelRight({endDateTime: at(90)}));
    expect(getValidityEndAtFirstBoarding([leg(0), leg(30)], fc)).toEqual(
      at(90),
    );
  });

  it('only checks the first boarding', () => {
    // Whether the ticket must last for later legs differs between
    // organizations, so that is left to the traveller to check.
    const fc = fareContract(travelRight({endDateTime: at(10)}));
    expect(getValidityEndAtFirstBoarding([leg(0), leg(30)], fc)).toEqual(
      at(10),
    );
  });

  it('is undefined when the ticket starts after the first boarding', () => {
    const fc = fareContract(travelRight({startDateTime: at(1)}));
    expect(getValidityEndAtFirstBoarding([leg(0)], fc)).toBeUndefined();
  });

  it('is undefined when the trip starts after the ticket expires', () => {
    const fc = fareContract(travelRight({endDateTime: at(-1)}));
    expect(getValidityEndAtFirstBoarding([leg(0)], fc)).toBeUndefined();
  });

  it('ignores the departure time of legs that do not need a ticket', () => {
    const fc = fareContract(travelRight({startDateTime: at(5)}));
    const legs = [leg(0, Mode.Foot, undefined), leg(10)];
    expect(getValidityEndAtFirstBoarding(legs, fc)).toEqual(at(90));
  });

  it('is undefined for a trip without legs that need a ticket', () => {
    const fc = fareContract(travelRight());
    expect(
      getValidityEndAtFirstBoarding([leg(0, Mode.Foot, undefined)], fc),
    ).toBeUndefined();
  });

  describe('carnets', () => {
    it('returns the end of the access activated at the first boarding', () => {
      const fc = carnet([{startDateTime: at(-5), endDateTime: at(85)}]);
      expect(getValidityEndAtFirstBoarding([leg(0)], fc)).toEqual(at(85));
    });

    it('is undefined when the carnet has no activated access', () => {
      expect(
        getValidityEndAtFirstBoarding([leg(0)], carnet([])),
      ).toBeUndefined();
    });

    it('is undefined when the access ended before the first boarding', () => {
      const fc = carnet([{startDateTime: at(-60), endDateTime: at(-1)}]);
      expect(getValidityEndAtFirstBoarding([leg(0)], fc)).toBeUndefined();
    });
  });
});

describe('canActivateCarnetForTrip', () => {
  it('is true for a carnet without an activated access', () => {
    expect(canActivateCarnetForTrip([leg(0)], carnet([]))).toBe(true);
  });

  it('is true when the last access ended before the first boarding', () => {
    const fc = carnet([{startDateTime: at(-60), endDateTime: at(-1)}]);
    expect(canActivateCarnetForTrip([leg(0)], fc)).toBe(true);
  });

  it('is false when an access is activated at the first boarding', () => {
    const fc = carnet([{startDateTime: at(-5), endDateTime: at(85)}]);
    expect(canActivateCarnetForTrip([leg(0)], fc)).toBe(false);
  });

  it('is false when all accesses are used', () => {
    const fc = carnet([], {
      maximumNumberOfAccesses: 2,
      numberOfUsedAccesses: 2,
    });
    expect(canActivateCarnetForTrip([leg(0)], fc)).toBe(false);
  });

  it('is false when the carnet has expired at the first boarding', () => {
    const fc = carnet([], {endDateTime: at(-1)});
    expect(canActivateCarnetForTrip([leg(0)], fc)).toBe(false);
  });

  it('is false for a ticket that is not a carnet', () => {
    expect(
      canActivateCarnetForTrip([leg(0)], fareContract(travelRight())),
    ).toBe(false);
  });
});
