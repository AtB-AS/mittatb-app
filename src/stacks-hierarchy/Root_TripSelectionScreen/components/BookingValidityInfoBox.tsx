import type {FareContractStub} from '@atb/modules/purchase-selection';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {TicketingTexts, useTranslation} from '@atb/translations';
import {formatToLongDateTime} from '@atb/utils/date';
import type {TripPatternWithBooking} from '@atb/api/types/trips';

type Props = {
  tripPatterns: TripPatternWithBooking[];
  originFareContract?: FareContractStub;
};

export function BookingValidityInfoBox({
  tripPatterns,
  originFareContract,
}: Props) {
  const {t, language} = useTranslation();
  const message = (() => {
    if (
      originFareContract?.endDate &&
      tripPatterns.some(
        (tp) => tp.booking.disabledReason === 'expired_fare_contract',
      )
    ) {
      return t(
        TicketingTexts.booking.ticketExpiresAt(
          formatToLongDateTime(originFareContract.endDate, language),
        ),
      );
    }
    if (
      originFareContract?.startDate &&
      tripPatterns.some(
        (tp) => tp.booking.disabledReason === 'inactive_fare_contract',
      )
    ) {
      return t(
        TicketingTexts.booking.ticketStartsAt(
          formatToLongDateTime(originFareContract.startDate, language),
        ),
      );
    }
  })();

  if (!message) return null;

  return <MessageInfoBox type="info" message={message} />;
}
