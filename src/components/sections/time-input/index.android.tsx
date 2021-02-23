import {useTheme} from '@atb/theme';
import {JourneyDatePickerTexts, useTranslation} from '@atb/translations';
import {dateWithReplacedTime, formatLocaleTime} from '@atb/utils/date';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import {parseISO} from 'date-fns';
import React, {useState} from 'react';
import ButtonInput from '../button-input';
import {dateToTimeString, TimeInputItemProps} from './utils';

export default function TimeInputItem(props: TimeInputItemProps) {
  const {value, onChange, ...innerprops} = props;
  const {t, language} = useTranslation();
  const [show, setShow] = useState(false);
  const {theme} = useTheme();

  return (
    <>
      <ButtonInput
        label={t(JourneyDatePickerTexts.dateTime.time)}
        onPress={() => setShow(true)}
        value={formatLocaleTime(value, language)}
        containerStyle={{alignItems: 'flex-end'}}
        {...innerprops}
      />

      {show && (
        <RNDateTimePicker
          value={dateWithReplacedTime(new Date(), value)}
          mode="time"
          is24Hour
          textColor={theme.text.colors.primary}
          onChange={(_, date) => {
            setShow(false);
            onChange(dateToTimeString(date, language));
          }}
        />
      )}
    </>
  );
}
