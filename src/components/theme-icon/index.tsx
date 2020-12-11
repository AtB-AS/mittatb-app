import {SvgProps} from 'react-native-svg';
import {useTheme} from '../../theme';
import {TextColors} from '../../theme/colors';

type ThemeIconProps = {
  svg(props: SvgProps): JSX.Element;
  fill?: TextColors;
} & SvgProps;

const ThemeIcon = ({svg, fill, ...props}: ThemeIconProps): JSX.Element => {
  const {theme} = useTheme();
  const settings = {
    fill: theme.text.colors[fill ?? 'primary'],
    ...props,
  };
  return svg(settings);
};
export default ThemeIcon;
