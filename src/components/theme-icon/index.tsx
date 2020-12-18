import {SvgProps} from 'react-native-svg';
import {useTheme} from '../../theme';
import {TextColors} from '../../theme/colors';

type ThemeIconProps = {
  svg(props: SvgProps): JSX.Element;
  colorType?: TextColors;
} & SvgProps;

const ThemeIcon = ({svg, colorType, ...props}: ThemeIconProps): JSX.Element => {
  const {theme} = useTheme();
  const settings = {
    fill: theme.text.colors[colorType ?? 'primary'],
    ...props,
  };
  return svg(settings);
};
export default ThemeIcon;
