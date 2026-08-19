import {getInterchangeRisk} from '../utils';

describe('Interchange risk evaluator', () => {
  it('passes when there is time to spare', () => {
    expect(getInterchangeRisk(1)).toBeUndefined();
    expect(getInterchangeRisk(600)).toBeUndefined();
  });
  it('catches an uncertain interchange', () => {
    expect(getInterchangeRisk(0)).toBe('uncertain');
    expect(getInterchangeRisk(-60)).toBe('uncertain');
  });
  it('treats -120 seconds as the last uncertain second', () => {
    expect(getInterchangeRisk(-120)).toBe('uncertain');
  });
  it('catches an impossible interchange from -121 seconds', () => {
    expect(getInterchangeRisk(-121)).toBe('impossible');
    expect(getInterchangeRisk(-600)).toBe('impossible');
  });
});
