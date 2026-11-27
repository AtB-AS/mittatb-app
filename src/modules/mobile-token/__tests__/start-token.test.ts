import {startToken} from '../start-token';
import {AbtMobileClient} from '../mobileTokenClient';
import {storage} from '@atb/modules/storage';

jest.mock('@bugsnag/react-native', () => ({leaveBreadcrumb: jest.fn()}));

jest.mock('@atb/modules/storage', () => ({
  storage: {get: jest.fn(), set: jest.fn()},
}));

jest.mock('../mobileTokenClient', () => ({
  AbtMobileClient: {start: jest.fn(), login: jest.fn()},
  CONTEXT_ID: 'main',
}));

jest.mock('@atb/utils/bugsnag-utils', () => ({
  logToBugsnag: jest.fn(),
  errorToMetadata: jest.fn(),
}));

const getStorage = storage.get as jest.Mock;
const setStorage = storage.set as jest.Mock;
const start = AbtMobileClient.start as jest.Mock;
const login = AbtMobileClient.login as jest.Mock;

describe('startToken', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    start.mockResolvedValue(undefined);
    login.mockResolvedValue(undefined);
  });

  it('starts the stored token for the same user', async () => {
    getStorage.mockResolvedValue('user-a');

    expect(await startToken('user-a')).toBe('started');
    expect(start).toHaveBeenCalledWith('main');
    expect(login).not.toHaveBeenCalled();
  });

  it('logs in for another user', async () => {
    getStorage.mockResolvedValue('user-a');

    expect(await startToken('user-b')).toBe('logged-in');
    expect(login).toHaveBeenCalledWith('main');
    expect(start).not.toHaveBeenCalled();
  });

  it('does not save the user after logging in, as the login may have failed', async () => {
    // The SDK reports a failed login through `errorDetails`, without rejecting
    getStorage.mockResolvedValue('user-a');
    await startToken('user-b');

    expect(setStorage).not.toHaveBeenCalled();
  });

  it('fails when the SDK rejects', async () => {
    getStorage.mockResolvedValue('user-a');
    start.mockRejectedValue(new Error('native error'));

    expect(await startToken('user-a')).toBe('failed');
  });

  it('fails when the storage throws', async () => {
    getStorage.mockRejectedValue(new Error('storage error'));

    expect(await startToken('user-a')).toBe('failed');
  });
});
