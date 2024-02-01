import React from 'react';
import {ProfileScreenProps} from './navigation-types';
import {TicketHistoryScreenComponent} from '@atb/ticket-history';

type Props = ProfileScreenProps<'Profile_TicketHistoryScreen'>;

export const Profile_TicketHistoryScreen = ({route}: Props) => {
  return <TicketHistoryScreenComponent mode={route.params.mode} />;
};
