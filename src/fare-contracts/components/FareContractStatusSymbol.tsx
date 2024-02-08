import React from 'react';
import {ThemeIcon} from '@atb/components/theme-icon';
import {TicketInvalid} from '@atb/assets/svg/mono-icons/ticketing';
import {Time} from '@atb/assets/svg/mono-icons/time';
import {ValidityStatus} from '@atb/fare-contracts/utils';
import {Ticket} from '@atb/assets/svg/color/images';
import {TicketingTexts, useTranslation} from '@atb/translations';
import {Ticket as SentTicket} from '@atb/assets/svg/mono-icons/ticketing';

export const FareContractStatusSymbol = ({
  status,
}: {
  status: ValidityStatus;
}) => {
  const {t} = useTranslation();
  switch (status) {
    case 'expired':
    case 'refunded':
    case 'rejected':
    case 'cancelled':
      return (
        <ThemeIcon
          svg={TicketInvalid}
          colorType="error"
          size="large"
          accessibilityLabel={t(
            TicketingTexts.ticketStatusSymbolA11yLabel[status],
          )}
        />
      );
    case 'upcoming':
      return (
        <ThemeIcon
          svg={Time}
          colorType="primary"
          size="large"
          accessibilityLabel={t(
            TicketingTexts.ticketStatusSymbolA11yLabel[status],
          )}
        />
      );
    case 'approved':
      return (
        <ThemeIcon
          svg={Ticket}
          accessibilityLabel={t(
            TicketingTexts.ticketStatusSymbolA11yLabel[status],
          )}
        />
      );
    case 'sent':
      return (
        <ThemeIcon
          svg={SentTicket}
          colorType="secondary"
          accessibilityLabel={t(
            TicketingTexts.ticketStatusSymbolA11yLabel[status],
          )}
        />
      );
    case 'reserving':
    case 'unknown':
    default:
      return null;
  }
};
