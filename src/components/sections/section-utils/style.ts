import {StyleSheet, Theme} from '../../../theme';

const useSectionStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  spaceBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}));
export default useSectionStyle;
