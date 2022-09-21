import {
  SelectionPinConfirm,
  SelectionPinMove,
  SelectionPinShadow,
  SelectionPinUnknown,
} from '@atb/assets/svg/color/map';
import React, {useEffect, useRef} from 'react';
import {Animated, View} from 'react-native';

export type PinMode = 'searching' | 'found' | 'nothing';

const AnimatedSelectionPin: React.FC<{isMoving: boolean; mode: PinMode}> = ({
  isMoving,
  mode,
}) => {
  const pinOffset = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isMoving) {
      animateMove(
        {value: pinOffset, toValue: -6, duration: 100},
        {value: scale, toValue: 1, duration: 100},
      );
    } else {
      animateMove(
        {value: pinOffset, toValue: 0, duration: 200},
        {value: scale, toValue: 2, duration: 100},
      );
    }
  }, [isMoving]);

  return (
    <View>
      <Animated.View style={{transform: [{translateY: pinOffset}], zIndex: 1}}>
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
      return <SelectionPinMove width={40} height={40} />;
    case 'found':
      return <SelectionPinConfirm width={40} height={40} />;
    case 'nothing':
    default:
      return <SelectionPinUnknown width={40} height={40} />;
  }
};

export default AnimatedSelectionPin;
