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
import {SvgProps} from 'react-native-svg';

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
              <Ticket
                key={'enkeltbillett'}
                title={'Enkeltbillett'}
                description={'Varighet mellom 90 min og 5 timer'}
                icon={<SingleTicketIcon height="100%" width="100%" />}
              />
              <Ticket
                key={'periodebillett'}
                title={'Enkeltbillett'}
                description={
                  'Velg mellom 7, 30 eller 180 dager eller kanskje du vil reise evig?'
                }
                icon={<PeriodTicketIcon height="100%" width="100%" />}
              />
            </View>
            <View style={styles.ticketsContainer}>
              <Ticket
                title={'Sommerpass'}
                description={
                  'Reis hvor du vil, så mye du vil med buss, tog, hurtigbåt, ferge og trikk i Trøndelag i sju dager'
                }
                icon={<PeriodTicketIcon width="100%" height="100%" />}
                key={'sommerpass'}
              />
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const Ticket = ({
  title,
  description,
  icon,
  key,
}: {
  title: string;
  description: string;
  icon: JSX.Element;
  key: string;
}) => {
  const styles = useStyles();
  return (
    <View style={styles.ticket} key={key}>
      <Sections.GenericItem>
        <ThemeText>{'Buss/Trikk'}</ThemeText>
        <ThemeText type="body__primary--bold" accessibilityLabel={title}>
          {title}
        </ThemeText>
        <ThemeText>{description}</ThemeText>

        <View style={styles.ticketIllustration}>{icon}</View>
      </Sections.GenericItem>
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
    paddingLeft: theme.spacings.medium,
    paddingBottom: theme.spacings.medium,
  },
  ticket: {
    width: '100%',
    flexShrink: 1,
    marginRight: theme.spacings.medium,
  },
  ticketIllustration: {
    width: 100,
    overflow: 'hidden',
    aspectRatio: 1,
  },
}));
