import {TripPattern} from '@atb/api/types/trips';
import {Walk} from '@atb/assets/svg/mono-icons/transportation-entur';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';

import {StyleSheet} from '@atb/theme';
import {TripDetailsTexts, useTranslation} from '@atb/translations';
import {secondsToDuration} from '@atb/utils/date';
import React from 'react';
import {View} from 'react-native';
import {Duration} from '@atb/assets/svg/mono-icons/time';

export const TripSummary: React.FC<TripPattern> = ({
  walkDistance,
  duration,
}) => {
  const styles = useStyle();
  const {t, language} = useTranslation();
  const time = secondsToDuration(duration, language);
  const readableDistance = walkDistance?.toFixed() ?? '0';
  return (
    <>
      <View style={styles.summaryDetail}>
        <ThemeIcon
          colorType="disabled"
          style={styles.leftIcon}
          svg={Duration}
        />
        <ThemeText
          color="secondary"
          accessible={true}
          accessibilityLabel={t(
            TripDetailsTexts.trip.summary.travelTime.a11yLabel(time),
          )}
          testID="travelTime"
        >
          {t(TripDetailsTexts.trip.summary.travelTime.label(time))}
        </ThemeText>
      </View>
      <View style={styles.summaryDetail}>
        <ThemeIcon colorType="secondary" style={styles.leftIcon} svg={Walk} />
        <ThemeText
          color="secondary"
          accessible={true}
          accessibilityLabel={t(
            TripDetailsTexts.trip.summary.walkDistance.a11yLabel(
              readableDistance,
            ),
          )}
          testID="walkDistance"
        >
          {t(
            TripDetailsTexts.trip.summary.walkDistance.label(readableDistance),
          )}
        </ThemeText>
      </View>
    </>
  );
};
const useStyle = StyleSheet.createThemeHook((theme) => ({
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
