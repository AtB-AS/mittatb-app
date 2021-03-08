import {useAuthState} from '@atb/auth';
import Button from '@atb/components/button';
import {RootStackParamList} from '@atb/navigation';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {StyleSheet, useTheme} from '@atb/theme';
import {useTicketState} from '@atb/tickets';
import {TicketsTexts, useTranslation} from '@atb/translations';
import useInterval from '@atb/utils/use-interval';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useState} from 'react';
import {View} from 'react-native';
import RecentTicketsScrollView from './RecentTicketsScrollView';
import TicketsScrollView from './TicketsScrollView';
import UpgradeSplash from './UpgradeSplash';
import MessageBox from '@atb/components/message-box';
import ThemeText from '@atb/components/text';
import MessageBoxTexts from '@atb/translations/components/MessageBox';
import {BuyTicketsScreenName} from '@atb/screens/Ticketing/Tickets/index';

export type TicketingScreenNavigationProp = StackNavigationProp<RootStackParamList>;

type Props = {
  navigation: TicketingScreenNavigationProp;
};

export const BuyTickets: React.FC<Props> = ({navigation}) => {
  const styles = useStyles();
  const {theme} = useTheme();
  const {
    must_upgrade_ticketing,
    enable_recent_tickets,
    enable_login,
    enable_period_tickets,
  } = useRemoteConfig();
  const {abtCustomerId, authenticationType} = useAuthState();
  const {t} = useTranslation();

  if (must_upgrade_ticketing) return <UpgradeSplash />;

  const isSignedInAsAbtCustomer = !!abtCustomerId;

  const onBuySingleTicket = () => {
    navigation.navigate('TicketPurchase', {
      screen: 'PurchaseOverview',
      params: {
        selectableProductType: 'single',
      },
    });
  };

  const onBuyPeriodTicket = () => {
    if (authenticationType === 'phone' || !enable_login) {
      navigation.navigate('TicketPurchase', {
        screen: 'PurchaseOverview',
        params: {
          selectableProductType: 'period',
        },
      });
    } else {
      navigation.navigate('Login', {
        screen: 'PhoneInput',
        params: {
          loginReason: t(TicketsTexts.buyTicketsTab.loginReason),
          afterLogin: {
            routeName: 'TicketPurchase',
            routeParams: {selectableProductType: 'period'},
          },
        },
      });
    }
  };

  return (
    <View style={styles.container}>
      {enable_recent_tickets ? (
        <RecentTicketsScrollView />
      ) : (
        <View style={{flex: 1}} />
      )}
      {isSignedInAsAbtCustomer && (
        <View style={{padding: theme.spacings.medium}}>
          <Button
            mode="primary"
            color="primary_2"
            text={t(TicketsTexts.buyTicketsTab.button.single.text)}
            accessibilityHint={t(
              TicketsTexts.buyTicketsTab.button.single.a11yHint,
            )}
            onPress={onBuySingleTicket}
          />
          {enable_period_tickets && (
            <Button
              mode="primary"
              color="primary_2"
              text={t(TicketsTexts.buyTicketsTab.button.period.text)}
              accessibilityHint={t(
                TicketsTexts.buyTicketsTab.button.period.a11yHint,
              )}
              onPress={onBuyPeriodTicket}
              viewContainerStyle={styles.buyPeriodTicketButton}
            />
          )}
        </View>
      )}
    </View>
  );
};

export const ActiveTickets: React.FC<Props> = () => {
  const {
    activeReservations,
    activeFareContracts,
    isRefreshingTickets,
    refreshTickets,
  } = useTicketState();

  const [now, setNow] = useState<number>(Date.now());
  useInterval(() => setNow(Date.now()), 2500);

  const styles = useStyles();
  const {t} = useTranslation();
  return (
    <View style={styles.container}>
      <TicketsScrollView
        reservations={activeReservations}
        fareContracts={activeFareContracts}
        isRefreshingTickets={isRefreshingTickets}
        refreshTickets={refreshTickets}
        noTicketsLabel={t(TicketsTexts.activeTicketsTab.noTickets)}
        now={now}
      />
    </View>
  );
};

export const ExpiredTickets: React.FC<Props> = () => {
  const {
    expiredFareContracts,
    isRefreshingTickets,
    refreshTickets,
  } = useTicketState();

  const [now, setNow] = useState<number>(Date.now());
  useInterval(() => setNow(Date.now()), 2500);

  const styles = useStyles();
  const {t} = useTranslation();
  return (
    <View style={styles.container}>
      <TicketsScrollView
        fareContracts={expiredFareContracts}
        isRefreshingTickets={isRefreshingTickets}
        refreshTickets={refreshTickets}
        noTicketsLabel={t(TicketsTexts.expiredTicketsTab.noTickets)}
        now={now}
      />
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.background.level1,
  },
  buyPeriodTicketButton: {
    marginTop: theme.spacings.medium,
  },
}));
