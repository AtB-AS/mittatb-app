import {SectionTexts, useTranslation} from '@atb/translations';
import {dateWithReplacedTime, formatLocaleTime} from '@atb/utils/date';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import React, {useMemo, useState} from 'react';
import {ButtonSectionItem} from '../ButtonSectionItem';
import {dateToTimeString, TimeInputSectionItemProps} from './utils';

export function TimeInputSectionItem(props: TimeInputSectionItemProps) {
  const {value, onChange, ...innerprops} = props;
  const {t, language} = useTranslation();
  const [show, setShow] = useState(false);
  const time = useMemo(() => dateWithReplacedTime(new Date(), value), [value]);

  return (
    <>
      <ButtonSectionItem
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
          onChange={(_: Event, date?: Date) => {
            setShow(false);
            onChange(dateToTimeString(date, language));
          }}
        />
      )}
    </>
  );
}
