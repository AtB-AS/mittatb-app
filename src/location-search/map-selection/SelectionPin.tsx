import React, {useRef, useEffect} from 'react';
import {Animated, View} from 'react-native';
import {
  SelectionPinConfirm,
  SelectionPinUnknown,
  SelectionPinMove,
  SelectionPinMoveCircle,
} from '../../assets/svg/map';

export type PinMode = 'searching' | 'found' | 'nothing';

const AnimatedSelectionPin: React.FC<{isMoving: boolean; mode: PinMode}> = ({
  isMoving,
  mode,
}) => {
  const pinOffset = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isMoving) {
      animateMove(
        {value: pinOffset, toValue: -6, duration: 100},
        {value: opacity, toValue: 1, duration: 100},
      );
    } else {
      animateMove(
        {value: pinOffset, toValue: 0, duration: 200},
        {value: opacity, toValue: 0, duration: 100},
      );
    }
  }, [isMoving]);

  return (
    <View>
      <Animated.View style={{transform: [{translateY: pinOffset}]}}>
        <SelectionPin mode={mode} />
      </Animated.View>
      <Animated.View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 16,
          opacity,
        }}
      >
        <SelectionPinMoveCircle />
      </Animated.View>
    </View>
  );
};

type AnimationConfig = Pick<
  Animated.TimingAnimationConfig,
  'toValue' | 'duration'
> & {value: Animated.Value};

function animateMove(
  offsetConfig: AnimationConfig,
  opacityConfig: AnimationConfig,
) {
  const {value: offsetValue, ...restOffsetConfig} = offsetConfig;
  const {value: opacityValue, ...restOpacityConfig} = opacityConfig;
  Animated.parallel([
    Animated.timing(offsetValue, {
      ...restOffsetConfig,
      useNativeDriver: true,
    }),
    Animated.timing(opacityValue, {
      ...restOpacityConfig,
      useNativeDriver: true,
    }),
  ]).start();
}

const SelectionPin: React.FC<{mode: PinMode}> = ({mode}) => {
  switch (mode) {
    case 'searching':
      return <SelectionPinMove width={40} height={60} />;
    case 'found':
      return <SelectionPinConfirm width={40} height={60} />;
    case 'nothing':
    default:
      return <SelectionPinUnknown width={40} height={60} />;
  }
};

export default AnimatedSelectionPin;
