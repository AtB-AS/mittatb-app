import {getCurrencyMajorName, getCurrencySymbol} from './currency';

describe('getCurrencySymbol', () => {
  it('returns kr for Norway (NOK)', () => {
    expect(getCurrencySymbol('NOK')).toBe('kr');
  });

  it('handles lowercase input for Norway', () => {
    expect(getCurrencySymbol('nok')).toBe('kr');
  });

  it('returns £ for the UK (GBP)', () => {
    expect(getCurrencySymbol('GBP')).toBe('£');
  });

  it('returns kr for Sweden (SEK)', () => {
    expect(getCurrencySymbol('SEK')).toBe('kr');
  });
});

describe('getCurrencyMajorName', () => {
  it('returns singular major unit for Norway (NOK)', () => {
    expect(getCurrencyMajorName(1, 'NOK')).toBe('Krone');
  });

  it('returns plural major unit for Norway (NOK)', () => {
    expect(getCurrencyMajorName(2, 'NOK')).toBe('Kroner');
  });

  it('returns singular and plural major units for the UK (GBP)', () => {
    expect(getCurrencyMajorName(1, 'GBP')).toBe('Pound');
    expect(getCurrencyMajorName(2, 'GBP')).toBe('Pounds');
  });

  it('returns singular and plural major units for Sweden (SEK)', () => {
    expect(getCurrencyMajorName(1, 'SEK')).toBe('Krona');
    expect(getCurrencyMajorName(2, 'SEK')).toBe('Kronor');
  });
});
