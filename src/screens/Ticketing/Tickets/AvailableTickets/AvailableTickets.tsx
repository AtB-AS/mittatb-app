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
import * as TicketIcons from '@atb/assets/svg/color/illustrations/ticket-type';
import {SvgProps} from 'react-native-svg';
import {Transition} from 'react-native-reanimated';
import {TransitionIOSSpec} from '@react-navigation/stack/lib/typescript/src/TransitionConfigs/TransitionSpecs';

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
                transportationModeTexts={{no: 'Buss/Trikk', en: 'Bus/Tram'}}
                transportationModeIcons={[]}
                description={'Varighet mellom 90 min og 5 timer'}
                icon={TicketIcons.Single}
              />
              <Ticket
                key={'periodebillett'}
                title={'Enkeltbillett'}
                transportationModeTexts={{no: 'Buss/Trikk', en: 'Bus/Tram'}}
                transportationModeIcons={['bus']}
                description={
                  'Velg mellom 7, 30 eller 180 dager eller kanskje du vil reise evig?'
                }
                icon={TicketIcons.Period}
              />
            </View>
            <View style={styles.ticketsContainer}>
              <Ticket
                title={'Sommerpass'}
                transportationModeTexts={{no: 'Buss/Trikk', en: 'Bus/Tram'}}
                transportationModeIcons={['bus']}
                description={
                  'Reis hvor du vil, så mye du vil med buss, tog, hurtigbåt, ferge og trikk i Trøndelag i sju dager'
                }
                icon={TicketIcons.Single}
                key={'sommerpass'}
              />
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
};

type TransportationModeIcon = (props: SvgProps) => JSX.Element;

const Ticket = ({
  title,
  description,
  transportationModeIcons,
  transportationModeTexts,
  icon,
  key,
}: {
  title: string;
  description: string;
  transportationModeIcons: TransportationModeIcon[];
  transportationModeTexts: {no: string; en: string};
  icon: (props: SvgProps) => JSX.Element;
  key: string;
}) => {
  const styles = useStyles();
  return (
    <View style={styles.ticket} key={key}>
      <View style={{flexShrink: 1}}>
        <ThemeText type="body__tertiary" style={styles.transportation_label}>
          {'Buss/Trikk'}
        </ThemeText>
        <ThemeText
          type="body__secondary--bold"
          style={styles.ticket_name}
          accessibilityLabel={title}
        >
          {title}
        </ThemeText>
        <ThemeText type="body__tertiary" style={styles.description}>
          {description}
        </ThemeText>
      </View>
      <View style={styles.ticketIllustrationContainer}>
        <View style={styles.ticketIllustration}>{icon({})}</View>
      </View>
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
    alignItems: 'stretch',
  },
  ticket: {
    width: '100%',
    flexShrink: 1,
    alignSelf: 'stretch',
    marginRight: theme.spacings.medium,
    padding: theme.spacings.xLarge,
    borderRadius: theme.border.radius.regular,
    backgroundColor: theme.colors.background_0.backgroundColor,
  },
  ticketIllustrationContainer: {
    flexGrow: 1,
    flexDirection: 'row',
    marginTop: theme.spacings.small,
  },
  ticketIllustration: {
    alignSelf: 'flex-end',
    opacity: 0.6,
  },
  label_uppercase: {
    // TODO: this will be paert of design system
  },
  transportation_label: {},
  ticket_name: {
    marginBottom: theme.spacings.small,
    marginTop: theme.spacings.small,
  },
  description: {},
}));
