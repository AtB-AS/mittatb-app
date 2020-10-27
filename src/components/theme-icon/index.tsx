import {SvgProps} from 'react-native-svg';
import {useTheme} from '../../theme';

type ThemeIconProps = {
  svg(props: SvgProps): JSX.Element;
} & SvgProps;

const ThemeIcon = ({svg, ...props}: ThemeIconProps): JSX.Element => {
  const {theme} = useTheme();
  const settings = {
    fill: theme.text.colors.primary,
    ...props,
  };
  return svg(settings);
};
export default ThemeIcon;
