import React from 'react';
import {
  AccessibilityProps,
  GestureResponderEvent,
  ScrollView,
  View,
} from 'react-native';
import {DepartureGroup} from '../../../api/departures/types';
import Button from '../../../components/button';
import {
  SectionItem,
  useSectionItem,
  useSectionStyle,
} from '../../../components/sections/section-utils';
import ThemeText from '../../../components/text';
import {StyleSheet} from '../../../theme';
import {formatToClock} from '../../../utils/date';

export type LineItemProps = SectionItem<{
  group: DepartureGroup;
  onPress?(event: GestureResponderEvent): void;
  accessibility?: AccessibilityProps;
}>;
export default function LineItem({
  group,
  onPress,
  accessibility,
  ...props
}: LineItemProps) {
  const {contentContainer, topContainer} = useSectionItem(props);
  const sectionStyle = useSectionStyle();
  const styles = useItemStyles();

  if (hasNoDepartures(group)) {
    return null;
  }

  return (
    <View style={[topContainer, {padding: 0}]}>
      <View style={[topContainer, sectionStyle.spaceBetween, contentContainer]}>
        <ThemeText>
          {group.lineInfo?.lineNumber} {group.lineInfo?.lineName}
        </ThemeText>
      </View>
      <ScrollView horizontal contentContainerStyle={styles.scrollContainer}>
        {group.departures.map((departure) => (
          <Button
            key={departure.serviceJourneyId}
            type="compact"
            mode="primary3"
            onPress={() => {}}
            text={formatToClock(departure.aimedTime)}
            style={styles.departure}
          />
        ))}
      </ScrollView>
    </View>
  );
}
const useItemStyles = StyleSheet.createThemeHook((theme) => ({
  scrollContainer: {
    marginBottom: theme.spacings.medium,
    paddingLeft: theme.spacings.medium,
  },
  departure: {
    marginRight: theme.spacings.small,
  },
}));

function hasNoDepartures(group: DepartureGroup) {
  return !Boolean(group.departures.length);
}
