import runTiming from '@atb/utils/run-timing';
import React, {
  Children,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from 'react';
import {View, ViewStyle} from 'react-native';
import Animated, {Clock, set, useCode, useValue} from 'react-native-reanimated';

type FadeProps = {
  visibleKey: string;
  style?: ViewStyle;
  children: [ReactElement, ReactElement];
  duration?: number;
  preserveHeightFrom?: string; // key for the element that sets the height. set to tallest element to prevent timing and animation issues.
};

export default function FadeBetween({
  style,
  children,
  visibleKey,
  duration,
  preserveHeightFrom,
}: FadeProps) {
  const progress = useValue<number>(1);
  const clock = useRef<Clock>(new Clock()).current;
  const [init, setInit] = useState(false);

  const fadeToTop = visibleKey === children[0].key;

  useEffect(() => {
    progress.setValue(1);
    setInit(true);
  }, []);

  useCode(
    () =>
      init &&
      set(
        progress,
        runTiming({
          clock,
          from: fadeToTop ? 0 : 1,
          to: fadeToTop ? 1 : 0,
          duration,
        }),
      ),
    [visibleKey],
  );

  const progressTop = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const progressBottom = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  return (
    <View style={style}>
      {Children.map(children, (child, idx) => (
        <AnimatedChild
          key={child.key!}
          child={child}
          visibleKey={visibleKey}
          progress={idx === 0 ? progressTop : progressBottom}
          preserveHeight={preserveHeightFrom === child.key}
        />
      ))}
    </View>
  );
}

function AnimatedChild({
  child,
  visibleKey,
  progress,
  preserveHeight,
}: {
  child: ReactElement;
  visibleKey: string;
  progress: Animated.Node<number>;
  preserveHeight: boolean;
}) {
  const visibleChild = child.key === visibleKey;

  return (
    <Animated.View
      style={{
        opacity: progress,
        width: '100%',
        position: preserveHeight ? 'relative' : 'absolute',
      }}
      pointerEvents={visibleChild ? 'auto' : 'none'}
    >
      {child}
    </Animated.View>
  );
}
