import {SvgProps} from 'react-native-svg';
import {useTheme} from '@atb/theme';
import {TextColor, iconSizes} from '@atb/theme/colors';

type ThemeIconProps = {
  svg(props: SvgProps): JSX.Element;
  colorType?: TextColor;
  size?: keyof typeof iconSizes;
} & SvgProps;

const ThemeIcon = ({
  svg,
  colorType,
  size = 'normal',
  ...props
}: ThemeIconProps): JSX.Element => {
  const {theme, themeName} = useTheme();
  const settings = {
    fill: theme.text.color[themeName][colorType ?? 'primary'],
    height: theme.icon.size[size],
    ...props,
  };
  return svg(settings);
};
export default ThemeIcon;
