import {useRemoteConfig} from '@atb/RemoteConfigContext';
import React from 'react';
import Splash from './Splash';
import Tickets from './FareProducts';

export default function Ticketing() {
  const {enable_ticketing} = useRemoteConfig();

  return !enable_ticketing ? <Splash /> : <Tickets />;
}
