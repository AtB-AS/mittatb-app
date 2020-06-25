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
  const {url, transaction_id, payment_id} = route.params;
  const {activatePollingForNewTickets} = useTicketState();
  useEffect(() => {
    const capture = async () => {
      await capturePayment(payment_id, transaction_id);
      activatePollingForNewTickets();
      navigation.popToTop();
    };
    capture();
  });

  return (
    <></>
  );
};

export default Vipps;
