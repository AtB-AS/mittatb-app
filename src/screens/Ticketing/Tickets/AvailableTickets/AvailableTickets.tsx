import {View} from 'react-native';
import Button from '@atb/components/button';
import {TicketsTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {useAuthState} from '@atb/auth';
import {StyleSheet, useTheme} from '@atb/theme';
import {useHasEnabledMobileToken} from '@atb/mobile-token/MobileTokenContext';
import * as Sections from '@atb/components/sections';
import {ScrollView} from 'react-native-gesture-handler';

import ThemeIcon from '@atb/components/theme-icon';
import ThemeText from '@atb/components/text';
import SingleTicketIcon from '@atb/assets/svg/color/illustrations/ticket-type/Single';
import PeriodTicketIcon from '@atb/assets/svg/color/illustrations/ticket-type/Period';

export const AvailableTickets = ({
  onBuySingleTicket,
  onBuyPeriodTicket,
}: {
  onBuySingleTicket: () => void;
  onBuyPeriodTicket: () => void;
}) => {
  const styles = useStyles();
  const {theme} = useTheme();
  const {abtCustomerId, authenticationType} = useAuthState();
  const hasEnabledMobileToken = useHasEnabledMobileToken();
  const {t} = useTranslation();

  const isSignedInAsAbtCustomer = !!abtCustomerId;

  return (
    <View style={styles.container}>
      {isSignedInAsAbtCustomer && (
        <View>
          <ScrollView>
            <View style={styles.ticketsContainer}>
              <View style={styles.ticket_small}>
                <Sections.GenericItem>
                  <ThemeText>{'Buss/Trikk'}</ThemeText>
                  <ThemeText
                    type="body__primary--bold"
                    key={'enkeltbillett'}
                    accessibilityLabel={'Enkeltbillett'}
                  >
                    {'Enkeltbillett'}
                  </ThemeText>
                  <ThemeText>{'Varighet mellom 90 min og 5 timer'}</ThemeText>

                  <View style={styles.ticketIllustration}>
                    {<SingleTicketIcon height="100%" width="100%" />}
                  </View>
                </Sections.GenericItem>
              </View>
              <View style={styles.ticket_small}>
                <Sections.GenericItem>
                  <ThemeText>{'Buss/Trikk'}</ThemeText>
                  <ThemeText
                    type="body__primary--bold"
                    key={'enkeltbillett'}
                    accessibilityLabel={'Enkeltbillett'}
                  >
                    {'Periodebillett'}
                  </ThemeText>
                  <ThemeText>{'Varighet mellom 90 min og 5 timer'}</ThemeText>
                  <View style={styles.ticketIllustration}>
                    {<PeriodTicketIcon height="100%" width="100%" />}
                  </View>
                </Sections.GenericItem>
              </View>
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background_1.backgroundColor,
  },
  buyPeriodTicketButton: {
    marginTop: theme.spacings.medium,
  },

  ticketsContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingRight: theme.spacings.medium,
  },
  ticket_small: {
    flexShrink: 1,
    marginLeft: theme.spacings.medium,
  },
  ticketIllustration: {
    width: '50%',
    aspectRatio: 1,
  },
}));
