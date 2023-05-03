import {AccessibleText} from '@atb/components/text';
import {ThemeText} from '@atb/components/text';
import {dictionary, useTranslation} from '@atb/translations';
import {formatToClock, RoundingMethod} from '@atb/utils/date';
import React from 'react';
import {View} from 'react-native';
import {getTimeRepresentationType, TimeValues} from '../utils';
import {usePreferences} from '@atb/preferences';

export const Time: React.FC<{
  timeValues: TimeValues;
  roundingMethod: RoundingMethod;
}> = ({timeValues, roundingMethod}) => {
  const {
    preferences: {debugShowSeconds},
  } = usePreferences();

  const {t, language} = useTranslation();
  const {aimedTime, expectedTime} = timeValues;
  const representationType = getTimeRepresentationType(timeValues);
  const scheduled = formatToClock(
    aimedTime,
    language,
    roundingMethod,
    debugShowSeconds,
  );
  const expected = expectedTime
    ? formatToClock(expectedTime, language, roundingMethod, debugShowSeconds)
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
            type="body__tertiary"
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
