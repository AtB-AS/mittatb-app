import {StyleSheet} from '@atb/theme';

export const useSectionStyle = StyleSheet.createThemeHook(() => ({
  spaceBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}));
