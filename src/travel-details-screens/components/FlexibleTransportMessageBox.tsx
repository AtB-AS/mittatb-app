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
import {getBookingRequirementForLeg} from '../utils';
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
  const {requiresBookingUrgently, bookingAvailableImminently, isTooEarly} =
    getBookingRequirementForLeg(
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
          isTooEarly ? bookingAvailableImminently : requiresBookingUrgently,
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
  const {
    requiresBooking,
    requiresBookingUrgently,
    bookingAvailableImminently,
    isTooEarly,
    secondsRemainingToAvailable,
    secondsRemainingToDeadline,
    earliestBookingDate,
    latestBookingDate,
  } = getBookingRequirementForLeg(
    leg,
    now,
    flex_booking_number_of_days_available,
  );

  if (!requiresBooking) {
    return '';
  } else if (requiresBookingUrgently || bookingAvailableImminently) {
    return secondsToMinutesLong(
      isTooEarly ? secondsRemainingToAvailable : secondsRemainingToDeadline,
      language,
    );
  } else {
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
