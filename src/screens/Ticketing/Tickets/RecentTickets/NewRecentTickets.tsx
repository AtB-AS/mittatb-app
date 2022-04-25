import React from 'react';
import {StyleSheet} from '@atb/theme';
import {ScrollView, StyleProp, ViewStyle} from 'react-native';
import useRecentTickets, {RecentTicket} from '../use-recent-tickets';
import {RecentTicketComponent} from './RecentTicketComponent';
import {
  Mode,
  TransportSubmode,
} from '@atb/api/types/generated/journey_planner_v3_types';
import {productIsSellableInApp} from '@atb/reference-data/utils';

type NewRecentTicketsProps = {
  navigation: any;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

export const NewRecentTickets = ({
  navigation,
  contentContainerStyle,
}: NewRecentTicketsProps) => {
  const styles = useStyles();
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
      contentContainerStyle={contentContainerStyle}
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
