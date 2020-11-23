import {StyleSheet, Theme} from '../../../theme';

const useSectionStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  baseItem: {
    backgroundColor: theme.background.level0,
  },
  spaceBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}));
export default useSectionStyle;
