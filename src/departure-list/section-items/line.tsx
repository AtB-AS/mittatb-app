import {
  DepartureGroup,
  DepartureLineInfo,
  DepartureTime,
  QuayInfo,
  StopPlaceInfo,
} from '@atb/api/departures/types';
import SvgFavorite from '@atb/assets/svg/mono-icons/places/Favorite';
import SvgFavoriteFill from '@atb/assets/svg/mono-icons/places/FavoriteFill';
import SvgFavoriteSemi from '@atb/assets/svg/mono-icons/places/FavoriteSemi';
import Warning from '@atb/assets/svg/color/situations/Warning';
import {screenReaderPause} from '@atb/components/accessible-text';
import Button from '@atb/components/button';
import {
  SectionItem,
  useSectionItem,
  useSectionStyle,
} from '@atb/components/sections/section-utils';
import ThemeText from '@atb/components/text';
import ThemeIcon from '@atb/components/theme-icon';
import TransportationIcon from '@atb/components/transportation-icon';
import {useFavorites} from '@atb/favorites';
import {StyleSheet} from '@atb/theme';
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
import {useNavigation} from '@react-navigation/native';
import React, {useRef} from 'react';
import {
  AccessibilityInfo,
  AccessibilityProps,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import {NearbyScreenNavigationProp} from '@atb/screens/Nearby/Nearby';
import {hasNoDeparturesOnGroup, isValidDeparture} from '../utils';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import {StoredType} from '@atb/favorites/storage';
import {FavoriteDeparture} from '@atb/favorites/types';
import FavoriteDialogSheet from '@atb/departure-list/section-items/FavoriteDialogSheet';
import {ServiceJourneyDeparture} from '@atb/screens/TripDetails/DepartureDetails/types';

export type LineItemProps = SectionItem<{
  group: DepartureGroup;
  stop: StopPlaceInfo;
  quay: QuayInfo;
  accessibility?: AccessibilityProps;
  searchDate: string;
}>;
export default function LineItem({
  group,
  stop,
  quay,
  accessibility,
  searchDate,
  testID,
  ...props
}: LineItemProps) {
  const {contentContainer, topContainer} = useSectionItem(props);
  const sectionStyle = useSectionStyle();
  const styles = useItemStyles();
  const navigation = useNavigation<NearbyScreenNavigationProp>();
  const {t, language} = useTranslation();

  if (hasNoDeparturesOnGroup(group)) {
    return null;
  }

  const title = `${group.lineInfo?.lineNumber} ${group.lineInfo?.lineName}`;

  const items = group.departures.map<ServiceJourneyDeparture>((dep) => ({
    serviceJourneyId: dep.serviceJourneyId!,
    date: dep.time,
    fromQuayId: group.lineInfo?.quayId,
    serviceDate: dep.serviceDate,
  }));

  const onPress = (activeItemIndex: number) => {
    console.log('##Line item press handler', items);
    navigation.navigate('TripDetails', {
      screen: 'DepartureDetails',
      params: {
        activeItemIndex,
        items,
      },
    });
  };

  // we know we have a departure as we've checked hasNoDeparturesOnGroup
  const nextValids = group.departures.filter(isValidDeparture);

  return (
    <View style={[topContainer, {padding: 0}]} testID={testID}>
      <View style={[topContainer, sectionStyle.spaceBetween]}>
        <TouchableOpacity
          style={[styles.lineHeader, contentContainer]}
          onPress={() => onPress(0)}
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
        <ToggleFavoriteDepartureButton
          line={group.lineInfo}
          stop={stop}
          quay={quay}
        />
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
            onPress={() => onPress(i)}
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
                ? labelForTime(i.time, searchDate, t, language, true)
                : t(
                    NearbyTexts.results.departure.nextAccessibilityNotRealtime(
                      labelForTime(i.time, searchDate, t, language, true),
                    ),
                  ),
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

  if (!isValidDeparture(departure)) {
    return null;
  }
  return (
    <Button
      key={departure.serviceJourneyId}
      type="compact"
      interactiveColor="interactive_2"
      onPress={() => onPress(departure)}
      text={formatTimeText(departure, searchDate, language, t)}
      style={styles.departure}
      textStyle={styles.departureText}
      icon={hasSituations(departure) ? Warning : undefined}
      iconPosition="right"
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
  text = addRealtimePrefixIfNecessary(text, departure.realtime, t);
  text = addDatePrefixIfNecessary(text, departure.time, searchDate);
  return text;
};

const addRealtimePrefixIfNecessary = (
  timeText: string,
  isRealtime: boolean = false,
  t: TFunc<typeof Language>,
) => (isRealtime ? timeText : t(dictionary.missingRealTimePrefix) + timeText);

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

function hasSituations(departure: DepartureTime) {
  return departure.situations.length > 0;
}
const useItemStyles = StyleSheet.createThemeHook((theme, themeName) => ({
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

type FavoriteStarProps = {
  line?: DepartureLineInfo;
  stop: StopPlaceInfo;
  quay: QuayInfo;
};
function ToggleFavoriteDepartureButton({line, stop, quay}: FavoriteStarProps) {
  const {getFavoriteDeparture, addFavoriteDeparture, removeFavoriteDeparture} =
    useFavorites();
  const {t} = useTranslation();
  const styles = useItemStyles();
  const closeRef = useRef(null);

  const {open: openBottomSheet} = useBottomSheet();

  if (!line) {
    return null;
  }

  const existingFavorite = getFavoriteDeparture({...line, stopId: stop.id});

  const onFavoritePress = async () => {
    if (existingFavorite) {
      await removeFavoriteDeparture(existingFavorite.id);
      AccessibilityInfo.announceForAccessibility(
        t(NearbyTexts.results.lines.favorite.message.removed),
      );
    } else {
      openBottomSheet(
        (close, focusRef) => (
          <FavoriteDialogSheet
            lineNumber={line.lineNumber}
            lineName={line.lineName}
            addFavorite={addFavorite}
            close={close}
            ref={focusRef}
          />
        ),
        closeRef,
      );
    }
  };

  const addFavorite = async (forSpecificLineName: boolean) => {
    await addFavoriteDeparture({
      lineId: line.lineId,
      lineName: forSpecificLineName ? line.lineName : undefined,
      lineLineNumber: line.lineNumber,
      lineTransportationMode: line.transportMode,
      lineTransportationSubMode: line.transportSubmode,
      quayName: quay.name,
      quayPublicCode: quay.publicCode,
      quayId: quay.id,
      stopId: stop.id,
    });
    AccessibilityInfo.announceForAccessibility(
      t(NearbyTexts.results.lines.favorite.message.saved),
    );
  };

  const label = existingFavorite
    ? t(
        NearbyTexts.results.lines.favorite.removeFavorite(
          `${line.lineNumber} ${existingFavorite.lineName ?? ''}`,
          stop.name,
        ),
      )
    : t(
        NearbyTexts.results.lines.favorite.addFavorite(
          `${line.lineNumber} ${line.lineName}`,
          stop.name,
        ),
      );
  return (
    <TouchableOpacity
      ref={closeRef}
      onPress={onFavoritePress}
      accessibilityRole="checkbox"
      accessibilityState={{checked: !!existingFavorite}}
      accessibilityLabel={label}
      hitSlop={insets.symmetric(14, 8)}
      style={styles.favoriteButton}
    >
      <ThemeIcon svg={getFavoriteIcon(existingFavorite)} />
    </TouchableOpacity>
  );
}

const getFavoriteIcon = (existingFavorite?: StoredType<FavoriteDeparture>) => {
  if (!existingFavorite) {
    return SvgFavorite;
  } else if (existingFavorite.lineName) {
    return SvgFavoriteSemi;
  } else {
    return SvgFavoriteFill;
  }
};
