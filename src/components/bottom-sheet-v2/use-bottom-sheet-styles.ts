import {shadows} from '@atb/modules/map';
import {StyleSheet} from '@atb/theme';
import {Platform} from 'react-native';

const isOldAndroid = Platform.OS === 'android' && Platform.Version <= 28;

export const useBottomSheetStyles = StyleSheet.createThemeHook((theme) => ({
  contentContainer: {
    backgroundColor: theme.color.background.neutral[1].background,
  },
  sheet: {
    backgroundColor: theme.color.background.neutral[1].background,
    ...(isOldAndroid ? {...shadows, elevation: 0} : shadows),
  },
}));
