import {TouchableOpacity, View} from 'react-native';
import {TicketsTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {useAuthState} from '@atb/auth';
import {StyleSheet, useTheme} from '@atb/theme';
import {useHasEnabledMobileToken} from '@atb/mobile-token/MobileTokenContext';
import {ScrollView} from 'react-native-gesture-handler';
import ThemeText from '@atb/components/text';
import * as TicketIcons from '@atb/assets/svg/color/illustrations/ticket-type';
import {SvgProps} from 'react-native-svg';
import TransportationIcon from '@atb/components/transportation-icon';
import {
  Mode,
  TransportSubmode,
} from '@atb/api/types/generated/journey_planner_v3_types';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';

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
  const {preassignedFareproducts} = useFirestoreConfiguration();
  const {t} = useTranslation();

  const isSignedInAsAbtCustomer = !!abtCustomerId;

  // TODO check firestore for availability

  return (
    <View style={styles.container}>
      {isSignedInAsAbtCustomer && (
        <ScrollView>
          <View style={styles.ticketsContainer}>
            <Ticket
              title={t(TicketsTexts.availableTickets.singleTicket.title)}
              transportationModeTexts={t(
                TicketsTexts.availableTickets.singleTicket.transportModes,
              )}
              transportationModeIcons={[
                {mode: Mode.Bus, subMode: TransportSubmode.LocalBus},
              ]}
              description={t(
                TicketsTexts.availableTickets.singleTicket.description,
              )}
              icon={TicketIcons.Single}
              onPress={onBuySingleTicket}
            />
            <Ticket
              title={t(TicketsTexts.availableTickets.periodTicket.title)}
              transportationModeTexts={t(
                TicketsTexts.availableTickets.periodTicket.transportModes,
              )}
              transportationModeIcons={[
                {mode: Mode.Bus, subMode: TransportSubmode.LocalBus},
              ]}
              description={t(
                TicketsTexts.availableTickets.periodTicket.description,
              )}
              icon={TicketIcons.Period}
              onPress={onBuyPeriodTicket}
            />
          </View>
          <View style={styles.ticketsContainer}>
            <Ticket
              title={t(TicketsTexts.availableTickets.summerPass.title)}
              transportationModeTexts={t(
                TicketsTexts.availableTickets.summerPass.transportModes,
              )}
              transportationModeIcons={[
                {mode: Mode.Bus, subMode: TransportSubmode.LocalBus},
                {mode: Mode.Rail},
                {mode: Mode.Water},
              ]}
              description={t(
                TicketsTexts.availableTickets.summerPass.description,
              )}
              icon={TicketIcons.Summer}
              onPress={onBuyPeriodTicket}
            />
          </View>
          <View style={styles.ticketsContainer}>
            <Ticket
              title={t(TicketsTexts.availableTickets.summerPass.title)}
              transportationModeTexts={t(
                TicketsTexts.availableTickets.summerPass.transportModes,
              )}
              transportationModeIcons={[
                {mode: Mode.Bus, subMode: TransportSubmode.LocalBus},
                {mode: Mode.Rail},
                {mode: Mode.Water},
              ]}
              description={t(
                TicketsTexts.availableTickets.summerPass.description,
              )}
              icon={TicketIcons.Summer}
              accented={true}
              onPress={onBuyPeriodTicket}
            />
          </View>
        </ScrollView>
      )}
    </View>
  );
};

type TransportationModeIconProperties = {
  mode: Mode;
  subMode?: TransportSubmode;
};

const Ticket = ({
  title,
  description,
  transportationModeIcons,
  transportationModeTexts,
  icon,
  accented = false,
  onPress,
}: {
  title: string;
  description: string;
  transportationModeIcons: TransportationModeIconProperties[];
  transportationModeTexts: string;
  icon: (props: SvgProps) => JSX.Element;
  accented?: boolean;
  onPress: () => void;
}) => {
  const styles = useStyles();
  const ticketTheme = accented ? styles.ticket_accented : styles.ticket_normal;
  const textColor = accented ? 'primary_2' : 'primary';

  return (
    <View style={[styles.ticket, ticketTheme]}>
      <TouchableOpacity onPress={onPress}>
        <View style={{flexShrink: 1}}>
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
            {transportationModeIcons.map((icon) => {
              return (
                <TransportationIcon mode={icon.mode} subMode={icon.subMode} />
              );
            })}
            <ThemeText
              type="body__tertiary"
              style={styles.transportation_label}
              color={textColor}
            >
              {transportationModeTexts}
            </ThemeText>
          </View>
          <ThemeText
            type="body__secondary--bold"
            style={styles.ticket_name}
            accessibilityLabel={title}
            color={textColor}
          >
            {title}
          </ThemeText>
          <ThemeText
            type="body__tertiary"
            style={styles.description}
            color={textColor}
          >
            {description}
          </ThemeText>
        </View>
        <View style={styles.ticketIllustrationContainer}>
          <View style={styles.ticketIllustration}>{icon({})}</View>
        </View>
      </TouchableOpacity>
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
  },

  ticket_normal: {
    backgroundColor: theme.colors.background_0.backgroundColor,
  },
  ticket_accented: {
    backgroundColor: theme.colors.primary_2.backgroundColor,
    textColor: theme.colors.primary_2.color,
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
