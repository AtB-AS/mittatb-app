import React from 'react';
import ThemeIcon from '@atb/components/theme-icon';
import {TicketAdd, TicketInvalid} from '@atb/assets/svg/mono-icons/ticketing';
import {Time} from '@atb/assets/svg/mono-icons/time';
import {ValidityStatus} from '@atb/screens/Ticketing/Ticket/utils';

const TicketStatusSymbol = ({status}: {status: ValidityStatus}) => {
  switch (status) {
    case 'expired':
    case 'refunded':
      return <ThemeIcon svg={TicketInvalid} colorType="error" size={'large'} />;
    case 'upcoming':
      return <ThemeIcon svg={Time} colorType="primary" size={'large'} />;
    case 'reserving':
    case 'unknown':
    default:
      return null;
  }
};

export default TicketStatusSymbol;
