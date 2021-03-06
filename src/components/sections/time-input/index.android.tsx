import {SectionTexts, useTranslation} from '@atb/translations';
import {dateWithReplacedTime, formatLocaleTime} from '@atb/utils/date';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import React, {useMemo, useState} from 'react';
import ButtonInput from '../button-input';
import {dateToTimeString, TimeInputItemProps} from './utils';

export default function TimeInputItem(props: TimeInputItemProps) {
  const {value, onChange, ...innerprops} = props;
  const {t, language} = useTranslation();
  const [show, setShow] = useState(false);
  const time = useMemo(() => dateWithReplacedTime(new Date(), value), [value]);

  return (
    <>
      <ButtonInput
        label={t(SectionTexts.timeInput.label)}
        onPress={() => setShow(true)}
        value={formatLocaleTime(time, language)}
        containerStyle={{alignItems: 'flex-end'}}
        {...innerprops}
      />

      {show && (
        <RNDateTimePicker
          value={time}
          mode="time"
          is24Hour
          onChange={(_, date) => {
            setShow(false);
            onChange(dateToTimeString(date, language));
          }}
        />
      )}
    </>
  );
}
