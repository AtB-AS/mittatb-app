import {StyleSheet} from '@atb/theme';

const useSectionStyle = StyleSheet.createThemeHook(() => ({
  spaceBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}));
export default useSectionStyle;
