import React from 'react';
import ThemeIcon from '@atb/components/theme-icon';
import {TicketInvalid} from '@atb/assets/svg/mono-icons/ticketing';
import {Time} from '@atb/assets/svg/mono-icons/time';
import {ValidityStatus} from '@atb/screens/Ticketing/Ticket/utils';
import {Ticket} from '@atb/assets/svg/color/images';

const TicketStatusSymbol = ({status}: {status: ValidityStatus}) => {
  switch (status) {
    case 'expired':
    case 'refunded':
    case 'rejected':
      return <ThemeIcon svg={TicketInvalid} colorType="error" size={'large'} />;
    case 'upcoming':
      return <ThemeIcon svg={Time} colorType="primary" size={'large'} />;
    case 'approved':
      return <ThemeIcon svg={Ticket} />;
    case 'reserving':
    case 'unknown':
    default:
      return null;
  }
};

export default TicketStatusSymbol;
