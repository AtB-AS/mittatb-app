import React, {useEffect, useRef, useState} from 'react';
import {LayoutChangeEvent, StyleSheet, View} from 'react-native';
import Animated, {Easing, FadeIn} from 'react-native-reanimated';

type Props = {
  children: React.ReactNode[];
  overflow: (hiddenCount: number) => React.ReactNode;
  maxWidth: number;
  gap?: number;
  revealDuration?: number;
};

type FitResult = {
  visibleCount: number;
  needsOverflow: boolean;
};

export const OverflowContainer: React.FC<Props> = ({
  children,
  overflow,
  maxWidth,
  gap = 0,
  revealDuration = 200,
}) => {
  const widthsRef = useRef<(number | null)[]>(
    Array(children.length).fill(null),
  );
  const overflowWidthRef = useRef<number | null>(null);
  const measuredCountRef = useRef(0);

  const [fitResult, setFitResult] = useState<FitResult | null>(null);

  useEffect(() => {
    if (maxWidth === 0) return;
    widthsRef.current = Array(children.length).fill(null);
    overflowWidthRef.current = null;
    measuredCountRef.current = 0;
    setFitResult(null);
  }, [maxWidth, children.length]);

  const tryCompute = () => {
    if (maxWidth === 0) return;

    if (
      measuredCountRef.current < children.length ||
      overflowWidthRef.current === null
    ) {
      return;
    }

    const overflowWidth = overflowWidthRef.current;
    const widths = widthsRef.current as number[];
    let currentWidth = 0;
    let visibleCount = 0;

    for (let i = 0; i < widths.length; i++) {
      const isLast = i === widths.length - 1;
      const gapBefore = i > 0 ? gap : 0;
      const overflowReserve = isLast ? 0 : overflowWidth + gap;

      if (currentWidth + gapBefore + widths[i] + overflowReserve <= maxWidth) {
        currentWidth += gapBefore + widths[i];
        visibleCount++;
      } else {
        break;
      }
    }

    setFitResult({visibleCount, needsOverflow: visibleCount < children.length});
  };

  const handleChildLayout = (index: number, width: number) => {
    if (widthsRef.current[index] !== null) return;
    widthsRef.current[index] = width;
    measuredCountRef.current++;
    tryCompute();
  };

  const handleOverflowLayout = (width: number) => {
    if (overflowWidthRef.current !== null) return;
    overflowWidthRef.current = width;
    tryCompute();
  };

  const entering = FadeIn.duration(revealDuration).easing(
    Easing.out(Easing.ease),
  );

  const hiddenCount = children.length - (fitResult?.visibleCount ?? 0);

  return (
    <View style={[styles.row, {gap}]}>
      {!fitResult && (
        <View
          key={maxWidth}
          style={[styles.measureWrapper, {width: maxWidth}]}
          pointerEvents="none"
        >
          <View style={[styles.row, {gap}]}>
            {children.map((child, i) => (
              <View
                key={i}
                style={styles.measureChild}
                onLayout={(e: LayoutChangeEvent) =>
                  handleChildLayout(i, e.nativeEvent.layout.width)
                }
              >
                {child}
              </View>
            ))}
            <View
              style={styles.measureChild}
              onLayout={(e: LayoutChangeEvent) =>
                handleOverflowLayout(e.nativeEvent.layout.width)
              }
            >
              {overflow(children.length)}
            </View>
          </View>
        </View>
      )}

      {fitResult && (
        <Animated.View style={[styles.row, {gap}]} entering={entering}>
          {children.slice(0, fitResult.visibleCount).map((child, i) => (
            <View key={i}>{child}</View>
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
    overflow: 'hidden',
  },
  measureChild: {
    flexShrink: 0,
    opacity: 0,
  },
});
