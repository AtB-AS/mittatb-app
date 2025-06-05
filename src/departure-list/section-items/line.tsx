import {DepartureGroup, DepartureTime} from '@atb/api/departures/types';
import {screenReaderPause, ThemeText} from '@atb/components/text';
import {
  SectionItemProps,
  useSectionItem,
  useSectionStyle,
} from '@atb/components/sections';
import {TransportationIconBox} from '@atb/components/icon-box';
import {ServiceJourneyDeparture} from '@atb/screen-components/travel-details-screens';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {
  CancelledDepartureTexts,
  DeparturesTexts,
  dictionary,
  Language,
  useTranslation,
} from '@atb/translations';
import {
  formatToClock,
  formatToClockOrRelativeMinutes,
  formatToWeekday,
  isInThePast,
  isRelativeButNotNow,
  isWithinSameDate,
} from '@atb/utils/date';
import {insets} from '@atb/utils/insets';
import {TFunc} from '@leile/lobo-t';
import React from 'react';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import {hasNoDeparturesOnGroup, isValidDeparture} from '../utils';
import {Realtime as RealtimeDark} from '@atb/assets/svg/color/icons/status/dark';
import {Realtime as RealtimeLight} from '@atb/assets/svg/color/icons/status/light';
import {
  bookingStatusToMsgType,
  filterNotices,
  formatDestinationDisplay,
  getBookingStatus,
} from '@atb/screen-components/travel-details-screens';
import {QuaySectionProps} from '@atb/departure-list/section-items/quay-section';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {ThemeIcon} from '@atb/components/theme-icon';
import {
  getMsgTypeForMostCriticalSituationOrNotice,
  toMostCriticalStatus,
} from '@atb/modules/situations';
import {statusTypeToIcon} from '@atb/utils/status-type-to-icon';
import type {Mode, Statuses} from '@atb/theme';

export type LineItemProps = SectionItemProps<{
  group: DepartureGroup;
  searchDate: string;
  onPressDeparture: QuaySectionProps['onPressDeparture'];
}>;
export function LineItem({
  group,
  searchDate,
  testID,
  onPressDeparture,
  ...props
}: LineItemProps) {
  const {contentContainer, topContainer} = useSectionItem(props);
  const sectionStyle = useSectionStyle();
  const styles = useItemStyles();
  const {t, language} = useTranslation();

  if (hasNoDeparturesOnGroup(group)) {
    return null;
  }

  const title = `${group.lineInfo?.lineNumber} ${formatDestinationDisplay(
    t,
    group.lineInfo?.destinationDisplay,
  )}`;

  const items = group.departures.map<ServiceJourneyDeparture>((dep) => ({
    serviceJourneyId: dep.serviceJourneyId!,
    date: dep.aimedTime,
    fromStopPosition: dep.stopPositionInPattern,
    serviceDate: dep.serviceDate,
    isTripCancelled: dep.cancellation,
  }));

  // we know we have a departure as we've checked hasNoDeparturesOnGroup
  const nextValids = group.departures.filter(isValidDeparture);

  return (
    <View
      style={[topContainer, {paddingVertical: 0, paddingHorizontal: 0}]}
      testID={testID}
    >
      <View style={[topContainer, sectionStyle.spaceBetween]}>
        <PressableOpacity
          style={[contentContainer, styles.lineHeader]}
          onPress={() => onPressDeparture(items, 0)}
          hitSlop={insets.symmetric(12, 0)}
          accessibilityRole="button"
          accessibilityHint={
            t(DeparturesTexts.results.lines.lineNameAccessibilityHint) +
            screenReaderPause
          }
          accessibilityLabel={getAccessibilityTextFirstDeparture(
            title,
            nextValids,
            searchDate,
            t,
            language,
          )}
        >
          <TransportationIconBox
            style={styles.transportationMode}
            mode={group.lineInfo?.transportMode}
            subMode={group.lineInfo?.transportSubmode}
          />
          <ThemeText style={{flex: 1}} testID={testID + 'Title'}>
            {title}
          </ThemeText>
        </PressableOpacity>
      </View>
      <ScrollView
        horizontal
        contentContainerStyle={styles.scrollContainer}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        {group.departures.map((departure, i) => (
          <DepartureTimeItem
            departure={departure}
            key={departure.serviceJourneyId + departure.aimedTime}
            onPress={() => onPressDeparture(items, i)}
            searchDate={searchDate}
            testID={'depTime' + i}
          />
        ))}
      </ScrollView>
    </View>
  );
}

function labelForTime(
  time: string,
  searchDate: string,
  t: TFunc<typeof Language>,
  language: Language,
  accessibility?: boolean,
) {
  const resultTime = formatToClockOrRelativeMinutes(
    time,
    language,
    t(dictionary.date.units.now),
  );

  if (isRelativeButNotNow(time)) {
    return t(DeparturesTexts.results.relativeTime(resultTime));
  }

  return addDatePrefixIfNecessary(
    resultTime,
    time,
    searchDate,
    accessibility ? 'EEEE' : undefined,
  );
}

function getAccessibilityTextFirstDeparture(
  title: string,
  nextValids: DepartureTime[],
  searchDate: string,
  t: TFunc<typeof Language>,
  language: Language,
) {
  const [firstResult, secondResult, ...rest] = nextValids;
  const firstResultScreenReaderTimeText = labelForTime(
    firstResult.time,
    searchDate,
    t,
    language,
  );

  const inPast = isInThePast(firstResult.time);
  const upcoming =
    (inPast
      ? t(
          DeparturesTexts.results.departure.hasPassedAccessibilityLabel(
            formatToClock(firstResult.time, language, 'floor'),
          ),
        )
      : firstResult.realtime
      ? t(
          DeparturesTexts.results.departure.upcomingRealtimeAccessibilityLabel(
            firstResultScreenReaderTimeText,
          ),
        )
      : t(
          DeparturesTexts.results.departure.upcomingAccessibilityLabel(
            firstResultScreenReaderTimeText,
          ),
        )) +
    (firstResult.cancellation ? t(CancelledDepartureTexts.cancelled) : '');

  const nextLabel = secondResult
    ? t(
        DeparturesTexts.results.departure.nextAccessibilityLabel(
          [secondResult, ...rest]
            .map(
              (i) =>
                (i.realtime
                  ? t(
                      DeparturesTexts.results.departure.nextAccessibilityRealtime(
                        labelForTime(i.time, searchDate, t, language, true),
                      ),
                    )
                  : labelForTime(i.time, searchDate, t, language, true)) +
                (i.cancellation ? t(CancelledDepartureTexts.cancelled) : ''),
            )
            .join(', '),
        ),
      )
    : '';

  return `${title}. ${upcoming} ${nextLabel} ${screenReaderPause}`;
}

type DepartureTimeItemProps = {
  departure: DepartureTime;
  onPress(departure: DepartureTime): void;
  searchDate: string;
  testID?: string;
};
function DepartureTimeItem({
  departure,
  onPress,
  searchDate,
  testID,
}: DepartureTimeItemProps) {
  const styles = useItemStyles();
  const {t, language} = useTranslation();
  const {themeName} = useThemeContext();

  const rightIcon = getSvgForDeparture(departure, themeName);
  const leftIcon =
    !departure.cancellation && departure.realtime
      ? themeName === 'dark'
        ? RealtimeDark
        : RealtimeLight
      : undefined;

  if (!isValidDeparture(departure)) {
    return null;
  }
  return (
    <TouchableOpacity
      style={styles.departure}
      testID={testID}
      key={departure.aimedTime + departure.serviceJourneyId}
      onPress={() => onPress(departure)}
    >
      {leftIcon && <ThemeIcon svg={leftIcon} size="xSmall" />}

      <ThemeText
        typography="body__primary--bold"
        style={[
          styles.departureText,
          departure.cancellation && styles.strikethrough,
        ]}
      >
        {formatTimeText(departure, searchDate, language, t)}
      </ThemeText>
      {rightIcon && <ThemeIcon svg={rightIcon} />}
    </TouchableOpacity>
  );
}

const formatTimeText = (
  departure: DepartureTime,
  searchDate: string,
  language: Language,
  t: TFunc<typeof Language>,
) => {
  let text = formatToClockOrRelativeMinutes(
    departure.time,
    language,
    t(dictionary.date.units.now),
  );
  text = addDatePrefixIfNecessary(text, departure.time, searchDate);
  return text;
};

const addDatePrefixIfNecessary = (
  timeText: string,
  departureDate: string,
  searchDate: string,
  dateFormat?: string,
) => {
  if (isWithinSameDate(searchDate, departureDate)) {
    return timeText;
  } else {
    return `${formatToWeekday(
      departureDate,
      Language.Norwegian,
      dateFormat ? dateFormat : undefined,
    )}. ${timeText}`;
  }
};

const useItemStyles = StyleSheet.createThemeHook((theme) => ({
  transportationMode: {
    marginRight: theme.spacing.small,
  },
  lineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollContainer: {
    marginBottom: theme.spacing.medium,
    paddingLeft: theme.spacing.medium,
  },
  strikethrough: {
    textDecorationLine: 'line-through',
    fontWeight: 'normal',
  },
  departure: {
    padding: theme.spacing.small,
    backgroundColor: theme.color.background.neutral[1].background,
    borderRadius: theme.border.radius.regular,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.xSmall,
    marginRight: theme.spacing.small,
  },
  departureText: {
    fontVariant: ['tabular-nums'],
  },
  favoriteButton: {
    paddingLeft: theme.spacing.medium,
  },
}));

export const getSvgForDeparture = (
  departure: DepartureTime,
  themeName: Mode,
) => {
  const msgTypeForSituationOrNotice =
    getMsgTypeForMostCriticalSituationOrNotice(
      departure.situations,
      filterNotices(departure.notices || []),
      departure.cancellation,
    );

  const bookingStatus = getBookingStatus(
    departure.bookingArrangements,
    departure.aimedTime,
  );
  const msgTypeForBooking = bookingStatusToMsgType(bookingStatus);

  const msgType = [msgTypeForSituationOrNotice, msgTypeForBooking].reduce<
    Statuses | undefined
  >(toMostCriticalStatus, undefined);
  return msgType && statusTypeToIcon(msgType, true, themeName);
};
