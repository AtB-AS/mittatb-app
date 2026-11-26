import {shadows} from '@atb/modules/map';
import {StyleSheet} from '@atb/theme';
import {Platform} from 'react-native';

const isOldAndroid = Platform.OS === 'android' && Platform.Version <= 28;

export const useBottomSheetStyles = StyleSheet.createThemeHook(
  (theme, {left, right}) => ({
    contentContainer: {
      backgroundColor: theme.color.background.neutral[1].background,
    },
    content: {
      paddingLeft: left,
      paddingRight: right,
    },
    fixedSizeContent: {
      flex: 1,
      paddingLeft: left,
      paddingRight: right,
    },
    sheet: {
      backgroundColor: theme.color.background.neutral[1].background,
      ...(isOldAndroid ? {...shadows, elevation: 0} : shadows),
    },
  }),
);
