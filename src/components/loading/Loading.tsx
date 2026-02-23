import {
  BlurMask,
  Canvas,
  Path,
  Skia,
  SweepGradient,
  vec,
} from '@shopify/react-native-skia';
import {Ref, useEffect, useMemo} from 'react';
import {ActivityIndicatorProps} from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

/*
animating?: boolean | undefined;

  color?: ColorValue | undefined;

  hidesWhenStopped?: boolean | undefined;

  size?: number | 'small' | 'large' | undefined;

  style?: StyleProp<ViewStyle> | undefined;
*/

export const Loading: React.FC<
  ActivityIndicatorProps & {ref?: Ref<any> | null}
> = ({
  animating = true,
  //color,
  hidesWhenStopped = true,
  size: sizeType = 'large',
  style,
  ref,
  ...props
}) => {
  const size = sizeType === 'small' ? 20 : 36;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const canvasSize = size + 30;
  const circle = useMemo(() => {
    const skPath = Skia.Path.Make();

    skPath.addCircle(canvasSize / 2, canvasSize / 2, radius);
    return skPath;
  }, [canvasSize, radius]);

  const progress = useSharedValue(0);

  useEffect(() => {
    if (animating) {
      progress.value = withRepeat(
        withTiming(1, {duration: 1000, easing: Easing.linear}),
        -1,
        false,
      );
    }
  }, [progress, animating]);

  const rContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{rotate: `${2 * Math.PI * progress.value}rad`}],
    };
  });

  const startPath = useDerivedValue(() => {
    return interpolate(progress.value, [0, 0.5, 1], [0.6, 0.3, 0.6]);
  }, []);

  if (!animating && hidesWhenStopped) {
    return null;
  }

  return (
    <Animated.View
      entering={FadeIn.duration(500)}
      exiting={FadeOut.duration(500)}
      style={[rContainerStyle, style]}
      ref={ref}
      {...props}
    >
      <Canvas
        style={{
          width: canvasSize,
          height: canvasSize,
        }}
      >
        <Path
          path={circle}
          color="red"
          style="stroke"
          strokeWidth={strokeWidth}
          start={startPath}
          end={1}
          strokeCap="round"
        >
          <SweepGradient
            c={vec(canvasSize / 2, canvasSize / 2)}
            colors={['cyan', 'magenta', 'yellow', 'cyan']}
          />
          <BlurMask blur={5} style="solid" />
        </Path>
      </Canvas>
    </Animated.View>
  );
};
