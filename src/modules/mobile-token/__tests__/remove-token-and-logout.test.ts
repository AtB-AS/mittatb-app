import {
  MAX_LOGOUT_WAIT_SECONDS,
  removeTokenAndLogout,
} from '../remove-token-and-logout';
import {AbtMobileClient} from '../mobileTokenClient';
import {tokenService} from '../tokenService';
import {clearAttestationRequirement} from '../attestation-requirement';
import {notifyBugsnag} from '@atb/utils/bugsnag-utils';

// The uuid package is ESM only, which Jest doesn't transform here
jest.mock('uuid', () => ({v4: () => 'trace-id'}));

jest.mock('../mobileTokenClient', () => ({
  AbtMobileClient: {logout: jest.fn()},
  CONTEXT_ID: 'main',
}));

jest.mock('../tokenService', () => ({
  tokenService: {removeToken: jest.fn()},
}));

jest.mock('../attestation-requirement', () => ({
  clearAttestationRequirement: jest.fn(),
}));

jest.mock('@atb/utils/bugsnag-utils', () => ({
  notifyBugsnag: jest.fn(),
  logToBugsnag: jest.fn(),
  errorToMetadata: jest.fn(),
}));

const logout = AbtMobileClient.logout as jest.Mock;
const removeToken = tokenService.removeToken as jest.Mock;

/** A promise the test settles itself */
const deferred = () => {
  let resolve!: () => void;
  let reject!: (err: Error) => void;
  const promise = new Promise<void>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return {promise, resolve, reject};
};

const removedTokenIds = () => removeToken.mock.calls.map(([id]) => id);

describe('removeTokenAndLogout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    removeToken.mockResolvedValue(undefined);
    logout.mockResolvedValue(undefined);
  });
  afterEach(() => jest.useRealTimers());

  it('removes the token and logs out of the SDK', async () => {
    const latestTokenId = {current: 'token-1'};
    await removeTokenAndLogout({
      tokenId: 'token-1',
      latestTokenId,
      description: 'test',
    });

    expect(removedTokenIds()).toEqual(['token-1']);
    expect(clearAttestationRequirement).toHaveBeenCalled();
    expect(logout).toHaveBeenCalledWith('main');
  });

  it('only logs out when there is no token', async () => {
    await removeTokenAndLogout({
      tokenId: undefined,
      latestTokenId: {current: undefined},
      description: 'test',
    });

    expect(removeToken).not.toHaveBeenCalled();
    expect(logout).toHaveBeenCalled();
  });

  it('still logs out when removing the token fails', async () => {
    removeToken.mockRejectedValue(new Error('offline'));
    await removeTokenAndLogout({
      tokenId: 'token-1',
      latestTokenId: {current: 'token-1'},
      description: 'test',
    });

    expect(notifyBugsnag).toHaveBeenCalled();
    expect(logout).toHaveBeenCalled();
  });

  it('leaves no timer running after the SDK logout', async () => {
    jest.useFakeTimers();
    await removeTokenAndLogout({
      tokenId: 'token-1',
      latestTokenId: {current: 'token-1'},
      description: 'test',
    });

    expect(jest.getTimerCount()).toBe(0);
  });

  it('stops waiting for a stuck SDK logout', async () => {
    jest.useFakeTimers();
    logout.mockReturnValue(new Promise(() => {}));
    let isDone = false;
    removeTokenAndLogout({
      tokenId: 'token-1',
      latestTokenId: {current: 'token-1'},
      description: 'test',
    }).then(() => (isDone = true));

    await jest.advanceTimersByTimeAsync(MAX_LOGOUT_WAIT_SECONDS * 1000 - 1);
    expect(isDone).toBe(false);
    await jest.advanceTimersByTimeAsync(1);
    expect(isDone).toBe(true);
  });

  it('removes a token created while waiting for the SDK logout', async () => {
    const latestTokenId: {current: string | undefined} = {current: 'token-1'};
    // A running start renews the token before the SDK runs the logout
    logout.mockImplementation(async () => {
      latestTokenId.current = 'token-2';
    });
    await removeTokenAndLogout({
      tokenId: 'token-1',
      latestTokenId,
      description: 'test',
    });

    expect(removedTokenIds()).toEqual(['token-1', 'token-2']);
  });

  it('removes a token created while removing the old one', async () => {
    const latestTokenId: {current: string | undefined} = {current: 'token-1'};
    const firstRemoval = deferred();
    removeToken.mockReturnValueOnce(firstRemoval.promise);
    const done = removeTokenAndLogout({
      tokenId: 'token-1',
      latestTokenId,
      description: 'test',
    });

    // A running start renews the token while the old one is being removed
    latestTokenId.current = 'token-2';
    firstRemoval.resolve();
    await done;

    expect(removedTokenIds()).toEqual(['token-1', 'token-2']);
  });

  it('removes a new token and resolves when the SDK logout fails', async () => {
    const latestTokenId: {current: string | undefined} = {current: 'token-1'};
    logout.mockImplementation(async () => {
      latestTokenId.current = 'token-2';
      throw new Error('native error');
    });

    await expect(
      removeTokenAndLogout({
        tokenId: 'token-1',
        latestTokenId,
        description: 'test',
      }),
    ).resolves.toBeUndefined();
    expect(removedTokenIds()).toEqual(['token-1', 'token-2']);
  });
});
