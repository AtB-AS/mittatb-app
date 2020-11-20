import React, {
  Children,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from 'react';
import {Text, View, ViewStyle} from 'react-native';
import Animated, {
  block,
  call,
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
  isParentAnimating?: boolean;
};

export default function FadeBetween({
  style,
  children,
  visibleKey,
  duration,
  isParentAnimating = false,
}: FadeProps) {
  const progress = useValue<number>(0);
  const clock = useRef<Clock>(new Clock()).current;
  const [isAnimating, setIsAnimating] = useState(false);
  const [init, setInit] = useState(false);

  useEffect(() => {
    progress.setValue(1);
    setInit(true);
  }, []);

  useCode(
    () =>
      init && set(progress, runTiming(clock, 0, 1, duration, setIsAnimating)),
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
          isAnimating={isParentAnimating || isAnimating}
        />
      ))}
    </View>
  );
}

function AnimatedChild({
  child,
  visibleKey,
  progress,
  isAnimating,
}: {
  child: ReactElement;
  visibleKey: string;
  progress: Animated.Value<number>;
  isAnimating: boolean;
}) {
  const visibleChild = child.key !== visibleKey;

  const opacity = Animated.interpolate(progress, {
    inputRange: [0, 1],
    outputRange: visibleChild ? [0, 1] : [1, 0],
  });

  const isPreviousChildWhenAnimating =
    (visibleChild && !isAnimating) || (!visibleChild && isAnimating);

  return (
    <Animated.View
      style={{
        position: isPreviousChildWhenAnimating ? 'relative' : 'absolute',
        width: visibleChild && isAnimating ? '100%' : undefined,
        opacity,
      }}
      pointerEvents={visibleChild ? 'auto' : 'none'}
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
  setIsAnimating: (isAnimating: boolean) => void,
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
      call([], () => setIsAnimating(true)),
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
    cond(
      state.finished,
      call([], () => setIsAnimating(false)),
    ),
    // the block returns the updated position
    state.position,
  ]);
}
