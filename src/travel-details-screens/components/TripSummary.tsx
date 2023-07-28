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
import {useHumanizeDistance} from '@atb/utils/location';
import {Mode} from '@atb/api/types/generated/journey_planner_v3_types';

export const TripSummary: React.FC<TripPattern> = ({legs, duration}) => {
  const styles = useStyle();
  const {t, language} = useTranslation();
  const time = secondsToDuration(duration, language);
  const walkDistance = legs
    .filter((l) => l.mode === Mode.Foot)
    .reduce((tot, {distance}) => tot + distance, 0);
  const readableDistance = useHumanizeDistance(walkDistance);
  return (
    <View style={styles.tripSummary}>
      <View style={styles.summaryDetail}>
        <ThemeIcon
          colorType="disabled"
          style={styles.leftIcon}
          svg={Duration}
        />
        <ThemeText
          color="secondary"
          accessible={true}
          style={styles.detailText}
          accessibilityLabel={t(
            TripDetailsTexts.trip.summary.travelTime.a11yLabel(time),
          )}
          testID="travelTime"
        >
          {t(TripDetailsTexts.trip.summary.travelTime.label(time))}
        </ThemeText>
      </View>
      {readableDistance && (
        <View style={styles.summaryDetail}>
          <ThemeIcon colorType="secondary" style={styles.leftIcon} svg={Walk} />
          <ThemeText
            color="secondary"
            accessible={true}
            style={styles.detailText}
            accessibilityLabel={t(
              TripDetailsTexts.trip.summary.walkDistance.a11yLabel(
                readableDistance,
              ),
            )}
            testID="walkDistance"
          >
            {t(
              TripDetailsTexts.trip.summary.walkDistance.label(
                readableDistance,
              ),
            )}
          </ThemeText>
        </View>
      )}
    </View>
  );
};
const useStyle = StyleSheet.createThemeHook((theme) => ({
  tripSummary: {
    paddingVertical: theme.spacings.medium,
  },
  detailText: {
    flex: 1,
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
