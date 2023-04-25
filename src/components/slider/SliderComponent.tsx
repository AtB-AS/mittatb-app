import {Slider} from '@miblanchard/react-native-slider';
import {
  getStaticColor,
  isStaticColor,
  StaticColor,
  TextColor,
} from '@atb/theme/colors';
import {ContrastColor} from '@atb-as/theme';
import {useTheme} from '@atb/theme';
import {View, ViewStyle} from 'react-native';

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
  thumbStyle?: ViewStyle;
  trackStyle?: ViewStyle;
  trackMarks?: number[];
};
export function SliderComponent({
  value,
  maximumValue,
  minimumValue,
  minimumTrackTintColor = 'background_accent_3',
  maximumTrackTintColor,
  step,
  thumbTintColor,
  onValueChange,
  thumbStyle,
  trackStyle,
  trackMarks,
}: Props) {
  const minColor = useColor(minimumTrackTintColor);
  const maxColor = useColor(maximumTrackTintColor);

  return (
    <View>
      <Slider
        thumbStyle={thumbStyle}
        trackStyle={trackStyle}
        value={value}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        minimumTrackTintColor={useColor(minimumTrackTintColor)}
        maximumTrackTintColor={useColor(maximumTrackTintColor)}
        step={step}
        thumbTintColor={useColor(thumbTintColor)}
        onValueChange={(value) => {
          onValueChange(value[0]);
        }}
        containerStyle={{width: '100%'}}
        trackMarks={trackMarks}
        thumbTouchSize={{width: 30, height: 40}}
        trackClickable={true}
        renderTrackMarkComponent={
          trackMarks
            ? (index) => {
                return (
                  <View
                    style={{
                      position: 'absolute',
                      top: -5,
                      right: -10,
                      width: 2,
                      height: 5,
                      backgroundColor:
                        value && index > value - 3 ? maxColor : minColor,
                      borderRadius: 1,
                    }}
                  />
                );
              }
            : undefined
        }
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
