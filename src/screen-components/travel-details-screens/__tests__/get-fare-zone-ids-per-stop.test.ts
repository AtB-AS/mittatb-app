import {Leg} from '@atb/api/types/trips';
import {Mode} from '@atb/api/types/generated/journey_planner_v3_types';
import {FareZone} from '@atb/modules/configuration';
import {getFareZoneIdsPerStop} from '../utils';

const A = 'ATB:FareZone:10';
const B1 = 'ATB:FareZone:6';
const C1 = 'ATB:FareZone:4';

const fareZones = [A, B1, C1].map((id) => ({id}) as FareZone);

// Stops also carry zones of other authorities and legacy tariff zones, which
// should be ignored.
const tariffZones = (...ids: string[]) => ids.map((id) => ({id}));
const place = (...ids: string[]) => ({
  quay: {tariffZones: tariffZones(...ids)},
});
const call = (...ids: string[]) => ({quay: {tariffZones: tariffZones(...ids)}});

const busLeg = (from: string[], intermediate: string[][], to: string[]): Leg =>
  ({
    mode: Mode.Bus,
    fromPlace: place(...from),
    intermediateEstimatedCalls: intermediate.map((ids) => call(...ids)),
    toPlace: place(...to),
  }) as unknown as Leg;

const footLeg = (from: string[], to: string[]): Leg =>
  ({
    mode: Mode.Foot,
    fromPlace: place(...from),
    intermediateEstimatedCalls: [],
    toPlace: place(...to),
  }) as unknown as Leg;

describe('getFareZoneIdsPerStop', () => {
  it('returns the fare zones of every stop, including intermediate calls', () => {
    const leg = busLeg(
      [A, 'ATB:TariffZone:1', 'MOR:TariffZone:1016'],
      [[A, 'ATB:TariffZone:1'], [B1, 'ATB:TariffZone:2'], [C1]],
      [C1, 'ATB:TariffZone:5'],
    );

    expect(getFareZoneIdsPerStop([leg], fareZones)).toEqual([
      [A],
      [A],
      [B1],
      [C1],
      [C1],
    ]);
  });

  it('finds a zone that only an intermediate call passes through', () => {
    const leg = busLeg([A], [[B1]], [C1]);

    expect(getFareZoneIdsPerStop([leg], fareZones)?.flat()).toContain(B1);
  });

  it('keeps every fare zone of a stop on a zone border', () => {
    const leg = busLeg([A], [], [A, B1]);

    expect(getFareZoneIdsPerStop([leg], fareZones)).toEqual([[A], [A, B1]]);
  });

  it('ignores legs that do not need a ticket', () => {
    const legs = [footLeg(['OTHER:Zone:1'], [A]), busLeg([A], [], [B1])];

    expect(getFareZoneIdsPerStop(legs, fareZones)).toEqual([[A], [B1]]);
  });

  it('returns undefined when a stop has no fare zone we sell tickets for', () => {
    const leg = busLeg([A], [['INN:FareZone:173']], [B1]);

    expect(getFareZoneIdsPerStop([leg], fareZones)).toBeUndefined();
  });

  it('returns undefined when intermediate calls lack tariff zones', () => {
    const leg = {
      ...busLeg([A], [], [B1]),
      intermediateEstimatedCalls: [{quay: {}}],
    } as unknown as Leg;

    expect(getFareZoneIdsPerStop([leg], fareZones)).toBeUndefined();
  });

  it('returns an empty list for a trip without legs that need a ticket', () => {
    expect(getFareZoneIdsPerStop([footLeg([A], [A])], fareZones)).toEqual([]);
  });
});
