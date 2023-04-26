import {View, ViewStyle} from 'react-native';
import Slider from '@react-native-community/slider';
import {InteractiveColor} from '@atb/theme/colors';
import {useTheme} from '@atb/theme';

type Props = {
  value?: number;
  maximumValue: number;
  minimumValue: number;
  minimumTrackTintColor: InteractiveColor;
  maximumTrackTintColor: InteractiveColor;
  step: number;
  tapToSeek: boolean;
  thumbTintColor: InteractiveColor;
  onValueChange?: (value: number) => void;
  onSlidingComplete?: (value: number) => void;
  style?: ViewStyle;
};
export function SliderComponent({
  value,
  maximumValue,
  minimumValue,
  minimumTrackTintColor,
  maximumTrackTintColor,
  step,
  tapToSeek,
  thumbTintColor,
  onValueChange,
  onSlidingComplete,
  style,
}: Props) {
  const {theme} = useTheme();
  const minColor = theme.interactive[minimumTrackTintColor].default.background;
  const maxColor = theme.interactive[maximumTrackTintColor].active.background;
  const thumbColor = theme.interactive[thumbTintColor].default.background;

  return (
    <View>
      <Slider
        onSlidingComplete={onSlidingComplete}
        style={style}
        value={value}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        minimumTrackTintColor={minColor}
        maximumTrackTintColor={maxColor}
        step={step}
        tapToSeek={tapToSeek}
        thumbTintColor={thumbColor}
        onValueChange={onValueChange}
      />
    </View>
  );
}
