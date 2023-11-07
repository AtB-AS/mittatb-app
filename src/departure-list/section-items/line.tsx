import {
  DepartureGroup,
  DepartureTime,
  QuayInfo,
  QuaySectionMode,
  StopPlaceInfo,
} from '@atb/api/departures/types';
import {screenReaderPause, ThemeText} from '@atb/components/text';
import {Button} from '@atb/components/button';
import {
  SectionItemProps,
  useSectionItem,
  useSectionStyle,
} from '@atb/components/sections';
import {TransportationIconBox} from '@atb/components/icon-box';
import {ServiceJourneyDeparture} from '@atb/travel-details-screens/types';
import {StyleSheet, useTheme} from '@atb/theme';
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
import {ScrollView, View} from 'react-native';
import {hasNoDeparturesOnGroup, isValidDeparture} from '../utils';
import {getSvgForMostCriticalSituationOrNotice} from '@atb/situations';
import {Realtime as RealtimeDark} from '@atb/assets/svg/color/icons/status/dark';
import {Realtime as RealtimeLight} from '@atb/assets/svg/color/icons/status/light';
import {
  filterNotices,
  formatDestinationDisplay,
} from '@atb/travel-details-screens/utils';
import {
  FavouriteDepartureToggle,
  useOnMarkFavouriteDepartures,
} from '@atb/favorites';
import {QuaySectionProps} from '@atb/departure-list/section-items/quay-section';
import {PressableOpacity} from '@atb/components/pressable-opacity';

export type LineItemProps = SectionItemProps<{
  group: DepartureGroup;
  stop: StopPlaceInfo;
  quay: QuayInfo;
  searchDate: string;
  mode: QuaySectionMode;
  onPressDeparture: QuaySectionProps['onPressDeparture'];
}>;
export function LineItem({
  group,
  stop,
  quay,
  searchDate,
  testID,
  mode,
  onPressDeparture,
  ...props
}: LineItemProps) {
  const {contentContainer, topContainer} = useSectionItem(props);
  const sectionStyle = useSectionStyle();
  const styles = useItemStyles();
  const {t, language} = useTranslation();

  const {
    onMarkFavourite,
    getExistingFavorite,
    toggleFavouriteAccessibilityLabel,
  } = useOnMarkFavouriteDepartures(quay, stop);

  if (hasNoDeparturesOnGroup(group)) {
    return null;
  }
  const favouriteDepartureLine = {
    ...group.lineInfo,
    id: group.lineInfo?.lineId ?? '',
  };

  const title = `${group.lineInfo?.lineNumber} ${formatDestinationDisplay(
    t,
    group.lineInfo?.destinationDisplay,
  )}`;

  const items = group.departures.map<ServiceJourneyDeparture>((dep) => ({
    serviceJourneyId: dep.serviceJourneyId!,
    date: dep.aimedTime,
    fromQuayId: group.lineInfo?.quayId,
    serviceDate: dep.serviceDate,
    isTripCancelled: dep.cancellation,
  }));

  // we know we have a departure as we've checked hasNoDeparturesOnGroup
  const nextValids = group.departures.filter(isValidDeparture);
  const existing = getExistingFavorite(favouriteDepartureLine);

  return (
    <View style={[topContainer, {padding: 0}]} testID={testID}>
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
        {mode === 'departures' && (
          <FavouriteDepartureToggle
            existingFavorite={existing}
            onMarkFavourite={() =>
              onMarkFavourite(favouriteDepartureLine, existing)
            }
            toggleFavouriteAccessibilityLabel={toggleFavouriteAccessibilityLabel(
              favouriteDepartureLine,
            )}
          />
        )}
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
  const {themeName} = useTheme();

  const notices = filterNotices(departure.notices || []);

  const rightIcon = getSvgForMostCriticalSituationOrNotice(
    departure.situations,
    notices,
    departure.cancellation,
  );
  const leftIcon = departure.realtime
    ? themeName === 'dark'
      ? RealtimeDark
      : RealtimeLight
    : undefined;

  if (!isValidDeparture(departure)) {
    return null;
  }
  return (
    <Button
      key={departure.aimedTime + departure.serviceJourneyId}
      type="inline"
      compact={true}
      interactiveColor="interactive_2"
      onPress={() => onPress(departure)}
      text={formatTimeText(departure, searchDate, language, t)}
      style={styles.departure}
      textStyle={[
        styles.departureText,
        departure.cancellation && styles.strikethrough,
      ]}
      rightIcon={
        rightIcon && {
          svg: rightIcon,
        }
      }
      leftIcon={leftIcon && {svg: leftIcon, size: 'small'}}
      testID={testID}
    />
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
    marginRight: theme.spacings.small,
  },
  lineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollContainer: {
    marginBottom: theme.spacings.medium,
    paddingLeft: theme.spacings.medium,
  },
  strikethrough: {
    textDecorationLine: 'line-through',
  },
  departure: {
    backgroundColor: theme.static.background.background_1.background,
    borderWidth: 0,
    marginRight: theme.spacings.small,
  },
  departureText: {
    fontVariant: ['tabular-nums'],
  },
  favoriteButton: {
    paddingLeft: theme.spacings.medium,
  },
}));
