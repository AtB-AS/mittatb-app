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

import {Leg} from '@atb/api/types/trips';
import {
  getEarliestBookingDateFromLeg,
  getIsTooEarlyToBookLeg,
  getLatestBookingDateFromLeg,
  getLegBookingIsAvailableImminently,
  getLegRequiresBookingUrgently, getPublicCodeFromLeg,
  getSecondsRemainingToLegBookingAvailable,
  getSecondsRemainingToLegBookingDeadline,
} from '../utils';
import {useRemoteConfig} from '@atb/RemoteConfigContext';

type Props = {
  leg: Leg;
  now: number;
  showStatusIcon: boolean;
  onPressConfig?: OnPressConfig;
};

export const BookingInfoBox = ({
  leg,
  now,
  showStatusIcon,
  onPressConfig,
}: Props) => {
  const {t, language} = useTranslation();

  const {flex_booking_number_of_days_available} = useRemoteConfig();
  const requiresBookingUrgently = getLegRequiresBookingUrgently(leg, now);
  const bookingIsAvailableImminently = getLegBookingIsAvailableImminently(
    leg,
    now,
    flex_booking_number_of_days_available,
  );
  const isTooEarly = getIsTooEarlyToBookLeg(
    leg,
    now,
    flex_booking_number_of_days_available,
  );

  const formattedTimeForLegBooking = getFormattedTimeForLegBooking(
    leg,
    now,
    flex_booking_number_of_days_available,
    t,
    language,
  );

  const publicCode = getPublicCodeFromLeg(leg);

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

function getFormattedTimeForLegBooking(
  leg: Leg,
  now: number,
  flex_booking_number_of_days_available: number,
  t: TranslateFunction,
  language: Language,
): string {
  if (!leg.bookingArrangements) {
    return '';
  } else {
    const requiresBookingUrgently = getLegRequiresBookingUrgently(leg, now);
    const bookingIsAvailableImminently = getLegBookingIsAvailableImminently(
      leg,
      now,
      flex_booking_number_of_days_available,
    );
    const isTooEarly = getIsTooEarlyToBookLeg(
      leg,
      now,
      flex_booking_number_of_days_available,
    );

    if (requiresBookingUrgently || bookingIsAvailableImminently) {
      const secondsRemainingToAvailable =
        getSecondsRemainingToLegBookingAvailable(
          leg,
          now,
          flex_booking_number_of_days_available,
        );
      const secondsRemainingToDeadline =
        getSecondsRemainingToLegBookingDeadline(leg, now);

      return secondsToMinutesLong(
        isTooEarly ? secondsRemainingToAvailable : secondsRemainingToDeadline,
        language,
      );
    } else {
      const earliestBookingDate = getEarliestBookingDateFromLeg(
        leg,
        flex_booking_number_of_days_available,
      );
      const latestBookingDate = getLatestBookingDateFromLeg(leg);
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
}
