import {View, ViewStyle} from 'react-native';
import Slider from '@react-native-community/slider';
import {
  getStaticColor,
  isStaticColor,
  StaticColor,
  TextColor,
} from '@atb/theme/colors';
import {ContrastColor} from '@atb-as/theme';
import {useTheme} from '@atb/theme';

type ColorType = TextColor | StaticColor | ContrastColor;

type Props = {
  value?: number;
  maximumValue: number;
  minimumValue: number;
  minimumTrackTintColor?: ColorType;
  maximumTrackTintColor: ColorType;
  step: number;
  tapToSeek: boolean;
  thumbTintColor: ColorType;
  onValueChange: (value: number) => void;
  style?: ViewStyle;
};
export function SliderComponent({
  value,
  maximumValue,
  minimumValue,
  minimumTrackTintColor = 'background_accent_3',
  maximumTrackTintColor,
  step,
  tapToSeek,
  thumbTintColor,
  onValueChange,
  style,
}: Props) {
  return (
    <View>
      <Slider
        style={style}
        value={value}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        minimumTrackTintColor={useColor(minimumTrackTintColor)}
        maximumTrackTintColor={useColor(maximumTrackTintColor)}
        step={step}
        tapToSeek={tapToSeek}
        thumbTintColor={useColor(thumbTintColor)}
        onValueChange={onValueChange}
      />
    </View>
  );
}
const useColor = (color: ColorType): string => {
  const {theme, themeName} = useTheme();

  if (typeof color !== 'string') {
    return color.background;
  }
  return isStaticColor(color)
    ? getStaticColor(themeName, color).background
    : theme.text.colors[color];
};
