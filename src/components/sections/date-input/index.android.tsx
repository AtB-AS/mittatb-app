import {useTheme} from '@atb/theme';
import {JourneyDatePickerTexts, useTranslation} from '@atb/translations';
import {formatToSimpleDate} from '@atb/utils/date';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import {parseISO} from 'date-fns';
import React, {useState} from 'react';
import {Platform} from 'react-native';
import ButtonInput from '../button-input';
import InternalLabeledItem from '../internals/internal-labeled-item';
import {DateInputItemProps, dateToDateString} from './utils';

export default function DateInputItem(props: DateInputItemProps) {
  const {value, onChange, ...innerProps} = props;
  const {t, locale, language} = useTranslation();
  const {theme} = useTheme();
  const [show, setShow] = useState(false);

  return (
    <>
      <ButtonInput
        label={t(JourneyDatePickerTexts.dateTime.date)}
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
          textColor={theme.text.colors.primary}
          onChange={(_, date) => {
            onChange(dateToDateString(date));
            setShow(false);
          }}
        />
      )}
    </>
  );
}
