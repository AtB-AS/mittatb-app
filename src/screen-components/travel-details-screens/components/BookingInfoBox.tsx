import {TripDetailsTexts, useTranslation} from '@atb/translations';
import {MessageInfoBox, OnPressConfig} from '@atb/components/message-info-box';
import {formatToShortDateTimeWithRelativeDayNames} from '@atb/utils/date';

import {
  getBookingStatus,
  getEarliestBookingDate,
  getLatestBookingDate,
} from '../utils';
import {useRemoteConfigContext} from '@atb/modules/remote-config';
import {BookingArrangementFragment} from '@atb/api/types/generated/fragments/booking-arrangements';
import {BookingArrangement} from '@atb/api/types/generated/journey_planner_v3_types';
import {RefObject} from 'react';

type Props = {
  bookingArrangements?: BookingArrangementFragment;
  aimedStartTime: string;
  now: number;
  onPressConfig?: OnPressConfig;
  focusRef?: RefObject<any>;
};

export const BookingInfoBox = ({
  bookingArrangements,
  aimedStartTime,
  now,
  onPressConfig,
  focusRef,
}: Props) => {
  const bookingMessage = useBookingMessage(
    bookingArrangements,
    aimedStartTime,
    now,
  );

  if (!bookingMessage) return null;

  const bookingStatus = getBookingStatus(
    bookingArrangements,
    aimedStartTime,
    now,
  );

  return (
    <MessageInfoBox
      type={bookingStatus === 'late' ? 'error' : 'warning'}
      message={bookingMessage}
      onPressConfig={onPressConfig}
      focusRef={focusRef}
    />
  );
};

const useBookingMessage = (
  bookingArrangements: BookingArrangement | undefined,
  aimedStartTime: string,
  now: number,
): string | undefined => {
  const {t, language} = useTranslation();
  const {flex_booking_number_of_days_available} = useRemoteConfigContext();
  if (!bookingArrangements) return undefined;

  const status = getBookingStatus(
    bookingArrangements,
    aimedStartTime,
    now,
    flex_booking_number_of_days_available,
  );

  const formatDate = (date: Date) =>
    formatToShortDateTimeWithRelativeDayNames(new Date(now), date, t, language);

  switch (status) {
    case 'early': {
      const earliestBookingDate = getEarliestBookingDate(
        bookingArrangements,
        aimedStartTime,
        flex_booking_number_of_days_available,
      );
      return t(
        TripDetailsTexts.flexibleTransport.needsBookingButIsTooEarly(
          formatDate(earliestBookingDate),
        ),
      );
    }
    case 'bookable': {
      const latestBookingDate = getLatestBookingDate(
        bookingArrangements,
        aimedStartTime,
      );
      return t(
        TripDetailsTexts.flexibleTransport.needsBookingAndIsAvailable(
          formatDate(latestBookingDate),
        ),
      );
    }
    case 'late': {
      return t(TripDetailsTexts.flexibleTransport.needsBookingButIsTooLate);
    }
    case 'none':
      return undefined;
  }
};
