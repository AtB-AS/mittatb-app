import React, {useState} from 'react';
import {View} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useTicketState} from '../../../TicketContext';
import {StyleSheet, useTheme} from '../../../theme';
import useInterval from '../../../utils/use-interval';
import TicketsScrollView from './TicketsScrollView';
import {RootStackParamList} from '../../../navigation';
import {TicketsTexts, useTranslation} from '../../../translations';
import Button from '../../../components/button';
import {useRemoteConfig} from '../../../RemoteConfigContext';
import UpgradeSplash from './UpgradeSplash';

export type TicketingScreenNavigationProp = StackNavigationProp<RootStackParamList>;

type Props = {
  navigation: TicketingScreenNavigationProp;
};

export const BuyTickets: React.FC<Props> = ({navigation}) => {
  const styles = useStyles();
  const {theme} = useTheme();
  const {must_upgrade_ticketing} = useRemoteConfig();
  const {t} = useTranslation();

  if (must_upgrade_ticketing) return <UpgradeSplash />;

  return (
    <View style={styles.container}>
      <View style={{flex: 1}}>{/*Reservert for "Sist kjøpte billetter"*/}</View>
      <View style={{padding: theme.spacings.medium}}>
        <Button
          mode="primary"
          text={t(TicketsTexts.buyTicketsTab.button.text)}
          accessibilityHint={t(TicketsTexts.buyTicketsTab.button.a11yHint)}
          onPress={() => navigation.navigate('TicketPurchase', {})}
        />
      </View>
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
        tickets={activeFareContracts}
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
        tickets={expiredFareContracts}
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
}));
