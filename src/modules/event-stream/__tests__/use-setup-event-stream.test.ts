import {act, renderHook} from '@testing-library/react-native';
import {useSetupEventStream} from '../use-setup-event-stream';
import {getIdTokenGlobal} from '../../auth';
import {useSubscription, SubscriptionProps} from '@atb/api/use-subscription';
import {EventKind} from '../types';

// The stream event types transitively pull in native image libs via
// `@atb/api/types/mobility`, which Jest can't run.
jest.mock('@atb/utils/image', () => {
  const {z} = require('zod');
  return {Base64ImageSchema: z.string()};
});
jest.mock('@atb/api/use-subscription', () => ({
  useSubscription: jest.fn(),
}));
jest.mock('../../auth', () => ({
  getIdTokenGlobal: jest.fn(),
  isIdTokenRefreshEnabled: () => true,
  useAuthContext: () => ({authStatus: 'authenticated'}),
}));
jest.mock('@atb/modules/feature-toggles', () => ({
  useFeatureTogglesContext: () => ({isEventStreamEnabled: true}),
}));
jest.mock('@bugsnag/react-native', () => ({
  leaveBreadcrumb: jest.fn(),
}));

const mockUseSubscription = useSubscription as jest.Mock;
const mockGetIdTokenGlobal = getIdTokenGlobal as jest.Mock;

function getSubscriptionProps(): SubscriptionProps {
  return mockUseSubscription.mock.lastCall[0];
}

function createWebSocket() {
  return {readyState: WebSocket.OPEN, send: jest.fn()} as unknown as WebSocket;
}

function open(ws = createWebSocket()) {
  act(() => getSubscriptionProps().onOpen?.(ws));
  return ws;
}

function close() {
  act(() =>
    getSubscriptionProps().onClose?.({code: 1006} as WebSocketCloseEvent),
  );
}

describe('useSetupEventStream reconnect', () => {
  const callback = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    mockUseSubscription.mockClear();
    mockGetIdTokenGlobal.mockReturnValue('token');
    callback.mockClear();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('does not call reconnect listeners on the first open', () => {
    const {result} = renderHook(() => useSetupEventStream());
    act(() => result.current.subscribeToReconnect({id: 'test', callback}));

    open();

    expect(callback).not.toHaveBeenCalled();
  });

  it('calls reconnect listeners when opened after a close', () => {
    const {result} = renderHook(() => useSetupEventStream());
    act(() => result.current.subscribeToReconnect({id: 'test', callback}));

    open();
    close();
    open();

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('only calls reconnect listeners once per reconnect', () => {
    const {result} = renderHook(() => useSetupEventStream());
    act(() => result.current.subscribeToReconnect({id: 'test', callback}));

    open();
    close();
    open();
    open();

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('calls reconnect listeners after AUTH is sent', () => {
    mockGetIdTokenGlobal.mockReturnValue(undefined);
    const {result} = renderHook(() => useSetupEventStream());
    act(() => result.current.subscribeToReconnect({id: 'test', callback}));

    open();
    close();
    const ws = open();
    expect(callback).not.toHaveBeenCalled();

    mockGetIdTokenGlobal.mockReturnValue('token');
    act(() => jest.advanceTimersByTime(1000));

    expect(ws.send).toHaveBeenCalledWith('AUTH token');
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('calls reconnect listeners if the websocket is replaced while waiting for a token', () => {
    mockGetIdTokenGlobal.mockReturnValue(undefined);
    const {result} = renderHook(() => useSetupEventStream());
    act(() => result.current.subscribeToReconnect({id: 'test', callback}));

    open();
    close();
    const replacedWs = open();
    // Replaced without `onClose`, like `useSubscription` does on cleanup.
    (replacedWs as {readyState: number}).readyState = WebSocket.CLOSED;
    open();

    mockGetIdTokenGlobal.mockReturnValue('token');
    act(() => jest.advanceTimersByTime(1000));

    expect(replacedWs.send).not.toHaveBeenCalled();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('does not call unsubscribed reconnect listeners', () => {
    const {result} = renderHook(() => useSetupEventStream());
    act(() => result.current.subscribeToReconnect({id: 'test', callback}));
    act(() => result.current.unsubscribeFromReconnect('test'));

    open();
    close();
    open();

    expect(callback).not.toHaveBeenCalled();
  });

  it('keeps stable callbacks when subscribing listeners', () => {
    const {result} = renderHook(() => useSetupEventStream());
    const {onMessage, onOpen, onClose} = getSubscriptionProps();

    act(() => result.current.subscribeToReconnect({id: 'test', callback}));
    act(() =>
      result.current.subscribe({
        id: 'test',
        eventKind: EventKind.FareContract,
        callback: jest.fn(),
      }),
    );

    expect(getSubscriptionProps().onMessage).toBe(onMessage);
    expect(getSubscriptionProps().onOpen).toBe(onOpen);
    expect(getSubscriptionProps().onClose).toBe(onClose);
  });
});
