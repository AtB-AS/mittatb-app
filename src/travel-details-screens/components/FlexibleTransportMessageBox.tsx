import {
  TripDetailsTexts,
  Language,
  TranslateFunction,
  useTranslation,
} from '@atb/translations';
import {MessageBox, OnPressConfig} from '@atb/components/message-box';
import {
  secondsToMinutesLong,
  formatToShortDateTimeWithRelativeDayNames,
} from '@atb/utils/date';

import {Leg} from '@atb/api/types/trips';
import {
  getEarliestBookingDateFromLeg,
  getLegRequiresBooking,
  getLegRequiresBookingUrgently,
  getIsTooEarlyToBookLeg,
  getLegBookingIsAvailableImminently,
  getSecondsRemainingToLegBookingAvailable,
  getSecondsRemainingToLegBookingDeadline,
  getLatestBookingDateFromLeg,
} from '../utils';
import {useRemoteConfig} from '@atb/RemoteConfigContext';

type FlexibleTransportMessageProps = {
  leg: Leg;
  publicCode: string;
  now: number;
  showStatusIcon: boolean;
  onPressConfig?: OnPressConfig;
};

export const FlexibleTransportMessageBox: React.FC<
  FlexibleTransportMessageProps
> = ({leg, publicCode, now, showStatusIcon, onPressConfig}) => {
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

  return (
    <MessageBox
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
  const requiresBooking = getLegRequiresBooking(leg);
  if (!requiresBooking) {
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
