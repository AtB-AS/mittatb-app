import colors from '@atb/theme/colors';
import {ViewStyle} from 'react-native';

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
