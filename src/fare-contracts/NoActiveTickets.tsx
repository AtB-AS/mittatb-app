import {View} from 'react-native';
import {StyleSheet, useTheme} from '@atb/theme';
import {TicketingTexts, useTranslation} from '@atb/translations';
import {ThemeText} from '@atb/components/text';
import {Ticket} from '@atb/assets/svg/color/images';

export const NoActiveTickets = () => {
  const styles = useStyles();
  const {theme} = useTheme();
  const {t} = useTranslation();

  return (
    <View style={styles.noActiveTicketsContainer}>
      <Ticket height={theme.icon.size.large * 4} />
      <ThemeText
        type="body__primary--bold"
        color="secondary"
        style={styles.noActiveTicketsTitle}
      >
        {t(
          TicketingTexts.activeFareProductsAndReservationsTab
            .noActiveItemsTitle,
        )}
      </ThemeText>
      <ThemeText type="body__secondary" color="secondary">
        {t(
          TicketingTexts.activeFareProductsAndReservationsTab
            .noActiveItemsDetails,
        )}
      </ThemeText>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  noActiveTicketsContainer: {
    margin: theme.spacings.medium,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  noActiveTicketsTitle: {
    marginTop: theme.spacings.small,
    marginBottom: theme.spacings.xSmall,
  },
}));
