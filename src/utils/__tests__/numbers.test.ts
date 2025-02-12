import {formatNumberToString} from '@atb/utils/numbers';
import {Language} from '@atb/translations';

const LANG = Language.Norwegian;

describe('numbers', () => {
  describe('formatPriceToString', () => {
    it('Should not show decimals on whole numbers', () => {
      const result = formatNumberToString(11.0, LANG);
      expect(result).toEqual('11');
    });

    it('Should show two decimals on decimal numbers', () => {
      const result1 = formatNumberToString(10.2, LANG, undefined);
      expect(result1).toEqual('10,20');

      const result2 = formatNumberToString(10.23, LANG);
      expect(result2).toEqual('10,23');

      const result3 = formatNumberToString(10.233, LANG);
      expect(result3).toEqual('10,23');

      const result4 = formatNumberToString(10.237, LANG);
      expect(result4).toEqual('10,24');
    });

    it('Should show decimals on whole numbers if min digits 2', () => {
      const res1 = formatNumberToString(11.0, LANG, 2);
      expect(res1).toEqual('11,00');

      const res2 = formatNumberToString(11, LANG, 2);
      expect(res2).toEqual('11,00');
      const res3 = formatNumberToString(11.0, LANG, 2, 3);
      expect(res3).toEqual('11,00');

      const res4 = formatNumberToString(11, LANG, 2, 3);
      expect(res4).toEqual('11,00');
    });

    it('Should show number of decimals up to given max digits on decimal numbers', () => {
      const result1 = formatNumberToString(10.2, LANG, undefined, 3);
      expect(result1).toEqual('10,20');

      const result2 = formatNumberToString(10.23, LANG, undefined, 3);
      expect(result2).toEqual('10,23');

      const result3 = formatNumberToString(10.233, LANG, undefined, 3);
      expect(result3).toEqual('10,233');

      const result4 = formatNumberToString(10.237, LANG, undefined, 3);
      expect(result4).toEqual('10,237');

      const result5 = formatNumberToString(10.2346, LANG, undefined, 3);
      expect(result5).toEqual('10,235');
    });

    it('Should always round to whole number', () => {
      const result1 = formatNumberToString(10.2, LANG, 0, 0);
      expect(result1).toEqual('10');

      const result2 = formatNumberToString(10.23, LANG, 0, 0);
      expect(result2).toEqual('10');

      const result3 = formatNumberToString(10.233, LANG, 0, 0);
      expect(result3).toEqual('10');

      const result4 = formatNumberToString(10.237, LANG, 0, 0);
      expect(result4).toEqual('10');
    });

    it('Should always show 3 digits', () => {
      const result1 = formatNumberToString(10.2, LANG, 3, 3);
      expect(result1).toEqual('10,200');

      const result2 = formatNumberToString(10.23, LANG, 3, 3);
      expect(result2).toEqual('10,230');

      const result3 = formatNumberToString(10.233, LANG, 3, 3);
      expect(result3).toEqual('10,233');

      const result4 = formatNumberToString(10.2376, LANG, 3, 3);
      expect(result4).toEqual('10,238');
    });

    it('Should always show 1 digit', () => {
      const result1 = formatNumberToString(10, LANG, 1, 1);
      expect(result1).toEqual('10,0');

      const result2 = formatNumberToString(10.23, LANG, 1, 1);
      expect(result2).toEqual('10,2');

      const result3 = formatNumberToString(10.233, LANG, 1, 1);
      expect(result3).toEqual('10,2');
    });

    it('Should show max 1 digit', () => {
      const result1 = formatNumberToString(10, LANG, 0, 1);
      expect(result1).toEqual('10');

      const result2 = formatNumberToString(10.2, LANG, 0, 1);
      expect(result2).toEqual('10,2');

      const result3 = formatNumberToString(10.233, LANG, 0, 1);
      expect(result3).toEqual('10,2');
    });

    it('Should round to whole number', () => {
      const result = formatNumberToString(10.999, LANG);
      expect(result).toEqual('11');
    });

    it('Should let max digits have priority if max is lower than min', () => {
      const result = formatNumberToString(10.234, LANG, 2, 1);
      expect(result).toEqual('10,2');
    });
  });
});
