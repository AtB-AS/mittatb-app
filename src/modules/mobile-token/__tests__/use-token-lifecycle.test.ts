import {act, renderHook} from '@testing-library/react-native';
import {useTokenLifecycle} from '../use-token-lifecycle';
import {startToken} from '../start-token';

jest.mock('../start-token', () => ({startToken: jest.fn()}));

const mockStartToken = startToken as jest.Mock;

type Props = {enabled: boolean; userId: string; retryCount: number};

const latestTokenId = {current: 'token-before' as string | undefined};
const onLogin = jest.fn();

const render = (props: Props) =>
  renderHook((p: Props) => useTokenLifecycle({...p, latestTokenId, onLogin}), {
    initialProps: props,
  });

/** Makes `startToken` return a promise the test settles itself */
const deferStart = () => {
  const results: ((result: string) => void)[] = [];
  mockStartToken.mockImplementation(
    () => new Promise((resolve) => results.push(resolve)),
  );
  return results;
};

describe('useTokenLifecycle', () => {
  beforeEach(() => jest.clearAllMocks());

  it('starts the SDK when enabled, and is done when it has started', async () => {
    const results = deferStart();
    const hook = render({enabled: true, userId: 'user-a', retryCount: 0});
    expect(mockStartToken).toHaveBeenCalledWith('user-a');
    expect(hook.result.current.lifecycleStatus).toBe('pending');

    await act(async () => results[0]('started'));
    expect(hook.result.current.lifecycleStatus).toBe('done');
    expect(hook.result.current.isStartFailed).toBe(false);
  });

  it('does not start the SDK while disabled', () => {
    deferStart();
    const hook = render({enabled: false, userId: 'user-a', retryCount: 0});

    expect(mockStartToken).not.toHaveBeenCalled();
    expect(hook.result.current.lifecycleStatus).not.toBe('done');
  });

  it('stays done when it is briefly disabled for the same user', async () => {
    const results = deferStart();
    const hook = render({enabled: true, userId: 'user-a', retryCount: 0});
    await act(async () => results[0]('started'));

    // For example while auth fetches a new id token
    hook.rerender({enabled: false, userId: 'user-a', retryCount: 0});
    expect(hook.result.current.lifecycleStatus).toBe('done');

    hook.rerender({enabled: true, userId: 'user-a', retryCount: 0});
    expect(hook.result.current.lifecycleStatus).toBe('done');
    expect(mockStartToken).toHaveBeenCalledTimes(1);
  });

  it('starts the SDK again on retry', async () => {
    const results = deferStart();
    const hook = render({enabled: true, userId: 'user-a', retryCount: 0});
    await act(async () => results[0]('failed'));
    expect(hook.result.current.isStartFailed).toBe(true);

    hook.rerender({enabled: true, userId: 'user-a', retryCount: 1});
    expect(mockStartToken).toHaveBeenCalledTimes(2);
    expect(hook.result.current.lifecycleStatus).toBe('pending');
    expect(hook.result.current.isStartFailed).toBe(false);
  });

  it('starts the SDK for a new user', async () => {
    const results = deferStart();
    const hook = render({enabled: true, userId: 'user-a', retryCount: 0});
    await act(async () => results[0]('started'));

    hook.rerender({enabled: true, userId: 'user-b', retryCount: 0});
    expect(mockStartToken).toHaveBeenLastCalledWith('user-b');
    expect(hook.result.current.lifecycleStatus).toBe('pending');
  });

  it('starts the SDK again after the run is reset', async () => {
    const results = deferStart();
    const hook = render({enabled: true, userId: 'user-a', retryCount: 0});
    await act(async () => results[0]('started'));

    // At logout the run is reset while it is disabled
    hook.rerender({enabled: false, userId: 'user-a', retryCount: 0});
    act(() => hook.result.current.resetRun());
    hook.rerender({enabled: true, userId: 'user-a', retryCount: 0});
    expect(mockStartToken).toHaveBeenCalledTimes(2);
  });

  it('reports a login with the token id from before it', async () => {
    const results = deferStart();
    render({enabled: true, userId: 'user-b', retryCount: 0});
    await act(async () => results[0]('logged-in'));

    expect(onLogin).toHaveBeenCalledWith('user-b', 'token-before');
  });
});
