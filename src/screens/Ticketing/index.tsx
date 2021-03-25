import {useRemoteConfig} from '@atb/RemoteConfigContext';
import React from 'react';
import Splash from './Splash';
import Tickets from './Tickets';

export default function Ticketing() {
  const {enable_ticketing} = useRemoteConfig();

  return !false ? <Splash /> : <Tickets />;
}
