import {act, renderHook} from '@testing-library/react-native';
import {
  INITIAL_RENDER_COUNT,
  RENDER_ALL_FALLBACK_MS,
  useProgressiveRendering,
} from '../use-progressive-rendering';

type Props = {count: number; searchKey: string};

const renderProgressiveRendering = (count: number, searchKey = 'search-a') =>
  renderHook(
    ({count, searchKey}: Props) => useProgressiveRendering(count, searchKey),
    {initialProps: {count, searchKey}},
  );

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

  it('keeps rendering all results when more results are added to the same search', () => {
    const hook = renderProgressiveRendering(8);

    markReady(hook, [0, 1, 2, 3, 4]);
    hook.rerender({count: 16, searchKey: 'search-a'});
    expect(hook.result.current.renderAll).toBe(true);
  });

  it('starts over when the results are cleared for a new search', () => {
    const hook = renderProgressiveRendering(12);
    markReady(hook, [0, 1, 2, 3, 4]);

    hook.rerender({count: 0, searchKey: 'search-b'});
    expect(hook.result.current.renderAll).toBe(false);

    hook.rerender({count: 10, searchKey: 'search-b'});
    expect(hook.result.current.renderAll).toBe(false);
    markReady(hook, [0, 1, 2, 3, 4]);
    expect(hook.result.current.renderAll).toBe(true);
  });

  it('starts over when switching straight to the cached results of another search', () => {
    const hook = renderProgressiveRendering(12);
    markReady(hook, [0, 1, 2, 3, 4]);
    expect(hook.result.current.renderAll).toBe(true);

    hook.rerender({count: 12, searchKey: 'search-b'});
    expect(hook.result.current.renderAll).toBe(false);
    markReady(hook, [0, 1, 2, 3]);
    expect(hook.result.current.renderAll).toBe(false);
    markReady(hook, [4]);
    expect(hook.result.current.renderAll).toBe(true);
  });

  it('starts over when switching back to a search that was already shown', () => {
    const hook = renderProgressiveRendering(12);
    markReady(hook, [0, 1, 2, 3, 4]);
    hook.rerender({count: 12, searchKey: 'search-b'});
    markReady(hook, [0, 1, 2, 3, 4]);

    hook.rerender({count: 12, searchKey: 'search-a'});
    expect(hook.result.current.renderAll).toBe(false);
  });

  it('does not count rows that were ready in the previous search', () => {
    const hook = renderProgressiveRendering(12);
    markReady(hook, [0, 1, 2]);

    hook.rerender({count: 12, searchKey: 'search-b'});
    markReady(hook, [3, 4]);
    expect(hook.result.current.renderAll).toBe(false);
  });

  it('restarts the fallback delay for a new search', () => {
    const hook = renderProgressiveRendering(12);
    act(() => jest.advanceTimersByTime(RENDER_ALL_FALLBACK_MS - 500));

    hook.rerender({count: 12, searchKey: 'search-b'});
    act(() => jest.advanceTimersByTime(500));
    expect(hook.result.current.renderAll).toBe(false);
    act(() => jest.advanceTimersByTime(RENDER_ALL_FALLBACK_MS - 500));
    expect(hook.result.current.renderAll).toBe(true);
  });
});
