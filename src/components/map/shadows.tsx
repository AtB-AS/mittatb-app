import {ViewStyle} from 'react-native';
import colors from '../../theme/colors';

const shadows: ViewStyle = {
  shadowColor: colors.text.black,
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 8,
  elevation: 8,
};

export default shadows;
