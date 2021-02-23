import {useTheme} from '@atb/theme';
import {SectionTexts, useTranslation} from '@atb/translations';
import {dateWithReplacedTime} from '@atb/utils/date';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import React from 'react';
import {View} from 'react-native';
import InternalLabeledItem from '../internals/internal-labeled-item';
import {dateToTimeString, TimeInputItemProps} from './utils';

export default function TimeInputItem(props: TimeInputItemProps) {
  const {value, onChange, ...innerprops} = props;
  const {t, locale, language} = useTranslation();
  const {theme} = useTheme();

  return (
    <InternalLabeledItem
      label={t(SectionTexts.timeInput.label)}
      wrapperStyle={{paddingVertical: 2}}
      accessibleLabel={true}
      {...innerprops}
    >
      <View style={{flex: 1}}>
        <RNDateTimePicker
          value={dateWithReplacedTime(new Date(), value)}
          mode="time"
          locale={locale}
          textColor={theme.text.colors.primary}
          display="inline"
          onChange={(_, date) => {
            onChange(dateToTimeString(date, language));
          }}
        />
      </View>
    </InternalLabeledItem>
  );
}
