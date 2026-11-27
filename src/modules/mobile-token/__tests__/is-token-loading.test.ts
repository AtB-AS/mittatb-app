import {isTokenLoading} from '../is-token-loading';

const loaded = {
  lifecycleStatus: 'done' as const,
  hasTokenDetails: true,
  hasError: false,
  isStartFailed: false,
  isWaitingForTokenList: false,
};

describe('isTokenLoading', () => {
  it('is loading while the SDK has not started, also while auth is not ready', () => {
    // Without auth the SDK is not started. It must still count as loading,
    // so the timeout that shows the fallback barcode runs.
    expect(isTokenLoading({...loaded, lifecycleStatus: 'pending'})).toBe(true);
  });

  it('is not loading when the SDK has the token', () => {
    expect(isTokenLoading(loaded)).toBe(false);
  });

  it('is loading while the token details have not arrived', () => {
    expect(isTokenLoading({...loaded, hasTokenDetails: false})).toBe(true);
  });

  it('is not loading when starting the SDK failed', () => {
    expect(
      isTokenLoading({...loaded, hasTokenDetails: false, hasError: true}),
    ).toBe(false);
    expect(
      isTokenLoading({...loaded, hasTokenDetails: false, isStartFailed: true}),
    ).toBe(false);
  });

  it('is loading while waiting for the token list', () => {
    expect(isTokenLoading({...loaded, isWaitingForTokenList: true})).toBe(true);
  });
});
