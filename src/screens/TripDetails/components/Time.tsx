import AccessibleText from '@atb/components/accessible-text';
import ThemeText from '@atb/components/text';
import {dictionary, useTranslation} from '@atb/translations';
import {formatToClock} from '@atb/utils/date';
import React from 'react';
import {View} from 'react-native';
import {getTimeRepresentationType, TimeValues} from '../utils';

const Time: React.FC<TimeValues> = (timeValues) => {
  const {t, language} = useTranslation();
  const {aimedTime, expectedTime} = timeValues;
  const representationType = getTimeRepresentationType(timeValues);
  const scheduled = formatToClock(aimedTime, language);
  const expected = expectedTime ? formatToClock(expectedTime, language) : '';

  switch (representationType) {
    case 'significant-difference': {
      return (
        <View style={{flexDirection: 'column', alignItems: 'flex-end'}}>
          <AccessibleText prefix={t(dictionary.travel.time.expectedPrefix)}>
            {expected}
          </AccessibleText>
          <AccessibleText
            type="label"
            color="secondary"
            prefix={t(dictionary.travel.time.aimedPrefix)}
            style={{textDecorationLine: 'line-through'}}
          >
            {scheduled}
          </AccessibleText>
        </View>
      );
    }
    case 'no-realtime': {
      return (
        <ThemeText>
          <ThemeText>{t(dictionary.missingRealTimePrefix)} </ThemeText>
          {scheduled}
        </ThemeText>
      );
    }
    default: {
      return <ThemeText>{scheduled}</ThemeText>;
    }
  }
};

export default Time;
