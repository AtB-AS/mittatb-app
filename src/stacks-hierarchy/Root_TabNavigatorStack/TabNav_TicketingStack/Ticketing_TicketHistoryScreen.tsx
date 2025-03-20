import React from 'react';
import {TicketHistoryScreenComponent} from '@atb/ticket-history';
import {TicketingScreenProps} from './navigation-types';

type Props = TicketingScreenProps<'Ticketing_TicketHistoryScreen'>;

export const Ticketing_TicketHistoryScreen = ({route, navigation}: Props) => {
  return (
    <TicketHistoryScreenComponent
      mode={route.params.mode}
      onPressFareContract={(fareContractId) =>
        navigation.navigate('Root_FareContractDetailsScreen', {fareContractId})
      }
    />
  );
};
