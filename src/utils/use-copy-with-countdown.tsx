import Clipboard from '@react-native-clipboard/clipboard';
import React, {PropsWithChildren, useRef, useState} from 'react';
import Animated, {
  Clock,
  EasingNode,
  set,
  useCode,
  useValue,
} from 'react-native-reanimated';
import {runTiming} from './run-timing';

export function useCopyWithOpacityFade(duration: number = 500) {
  const opacity = useValue<number>(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const clock = useRef<Clock>(new Clock()).current;

  useCode(
    () =>
      isAnimating &&
      set(
        opacity,
        runTiming({
          clock,
          from: 1,
          to: 0,
          duration,
          easing: EasingNode.quad,
          callback: () => setIsAnimating(false),
        }),
      ),
    [isAnimating],
  );

  function setClipboard(content: string) {
    Clipboard.setString(content);
    setIsAnimating(true);
  }

  function FadeContainer({children}: PropsWithChildren<{}>) {
    return <Animated.View style={{opacity}}>{children}</Animated.View>;
  }

  return {
    setClipboard,
    isAnimating,
    FadeContainer,
  };
}
