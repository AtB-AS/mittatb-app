import {StyleSheet} from '@atb/theme';

export const usePurchaseTicketHeadingStyles = StyleSheet.createThemeHook(
  (theme) => ({
    heading: {
      margin: theme.spacings.medium,
      marginLeft: theme.spacings.xLarge,
      marginTop: theme.spacings.large,
    },
  }),
);
