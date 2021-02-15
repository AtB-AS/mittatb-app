import {SvgProps} from 'react-native-svg';
import {useTheme} from '@atb/theme';
import {TextColors, iconSizes} from '@atb/theme/colors';

type ThemeIconProps = {
  svg(props: SvgProps): JSX.Element;
  colorType?: TextColors;
  size?: keyof typeof iconSizes;
} & SvgProps;

const ThemeIcon = ({
  svg,
  colorType,
  size = 'normal',
  ...props
}: ThemeIconProps): JSX.Element => {
  const {theme} = useTheme();
  const settings = {
    fill: theme.text.colors[colorType ?? 'primary'],
    height: theme.icon.size[size],
    ...props,
  };
  return svg(settings);
};
export default ThemeIcon;
