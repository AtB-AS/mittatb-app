import {computeFit} from '../compute-fit';

describe('computeFit', () => {
  it('shows every child and no badge when they all fit', () => {
    expect(
      computeFit({
        widths: [20, 20, 20],
        overflowWidth: 30,
        maxWidth: 100,
        gap: 0,
      }),
    ).toEqual({visibleCount: 3, needsOverflow: false});
  });

  it('reserves space for the badge and overflows when space is tight', () => {
    const result = computeFit({
      widths: [20, 20, 20],
      overflowWidth: 30,
      maxWidth: 55,
      gap: 0,
    });
    expect(result).toEqual({visibleCount: 1, needsOverflow: true});
    // hidden count is derived by the caller as length - visibleCount
    expect(3 - result.visibleCount).toBe(2);
  });

  it('does not reserve badge space for the last item', () => {
    // The second (last) item only fits because no overflow space is reserved
    // after it; with the reserve it would be pushed out.
    expect(
      computeFit({widths: [20, 20], overflowWidth: 30, maxWidth: 50, gap: 0}),
    ).toEqual({visibleCount: 2, needsOverflow: false});
  });

  it('applies gap only before non-first items', () => {
    const base = {widths: [20, 20], overflowWidth: 10, maxWidth: 45};
    expect(computeFit({...base, gap: 0})).toEqual({
      visibleCount: 2,
      needsOverflow: false,
    });
    // The 10px gap before the second item now pushes it out.
    expect(computeFit({...base, gap: 10})).toEqual({
      visibleCount: 1,
      needsOverflow: true,
    });
  });

  it('shows nothing visible when the first item alone does not fit', () => {
    expect(
      computeFit({widths: [40, 20], overflowWidth: 10, maxWidth: 30, gap: 0}),
    ).toEqual({visibleCount: 0, needsOverflow: true});
  });

  it('handles an empty child set', () => {
    expect(
      computeFit({widths: [], overflowWidth: 10, maxWidth: 100, gap: 0}),
    ).toEqual({visibleCount: 0, needsOverflow: false});
  });

  it('recomputes for a same-length set with different widths (stale-content regression)', () => {
    // The previous implementation reset measurement only on a child-count change,
    // so a same-length swap (e.g. a leg gaining a notification badge, or a
    // different trip at the same list index) kept the stale fit. A pure recompute
    // must reflect the new widths.
    const args = {overflowWidth: 30, maxWidth: 100, gap: 0};
    expect(computeFit({...args, widths: [20, 20, 20]})).toEqual({
      visibleCount: 3,
      needsOverflow: false,
    });
    expect(computeFit({...args, widths: [20, 60, 20]})).toEqual({
      visibleCount: 1,
      needsOverflow: true,
    });
  });
});
