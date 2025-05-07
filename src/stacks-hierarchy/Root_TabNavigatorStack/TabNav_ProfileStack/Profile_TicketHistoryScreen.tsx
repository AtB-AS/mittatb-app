import React from 'react';
import {ProfileScreenProps} from './navigation-types';
import {TicketHistoryScreenComponent} from '@atb/screen-components/ticket-history';

type Props = ProfileScreenProps<'Profile_TicketHistoryScreen'>;

export const Profile_TicketHistoryScreen = ({route, navigation}: Props) => {
  return (
    <TicketHistoryScreenComponent
      mode={route.params.mode}
      onPressFareContract={(fareContractId) =>
        navigation.navigate('Root_FareContractDetailsScreen', {fareContractId})
      }
    />
  );
};
