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
};

export default function FadeBetween({
  style,
  children,
  visibleKey,
  duration,
}: FadeProps) {
  const progress = useValue<number>(0);
  const clock = useRef<Clock>(new Clock()).current;
  const [init, setInit] = useState(false);

  useEffect(() => {
    progress.setValue(1);
    setInit(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useCode(
    () => init && set(progress, runTiming({clock, from: 0, to: 1, duration})),
    [visibleKey],
  );

  return (
    <View style={style}>
      {Children.map(children, (child) => (
        <AnimatedChild
          key={child.key!}
          child={child}
          visibleKey={visibleKey}
          progress={progress}
        />
      ))}
    </View>
  );
}

function AnimatedChild({
  child,
  visibleKey,
  progress,
}: {
  child: ReactElement;
  visibleKey: string;
  progress: Animated.Value<number>;
}) {
  const visibleChild = child.key === visibleKey;

  const opacity = Animated.interpolate(progress, {
    inputRange: [0, 1],
    outputRange: visibleChild ? [0, 1] : [1, 0],
  });

  return (
    <Animated.View
      style={{
        position: visibleChild ? 'relative' : 'absolute',
        opacity,
      }}
      pointerEvents={visibleChild ? 'auto' : 'none'}
    >
      {child}
    </Animated.View>
  );
}
