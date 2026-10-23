import React from 'react';
import {StyleSheet, View} from 'react-native';
import {
  fireEvent,
  render,
  type RenderResult,
} from '@testing-library/react-native';
import type {ReactTestInstance} from 'react-test-renderer';
import {OverflowContainer} from '../OverflowContainer';

const legs = (count: number) =>
  Array.from({length: count}, (_, i) => (
    <View key={`leg-${i}`} testID={`leg-${i}`} />
  ));
const overflow = () => <View testID="overflow" />;

// Measure-pass children carry onLayout; firing it reports a width for each.
const measureNodes = (view: RenderResult) =>
  view.UNSAFE_root.findAll((n) => typeof n.props?.onLayout === 'function');

const reportWidths = (view: RenderResult, width = 30) =>
  measureNodes(view).forEach((n) =>
    fireEvent(n, 'layout', {
      nativeEvent: {layout: {x: 0, y: 0, width, height: 20}},
    }),
  );

const measurerWidth = (view: RenderResult) =>
  StyleSheet.flatten(
    view.UNSAFE_root.find(
      (n) =>
        typeof n.type === 'string' &&
        n.props?.importantForAccessibility === 'no-hide-descendants',
    ).props.style,
  ).width;

const hasOnLayoutAncestor = (node: ReactTestInstance) => {
  for (let p = node.parent; p; p = p.parent) {
    if (typeof p.props?.onLayout === 'function') return true;
  }
  return false;
};

// Measurer children live under an onLayout wrapper; the visible row does not. A
// leg counts as revealed once it renders outside the measurer — independent of
// either implementation's measurer details (unmounted vs. always-mounted).
const isRevealed = (view: RenderResult, id: string) =>
  view.UNSAFE_root.findAll((n) => n.props?.testID === id).some(
    (n) => !hasOnLayoutAncestor(n),
  );

describe('OverflowContainer', () => {
  it('reveals the children once their widths are reported', () => {
    const view = render(
      <OverflowContainer maxWidth={200} overflow={overflow}>
        {legs(3)}
      </OverflowContainer>,
    );

    expect(isRevealed(view, 'leg-0')).toBe(false);
    reportWidths(view);
    expect(isRevealed(view, 'leg-0')).toBe(true);
  });

  // The bug behind "intermittent blank legs": widths are measured before the
  // parent reports maxWidth (TravelCard starts it at 0). The component must reveal
  // from those widths when the real maxWidth arrives — WITHOUT a second layout
  // pass. The old code discarded the pre-maxWidth widths and got stuck whenever the
  // re-measure didn't land, leaving the row blank.
  it('reveals from widths measured before maxWidth is known, with no re-measure', () => {
    const view = render(
      <OverflowContainer maxWidth={0} overflow={overflow}>
        {legs(3)}
      </OverflowContainer>,
    );
    reportWidths(view);
    expect(isRevealed(view, 'leg-0')).toBe(false); // maxWidth is 0: still measuring

    // Real width arrives; deliberately fire NO new layout events.
    view.rerender(
      <OverflowContainer maxWidth={200} overflow={overflow}>
        {legs(3)}
      </OverflowContainer>,
    );

    expect(isRevealed(view, 'leg-0')).toBe(true);
  });

  it('fires onReady once the row is measured and revealed', () => {
    const onReady = jest.fn();
    const view = render(
      <OverflowContainer maxWidth={200} overflow={overflow} onReady={onReady}>
        {legs(3)}
      </OverflowContainer>,
    );

    expect(onReady).not.toHaveBeenCalled();
    reportWidths(view);
    expect(onReady).toHaveBeenCalledTimes(1);
  });

  // A parent re-render passes new (but equal) children, like the legs in
  // TravelCard every time Results re-renders.
  it('does not fire onReady again when the parent re-renders', () => {
    const onReady = jest.fn();
    const element = () => (
      <OverflowContainer maxWidth={200} overflow={overflow} onReady={onReady}>
        {legs(3)}
      </OverflowContainer>
    );
    const view = render(element());
    reportWidths(view);
    view.rerender(element());

    expect(onReady).toHaveBeenCalledTimes(1);
  });

  // While maxWidth is 0 the children would measure as 0 wide and not be
  // measured again, which broke the "+N" counter.
  it('only constrains the measurer to maxWidth once it is known', () => {
    const view = render(
      <OverflowContainer maxWidth={0} overflow={overflow}>
        {legs(3)}
      </OverflowContainer>,
    );
    expect(measurerWidth(view)).toBeUndefined();

    view.rerender(
      <OverflowContainer maxWidth={200} overflow={overflow}>
        {legs(3)}
      </OverflowContainer>,
    );
    expect(measurerWidth(view)).toBe(200);
  });
});
