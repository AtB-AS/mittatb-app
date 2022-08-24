import Animated, {
  block,
  call,
  Clock,
  clockRunning,
  cond,
  debug,
  Easing,
  EasingNode,
  set,
  startClock,
  stopClock,
  timing,
  Value,
} from 'react-native-reanimated';

export default function runTiming(timingConfig: {
  clock: Clock;
  from: number;
  to: number;
  duration?: number;
  easing?: Animated.EasingNodeFunction;
  callback?: () => void;
}) {
  const {clock, from, to, duration, easing, callback} = timingConfig;
  const state = {
    finished: new Value(0),
    position: new Value(from),
    time: new Value(0),
    frameTime: new Value(0),
  };

  const config = {
    duration: duration ?? 400,
    toValue: new Value<number>(to),
    easing: easing ?? EasingNode.linear,
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
    cond(
      state.finished,
      debug(
        'stop clock',
        block([stopClock(clock), call([], () => callback?.())]),
      ),
    ),
    // the block returns the updated position
    state.position,
  ]);
}
