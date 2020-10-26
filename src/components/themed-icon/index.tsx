import Svg, {SvgProps} from 'react-native-svg';
import {useTheme} from '../../theme';

type SvgIconProps = {
  svg(props: SvgProps): JSX.Element;
};
const ThemedIcon = ({svg}: SvgIconProps) => {
  const {theme} = useTheme();
  const settings = {
    fill: theme.text.colors.primary,
  };
  return svg(settings);
};
export default ThemedIcon;
