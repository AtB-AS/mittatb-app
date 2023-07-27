import {BookingRequirement} from '@atb/travel-details-screens/types';
import {
  FlexibleTransportTexts,
  Language,
  TranslateFunction,
  useTranslation,
} from '@atb/translations';
import {MessageBox, OnPressConfig} from '@atb/components/message-box';
import {
  secondsToMinutesLong,
  formatToShortDateTimeWithRelativeDayNames,
} from '@atb/utils/date';

type FlexibleTransportMessageProps = {
  bookingRequirement: BookingRequirement;
  publicCode: string;
  now: number;
  showStatusIcon: boolean;
  onPressConfig?: OnPressConfig;
};

export const FlexibleTransportMessageBox: React.FC<
  FlexibleTransportMessageProps
> = ({bookingRequirement, publicCode, now, showStatusIcon, onPressConfig}) => {
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
      noStatusIcon={!showStatusIcon}
      message={t(
        FlexibleTransportTexts?.[
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
    return formatToShortDateTimeWithRelativeDayNames(
      new Date(now),
      nextBookingStateChangeDate,
      t,
      language,
    );
  }
}
