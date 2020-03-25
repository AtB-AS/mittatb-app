import * as React from 'react';
import Svg, {Ellipse, SvgProps, Color} from 'react-native-svg';
import {Animated, NativeMethodsMixinStatic} from 'react-native';
import {useEffect, useRef} from 'react';

export type LegTransportMethodIconProps = SvgProps & {
  borderColor?: Color;
  isLive?: boolean;
};

let AnimatedCircle = Animated.createAnimatedComponent(Ellipse);

const LegTransportMethodIcon: React.FC<LegTransportMethodIconProps> = ({
  borderColor = '#A2AD00',
  isLive = true,
  children,
  ...props
}) => {
  const cicleRef = useCirclePulseAnimation({isAnimating: isLive});

  return (
    <Svg width={28} height={28} viewBox="0 0 28 28" fill="none" {...props}>
      <AnimatedCircle
        ref={cicleRef}
        opacity="0.5"
        cx="14"
        cy="14"
        rx="14"
        ry="14"
        fill={borderColor}
      />
      <Ellipse cx="14" cy="14" rx="10" ry="10" fill={borderColor} />

      {children}
    </Svg>
  );
};

export default LegTransportMethodIcon;

type AnimationOptions = {
  isAnimating?: boolean;
  opacityTimingMs?: number;
  scaleTimingMs?: number;
  interval?: number;
  scale?: {
    from: number;
    to: number;
  };
  opacity?: {
    from: number;
    to: number;
  };
};
function useCirclePulseAnimation(opts: AnimationOptions = {}) {
  const {
    isAnimating = false,
    opacityTimingMs = 500,
    scaleTimingMs = 700,
    interval = 300,
    scale = {
      from: 10,
      to: 14,
    },
    opacity = {
      from: 0.3,
      to: 0.6,
    },
  } = opts;
  const opacityAnimation = new Animated.Value(opacity.from);
  const scaleAnimation = new Animated.ValueXY({x: scale.from, y: scale.from});
  const circle = useRef<NativeMethodsMixinStatic>(null);

  useEffect(() => {
    if (circle.current) {
      circle.current.setNativeProps({
        opacity: opacity.from,
        rx: scale.from,
        ry: scale.from,
      });
    }
    if (!isAnimating) {
      return;
    }

    const opacityListener = (e: {value: number}) => {
      if (!circle?.current?.setNativeProps) return;
      circle.current.setNativeProps({opacity: e.value});
    };
    const scaleListener = (e: {x: number; y: number}) => {
      if (!circle?.current?.setNativeProps) return;
      circle.current.setNativeProps({rx: e.x, ry: e.y});
    };
    opacityAnimation.addListener(opacityListener);
    let id = scaleAnimation.addListener(scaleListener);

    return () => {
      opacityAnimation.removeAllListeners();
      opacityAnimation.stopAnimation();
      scaleAnimation.removeListener(id);
      scaleAnimation.stopAnimation();
    };
  }, [isAnimating]);
  useEffect(() => {
    if (!isAnimating) {
      return;
    }

    let timeout: number;
    let sequence: Animated.CompositeAnimation;
    function doAnimation() {
      sequence = Animated.sequence([
        Animated.parallel([
          Animated.timing(opacityAnimation, {
            toValue: opacity.to,
            duration: opacityTimingMs,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnimation, {
            toValue: {x: scale.to, y: scale.to},
            duration: scaleTimingMs,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(opacityAnimation, {
            toValue: opacity.from,
            duration: opacityTimingMs,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnimation, {
            toValue: {x: scale.from, y: scale.from},
            duration: scaleTimingMs,
            useNativeDriver: true,
          }),
        ]),
      ]);

      sequence.start(() => {
        timeout = setTimeout(doAnimation, interval);
      });
    }

    doAnimation();
    return () => {
      clearTimeout(timeout);
      sequence.stop();
    };
  }, [isAnimating]);

  return circle;
}
