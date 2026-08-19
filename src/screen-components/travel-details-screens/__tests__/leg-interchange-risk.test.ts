import {Leg} from '@atb/api/types/trips';
import {legInterchangeRisk} from '../utils';

describe('Leg interchange risk evaluator', () => {
  const place = (stopPlaceId: string) =>
    ({quay: {stopPlace: {id: stopPlaceId}}}) as Leg['fromPlace'];

  const busLeg = (
    fromStopPlaceId: string,
    toStopPlaceId: string,
    interchangeTo?: Leg['interchangeTo'],
  ) =>
    ({
      mode: 'bus',
      fromPlace: place(fromStopPlaceId),
      toPlace: place(toStopPlaceId),
      interchangeTo,
    }) as Leg;

  const footLeg = (fromStopPlaceId: string, toStopPlaceId: string) =>
    ({
      mode: 'foot',
      fromPlace: place(fromStopPlaceId),
      toPlace: place(toStopPlaceId),
    }) as Leg;

  it('catches a missed interchange at the same stop place', () => {
    const legs = [busLeg('A', 'B'), busLeg('B', 'C')];
    expect(legInterchangeRisk(0, legs, -60)).toBe('uncertain');
    expect(legInterchangeRisk(0, legs, -300)).toBe('impossible');
  });

  it('passes when there is time to spare', () => {
    const legs = [busLeg('A', 'B'), busLeg('B', 'C')];
    expect(legInterchangeRisk(0, legs, 120)).toBeUndefined();
  });

  it('catches a missed interchange when walking to another stop place', () => {
    const legs = [busLeg('A', 'B'), footLeg('B', 'C'), busLeg('C', 'D')];
    expect(legInterchangeRisk(1, legs, -60)).toBe('uncertain');
  });

  it('catches a missed interchange when walking within the same stop place', () => {
    const legs = [busLeg('A', 'B'), footLeg('B', 'B'), busLeg('B', 'C')];
    expect(legInterchangeRisk(1, legs, -60)).toBe('uncertain');
  });

  it('passes on the leg leading into a walk, so it is only reported once', () => {
    const legs = [busLeg('A', 'B'), footLeg('B', 'B'), busLeg('B', 'C')];
    expect(legInterchangeRisk(0, legs, -60)).toBeUndefined();
  });

  it('passes on a guaranteed interchange', () => {
    const legs = [busLeg('A', 'B', {guaranteed: true}), busLeg('B', 'C')];
    expect(legInterchangeRisk(0, legs, -300)).toBeUndefined();
  });

  it('passes on a guaranteed interchange with a walk in between', () => {
    const legs = [
      busLeg('A', 'B', {guaranteed: true}),
      footLeg('B', 'B'),
      busLeg('B', 'C'),
    ];
    expect(legInterchangeRisk(1, legs, -300)).toBeUndefined();
  });

  it('catches a missed interchange when the stop place is unknown', () => {
    const legs = [
      {mode: 'bus', fromPlace: {}, toPlace: {}} as Leg,
      busLeg('B', 'C'),
    ];
    expect(legInterchangeRisk(0, legs, -60)).toBe('uncertain');
  });

  it('passes on the last leg', () => {
    const legs = [busLeg('A', 'B')];
    expect(legInterchangeRisk(0, legs, -60)).toBeUndefined();
  });
});
