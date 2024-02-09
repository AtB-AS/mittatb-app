import {
  Language,
  TranslateFunction,
  TripDetailsTexts,
  useTranslation,
} from '@atb/translations';
import {MessageInfoBox, OnPressConfig} from '@atb/components/message-info-box';
import {
  formatToShortDateTimeWithRelativeDayNames,
  secondsToMinutesLong,
} from '@atb/utils/date';

import {
  getEarliestBookingDate,
  getIsTooEarlyToBook,
  getLatestBookingDate,
  getBookingIsAvailableImminently,
  doesRequiresBookingUrgently,
  getSecondsRemainingUntilBookingAvailable,
  getSecondsRemainingToBookingDeadline,
} from '../utils';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {BookingArrangementFragment} from '@atb/api/types/generated/fragments/booking-arrangements';

type Props = {
  bookingArrangements?: BookingArrangementFragment;
  aimedStartTime: string;
  publicCode: string;
  now: number;
  showStatusIcon: boolean;
  onPressConfig?: OnPressConfig;
};

export const BookingInfoBox = ({
  bookingArrangements,
  aimedStartTime,
  publicCode,
  now,
  showStatusIcon,
  onPressConfig,
}: Props) => {
  const {t, language} = useTranslation();

  const {flex_booking_number_of_days_available} = useRemoteConfig();

  if (!bookingArrangements) return null;

  const requiresBookingUrgently = doesRequiresBookingUrgently(
    bookingArrangements,
    aimedStartTime,
    now,
  );
  const bookingIsAvailableImminently = getBookingIsAvailableImminently(
    bookingArrangements,
    aimedStartTime,
    now,
    flex_booking_number_of_days_available,
  );
  const isTooEarly = getIsTooEarlyToBook(
    bookingArrangements,
    aimedStartTime,
    now,
    flex_booking_number_of_days_available,
  );

  const formattedTimeForLegBooking = getFormattedTimeForBooking(
    bookingArrangements,
    aimedStartTime,
    now,
    flex_booking_number_of_days_available,
    t,
    language,
  );

  return (
    <MessageInfoBox
      type={requiresBookingUrgently ? 'warning' : 'info'}
      noStatusIcon={!showStatusIcon}
      message={t(
        TripDetailsTexts.flexibleTransport?.[
          isTooEarly
            ? 'needsBookingButIsTooEarly'
            : 'needsBookingAndIsAvailable'
        ](
          publicCode,
          formattedTimeForLegBooking,
          isTooEarly ? bookingIsAvailableImminently : requiresBookingUrgently,
        ),
      )}
      onPressConfig={onPressConfig}
    />
  );
};

function getFormattedTimeForBooking(
  bookingArrangements: BookingArrangementFragment,
  expectedStartTime: string,
  now: number,
  flex_booking_number_of_days_available: number,
  t: TranslateFunction,
  language: Language,
): string {
  const requiresBookingUrgently = doesRequiresBookingUrgently(
    bookingArrangements,
    expectedStartTime,
    now,
  );
  const bookingIsAvailableImminently = getBookingIsAvailableImminently(
    bookingArrangements,
    expectedStartTime,
    now,
    flex_booking_number_of_days_available,
  );
  const isTooEarly = getIsTooEarlyToBook(
    bookingArrangements,
    expectedStartTime,
    now,
    flex_booking_number_of_days_available,
  );

  if (requiresBookingUrgently || bookingIsAvailableImminently) {
    const secondsRemainingToAvailable =
      getSecondsRemainingUntilBookingAvailable(
        bookingArrangements,
        expectedStartTime,
        now,
        flex_booking_number_of_days_available,
      );
    const secondsRemainingToDeadline = getSecondsRemainingToBookingDeadline(
      bookingArrangements,
      expectedStartTime,
      now,
    );

    return secondsToMinutesLong(
      isTooEarly ? secondsRemainingToAvailable : secondsRemainingToDeadline,
      language,
    );
  } else {
    const earliestBookingDate = getEarliestBookingDate(
      bookingArrangements,
      expectedStartTime,
      flex_booking_number_of_days_available,
    );
    const latestBookingDate = getLatestBookingDate(
      bookingArrangements,
      expectedStartTime,
    );
    const nextBookingStateChangeDate = isTooEarly
      ? earliestBookingDate
      : latestBookingDate;

    return formatToShortDateTimeWithRelativeDayNames(
      new Date(now),
      nextBookingStateChangeDate,
      t,
      language,
    );
  }
}
