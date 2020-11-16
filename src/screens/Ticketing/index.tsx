import React from 'react';
import Tickets from './Tickets';
import Splash from './Splash';
import {useRemoteConfig} from '../../RemoteConfigContext';

export default function Ticketing() {
  const {enable_ticketing} = useRemoteConfig();

  return !enable_ticketing ? <Splash /> : <Tickets />;
}
