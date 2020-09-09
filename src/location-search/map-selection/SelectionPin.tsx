import React, {useRef, useEffect} from 'react';
import {Animated, View} from 'react-native';
import {
  SelectionPinConfirm,
  SelectionPinUnknown,
  SelectionPinMove,
  SelectionPinMoveCircle,
} from '../../assets/svg/map';

export type PinMode = 'movestart' | 'moveend' | 'found' | 'nothing';

const AnimatedSelectionPin: React.FC<{mode: PinMode}> = ({mode}) => {
  const pinOffset = useRef(new Animated.Value(-6)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (mode === 'movestart') {
      Animated.parallel([
        Animated.timing(pinOffset, {
          toValue: -12,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (mode === 'moveend') {
      Animated.parallel([
        Animated.timing(pinOffset, {
          toValue: -4,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [mode]);

  return (
    <View>
      <Animated.View style={{transform: [{translateY: pinOffset}]}}>
        <SelectionPin mode={mode} />
      </Animated.View>
      <Animated.View
        style={{
          position: 'absolute',
          bottom: 6,
          left: 16,
          opacity,
        }}
      >
        <SelectionPinMoveCircle />
      </Animated.View>
    </View>
  );
};

const SelectionPin: React.FC<{mode: PinMode}> = ({mode}) => {
  switch (mode) {
    case 'movestart':
    case 'moveend':
      return <SelectionPinMove width={40} height={60} />;
    case 'found':
      return <SelectionPinConfirm width={40} height={60} />;
    case 'nothing':
    default:
      return <SelectionPinUnknown width={40} height={60} />;
  }
};

export default AnimatedSelectionPin;
