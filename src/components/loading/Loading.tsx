import React, {Ref, useEffect, useMemo} from 'react';
import {View, ActivityIndicatorProps} from 'react-native';
import {Canvas, Group, Path, Skia} from '@shopify/react-native-skia';
import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

type LoadingProps = ActivityIndicatorProps & {ref?: Ref<any> | null};

export const Loading: React.FC<LoadingProps> = ({
  animating = true,
  hidesWhenStopped = true,
  size: sizeType = 'large',
  style,
  ref,
  ...props
}) => {
  const size = sizeType === 'small' ? 24 : 36;

  const cx = size / 2;
  const cy = size / 2;

  const donutWidth = Math.max(6, Math.round(size * 0.22));
  const donutOuter = size / 2;
  const donutInner = donutOuter - donutWidth;
  const donutRadius = donutInner + donutWidth / 2;

  const donutColor = '#e1f4bd';
  const arcColor = '#587e05';

  const path = useMemo(() => {
    const p = Skia.Path.Make();
    p.addCircle(cx, cy, donutRadius);
    return p;
  }, [cx, cy, donutRadius]);

  // Arc length: ~1/3 circumference
  const arcStart = 0;
  const arcEnd = 0.33;

  const progress = useSharedValue(0);

  useEffect(() => {
    if (!animating) return;
    progress.value = withRepeat(
      withTiming(1, {duration: 900, easing: Easing.linear}),
      -1,
      false,
    );
  }, [animating, progress]);

  const rotationTransform = useDerivedValue(() => {
    return [{rotate: progress.value * 2 * Math.PI}];
  }, []);

  if (!animating && hidesWhenStopped) return null;

  return (
    <View style={style} ref={ref} {...props}>
      <Canvas style={{width: size, height: size}}>
        <Path
          path={path}
          style="stroke"
          strokeWidth={donutWidth}
          color={donutColor}
          strokeCap="round"
        />

        <Group origin={{x: cx, y: cy}} transform={rotationTransform}>
          <Path
            path={path}
            style="stroke"
            strokeWidth={donutWidth}
            color={arcColor}
            strokeCap="round"
            start={arcStart}
            end={arcEnd}
          />
        </Group>
      </Canvas>
    </View>
  );
};
