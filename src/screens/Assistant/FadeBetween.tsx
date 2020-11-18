import React, {Children, ReactElement, useRef} from 'react';
import {View, ViewStyle} from 'react-native';
import Animated, {
  block,
  Clock,
  clockRunning,
  cond,
  debug,
  Easing,
  set,
  startClock,
  stopClock,
  timing,
  useCode,
  useValue,
  Value,
} from 'react-native-reanimated';

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
  useCode(() => set(progress, runTiming(clock, 0, 1, duration)), [visibleKey]);

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
  const visibleChild = child.key !== visibleKey;

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
    >
      {child}
    </Animated.View>
  );
}

function runTiming(
  clock: Clock,
  from: number,
  to: number,
  duration: number = 400,
) {
  const state = {
    finished: new Value(0),
    position: new Value(from),
    time: new Value(0),
    frameTime: new Value(0),
  };

  const config = {
    duration,
    toValue: new Value<number>(to),
    easing: Easing.linear,
  };

  return block([
    cond(clockRunning(clock), 0, [
      // If the clock isn't running we reset all the animation params and start the clock
      set(state.finished, 0),
      set(state.time, 0),
      set(state.position, from),
      set(state.frameTime, 0),
      set(config.toValue, to),
      startClock(clock),
    ]),
    // we run the step here that is going to update position
    timing(clock, state, config),
    // if the animation is over we stop the clock
    cond(state.finished, debug('stop clock', stopClock(clock))),
    // the block returns the updated position
    state.position,
  ]);
}
