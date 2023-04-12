import {AccessibleText} from '@atb/components/text';
import {ThemeText} from '@atb/components/text';
import {dictionary, useTranslation} from '@atb/translations';
import {formatToClock, RoundingMethod} from '@atb/utils/date';
import React from 'react';
import {View} from 'react-native';
import {getTimeRepresentationType, TimeValues} from '../utils';
import {ThemeIcon} from '@atb/components/theme-icon';
import {useTheme} from '@atb/theme';
import {Realtime as RealtimeDark} from '@atb/assets/svg/color/icons/status/dark';
import {Realtime as RealtimeLight} from '@atb/assets/svg/color/icons/status/light';
import {usePreferences} from '@atb/preferences';

export const Time: React.FC<{
  timeValues: TimeValues;
  roundingMethod: RoundingMethod;
  showRealtimeIcon?: boolean;
}> = ({timeValues, showRealtimeIcon = true, roundingMethod}) => {
  const {
    preferences: {debugShowSeconds},
  } = usePreferences();

  const {t, language} = useTranslation();
  const {themeName, theme} = useTheme();
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

  const realtimeIcon = (
    <ThemeIcon
      svg={themeName == 'dark' ? RealtimeDark : RealtimeLight}
      size="small"
      style={{marginRight: theme.spacings.xSmall}}
    />
  );

  switch (representationType) {
    case 'significant-difference': {
      return (
        <View style={{flexDirection: 'column', alignItems: 'flex-end'}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {showRealtimeIcon && realtimeIcon}
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
          {showRealtimeIcon && realtimeIcon}
          <ThemeText testID="schTime">{expected}</ThemeText>
        </View>
      );
    }
  }
};
