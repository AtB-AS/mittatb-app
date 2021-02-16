import {Duration, WalkingPerson} from '@atb/assets/svg/icons/transportation';
import ThemeText from '@atb/components/text';
import ThemeIcon from '@atb/components/theme-icon';
import {TripPattern} from '@atb/sdk';
import {StyleSheet} from '@atb/theme';
import {TripDetailsTexts, useTranslation} from '@atb/translations';
import {secondsToDuration} from '@atb/utils/date';
import React from 'react';
import {View} from 'react-native';

const Summary: React.FC<TripPattern> = ({walkDistance, duration}) => {
  const styles = useStyle();
  const {t, language} = useTranslation();
  const time = secondsToDuration(duration, language);
  const summaryTexts = TripDetailsTexts.trip.summary;
  const readableDistance = walkDistance.toFixed();
  return (
    <View style={styles.summary}>
      <View style={styles.summaryDetail}>
        <ThemeIcon colorType="faded" style={styles.leftIcon} svg={Duration} />
        <ThemeText
          color="faded"
          accessible={true}
          accessibilityLabel={t(summaryTexts.travelTime.a11yLabel(time))}
        >
          {t(summaryTexts.travelTime.label(time))}
        </ThemeText>
      </View>
      <View style={styles.summaryDetail}>
        <ThemeIcon
          colorType="faded"
          style={styles.leftIcon}
          svg={WalkingPerson}
        />
        <ThemeText
          color="faded"
          accessible={true}
          accessibilityLabel={t(
            summaryTexts.walkDistance.a11yLabel(readableDistance),
          )}
        >
          {t(summaryTexts.walkDistance.label(readableDistance))}
        </ThemeText>
      </View>
    </View>
  );
};
const useStyle = StyleSheet.createThemeHook((theme) => ({
  summary: {
    marginVertical: theme.spacings.medium,
    borderTopWidth: theme.border.width.slim,
    borderColor: theme.background.level1,
  },
  summaryDetail: {
    padding: theme.spacings.medium,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftIcon: {
    marginRight: theme.spacings.small,
  },
}));
export default Summary;
