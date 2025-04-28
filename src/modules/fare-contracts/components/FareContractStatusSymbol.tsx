import React from 'react';
import {ThemeIcon} from '@atb/components/theme-icon';
import {TicketInvalid} from '@atb/assets/svg/mono-icons/ticketing';
import {Time} from '@atb/assets/svg/mono-icons/time';
import {ValidityStatus} from '../utils';
import {TicketingTexts, useTranslation} from '@atb/translations';
import {Ticket as SentTicket} from '@atb/assets/svg/mono-icons/ticketing';
import {ThemedTicket} from '@atb/theme/ThemedAssets';

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
          color="error"
          accessibilityLabel={t(
            TicketingTexts.ticketStatusSymbolA11yLabel[status],
          )}
        />
      );
    case 'upcoming':
      return (
        <ThemeIcon
          svg={Time}
          accessibilityLabel={t(
            TicketingTexts.ticketStatusSymbolA11yLabel[status],
          )}
        />
      );
    case 'approved':
      return (
        <ThemeIcon
          svg={ThemedTicket}
          accessibilityLabel={t(
            TicketingTexts.ticketStatusSymbolA11yLabel[status],
          )}
        />
      );
    case 'sent':
      return (
        <ThemeIcon
          svg={SentTicket}
          color="secondary"
          accessibilityLabel={t(
            TicketingTexts.ticketStatusSymbolA11yLabel[status],
          )}
        />
      );
    case 'reserving':
    default:
      return null;
  }
};
