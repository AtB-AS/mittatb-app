import React from 'react';
import {StyleSheet, useTheme} from '@atb/theme';
import {ScrollView, StyleProp, ViewStyle, View} from 'react-native';
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

type NavigationProp = CompositeNavigationProp<
  StackNavigationProp<TicketingStackParams>,
  StackNavigationProp<RootStackParamList>
>;

export const RecentTickets = () => {
  const navigation = useNavigation<NavigationProp>();
  const styles = useStyles();
  const {theme} = useTheme();
  const {recentTickets, loading, refresh} = useRecentTickets();

  const selectTicket = (ticket: RecentTicket) => {
    navigation.navigate('TicketPurchase', {
      screen: 'Confirmation',
      params: {
        ...ticket,
        headerLeftButton: {type: 'cancel'},
      },
    });
  };

  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{
        marginVertical: theme.spacings.medium,
        paddingHorizontal: theme.spacings.xSmall,
      }}
      style={styles.horizontalScrollView}
    >
      {recentTickets
        .filter((recentTicket) => {
          const t = recentTicket.preassignedFareProduct.type;
          if (t === 'single' || t === 'period' || t === 'carnet') return true;
          else return false;
        })
        .filter((recentTicket) =>
          productIsSellableInApp(recentTicket.preassignedFareProduct),
        )
        .map((ticket, index) => (
          <RecentTicketComponent
            key={index}
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
          />
        ))}
    </ScrollView>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  horizontalScrollView: {
    marginVertical: theme.spacings.medium,
  },
}));
