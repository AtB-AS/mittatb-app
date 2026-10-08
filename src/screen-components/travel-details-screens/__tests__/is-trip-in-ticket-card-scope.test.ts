import {Leg} from '@atb/api/types/trips';
import {
  Mode,
  TransportSubmode,
} from '@atb/api/types/generated/journey_planner_v3_types';
import {FareZone} from '@atb/modules/configuration';
import {isTripInTicketCardScope} from '../utils';

const A = 'ATB:FareZone:10';
const B1 = 'ATB:FareZone:6';

const ourAuthority = 'ATB:Authority:2';
const fareZones = [A, B1].map((id) => ({id}) as FareZone);

const place = (...ids: string[]) => ({
  quay: {tariffZones: ids.map((id) => ({id}))},
});

const leg = (
  from: string[],
  to: string[],
  {
    mode = Mode.Bus,
    transportSubmode = TransportSubmode.LocalBus,
    authorityId = ourAuthority,
    intermediate = [],
  }: {
    mode?: Mode;
    transportSubmode?: TransportSubmode;
    authorityId?: string;
    intermediate?: string[][];
  } = {},
): Leg =>
  ({
    mode,
    transportSubmode,
    authority: {id: authorityId},
    fromPlace: place(...from),
    intermediateEstimatedCalls: intermediate.map((ids) => place(...ids)),
    toPlace: place(...to),
  }) as unknown as Leg;

const footLeg = (from: string[], to: string[]): Leg =>
  ({
    mode: Mode.Foot,
    fromPlace: place(...from),
    intermediateEstimatedCalls: [],
    toPlace: place(...to),
  }) as unknown as Leg;

const isInScope = (legs: Leg[]) =>
  isTripInTicketCardScope(legs, fareZones, ourAuthority);

describe('isTripInTicketCardScope', () => {
  it('is in scope for a bus trip within one zone', () => {
    expect(
      isInScope([leg([A], [A], {intermediate: [[A]]}), leg([A], [A])]),
    ).toBe(true);
  });

  it('includes trams and bus sub modes we sell bus tickets for', () => {
    const legs = [
      leg([A], [A], {
        mode: Mode.Tram,
        transportSubmode: TransportSubmode.CityTram,
      }),
      leg([A], [A], {transportSubmode: TransportSubmode.ExpressBus}),
    ];
    expect(isInScope(legs)).toBe(true);
  });

  it('counts a stop on a zone border for each of its zones', () => {
    expect(isInScope([leg([A], [A, B1]), leg([A, B1], [B1])])).toBe(false);
    expect(isInScope([leg([A], [A, B1])])).toBe(true);
    expect(isInScope([leg([A, B1], [B1])])).toBe(true);
  });

  it('is not in scope when the trip passes through more than one zone', () => {
    expect(isInScope([leg([A], [A], {intermediate: [[B1]]})])).toBe(false);
    expect(isInScope([leg([A], [A]), leg([B1], [B1])])).toBe(false);
  });

  it('is not in scope when a stop has no fare zone we sell tickets for', () => {
    expect(isInScope([leg([A], ['INN:FareZone:173'])])).toBe(false);
  });

  it('is not in scope when a leg is not by bus or tram', () => {
    const railLeg = leg([A], [A], {
      mode: Mode.Rail,
      transportSubmode: TransportSubmode.Local,
    });
    expect(isInScope([leg([A], [A]), railLeg])).toBe(false);
  });

  it('is not in scope when a leg is operated for another authority', () => {
    const legs = [leg([A], [A]), leg([A], [A], {authorityId: 'SJN:Authority'})];
    expect(isInScope(legs)).toBe(false);
  });

  it('ignores legs that do not need a ticket', () => {
    const legs = [
      footLeg(['OTHER:Zone:1'], [A]),
      leg([A], [A]),
      footLeg([A], [B1]),
    ];
    expect(isInScope(legs)).toBe(true);
  });

  it('is not in scope for a trip without legs that need a ticket', () => {
    expect(isInScope([footLeg([A], [A])])).toBe(false);
  });
});
