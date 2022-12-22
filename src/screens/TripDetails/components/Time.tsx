import AccessibleText from '@atb/components/accessible-text';
import ThemeText from '@atb/components/text';
import {dictionary, useTranslation} from '@atb/translations';
import {formatToClock} from '@atb/utils/date';
import React from 'react';
import {View} from 'react-native';
import {getTimeRepresentationType, TimeValues} from '../utils';
import ThemeIcon from '@atb/components/theme-icon';
import {useTheme} from '@atb/theme';
import {Realtime as RealtimeDark} from '@atb/assets/svg/color/icons/status/dark';
import {Realtime as RealtimeLight} from '@atb/assets/svg/color/icons/status/light';

const Time: React.FC<{timeValues: TimeValues; showRealtime?: boolean}> = ({
  timeValues,
  showRealtime = true,
}) => {
  const {t, language} = useTranslation();
  const {themeName} = useTheme();
  const {aimedTime, expectedTime} = timeValues;
  const representationType = getTimeRepresentationType(timeValues);
  const scheduled = formatToClock(aimedTime, language);
  const expected = expectedTime ? formatToClock(expectedTime, language) : '';

  const realtimeIcon = (
    <ThemeIcon
      svg={themeName == 'dark' ? RealtimeDark : RealtimeLight}
      size="small"
      style={{marginRight: 4}}
    ></ThemeIcon>
  );

  switch (representationType) {
    case 'significant-difference': {
      return (
        <View style={{flexDirection: 'column', alignItems: 'flex-end'}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {showRealtime && realtimeIcon}
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
          {showRealtime && realtimeIcon}
          <ThemeText testID="schTime">{scheduled}</ThemeText>
        </View>
      );
    }
  }
};

export default Time;
