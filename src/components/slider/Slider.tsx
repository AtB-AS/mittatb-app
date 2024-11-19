import {ViewStyle} from 'react-native';
import {Slider as RNSlider} from '@miblanchard/react-native-slider';
import {InteractiveColor} from '@atb/theme/colors';
import {useTheme} from '@atb/theme';
import {Dimensions} from '@miblanchard/react-native-slider/lib/types';
import React from 'react';

type Props = {
  value?: number;
  maximumValue: number;
  minimumValue: number;
  minimumTrackTintColor?: InteractiveColor;
  maximumTrackTintColor?: InteractiveColor;
  step: number;
  trackClickable?: boolean;
  thumbTintColor?: InteractiveColor;
  onValueChange: (value: number) => void;
  onSlidingComplete?: (value: number) => void;
  thumbStyle?: ViewStyle;
  trackStyle?: ViewStyle;
  thumbTouchSize?: Dimensions | undefined;
  containerStyle?: ViewStyle;
  trackMarks?: number[];
  trackMarkComponent?: (texts: number) => React.ReactNode;
};
export function Slider({
  value,
  maximumValue,
  minimumValue,
  minimumTrackTintColor,
  maximumTrackTintColor,
  step,
  trackClickable = true,
  thumbTintColor,
  onValueChange,
  onSlidingComplete,
  thumbStyle,
  trackStyle,
  thumbTouchSize,
  containerStyle,
  trackMarkComponent,
  trackMarks,
}: Props) {
  const {theme} = useTheme();
  const themeColor = theme.color.interactive[0];
  const minColor = (minimumTrackTintColor ?? themeColor).default.background;
  const maxColor = (maximumTrackTintColor ?? themeColor).active.background;
  const thumbColor = (thumbTintColor ?? themeColor).default.background;

  const touchSize = 45;
  const thumbSize = 20;

  return (
    <RNSlider
      thumbStyle={
        thumbStyle ? thumbStyle : {width: thumbSize, height: thumbSize}
      }
      thumbTouchSize={
        thumbTouchSize ? thumbTouchSize : {width: touchSize, height: touchSize}
      }
      trackStyle={trackStyle}
      onSlidingComplete={(number) =>
        onSlidingComplete && onSlidingComplete(number[0])
      }
      onValueChange={(number) => onValueChange(number[0])}
      containerStyle={containerStyle}
      value={value}
      minimumValue={minimumValue}
      maximumValue={maximumValue}
      minimumTrackTintColor={minColor}
      maximumTrackTintColor={maxColor}
      step={step}
      trackClickable={trackClickable}
      thumbTintColor={thumbColor}
      trackMarks={trackMarks}
      renderTrackMarkComponent={
        trackMarks && trackMarkComponent
          ? (index) => {
              return trackMarkComponent(index);
            }
          : undefined
      }
    />
  );
}
