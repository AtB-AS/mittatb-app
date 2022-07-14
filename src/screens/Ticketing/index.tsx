import {useRemoteConfig} from '@atb/RemoteConfigContext';
import React from 'react';
import Splash from './Splash';
import Tickets from './Tickets';
import {useAppState} from '@atb/AppContext';
import {useIsFocused} from '@react-navigation/native';

export default function Ticketing() {
  const {enable_ticketing} = useRemoteConfig();
  const {callerRoute, setCallerRouteForMobileTokenOnboarding} = useAppState();

  const isFocused = useIsFocused();
  if (callerRoute === 'Ticketing' && isFocused) {
    setCallerRouteForMobileTokenOnboarding(undefined);
  }

  return !enable_ticketing ? <Splash /> : <Tickets />;
}
