import {
  DepartureGroup,
  DepartureLineInfo,
  DepartureTime,
  QuayInfo,
  StopPlaceInfo,
} from '@atb/api/departures/types';
import SvgFavorite from '@atb/assets/svg/icons/places/Favorite';
import SvgFavoriteFill from '@atb/assets/svg/icons/places/FavoriteFill';
import Warning from '@atb/assets/svg/situations/Warning';
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
import colors from '@atb/theme/colors';
import {
  dictionary,
  Language,
  NearbyTexts,
  useTranslation,
} from '@atb/translations';
import {
  formatToClock,
  formatToClockOrRelativeMinutes,
  isInThePast,
  isRelativeButNotNow,
} from '@atb/utils/date';
import insets from '@atb/utils/insets';
import {TFunc} from '@leile/lobo-t';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  AccessibilityInfo,
  AccessibilityProps,
  ScrollView,
  View,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {NearbyScreenNavigationProp} from '../../../screens/Nearby/Nearby';
import {hasNoDeparturesOnGroup, isValidDeparture} from '../utils';

export type LineItemProps = SectionItem<{
  group: DepartureGroup;
  stop: StopPlaceInfo;
  quay: QuayInfo;
  accessibility?: AccessibilityProps;
}>;
export default function LineItem({
  group,
  stop,
  quay,
  accessibility,
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

  const items = group.departures.map((dep) => ({
    serviceJourneyId: dep.serviceJourneyId!,
    date: dep.time,
    fromQuayId: group.lineInfo?.quayId,
  }));

  const onPress = (activeItemIndex: number) => {
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
    <View style={[topContainer, {padding: 0}]}>
      <View style={[topContainer, sectionStyle.spaceBetween]}>
        <TouchableOpacity
          style={styles.lineHeader}
          containerStyle={contentContainer}
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
          <ThemeText style={{flex: 1}}>{title}</ThemeText>
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
          />
        ))}
      </ScrollView>
    </View>
  );
}

function labelForTime(
  time: string,
  t: TFunc<typeof Language>,
  language: Language,
) {
  const resultTime = formatToClockOrRelativeMinutes(
    time,
    language,
    t(dictionary.date.units.now),
  );
  const isRelative = isRelativeButNotNow(time);

  return isRelative
    ? t(NearbyTexts.results.relativeTime(resultTime))
    : resultTime;
}

function getAccessibilityTextFirstDeparture(
  title: string,
  nextValids: DepartureTime[],
  t: TFunc<typeof Language>,
  language: Language,
) {
  const [firstResult, secondResult, ...rest] = nextValids;
  const firstResultScreenReaderTimeText = labelForTime(
    firstResult?.time,
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
                ? formatToClock(i.time, language)
                : t(
                    NearbyTexts.results.departure.nextAccessibilityNotRealtime(
                      formatToClock(i.time, language),
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
};
function DepartureTimeItem({departure, onPress}: DepartureTimeItemProps) {
  const styles = useItemStyles();
  const {t, language} = useTranslation();
  const time = formatToClockOrRelativeMinutes(
    departure.time,
    language,
    t(dictionary.date.units.now),
  );
  const isValid = isValidDeparture(departure);

  if (!isValid) {
    return null;
  }

  const inPast = isInThePast(departure.time);
  const timeWithRealtimePrefix = departure.realtime
    ? time
    : t(dictionary.missingRealTimePrefix) + ' ' + time;

  return (
    <Button
      key={departure.serviceJourneyId}
      type="compact"
      color="secondary_4"
      onPress={() => onPress(departure)}
      text={timeWithRealtimePrefix}
      style={styles.departure}
      disabled={inPast}
      textStyle={styles.departureText}
      icon={hasSituations(departure) ? Warning : undefined}
      iconPosition="right"
    />
  );
}
function hasSituations(departure: DepartureTime) {
  return departure.situations.length > 0;
}
const useItemStyles = StyleSheet.createThemeHook((theme, themeName) => ({
  transportationMode: {
    marginRight: theme.spacings.small,
  },
  lineHeader: {
    flexDirection: 'row',
  },
  scrollContainer: {
    marginBottom: theme.spacings.medium,
    paddingLeft: theme.spacings.medium,
  },
  departure: {
    backgroundColor:
      themeName === 'light' ? colors.primary.gray_50 : colors.primary.gray_950,
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
  const {
    getFavoriteDeparture,
    addFavoriteDeparture,
    removeFavoriteDeparture,
  } = useFavorites();
  const {t} = useTranslation();
  const styles = useItemStyles();

  if (!line) {
    return null;
  }

  const favorite = getFavoriteDeparture({...line, stopId: stop.id});

  const onPress = async () => {
    if (favorite) {
      await removeFavoriteDeparture(favorite.id);
      AccessibilityInfo.announceForAccessibility(
        t(NearbyTexts.results.lines.favorite.message.removed),
      );
    } else {
      await addFavoriteDeparture({
        lineId: line.lineId,
        lineName: line.lineName,
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
    }
  };

  const Icon = favorite ? SvgFavoriteFill : SvgFavorite;
  const label = t(
    NearbyTexts.results.lines.favorite[
      !favorite ? 'addFavorite' : 'removeFavorite'
    ](`${line.lineNumber} ${line.lineName}`, stop.name),
  );
  return (
    <TouchableOpacity
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityState={{checked: !!favorite}}
      accessibilityLabel={label}
      hitSlop={insets.symmetric(14, 8)}
      style={styles.favoriteButton}
    >
      <ThemeIcon svg={Icon} />
    </TouchableOpacity>
  );
}
