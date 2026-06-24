import React, {useCallback, useEffect, useState} from 'react';
import {LayoutChangeEvent, StyleSheet, View} from 'react-native';
import Animated, {Easing, FadeIn} from 'react-native-reanimated';
import {computeFit, FitResult} from './compute-fit';

type Props = {
  children: React.ReactNode[];
  overflow: (hiddenCount: number) => React.ReactNode;
  maxWidth: number;
  gap?: number;
  revealDuration?: number;
  // Fired once the fitted row is measured and revealed, so a parent can swap a
  // placeholder (e.g. a skeleton) for the real content.
  onReady?: () => void;
};

export const OverflowContainer: React.FC<Props> = ({
  children,
  overflow,
  maxWidth,
  gap = 0,
  revealDuration = 200,
  onReady,
}) => {
  const [widthByKey, setWidthByKey] = useState<Record<string, number>>({});
  const [overflowWidth, setOverflowWidth] = useState<number>();

  const items = React.Children.toArray(children);
  const orderedKeys = items.map((child, i) =>
    React.isValidElement(child) && child.key != null ? child.key : `__idx_${i}`,
  );

  // Derived during render; null until maxWidth and all child widths are in.
  const widths = orderedKeys
    .map((k) => widthByKey[k])
    .filter((w): w is number => w != null);
  const fitResult: FitResult | null =
    maxWidth > 0 &&
    overflowWidth != null &&
    widths.length === orderedKeys.length
      ? computeFit({widths, overflowWidth, maxWidth, gap})
      : null;

  const onReadyMemo = useCallback(() => onReady?.(), [onReady]);
  useEffect(() => {
    if (fitResult != null) {
      onReadyMemo();
    }
  }, [fitResult, onReadyMemo]);

  const entering = FadeIn.duration(revealDuration).easing(
    Easing.out(Easing.ease),
  );

  const hiddenCount = items.length - (fitResult?.visibleCount ?? 0);

  return (
    <View style={[styles.row, {gap}]}>
      {/* Hidden, out-of-flow measurer; onLayout keeps widthByKey fresh. */}
      <View
        style={[styles.measureWrapper, {width: maxWidth}]}
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <View style={[styles.row, {gap}]}>
          {items.map((child, i) => (
            <View
              key={orderedKeys[i]}
              style={styles.measureChild}
              onLayout={(e: LayoutChangeEvent) => {
                const width = e.nativeEvent.layout.width;
                const key = orderedKeys[i];
                setWidthByKey((prev) =>
                  prev[key] === width ? prev : {...prev, [key]: width},
                );
              }}
            >
              {child}
            </View>
          ))}
          <View
            style={styles.measureChild}
            onLayout={(e: LayoutChangeEvent) => {
              const width = e.nativeEvent.layout.width;
              setOverflowWidth((prev) => (prev === width ? prev : width));
            }}
          >
            {overflow(items.length)}
          </View>
        </View>
      </View>

      {fitResult && (
        <Animated.View style={[styles.row, {gap}]} entering={entering}>
          {items.slice(0, fitResult.visibleCount).map((child, i) => (
            <View key={orderedKeys[i]}>{child}</View>
          ))}
          {fitResult.needsOverflow && overflow(hiddenCount)}
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  measureWrapper: {
    position: 'absolute',
    overflow: 'hidden',
  },
  measureChild: {
    flexShrink: 0,
    opacity: 0,
  },
});
