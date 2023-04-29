import {useTheme} from '@atb/theme';
import {SectionTexts, useTranslation} from '@atb/translations';
import {formatToSimpleDate} from '@atb/utils/date';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import {parseISO} from 'date-fns';
import React, {useState} from 'react';
import {ButtonSectionItem} from '../ButtonSectionItem';
import {DateInputSectionItemProps} from './utils';
import {useLocaleContext} from '@atb/LocaleProvider';
import {dateToDateString} from '@atb/utils/date-to-date-string';

export function DateInputSectionItem(props: DateInputSectionItemProps) {
  const {value, onChange, ...innerProps} = props;
  const {t} = useTranslation();
  const locale = useLocaleContext();
  const {theme} = useTheme();
  const [show, setShow] = useState(false);

  return (
    <>
      <ButtonSectionItem
        label={t(SectionTexts.dateInput.label)}
        value={formatToSimpleDate(value, locale.language)}
        onPress={() => setShow(true)}
        containerStyle={{alignItems: 'flex-end'}}
        {...innerProps}
      />
      {show && (
        <RNDateTimePicker
          value={parseISO(value)}
          mode="date"
          locale={locale.localeString}
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
