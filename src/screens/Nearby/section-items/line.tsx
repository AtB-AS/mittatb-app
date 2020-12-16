import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {AccessibilityProps, ScrollView, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {NearbyScreenNavigationProp} from '..';
import {DepartureGroup, DepartureTime} from '../../../api/departures/types';
import Warning from '../../../assets/svg/situations/Warning';
import Button from '../../../components/button';
import {
  SectionItem,
  useSectionItem,
  useSectionStyle,
} from '../../../components/sections/section-utils';
import ThemeText from '../../../components/text';
import TransportationIcon from '../../../components/transportation-icon';
import {StyleSheet} from '../../../theme';
import {dictionary, NearbyTexts, useTranslation} from '../../../translations';
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
  const firstResult = group.departures.find(isValidDeparture)!;
  const firstResultTime = formatToClockOrRelativeMinutes(firstResult?.time);
  const firstIsRelative = isRelativeButNotNow(firstResult?.time);

  const firstResultScreenReaderTimeText = firstIsRelative
    ? t(NearbyTexts.results.relativeTime(firstResultTime))
    : firstResultTime;

  return (
    <View style={[topContainer, {padding: 0}]}>
      <View style={[topContainer, sectionStyle.spaceBetween]}>
        <TouchableOpacity
          style={styles.lineHeader}
          containerStyle={contentContainer}
          onPress={() => onPress(firstResult)}
          hitSlop={insets.symmetric(12, 0)}
          accessibilityRole="header"
          accessibilityHint={t(
            NearbyTexts.results.lines.lineNameAccessibilityHint,
          )}
          accessibilityLabel={t(
            NearbyTexts.results.lines.firstResult(
              title,
              firstResultScreenReaderTimeText,
            ),
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
      <ScrollView horizontal contentContainerStyle={styles.scrollContainer}>
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

type DepartureTimeItemProps = {
  departure: DepartureTime;
  onPress(departure: DepartureTime): void;
};
function DepartureTimeItem({departure, onPress}: DepartureTimeItemProps) {
  const styles = useItemStyles();
  const time = formatToClockOrRelativeMinutes(departure.aimedTime);
  const timeClock = formatToClock(departure.aimedTime);
  const isValid = isValidDeparture(departure);
  const {t} = useTranslation();

  const firstIsRelative = isRelativeButNotNow(departure.aimedTime);

  const screenReaderTimeText = firstIsRelative
    ? t(NearbyTexts.results.relativeTime(time))
    : time;

  if (!isValid) {
    return null;
  }

  const inPast = isInThePast(departure.aimedTime);
  const accessibilityLabel = inPast
    ? t(NearbyTexts.results.departure.hasPassedAccessibilityLabel(timeClock))
    : departure.realtime
    ? t(
        NearbyTexts.results.departure.upcommingRealtimeAccessibilityLabel(
          screenReaderTimeText,
        ),
      )
    : t(
        NearbyTexts.results.departure.upcommingAccessibilityLabel(
          screenReaderTimeText,
        ),
      );

  const timeWithRealtimePrefix = departure.realtime
    ? time
    : t(dictionary.missingRealTime) + ' ' + time;

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
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={t(
        NearbyTexts.results.departure.departureAccessibilityHint,
      )}
    />
  );
}
function hasSituations(departure: DepartureTime) {
  return departure.situations.length > 0;
}
const useItemStyles = StyleSheet.createThemeHook((theme) => ({
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
    marginRight: theme.spacings.small,
  },
  departureText: {
    fontVariant: ['tabular-nums'],
  },
}));
