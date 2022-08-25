import React, {useMemo} from 'react';
import {StyleSheet, useTheme} from '@atb/theme';
import {ScrollView, View, ActivityIndicator, Dimensions} from 'react-native';
import useRecentTickets, {RecentTicket} from '../use-recent-tickets';
import {RecentTicketComponent} from './RecentTicketComponent';
import {
  Mode,
  TransportSubmode,
} from '@atb/api/types/generated/journey_planner_v3_types';
import {productIsSellableInApp} from '@atb/reference-data/utils';
import {RootStackParamList} from '@atb/navigation';
import {CompositeNavigationProp, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {TicketingStackParams} from '../../Purchase';
import ThemeText from '@atb/components/text';
import {TicketsTexts, useTranslation} from '@atb/translations';
import RecentTicketsTexts from '@atb/translations/screens/subscreens/RecentTicketsTexts';

type NavigationProp = CompositeNavigationProp<
  StackNavigationProp<TicketingStackParams>,
  StackNavigationProp<RootStackParamList>
>;

export const RecentTickets = () => {
  const navigation = useNavigation<NavigationProp>();
  const styles = useStyles();
  const {theme} = useTheme();
  const {t} = useTranslation();
  const {recentTickets, loading} = useRecentTickets();

  const selectTicket = (ticket: RecentTicket) => {
    navigation.navigate('TicketPurchase', {
      screen: 'PurchaseOverview',
      params: {
        preassignedFareProduct: ticket.preassignedFareProduct,
        userProfilesWithCount: ticket.userProfilesWithCount,
        fromTariffZone: {...ticket.fromTariffZone, resultType: 'zone'},
        toTariffZone: {...ticket.toTariffZone, resultType: 'zone'},
      },
    });
  };

  const filterRecentTickets = (recentTicketsArray: RecentTicket[]) =>
    recentTicketsArray
      .filter((recentTicket) => {
        const ticketType = recentTicket.preassignedFareProduct.type;
        if (
          ticketType === 'single' ||
          ticketType === 'period' ||
          ticketType === 'carnet' ||
          ticketType === 'hour24'
        )
          return true;
        else return false;
      })
      .filter((recentTicket) =>
        productIsSellableInApp(recentTicket.preassignedFareProduct),
      );

  const memoizedRecentTickets = useMemo(
    () => filterRecentTickets(recentTickets),
    [recentTickets],
  );

  return (
    <View
      style={{backgroundColor: theme.static.background.background_1.background}}
    >
      {loading && (
        <View
          style={{
            paddingVertical: theme.spacings.xLarge,
          }}
          accessible={true}
          accessibilityLabel={t(RecentTicketsTexts.titles.loading)}
        >
          <ThemeText
            type="body__primary"
            style={{textAlign: 'center', marginBottom: theme.spacings.large}}
          >
            {t(TicketsTexts.recentTickets.loading)}
          </ThemeText>
          <ActivityIndicator
            color={theme.static.background.background_0.text}
          />
        </View>
      )}

      {!loading && !!recentTickets.length && (
        <>
          <ThemeText type="body__secondary" style={styles.header}>
            {t(RecentTicketsTexts.repeatPurchase.label)}
          </ThemeText>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              paddingHorizontal: theme.spacings.xSmall,
            }}
            style={styles.horizontalScrollView}
            testID="recentTicketsScrollView"
          >
            {memoizedRecentTickets.map((ticket) => {
              const componentKey =
                ticket.preassignedFareProduct.id +
                ticket.userProfilesWithCount
                  .map((traveller) => {
                    return traveller.count + traveller.userTypeString;
                  })
                  .join();
              return (
                <RecentTicketComponent
                  key={componentKey}
                  ticketData={ticket}
                  transportModeTexts={[
                    {
                      mode: Mode.Bus,
                    },
                    {
                      mode: Mode.Tram,
                    },
                  ]}
                  transportModeIcons={[
                    {mode: Mode.Bus, subMode: TransportSubmode.LocalBus},
                  ]}
                  selectTicket={selectTicket}
                  testID={'recent' + memoizedRecentTickets.indexOf(ticket)}
                />
              );
            })}
          </ScrollView>
        </>
      )}
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  horizontalScrollView: {
    marginVertical: theme.spacings.medium,
  },
  header: {
    marginTop: theme.spacings.xLarge,
    marginLeft: theme.spacings.xLarge,
  },
}));
