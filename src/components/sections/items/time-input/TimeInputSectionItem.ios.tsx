import {useTheme} from '@atb/theme';
import {SectionTexts, useTranslation} from '@atb/translations';
import {dateWithReplacedTime} from '@atb/utils/date';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import React from 'react';
import {View} from 'react-native';
import {InternalLabeledSectionItem} from '../InternalLabeledSectionItem';
import {dateToTimeString, TimeInputSectionItemProps} from './utils';
import {useLocaleContext} from '@atb/LocaleProvider';

export function TimeInputSectionItem(props: TimeInputSectionItemProps) {
  const {value, onChange, ...innerprops} = props;
  const {t} = useTranslation();
  const locale = useLocaleContext();
  const {theme} = useTheme();

  return (
    <InternalLabeledSectionItem
      label={t(SectionTexts.timeInput.label)}
      wrapperStyle={{paddingVertical: 2}}
      {...innerprops}
    >
      <View style={{flex: 1}}>
        <RNDateTimePicker
          value={dateWithReplacedTime(new Date(), value)}
          mode="time"
          locale={locale.localeString}
          textColor={theme.text.colors.primary}
          display="inline"
          onChange={(_, date) => {
            onChange(dateToTimeString(date, locale.language));
          }}
          testID="timeInput"
        />
      </View>
    </InternalLabeledSectionItem>
  );
}
