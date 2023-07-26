import {BookingRequirement} from '@atb/travel-details-screens/types';
import {
  Language,
  TranslateFunction,
  TripDetailsTexts,
  useTranslation,
} from '@atb/translations';
import {MessageBox, OnPressConfig} from '@atb/components/message-box';
import {
  secondsToMinutesLong,
  daysBetween,
  formatToShortDateTimeWithoutYear,
} from '@atb/utils/date';

type FlexibleTransportMessageProps = {
  bookingRequirement: BookingRequirement;
  publicCode: string;
  now: number;
  onPressConfig?: OnPressConfig;
};

export const FlexibleTransportMessageBox: React.FC<
  FlexibleTransportMessageProps
> = ({bookingRequirement, publicCode, now, onPressConfig}) => {
  const {t, language} = useTranslation();

  const formattedTimeForBooking = getFormattedTimeForBooking(
    bookingRequirement,
    now,
    t,
    language,
  );

  return (
    <MessageBox
      type={bookingRequirement.requiresBookingUrgently ? 'warning' : 'info'}
      noStatusIcon={true}
      message={t(
        TripDetailsTexts.trip.leg?.[
          bookingRequirement.isTooEarly
            ? 'needsBookingButIsTooEarly'
            : 'needsBookingAndIsAvailable'
        ](
          publicCode,
          formattedTimeForBooking,
          bookingRequirement.isTooEarly
            ? bookingRequirement.bookingAvailableImminently
            : bookingRequirement.requiresBookingUrgently,
        ),
      )}
      onPressConfig={onPressConfig}
    />
  );
};

function getFormattedTimeForBooking(
  bookingRequirement: BookingRequirement,
  now: number,
  t: TranslateFunction,
  language: Language,
): string {
  if (!bookingRequirement.requiresBooking) {
    return '';
  } else if (
    bookingRequirement.requiresBookingUrgently ||
    bookingRequirement.bookingAvailableImminently
  ) {
    return secondsToMinutesLong(
      bookingRequirement.isTooEarly
        ? bookingRequirement.secondsRemainingToAvailable
        : bookingRequirement.secondsRemainingToDeadline,
      language,
    );
  } else {
    const nextBookingStateChangeDate = bookingRequirement.isTooEarly
      ? bookingRequirement.earliestBookingDate
      : bookingRequirement.latestBookingDate;

    const daysDifference = daysBetween(
      new Date(now),
      nextBookingStateChangeDate,
    );
    const relativeDayName = t(
      TripDetailsTexts.trip.leg.relativeDayNames(daysDifference),
    );
    return (
      relativeDayName +
      (relativeDayName === '' ? '' : ' ') +
      formatToShortDateTimeWithoutYear(nextBookingStateChangeDate, language)
    );
  }
}
