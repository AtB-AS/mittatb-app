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
import {isTripCoveredByFareContract} from '../utils';

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

const isCovered = (
  legs: Leg[],
  fareZoneIdsPerStop: string[][],
  fc: FareContractType,
) =>
  isTripCoveredByFareContract(
    legs,
    fareZoneIdsPerStop,
    fc,
    preassignedFareProducts,
    fareProductTypeConfigs,
  );

describe('isTripCoveredByFareContract', () => {
  const zonesAtoC1 = [[A], [B1], [C1]];

  it('is covered when zones, modes and validity all match', () => {
    expect(
      isCovered([leg(0), leg(30)], zonesAtoC1, fareContract(travelRight())),
    ).toBe(true);
  });

  describe('zones', () => {
    it('is not covered when a stop is in a zone the ticket lacks', () => {
      const fc = fareContract(travelRight({fareZoneRefs: [A, C1]}));
      expect(isCovered([leg(0)], zonesAtoC1, fc)).toBe(false);
    });

    it('accepts either zone of a stop on a zone border', () => {
      const fc = fareContract(travelRight({fareZoneRefs: [A]}));
      expect(isCovered([leg(0)], [[A], [A, B1]], fc)).toBe(true);
    });

    it('is not covered when the ticket has no fare zones', () => {
      const fc = fareContract(travelRight({fareZoneRefs: undefined}));
      expect(isCovered([leg(0)], zonesAtoC1, fc)).toBe(false);
    });
  });

  describe('validity', () => {
    it('is not covered when the ticket starts after the first boarding', () => {
      const fc = fareContract(travelRight({startDateTime: at(1)}));
      expect(isCovered([leg(0), leg(30)], zonesAtoC1, fc)).toBe(false);
    });

    it('is not covered when the ticket expires before a later boarding', () => {
      const fc = fareContract(travelRight({endDateTime: at(29)}));
      expect(isCovered([leg(0), leg(30)], zonesAtoC1, fc)).toBe(false);
    });

    it('is covered when the ticket expires after the last boarding', () => {
      const fc = fareContract(travelRight({endDateTime: at(30)}));
      expect(isCovered([leg(0), leg(30)], zonesAtoC1, fc)).toBe(true);
    });

    it('ignores the departure time of legs that do not need a ticket', () => {
      const fc = fareContract(travelRight({endDateTime: at(30)}));
      const legs = [leg(0), leg(45, Mode.Foot, undefined)];
      expect(isCovered(legs, zonesAtoC1, fc)).toBe(true);
    });
  });

  describe('carnets', () => {
    const carnet = (usedAccesses: {startDateTime: Date; endDateTime: Date}[]) =>
      fareContract(
        travelRight({
          fareProductRef: 'ATB:PreassignedFareProduct:carnet',
          startDateTime: at(-60 * 24),
          endDateTime: at(60 * 24 * 30),
          maximumNumberOfAccesses: 10,
          numberOfUsedAccesses: usedAccesses.length,
          usedAccesses,
        }),
      );

    it('is covered when boarding within an activated access', () => {
      const fc = carnet([{startDateTime: at(-5), endDateTime: at(85)}]);
      expect(isCovered([leg(0), leg(30)], zonesAtoC1, fc)).toBe(true);
    });

    it('is not covered when the carnet has no activated access', () => {
      expect(isCovered([leg(0)], zonesAtoC1, carnet([]))).toBe(false);
    });

    it('is not covered when boarding after the access has ended', () => {
      const fc = carnet([{startDateTime: at(-60), endDateTime: at(20)}]);
      expect(isCovered([leg(0), leg(30)], zonesAtoC1, fc)).toBe(false);
    });
  });

  describe('transport modes', () => {
    it('is not covered when a leg uses a mode the product does not allow', () => {
      const legs = [leg(0), leg(30, Mode.Rail, TransportSubmode.Local)];
      expect(isCovered(legs, zonesAtoC1, fareContract(travelRight()))).toBe(
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
      expect(isCovered([boatLeg], zonesAtoC1, fc)).toBe(true);
      expect(isCovered([otherBoatLeg], zonesAtoC1, fc)).toBe(false);
    });

    it('is not covered when the product is unknown', () => {
      const fc = fareContract(
        travelRight({fareProductRef: 'ATB:PreassignedFareProduct:unknown'}),
      );
      expect(isCovered([leg(0)], zonesAtoC1, fc)).toBe(false);
    });
  });

  it('is covered when any of the travel rights covers the trip', () => {
    const fc = fareContract(
      travelRight({fareZoneRefs: [A]}),
      travelRight({fareZoneRefs: [A, B1, C1]}),
    );
    expect(isCovered([leg(0)], zonesAtoC1, fc)).toBe(true);
  });

  it('is not covered for a trip without legs that need a ticket', () => {
    const fc = fareContract(travelRight());
    expect(isCovered([leg(0, Mode.Foot, undefined)], [], fc)).toBe(false);
  });
});
