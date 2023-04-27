import {View, ViewStyle} from 'react-native';
import RNSlider from '@react-native-community/slider';
import {InteractiveColor} from '@atb/theme/colors';
import {useTheme} from '@atb/theme';

type Props = {
  value?: number;
  maximumValue: number;
  minimumValue: number;
  interactiveColor: InteractiveColor;
  step: number;
  tapToSeek: boolean;
  onValueChange?: (value: number) => void;
  onSlidingComplete?: (value: number) => void;
  style?: ViewStyle;
};
export function Slider({
  value,
  maximumValue,
  minimumValue,
  interactiveColor,
  step,
  tapToSeek,
  onValueChange,
  onSlidingComplete,
  style,
}: Props) {
  const {theme} = useTheme();
  const minColor = theme.interactive[interactiveColor].default.background;
  const maxColor = theme.interactive[interactiveColor].active.background;
  const thumbColor = theme.interactive[interactiveColor].default.background;

  return (
    <View>
      <RNSlider
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
