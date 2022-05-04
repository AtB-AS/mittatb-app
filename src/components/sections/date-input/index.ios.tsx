import {useTheme} from '@atb/theme';
import {SectionTexts, useTranslation} from '@atb/translations';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import {parseISO} from 'date-fns';
import React from 'react';
import {Platform, StyleProp, ViewStyle} from 'react-native';
import InternalLabeledItem from '../internals/internal-labeled-item';
import {DateInputItemProps, dateToDateString} from './utils';
import {useLocaleContext} from '@atb/LocaleProvider';

export default function DateInputItem(props: DateInputItemProps) {
  const {value, onChange, ...innerprops} = props;
  const {t} = useTranslation();
  const locale = useLocaleContext();
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
        locale={locale.localeString}
        style={{
          ...style,
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
          alignSelf: 'flex-end',
        }}
        textColor={theme.text.colors.primary}
        display="compact"
        testID="dateInput"
        minimumDate={new Date()}
        onChange={(_, date) => {
          onChange(dateToDateString(date));
        }}
      />
    </InternalLabeledItem>
  );
}
