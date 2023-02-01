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
import {TransportationIcon} from '@atb/components/transportation-icon';
import {ServiceJourneyDeparture} from '@atb/travel-details-screens/types';
import {StyleSheet, useTheme} from '@atb/theme';
import {
  dictionary,
  Language,
  NearbyTexts,
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
import insets from '@atb/utils/insets';
import {TFunc} from '@leile/lobo-t';
import React from 'react';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import {hasNoDeparturesOnGroup, isValidDeparture} from '../utils';
import {getSvgForMostCriticalSituationOrNotice} from '@atb/situations';
import {Realtime as RealtimeDark} from '@atb/assets/svg/color/icons/status/dark';
import {Realtime as RealtimeLight} from '@atb/assets/svg/color/icons/status/light';
import {filterNotices} from '@atb/travel-details-screens/utils';
import {useOnMarkFavouriteDepartures} from '@atb/favorites/use-on-mark-favourite-departures';
import {QuaySectionProps} from '@atb/departure-list/section-items/quay-section';
import ToggleFavouriteDeparture from '@atb/favorites/ToggleFavouriteDeparture';

export type LineItemProps = SectionItemProps<{
  group: DepartureGroup;
  stop: StopPlaceInfo;
  quay: QuayInfo;
  searchDate: string;
  mode: QuaySectionMode;
  onPressDeparture: QuaySectionProps['onPressDeparture'];
}>;
export default function LineItem({
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

  const {onMarkFavourite, existingFavorite, toggleFavouriteAccessibilityLabel} =
    useOnMarkFavouriteDepartures(
      {...group.lineInfo, id: group.lineInfo?.lineId},
      quay,
      stop,
    );

  if (hasNoDeparturesOnGroup(group)) {
    return null;
  }

  const title = `${group.lineInfo?.lineNumber} ${group.lineInfo?.lineName}`;

  const items = group.departures.map<ServiceJourneyDeparture>((dep) => ({
    serviceJourneyId: dep.serviceJourneyId!,
    date: dep.aimedTime,
    fromQuayId: group.lineInfo?.quayId,
    serviceDate: dep.serviceDate,
  }));

  // we know we have a departure as we've checked hasNoDeparturesOnGroup
  const nextValids = group.departures.filter(isValidDeparture);

  return (
    <View style={[topContainer, {padding: 0}]} testID={testID}>
      <View style={[topContainer, sectionStyle.spaceBetween]}>
        <TouchableOpacity
          style={[styles.lineHeader, contentContainer]}
          onPress={() => onPressDeparture(items, 0)}
          hitSlop={insets.symmetric(12, 0)}
          accessibilityRole="button"
          accessibilityHint={
            t(NearbyTexts.results.lines.lineNameAccessibilityHint) +
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
          <View style={styles.transportationMode}>
            <TransportationIcon
              mode={group.lineInfo?.transportMode}
              subMode={group.lineInfo?.transportSubmode}
            />
          </View>
          <ThemeText style={{flex: 1}} testID={testID + 'Title'}>
            {title}
          </ThemeText>
        </TouchableOpacity>
        {mode === 'departures' && (
          <ToggleFavouriteDeparture
            existingFavorite={existingFavorite}
            onMarkFavourite={onMarkFavourite}
            toggleFavouriteAccessibilityLabel={
              toggleFavouriteAccessibilityLabel
            }
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
    return t(NearbyTexts.results.relativeTime(resultTime));
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
  const upcoming = inPast
    ? t(
        NearbyTexts.results.departure.hasPassedAccessibilityLabel(
          formatToClock(firstResult.time, language),
        ),
      )
    : firstResult.realtime
    ? t(
        NearbyTexts.results.departure.upcomingRealtimeAccessibilityLabel(
          firstResultScreenReaderTimeText,
        ),
      )
    : t(
        NearbyTexts.results.departure.upcomingAccessibilityLabel(
          firstResultScreenReaderTimeText,
        ),
      );

  const nextLabel = secondResult
    ? t(
        NearbyTexts.results.departure.nextAccessibilityLabel(
          [secondResult, ...rest]
            .map((i) =>
              i.realtime
                ? t(
                    NearbyTexts.results.departure.nextAccessibilityRealtime(
                      labelForTime(i.time, searchDate, t, language, true),
                    ),
                  )
                : labelForTime(i.time, searchDate, t, language, true),
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
      key={departure.serviceJourneyId}
      type="inline"
      compact={true}
      interactiveColor="interactive_2"
      onPress={() => onPress(departure)}
      text={formatTimeText(departure, searchDate, language, t)}
      style={styles.departure}
      textStyle={styles.departureText}
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
