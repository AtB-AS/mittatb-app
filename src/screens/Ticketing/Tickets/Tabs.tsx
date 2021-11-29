import {useAuthState} from '@atb/auth';
import Button from '@atb/components/button';
import {RootStackParamList} from '@atb/navigation';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {StyleSheet, useTheme} from '@atb/theme';
import {
  filterActiveOrCanBeUsedFareContracts,
  filterExpiredFareContracts,
  isValidRightNowFareContract,
  useTicketState,
} from '@atb/tickets';
import {TicketsTexts, useTranslation} from '@atb/translations';
import useInterval from '@atb/utils/use-interval';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import RecentTicketsScrollView from './RecentTicketsScrollView';
import TicketsScrollView from './TicketsScrollView';
import UpgradeSplash from './UpgradeSplash';
import {AddTicket} from '@atb/assets/svg/icons/ticketing';
import ThemeText from '@atb/components/text';
import MessageBox from '@atb/components/message-box';
import {useAppState} from '@atb/AppContext';

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
    enable_period_tickets,
  } = useRemoteConfig();
  const {abtCustomerId, authenticationType} = useAuthState();
  const {t} = useTranslation();
  const appContext = useAppState();

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
    if (authenticationType === 'phone') {
      navigation.navigate('TicketPurchase', {
        screen: 'PurchaseOverview',
        params: {
          selectableProductType: 'period',
        },
      });
    } else {
      navigation.navigate('LoginInApp', {
        screen: 'LoginOnboardingInApp',
        params: {
          afterLogin: {
            routeName: 'TicketPurchase',
            routeParams: {selectableProductType: 'period'},
          },
        },
      });
    }
  };

  const enableTicketingOverlay = () => {
    appContext.resetTicketing();
  };

  const topMessage = (
    <View style={{paddingBottom: theme.spacings.large}}>
      <MessageBox>
        <ThemeText type="body__primary" color="primary_1" isMarkdown={true}>
          {t(TicketsTexts.buyTicketsTab.reactivateSplash.message)}
        </ThemeText>

        <TouchableOpacity
          onPress={enableTicketingOverlay}
          accessibilityLabel={t(
            TicketsTexts.buyTicketsTab.reactivateSplash.linkA11yHint,
          )}
        >
          <ThemeText type="body__primary--underline" color="primary_1">
            {t(TicketsTexts.buyTicketsTab.reactivateSplash.linkText)}
          </ThemeText>
        </TouchableOpacity>
      </MessageBox>
    </View>
  );

  return (
    <View style={styles.container}>
      {enable_recent_tickets ? (
        <RecentTicketsScrollView
          topElement={topMessage}
        ></RecentTicketsScrollView>
      ) : (
        <View style={{flex: 1, padding: theme.spacings.medium}}>
          {topMessage}
        </View>
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
            icon={AddTicket}
            iconPosition={'right'}
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
              icon={AddTicket}
              iconPosition={'right'}
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
    fareContracts,
    isRefreshingTickets,
    refreshTickets,
    customerProfile,
    didPaymentFail,
  } = useTicketState();

  const activeFareContracts = filterActiveOrCanBeUsedFareContracts(
    fareContracts,
  ).sort(function (a, b): number {
    const isA = isValidRightNowFareContract(a);
    const isB = isValidRightNowFareContract(b);

    if (isA === isB) return 0;
    if (isA) return -1;
    return 1;
  });

  const hasAnyFareContractsOnAccount = fareContracts.length > 0;

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
        noTicketsLabel={t(
          hasAnyFareContractsOnAccount
            ? TicketsTexts.activeTicketsTab.noTicketsExpiredHelpText
            : TicketsTexts.activeTicketsTab.noTickets,
        )}
        now={now}
        travelCard={customerProfile?.travelcard}
        didPaymentFail={didPaymentFail}
      />
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
}));
