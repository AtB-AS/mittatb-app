import {act, renderHook} from '@testing-library/react-native';
import {
  INITIAL_RENDER_COUNT,
  RENDER_ALL_FALLBACK_MS,
  useProgressiveRendering,
} from '../use-progressive-rendering';

const renderProgressiveRendering = (numberOfResults: number) =>
  renderHook(({count}: {count: number}) => useProgressiveRendering(count), {
    initialProps: {count: numberOfResults},
  });

const markReady = (
  hook: ReturnType<typeof renderProgressiveRendering>,
  indexes: number[],
) =>
  act(() => {
    indexes.forEach((i) => hook.result.current.onInitialRowReady(i));
  });

describe('useProgressiveRendering', () => {
  beforeAll(() => jest.useFakeTimers());
  beforeEach(() => jest.clearAllTimers());
  afterAll(() => jest.useRealTimers());

  it('renders all results once the initial rows are ready', () => {
    const hook = renderProgressiveRendering(12);
    expect(INITIAL_RENDER_COUNT).toBe(5);

    expect(hook.result.current.renderAll).toBe(false);
    markReady(hook, [0, 1, 2, 3]);
    expect(hook.result.current.renderAll).toBe(false);
    markReady(hook, [4]);
    expect(hook.result.current.renderAll).toBe(true);
  });

  it('counts a row being ready more than once only once', () => {
    const hook = renderProgressiveRendering(12);

    markReady(hook, [0, 0, 1, 1, 2, 2, 3, 3]);
    expect(hook.result.current.renderAll).toBe(false);
  });

  it('only waits for the existing rows when there are fewer results than the initial count', () => {
    const hook = renderProgressiveRendering(3);

    markReady(hook, [0, 1]);
    expect(hook.result.current.renderAll).toBe(false);
    markReady(hook, [2]);
    expect(hook.result.current.renderAll).toBe(true);
  });

  it('waits for the initial rows when the results arrive after mounting', () => {
    const hook = renderProgressiveRendering(0);

    hook.rerender({count: 12});
    expect(hook.result.current.renderAll).toBe(false);
    markReady(hook, [0, 1, 2, 3, 4]);
    expect(hook.result.current.renderAll).toBe(true);
  });

  it('renders all results after the fallback delay if the rows never get ready', () => {
    const hook = renderProgressiveRendering(12);

    act(() => jest.advanceTimersByTime(RENDER_ALL_FALLBACK_MS - 1));
    expect(hook.result.current.renderAll).toBe(false);
    act(() => jest.advanceTimersByTime(1));
    expect(hook.result.current.renderAll).toBe(true);
  });

  it('does not start the fallback delay without results', () => {
    const hook = renderProgressiveRendering(0);

    act(() => jest.advanceTimersByTime(RENDER_ALL_FALLBACK_MS * 2));
    expect(hook.result.current.renderAll).toBe(false);
  });

  it('keeps rendering all results when more results are added', () => {
    const hook = renderProgressiveRendering(8);

    markReady(hook, [0, 1, 2, 3, 4]);
    hook.rerender({count: 16});
    expect(hook.result.current.renderAll).toBe(true);
  });
});
