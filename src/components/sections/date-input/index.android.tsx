import {useTheme} from '@atb/theme';
import {SectionTexts, useTranslation} from '@atb/translations';
import {formatToSimpleDate} from '@atb/utils/date';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import {parseISO} from 'date-fns';
import React, {useState} from 'react';
import ButtonInput from '../button-input';
import {DateInputItemProps, dateToDateString} from './utils';

export default function DateInputItem(props: DateInputItemProps) {
  const {value, onChange, ...innerProps} = props;
  const {t, locale, language} = useTranslation();
  const {theme} = useTheme();
  const [show, setShow] = useState(false);

  return (
    <>
      <ButtonInput
        label={t(SectionTexts.dateInput.label)}
        value={formatToSimpleDate(value, language)}
        onPress={() => setShow(true)}
        containerStyle={{alignItems: 'flex-end'}}
        {...innerProps}
      />
      {show && (
        <RNDateTimePicker
          value={parseISO(value)}
          mode="date"
          locale={locale}
          minimumDate={new Date()}
          textColor={theme.text.colors.primary}
          onChange={(_: Event, date?: Date) => {
            onChange(dateToDateString(date));
            setShow(false);
          }}
        />
      )}
    </>
  );
}
