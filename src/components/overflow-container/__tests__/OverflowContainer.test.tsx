import React, {useEffect} from 'react';
import {View} from 'react-native';
import {
  fireEvent,
  render,
  type RenderResult,
} from '@testing-library/react-native';
import {OverflowContainer} from '../OverflowContainer';

// Minimal mock for the reveal animation OverflowContainer imports from reanimated.
jest.mock('react-native-reanimated', () => {
  const RN = require('react-native');
  const entering = {duration: () => entering, easing: () => entering};
  return {
    __esModule: true,
    default: {View: RN.View},
    FadeIn: entering,
    Easing: {out: () => 0, ease: 0},
  };
});

/**
 * What OverflowContainer does, and what these tests pin down.
 *
 * OverflowContainer shows as many children as fit in `maxWidth`, plus a "+N"
 * overflow badge when some don't. Deciding how many fit needs each child's pixel
 * width, which isn't known until it has been rendered and laid out — so it works
 * in two phases:
 *
 *  1. Measure pass: while `fitResult` is null it renders every child and the
 *     badge invisibly (opacity 0, clipped), purely so React Native fires
 *     `onLayout` for each and reports its width. Widths accumulate in refs; once
 *     every child and the badge have reported, it computes how many fit and sets
 *     `fitResult`.
 *  2. Reveal: with `fitResult` set it renders the real, visible row — the
 *     children that fit, plus the badge if needed.
 *
 * If `fitResult` is never set, only the invisible measure pass renders and the
 * row looks blank. Each shown child therefore mounts twice in the normal flow:
 * once to be measured, then again when the row is revealed.
 *
 * The subtlety these tests guard: React Native delivers `onLayout` when a view
 * mounts (or its layout changes), but not when a view is merely reconciled in
 * place. When the child set changes, OverflowContainer resets its measurement and
 * re-measures — which only completes if the measure pass remounts the children.
 * If the measure pass is reused instead, the surviving children never report
 * layout again, measurement can't finish, and the row stays blank.
 *
 * These tests rely on real React behaviour rather than re-simulating onLayout
 * timing: the "measuring" state is reproduced simply by not firing onLayout, and
 * a child re-running its mount effect is how we observe a remount.
 */

let legMounts: Record<string, number> = {};

// Records its own mounts through the real React lifecycle: a reconciled-in-place
// instance does not re-run this effect, a remounted one does.
function Leg({id}: {id: string}) {
  useEffect(() => {
    legMounts[id] = (legMounts[id] ?? 0) + 1;
  }, [id]);
  return <View testID={id} />;
}

const legs = (count: number) =>
  Array.from({length: count}, (_, i) => <Leg key={i} id={`leg-${i}`} />);
const overflowNode = () => <Leg id="overflow" />;

// In the measure pass every child is wrapped in a View carrying onLayout; the
// settled row carries none, so these nodes also report whether measurement is
// still in progress.
const measureChildren = (view: RenderResult) =>
  view.UNSAFE_root.findAll((n) => typeof n.props?.onLayout === 'function');

describe('OverflowContainer', () => {
  beforeEach(() => {
    legMounts = {};
  });

  it('shows its children once a layout pass reports every width', () => {
    const view = render(
      <OverflowContainer maxWidth={200} overflow={overflowNode}>
        {legs(3)}
      </OverflowContainer>,
    );

    // One layout pass: report a width for every measure child.
    measureChildren(view).forEach((node) =>
      fireEvent(node, 'layout', {
        nativeEvent: {layout: {x: 0, y: 0, width: 30, height: 20}},
      }),
    );

    expect(view.getByTestId('leg-0')).toBeTruthy();
    expect(measureChildren(view)).toHaveLength(0);

    // Each shown leg mounts twice in the normal flow: once in the hidden measure
    // pass, then again when the measured row is revealed.
    [0, 1, 2].forEach((i) => expect(legMounts[`leg-${i}`]).toBe(2));
  });

  // Expected behaviour: a change to the child set re-runs the measure pass,
  // remounting the children so their new widths can be measured.
  it('remounts the measure pass when the child count changes', () => {
    const view = render(
      <OverflowContainer maxWidth={200} overflow={overflowNode}>
        {legs(4)}
      </OverflowContainer>,
    );
    const mountsBefore = legMounts['leg-0'];

    view.rerender(
      <OverflowContainer maxWidth={200} overflow={overflowNode}>
        {legs(3)}
      </OverflowContainer>,
    );

    expect(legMounts['leg-0']).toBeGreaterThan(mountsBefore);
  });
});
