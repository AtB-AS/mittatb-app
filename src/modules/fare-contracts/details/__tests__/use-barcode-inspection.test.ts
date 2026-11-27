import {act, renderHook} from '@testing-library/react-native';
import {AbtMobileClient} from '@atb/modules/mobile-token';
import {useBarcodeInspection} from '../use-barcode-inspection';

jest.mock('@atb/modules/mobile-token', () => ({
  AbtMobileClient: {
    beginInspection: jest.fn(),
    endInspection: jest.fn(),
  },
  CONTEXT_ID: 'main',
}));

jest.mock('@atb/utils/bugsnag-utils', () => ({
  notifyBugsnag: jest.fn(),
}));

const beginInspection = AbtMobileClient.beginInspection as jest.Mock;
const endInspection = AbtMobileClient.endInspection as jest.Mock;

type Deferred = {resolve: () => void; reject: (err: Error) => void};

/**
 * Makes each `beginInspection` call return a promise the test settles, and
 * records the order of the begin and end calls.
 */
const setUpInspection = () => {
  const calls: string[] = [];
  const begins: Deferred[] = [];
  beginInspection.mockImplementation(() => {
    calls.push(`begin${begins.length + 1}`);
    return new Promise<void>((resolve, reject) => {
      begins.push({resolve, reject});
    });
  });
  endInspection.mockImplementation(() => {
    calls.push('end');
  });
  return {calls, begins};
};

const render = (isActive: boolean) =>
  renderHook(
    ({active}: {active: boolean}) => useBarcodeInspection(active, false),
    {initialProps: {active: isActive}},
  );

describe('useBarcodeInspection', () => {
  beforeEach(() => jest.clearAllMocks());

  it('begins the inspection while active, and ends it on unmount', async () => {
    const {calls, begins} = setUpInspection();
    const hook = render(true);
    await act(async () => begins[0].resolve());

    expect(hook.result.current).toBe(false);
    hook.unmount();
    expect(calls).toEqual(['begin1', 'end']);
  });

  it('does not begin the inspection while inactive', () => {
    setUpInspection();
    render(false);
    expect(beginInspection).not.toHaveBeenCalled();
  });

  it('reports an error when the inspection cannot begin, and clears it when a later one begins', async () => {
    const {begins} = setUpInspection();
    const hook = render(true);
    await act(async () => begins[0].reject(new Error('not started')));
    expect(hook.result.current).toBe(true);

    hook.rerender({active: false});
    hook.rerender({active: true});
    await act(async () => begins[1].resolve());
    expect(hook.result.current).toBe(false);
  });

  it('ends an inspection that begins after becoming inactive', async () => {
    const {calls, begins} = setUpInspection();
    const hook = render(true);
    hook.rerender({active: false});
    await act(async () => begins[0].resolve());

    // The inspection began after the cleanup, so it must be ended again
    expect(calls).toEqual(['begin1', 'end', 'end']);
  });

  it('does not end a newer inspection when an older one begins late', async () => {
    const {calls, begins} = setUpInspection();
    const hook = render(true);
    hook.rerender({active: false});
    hook.rerender({active: true});
    await act(async () => begins[0].resolve());
    await act(async () => begins[1].resolve());

    // The newer inspection must still be running
    expect(calls[calls.length - 1]).toBe('begin2');
  });

  it('does not end the inspection of a newer screen when an older one goes inactive', async () => {
    const {calls, begins} = setUpInspection();
    const screenA = render(true);
    await act(async () => begins[0].resolve());

    // Ticket B is opened, and begins its inspection before A has blurred
    render(true);
    await act(async () => begins[1].resolve());
    screenA.rerender({active: false});

    expect(calls).toEqual(['begin1', 'begin2']);
  });

  it('ignores an error from an inspection that ended', async () => {
    const {begins} = setUpInspection();
    const hook = render(true);
    hook.rerender({active: false});
    await act(async () => begins[0].reject(new Error('not started')));
    expect(hook.result.current).toBe(false);
  });
});
