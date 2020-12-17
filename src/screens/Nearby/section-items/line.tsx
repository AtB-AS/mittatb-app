import {TFunc} from '@leile/lobo-t';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {AccessibilityProps, ScrollView, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {NearbyScreenNavigationProp} from '..';
import {DepartureGroup, DepartureTime} from '../../../api/departures/types';
import Warning from '../../../assets/svg/situations/Warning';
import {screenReaderPause} from '../../../components/accessible-text';
import Button from '../../../components/button';
import {
  SectionItem,
  useSectionItem,
  useSectionStyle,
} from '../../../components/sections/section-utils';
import ThemeText from '../../../components/text';
import TransportationIcon from '../../../components/transportation-icon';
import {StyleSheet} from '../../../theme';
import colors from '../../../theme/colors';
import {
  dictionary,
  Language,
  NearbyTexts,
  useTranslation,
} from '../../../translations';
import {
  formatToClock,
  formatToClockOrRelativeMinutes,
  isInThePast,
  isRelativeButNotNow,
} from '../../../utils/date';
import insets from '../../../utils/insets';
import {hasNoDeparturesOnGroup, isValidDeparture} from '../utils';

export type LineItemProps = SectionItem<{
  group: DepartureGroup;
  accessibility?: AccessibilityProps;
}>;
export default function LineItem({
  group,
  accessibility,
  ...props
}: LineItemProps) {
  const {contentContainer, topContainer} = useSectionItem(props);
  const sectionStyle = useSectionStyle();
  const styles = useItemStyles();
  const navigation = useNavigation<NearbyScreenNavigationProp>();
  const {t} = useTranslation();

  if (hasNoDeparturesOnGroup(group)) {
    return null;
  }

  const title = `${group.lineInfo?.lineNumber} ${group.lineInfo?.lineName}`;

  const onPress = (departure: DepartureTime) => {
    navigation.navigate('DepartureDetailsModal', {
      title,
      serviceJourneyId: departure.serviceJourneyId!,
      date: departure.aimedTime,
      fromQuayId: group.lineInfo?.quayId,
    });
  };

  // we know we have a departure as we've checked hasNoDeparturesOnGroup
  const nextValids = group.departures.filter(isValidDeparture);
  const firstResult = nextValids[0]!;

  return (
    <View style={[topContainer, {padding: 0}]}>
      <View style={[topContainer, sectionStyle.spaceBetween]}>
        <TouchableOpacity
          style={styles.lineHeader}
          containerStyle={contentContainer}
          onPress={() => onPress(firstResult)}
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
          )}
        >
          <View style={styles.transportationMode}>
            <TransportationIcon
              mode={group.lineInfo?.transportMode}
              subMode={group.lineInfo?.transportSubmode}
            />
          </View>
          <ThemeText>{title}</ThemeText>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        contentContainerStyle={styles.scrollContainer}
        accessibilityElementsHidden
      >
        {group.departures.map((departure) => (
          <DepartureTimeItem
            departure={departure}
            key={departure.serviceJourneyId + departure.aimedTime}
            onPress={onPress}
          />
        ))}
      </ScrollView>
    </View>
  );
}

function labelForTime(time: string, t: TFunc<typeof Language>) {
  const resultTime = formatToClockOrRelativeMinutes(time);
  const isRelative = isRelativeButNotNow(time);

  return isRelative
    ? t(NearbyTexts.results.relativeTime(resultTime))
    : resultTime;
}

function getAccessibilityTextFirstDeparture(
  title: string,
  nextValids: DepartureTime[],
  t: TFunc<typeof Language>,
) {
  const [firstResult, secondResult, ...rest] = nextValids;
  const firstResultScreenReaderTimeText = labelForTime(firstResult?.time, t);

  const inPast = isInThePast(firstResult.time);
  const upcoming = inPast
    ? t(
        NearbyTexts.results.departure.hasPassedAccessibilityLabel(
          formatToClock(firstResult.time),
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
                ? formatToClock(i.time)
                : t(
                    NearbyTexts.results.departure.nextAccessibilityNotRealtime(
                      formatToClock(i.time),
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
  const time = formatToClockOrRelativeMinutes(departure.time);
  const isValid = isValidDeparture(departure);
  const {t} = useTranslation();

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
      mode="primary3"
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
}));
