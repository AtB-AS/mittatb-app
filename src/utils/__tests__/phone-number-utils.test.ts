import {
  formatPhoneNumber,
  getParsedPrefixAndPhoneNumber,
} from '../phone-number-utils';

describe('phoneNumberUtils', () => {
  describe('formatPhoneNumber', () => {
    it('Should return a formatted a valid phone number', () => {
      const phoneNumber = '+4744444444';
      const formattedNumber = formatPhoneNumber(phoneNumber);
      expect(formattedNumber).toEqual('+47 44 44 44 44');
    });
    it('Should not format, but return an invalid phonenumber', () => {
      const phoneNumber = '12345';
      const formattedNumber = formatPhoneNumber(phoneNumber);
      expect(formattedNumber).toEqual('12345');
    });
  });

  describe('getParsedPrefixAndPhoneNumber', () => {
    it('Should return prefix and number for a valid phone number', () => {
      const phoneNumber = '+4744444444';
      const formattedNumber = getParsedPrefixAndPhoneNumber(phoneNumber);
      expect(formattedNumber.prefix).toEqual('47');
      expect(formattedNumber.phoneNumber).toEqual('44444444');
    });

    it('Should return just the number for an invalid phone number', () => {
      const phoneNumber = '12345';
      const formattedNumber = getParsedPrefixAndPhoneNumber(phoneNumber);
      expect(formattedNumber.prefix).toEqual(undefined);
      expect(formattedNumber.phoneNumber).toEqual('12345');
    });
  });
});
