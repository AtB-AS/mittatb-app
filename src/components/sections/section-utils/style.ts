import {StyleSheet, Theme} from '@atb/theme';

const useSectionStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  spaceBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}));
export default useSectionStyle;
