import {StackNavigationProp} from '@react-navigation/stack';
import {TicketingStackParams} from '../../index';
import {RouteProp} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {
  PaymentFailedReason,
  useTicketState,
} from '../../../../../TicketContext';

type Props = {
  navigation: StackNavigationProp<TicketingStackParams, 'PaymentVipps'>;
  route: RouteProp<TicketingStackParams, 'PaymentVipps'>;
};

enum VippsPaymentStatus {
  Succeeded = '100',
  UserCancelled = '202',
}

const Vipps: React.FC<Props> = ({navigation, route}) => {
  const {
    paymentFailedForReason,
    activatePollingForNewTickets,
  } = useTicketState();

  useEffect(() => {
    // @TODO Using the 'status' parameter in the Vipps redirect handler is
    // deprecated see
    // https://github.com/vippsas/vipps-ecom-api/blob/master/vipps-ecom-api.md#app-switching
    //
    // We should probably fetch the payment status from the ticketing service
    // instead.
    switch (route.params.status) {
      case VippsPaymentStatus.Succeeded:
        activatePollingForNewTickets();
        break;
      case VippsPaymentStatus.UserCancelled:
        paymentFailedForReason(PaymentFailedReason.UserCancelled);
        break;
      default:
        paymentFailedForReason(PaymentFailedReason.Unknown);
    }
    navigation.popToTop();
  }, []);

  return <></>;
};

export default Vipps;
