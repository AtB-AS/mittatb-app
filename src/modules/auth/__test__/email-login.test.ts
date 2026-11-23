import {isLoggedInAuthenticationType, mapAuthenticationType} from '../utils';
import {
  clearEmailLoginSession,
  formatCountdown,
  getPendingEmailCode,
  getPendingEmailPassword,
  isValidPassword,
  sanitizeEmailCode,
  setPendingEmailCode,
  setPendingEmailPassword,
} from '../email-login-session';

// utils imports the time module, which pulls in the API client and @env.
jest.mock('@atb/modules/time', () => ({
  getServerNowGlobal: () => Date.now(),
}));

const user = (fields: object) => fields as any;

describe('mapAuthenticationType', () => {
  it('prefers phone when the user has both phone and e-mail', () => {
    expect(
      mapAuthenticationType(
        user({phoneNumber: '+4799999999', email: 'a@b.no'}),
      ),
    ).toBe('phone');
  });

  it('maps an e-mail user to email', () => {
    expect(
      mapAuthenticationType(user({email: 'a@b.no', isAnonymous: false})),
    ).toBe('email');
  });

  it('maps an anonymous user to anonymous', () => {
    expect(mapAuthenticationType(user({isAnonymous: true}))).toBe('anonymous');
  });

  it('maps a missing user to none', () => {
    expect(mapAuthenticationType(undefined)).toBe('none');
  });
});

describe('isLoggedInAuthenticationType', () => {
  it('treats phone and email as logged in', () => {
    expect(isLoggedInAuthenticationType('phone')).toBe(true);
    expect(isLoggedInAuthenticationType('email')).toBe(true);
    expect(isLoggedInAuthenticationType('anonymous')).toBe(false);
    expect(isLoggedInAuthenticationType('none')).toBe(false);
  });
});

describe('isValidPassword', () => {
  it('requires 8 to 128 characters', () => {
    expect(isValidPassword('1234567')).toBe(false);
    expect(isValidPassword('12345678')).toBe(true);
    expect(isValidPassword('a'.repeat(128))).toBe(true);
    expect(isValidPassword('a'.repeat(129))).toBe(false);
  });

  it('counts characters, not UTF-16 units', () => {
    // 4 emoji are 8 UTF-16 units but only 4 characters
    expect(isValidPassword('😀😀😀😀')).toBe(false);
  });
});

describe('sanitizeEmailCode', () => {
  it('keeps pasted codes with spaces or dashes', () => {
    expect(sanitizeEmailCode('123 456')).toBe('123456');
    expect(sanitizeEmailCode(' 123-456 ')).toBe('123456');
  });

  it('limits to six digits', () => {
    expect(sanitizeEmailCode('1234567')).toBe('123456');
  });

  it('drops letters', () => {
    expect(sanitizeEmailCode('12a3')).toBe('123');
  });
});

describe('formatCountdown', () => {
  it('formats seconds as m:ss', () => {
    expect(formatCountdown(42)).toBe('0:42');
    expect(formatCountdown(60)).toBe('1:00');
    expect(formatCountdown(5.2)).toBe('0:06');
    expect(formatCountdown(-3)).toBe('0:00');
  });
});

describe('e-mail login session', () => {
  it('holds code and password until cleared', () => {
    setPendingEmailCode('123456');
    setPendingEmailPassword('secret-password');
    expect(getPendingEmailCode()).toBe('123456');
    expect(getPendingEmailPassword()).toBe('secret-password');

    clearEmailLoginSession();
    expect(getPendingEmailCode()).toBeUndefined();
    expect(getPendingEmailPassword()).toBeUndefined();
  });
});
