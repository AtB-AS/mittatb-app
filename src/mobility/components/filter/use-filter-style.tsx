import {StyleSheet} from '@atb/theme';

export const useFilterStyle = StyleSheet.createThemeHook((theme) => ({
  sectionHeader: {
    marginBottom: theme.spacings.small,
  },
}));
