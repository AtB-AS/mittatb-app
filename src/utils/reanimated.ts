import Animated, {
  add,
  Value,
  Clock,
  block,
  cond,
  not,
  clockRunning,
  set,
  timing,
  startClock,
  stopClock,
} from 'react-native-reanimated';

export interface TimingParams {
  clock?: Animated.Clock;
  from?: Animated.Adaptable<number>;
  to?: Animated.Adaptable<number>;
  duration?: Animated.Adaptable<number>;
  easing?: (v: Animated.Adaptable<number>) => Animated.Node<number>;
}

export const runTiming = (params: TimingParams) => {
  const {clock, easing, duration, from, to} = {
    clock: new Clock(),
    duration: 250,
    from: 0,
    to: 1,
    easing: (v: Animated.Adaptable<number>) => add(v, 0),
    ...params,
  };

  const state: Animated.TimingState = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0),
  };

  const config = {
    toValue: new Value(0),
    duration,
    easing,
  };

  return block([
    cond(not(clockRunning(clock)), [
      set(config.toValue, to),
      set(state.frameTime, 0),
    ]),
    block([
      cond(not(clockRunning(clock)), [
        set(state.finished, 0),
        set(state.time, 0),
        set(state.position, from),
        startClock(clock),
      ]),
      timing(clock, state, config),
      cond(state.finished, stopClock(clock)),
      state.position,
    ]),
  ]);
};
