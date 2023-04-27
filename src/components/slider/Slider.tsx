import {View, ViewStyle} from 'react-native';
import {Slider as RNSlider} from '@miblanchard/react-native-slider';
import {InteractiveColor} from '@atb/theme/colors';
import {useTheme} from '@atb/theme';
import {Dimensions} from '@miblanchard/react-native-slider/lib/types';

type Props = {
  value?: number;
  maximumValue: number;
  minimumValue: number;
  minimumTrackTintColor: InteractiveColor;
  maximumTrackTintColor: InteractiveColor;
  step: number;
  trackClickable: boolean;
  thumbTintColor: InteractiveColor;
  onValueChange: (value: number) => void;
  onSlidingComplete?: (value: number) => void;
  thumbStyle?: ViewStyle;
  trackStyle?: ViewStyle;
  thumbTouchSize?: Dimensions | undefined;
  containerStyle?: ViewStyle;
  trackMarks?: number[];
};
export function Slider({
  value,
  maximumValue,
  minimumValue,
  minimumTrackTintColor,
  maximumTrackTintColor,
  step,
  trackClickable,
  thumbTintColor,
  onValueChange,
  onSlidingComplete,
  thumbStyle,
  trackMarks,
  trackStyle,
  thumbTouchSize,
  containerStyle,
}: Props) {
  const {theme} = useTheme();
  const minColor = theme.interactive[minimumTrackTintColor].default.background;
  const maxColor = theme.interactive[maximumTrackTintColor].active.background;
  const thumbColor = theme.interactive[thumbTintColor].default.background;

  return (
    <View>
      <RNSlider
        thumbStyle={thumbStyle}
        thumbTouchSize={thumbTouchSize}
        trackStyle={trackStyle}
        onSlidingComplete={(number) =>
          onSlidingComplete && onSlidingComplete(number[0])
        }
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
        onValueChange={(value) => {
          onValueChange(value[0]);
        }}
      />
    </View>
  );
}
