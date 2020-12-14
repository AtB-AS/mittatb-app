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
import {
  formatToClockOrRelativeMinutes,
  isInThePast,
  isNumberOfMinutesInThePast,
} from '../../../utils/date';
import insets from '../../../utils/insets';
import {hasNoDeparturesOnGroup, HIDE_AFTER_NUM_MINUTES} from '../utils';

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

  return (
    <View style={[topContainer, {padding: 0}]}>
      <View style={[topContainer, sectionStyle.spaceBetween]}>
        <TouchableOpacity
          style={styles.lineHeader}
          containerStyle={contentContainer}
          onPress={() => onPress(group.departures[0])}
          hitSlop={insets.symmetric(12, 0)}
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

  if (isNumberOfMinutesInThePast(departure.aimedTime, HIDE_AFTER_NUM_MINUTES)) {
    return null;
  }

  const inPast = isInThePast(departure.aimedTime);

  return (
    <Button
      key={departure.serviceJourneyId}
      type="compact"
      mode="primary3"
      onPress={() => onPress(departure)}
      text={time}
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
