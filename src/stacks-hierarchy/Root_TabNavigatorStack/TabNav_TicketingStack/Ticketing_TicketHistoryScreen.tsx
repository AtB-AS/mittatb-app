import React from 'react';
import {TicketTabNavScreenProps} from './Ticketing_TicketTabNavStack/navigation-types';
import {TicketHistoryScreenComponent} from '@atb/ticket-history';

type Props = TicketTabNavScreenProps<'Ticketing_TicketHistoryScreen'>;

export const Ticketing_TicketHistoryScreen = ({route}: Props) => {
  return <TicketHistoryScreenComponent mode={route.params.mode} />;
};
