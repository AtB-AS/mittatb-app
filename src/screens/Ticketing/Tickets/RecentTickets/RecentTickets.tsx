import RecentTicketsScrollView from '@atb/screens/Ticketing/Tickets/RecentTickets/RecentTicketsScrollView';
import {TouchableOpacity, View} from 'react-native';
import React from 'react';
import MessageBox from '@atb/components/message-box';
import ThemeText from '@atb/components/text';
import {useAppState} from '@atb/AppContext';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {TicketsTexts, useTranslation} from '@atb/translations';
import {useTheme} from '@atb/theme';

export const RecentTickets = () => {
  const appContext = useAppState();
  const enableTicketingOverlay = () => {
    appContext.resetTicketing();
  };
  const {theme} = useTheme();
  const {must_upgrade_ticketing, enable_recent_tickets} = useRemoteConfig();
  const {t} = useTranslation();

  return <>{enable_recent_tickets ? <RecentTicketsScrollView /> : null}</>;
};
