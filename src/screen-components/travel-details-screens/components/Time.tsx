import {AccessibleText} from '@atb/components/text';
import {ThemeText} from '@atb/components/text';
import {dictionary, useTranslation} from '@atb/translations';
import {formatToClock} from '@atb/utils/date';
import React from 'react';
import {View} from 'react-native';
import {usePreferencesContext} from '@atb/modules/preferences';
import {RoundingMethod} from 'date-fns';
import {getRealtimeState, type TimeValues} from '@atb/utils/realtime';
import {StyleSheet} from '@atb/theme';

export const Time: React.FC<{
  timeValues: TimeValues;
  roundingMethod: RoundingMethod;
  timeIsApproximation?: boolean;
}> = ({timeValues, roundingMethod, timeIsApproximation}) => {
  const {
    preferences: {debugShowSeconds},
  } = usePreferencesContext();

  const {t, language} = useTranslation();
  const circaPrefix = timeIsApproximation
    ? t(dictionary.missingRealTimePrefix)
    : '';

  const {aimedTime, expectedTime} = timeValues;
  const representationType = getRealtimeState(timeValues);
  const scheduled =
    circaPrefix +
    formatToClock(aimedTime, language, roundingMethod, debugShowSeconds);

  const expected = expectedTime
    ? circaPrefix +
      formatToClock(expectedTime, language, roundingMethod, debugShowSeconds)
    : '';

  const styles = useStyles();

  switch (representationType) {
    case 'significant-difference': {
      return (
        <View style={styles.columnContainer}>
          <View style={styles.rowContainer}>
            <AccessibleText
              typography="body__m__strong"
              prefix={t(dictionary.travel.time.expectedPrefix)}
              testID="expTime"
            >
              {expected}
            </AccessibleText>
          </View>
          <AccessibleText
            typography="body__xs"
            type="secondary"
            prefix={t(dictionary.travel.time.aimedPrefix)}
            style={styles.aimedTime}
            testID="aimTime"
          >
            {scheduled}
          </AccessibleText>
        </View>
      );
    }
    case 'no-realtime': {
      return (
        <ThemeText typography="body__m__strong" testID="schCaTime">
          {expected || scheduled}
        </ThemeText>
      );
    }
    default: {
      return (
        <View style={styles.rowContainer}>
          <ThemeText typography="body__m__strong" testID="schTime">
            {expected}
          </ThemeText>
        </View>
      );
    }
  }
};

const useStyles = StyleSheet.createThemeHook(() => ({
  columnContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aimedTime: {
    textDecorationLine: 'line-through',
    position: 'absolute',
    top: '100%',
  },
}));
