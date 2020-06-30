import {StackNavigationProp} from '@react-navigation/stack';
import {TicketingStackParams} from '../../index';
import {RouteProp} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {capturePayment} from '../../../../api';
import {useTicketState} from '../../TicketContext';

type Props = {
  navigation: StackNavigationProp<TicketingStackParams, 'PaymentVipps'>;
  route: RouteProp<TicketingStackParams, 'PaymentVipps'>;
};

const Vipps: React.FC<Props> = ({navigation, route}) => {
  const {activatePollingForNewTickets} = useTicketState();
  useEffect(() => {
    activatePollingForNewTickets();
    navigation.popToTop();
  }, []);

  return <></>;
};

export default Vipps;
