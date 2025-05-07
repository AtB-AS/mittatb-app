import {AccessibleText} from '@atb/components/text';
import {ThemeText} from '@atb/components/text';
import {dictionary, useTranslation} from '@atb/translations';
import {formatToClock} from '@atb/utils/date';
import React from 'react';
import {View} from 'react-native';
import {getTimeRepresentationType, TimeValues} from '../utils';
import {usePreferencesContext} from '@atb/preferences';
import {RoundingMethod} from 'date-fns';

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
  const representationType = getTimeRepresentationType(timeValues);
  const scheduled =
    circaPrefix +
    formatToClock(aimedTime, language, roundingMethod, debugShowSeconds);

  const expected = expectedTime
    ? circaPrefix +
      formatToClock(expectedTime, language, roundingMethod, debugShowSeconds)
    : '';

  switch (representationType) {
    case 'significant-difference': {
      return (
        <View style={{flexDirection: 'column', alignItems: 'flex-end'}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <AccessibleText
              prefix={t(dictionary.travel.time.expectedPrefix)}
              testID="expTime"
            >
              {expected}
            </AccessibleText>
          </View>
          <AccessibleText
            typography="body__tertiary"
            color="secondary"
            prefix={t(dictionary.travel.time.aimedPrefix)}
            style={{textDecorationLine: 'line-through'}}
            testID="aimTime"
          >
            {scheduled}
          </AccessibleText>
        </View>
      );
    }
    case 'no-realtime': {
      return <ThemeText testID="schCaTime">{scheduled}</ThemeText>;
    }
    default: {
      return (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <ThemeText testID="schTime">{expected}</ThemeText>
        </View>
      );
    }
  }
};
