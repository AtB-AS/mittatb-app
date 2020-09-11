import React, {useRef, useEffect, useCallback, useMemo} from 'react';
import {View} from 'react-native';
import Animated, {
  timing,
  Easing,
  Clock,
  cond,
  set,
  not,
  block,
  interpolate,
  startClock,
  clockRunning,
  debug,
  stopClock,
  Value,
  useCode,
  useValue,
} from 'react-native-reanimated';
import {
  SelectionPinConfirm,
  SelectionPinUnknown,
  SelectionPinMove,
  SelectionPinShadow,
} from '../../assets/svg/map';

export type PinMode = 'searching' | 'found' | 'nothing';

const AnimatedSelectionPin: React.FC<{isMoving: boolean; mode: PinMode}> = ({
  isMoving,
  mode,
}) => {
  const animation = useValue<number>(0);
  const clock = useRef<Clock>(new Clock()).current;
  useCode(
    () => set(animation, runTiming(clock, isMoving ? 0 : 1, isMoving ? 1 : 0)),
    [isMoving],
  );

  const pinOffset = useRef(
    interpolate(animation, {
      inputRange: [0, 1],
      outputRange: [0, -6],
    }),
  ).current;

  const scale = useRef(
    interpolate(animation, {
      inputRange: [0, 1],
      outputRange: [2, 1],
    }),
  ).current;

  return (
    <View>
      <Animated.View
        style={{
          transform: [{translateY: pinOffset}],
          zIndex: 1,
        }}
      >
        <SelectionPin mode={mode} />
      </Animated.View>
      <Animated.View
        style={{
          position: 'absolute',
          bottom: -2,
          left: 14,
          transform: [{scaleX: scale}, {scaleY: scale}],
        }}
      >
        <SelectionPinShadow width={12} height={4} />
      </Animated.View>
    </View>
  );
};

function runTiming(clock: Clock, from: number, to: number) {
  const state = {
    finished: new Value(0),
    position: new Value(from),
    time: new Value(0),
    frameTime: new Value(0),
  };

  const config = {
    duration: 200,
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
    // we made the block return the updated position
    state.position,
  ]);
}

const SelectionPin: React.FC<{mode: PinMode}> = ({mode}) => {
  switch (mode) {
    case 'searching':
      return <SelectionPinMove width={40} height={40} />;
    case 'found':
      return <SelectionPinConfirm width={40} height={40} />;
    case 'nothing':
    default:
      return <SelectionPinUnknown width={40} height={40} />;
  }
};

export default AnimatedSelectionPin;
