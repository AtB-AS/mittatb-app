import React from 'react';
import {View} from 'react-native';
import AccessibleText from '../../../components/accessible-text';
import ThemeText from '../../../components/text';
import {useTranslation, dictionary} from '../../../translations';
import {formatToClock} from '../../../utils/date';
import {getTimeRepresentationType, TimeValues} from '../utils';

const Time: React.FC<TimeValues> = (timeValues) => {
  const {t} = useTranslation();
  const {aimedTime, expectedTime} = timeValues;
  const representationType = getTimeRepresentationType(timeValues);
  const scheduled = formatToClock(aimedTime);
  const expected = expectedTime ? formatToClock(expectedTime) : '';

  if (representationType === 'significant-difference') {
    return (
      <View style={{flexDirection: 'column', alignItems: 'flex-end'}}>
        <AccessibleText prefix={t(dictionary.travel.time.expectedPrefix)}>
          {expected}
        </AccessibleText>
        <AccessibleText
          type="label"
          color="faded"
          prefix={t(dictionary.travel.time.aimedPrefix)}
          style={{textDecorationLine: 'line-through'}}
        >
          {scheduled}
        </AccessibleText>
      </View>
    );
  }
  return (
    <ThemeText>
      {representationType === 'no-realtime' && (
        <ThemeText>{t(dictionary.missingRealTimePrefix)}</ThemeText>
      )}
      {scheduled}
    </ThemeText>
  );
};

export default Time;
