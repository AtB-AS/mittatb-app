import React from 'react';
import ThemeIcon from '@atb/components/theme-icon';
import {TicketInvalid} from '@atb/assets/svg/mono-icons/ticketing';
import {Time} from '@atb/assets/svg/mono-icons/time';
import {ValidityStatus} from '@atb/screens/Ticketing/FareContracts/utils';
import {Ticket} from '@atb/assets/svg/color/images';
import {TicketsTexts, useTranslation} from '@atb/translations';

const FareContractStatusSymbol = ({status}: {status: ValidityStatus}) => {
  const {t} = useTranslation();
  switch (status) {
    case 'expired':
    case 'refunded':
    case 'rejected':
      return (
        <ThemeIcon
          svg={TicketInvalid}
          colorType="error"
          size={'large'}
          accessibilityLabel={t(
            TicketsTexts.ticketStatusSymbolA11yLabel[status],
          )}
        />
      );
    case 'upcoming':
      return (
        <ThemeIcon
          svg={Time}
          colorType="primary"
          size={'large'}
          accessibilityLabel={t(
            TicketsTexts.ticketStatusSymbolA11yLabel[status],
          )}
        />
      );
    case 'approved':
      return (
        <ThemeIcon
          svg={Ticket}
          accessibilityLabel={t(
            TicketsTexts.ticketStatusSymbolA11yLabel[status],
          )}
        />
      );
    case 'reserving':
    case 'unknown':
    default:
      return null;
  }
};

export default FareContractStatusSymbol;
