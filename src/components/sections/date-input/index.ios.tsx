import {useTheme} from '@atb/theme';
import {SectionTexts, useTranslation} from '@atb/translations';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import {parseISO} from 'date-fns';
import React from 'react';
import {Platform, StyleProp, ViewStyle} from 'react-native';
import InternalLabeledItem from '../internals/internal-labeled-item';
import {DateInputItemProps, dateToDateString} from './utils';

export default function DateInputItem(props: DateInputItemProps) {
  const {value, onChange, ...innerprops} = props;

  const {t, locale} = useTranslation();
  const {theme} = useTheme();

  const majorVersionIOS = parseInt(String(Platform.Version), 10);
  let style: StyleProp<ViewStyle> = {width: 130};
  if (majorVersionIOS < 13) {
    style = {width: undefined, flex: 1};
  }

  return (
    <InternalLabeledItem
      label={t(SectionTexts.dateInput.label)}
      {...innerprops}
    >
      <RNDateTimePicker
        value={parseISO(value)}
        mode="date"
        // Always use no as locale to enfore 24 Hour clock
        locale="no"
        style={{
          ...style,
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
          alignSelf: 'flex-end',
        }}
        textColor={theme.text.colors.primary}
        display="compact"
        minimumDate={new Date()}
        onChange={(date) => {
          onChange(dateToDateString(date));
        }}
      />
    </InternalLabeledItem>
  );
}
