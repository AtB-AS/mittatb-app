import {ArrowLeft, ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {Date as DateIcon} from '@atb/assets/svg/mono-icons/time';
import {useBottomSheetContext} from '@atb/components/bottom-sheet';
import {Button} from '@atb/components/button';
import {StyleSheet} from '@atb/theme';
import {
  DeparturesTexts,
  Language,
  type TranslateFunction,
  useTranslation,
} from '@atb/translations';
import {
  formatToLongDateTime,
  isInThePast,
  parseISOFromCET,
} from '@atb/utils/date';
import {useFontScale} from '@atb/utils/use-font-scale';
import {addDays, isToday, parseISO} from 'date-fns';
import React, {RefObject, useRef} from 'react';
import {View} from 'react-native';
import {DepartureDateOptions, DepartureSearchTime} from '../types';
import {DatePickerSheet} from '@atb/date-picker';

type DateSelectionProps = {
  searchTime: DepartureSearchTime;
  setSearchTime: (searchTime: DepartureSearchTime) => void;
};

export const DateSelection = ({
  searchTime,
  setSearchTime,
}: DateSelectionProps): JSX.Element => {
  const styles = useStyles();
  const {t, language} = useTranslation();
  const disablePreviousDayNavigation = isToday(
    parseISOFromCET(searchTime.date),
  );
  const onCloseFocusRef = useRef<RefObject<any>>(null);

  const fontScale = useFontScale();
  const shouldShowNextPrevTexts = fontScale < 1.3;

  const searchTimeText =
    searchTime.option === 'now'
      ? t(DeparturesTexts.dateNavigation.departureNow)
      : formatToTwoLineDateTime(searchTime.date, language, t);

  const onSetSearchTime = (time: DepartureSearchTime) => {
    if (isInThePast(time.date)) {
      setSearchTime({
        date: new Date().toISOString(),
        option: 'now',
      });
      return;
    }
    setSearchTime(time);
  };

  const {open: openBottomSheet, onOpenFocusRef} = useBottomSheetContext();
  const onLaterTimePress = () => {
    openBottomSheet(
      () => (
        <DatePickerSheet
          ref={onOpenFocusRef}
          initialDate={searchTime.date}
          onSave={onSetSearchTime}
          options={DepartureDateOptions.map((option) => ({
            option,
            text: t(DeparturesTexts.dateNavigation.options[option]),
            selected: searchTime.option === option,
          }))}
        />
      ),
      onCloseFocusRef,
    );
  };

  return (
    <View style={styles.dateNavigator}>
      <Button
        expanded={false}
        onPress={() => {
          setSearchTime(changeDay(searchTime, -1));
        }}
        text={
          shouldShowNextPrevTexts
            ? t(DeparturesTexts.dateNavigation.prevDay)
            : undefined
        }
        mode="tertiary"
        type="small"
        leftIcon={{svg: ArrowLeft}}
        disabled={disablePreviousDayNavigation}
        accessibilityHint={
          disablePreviousDayNavigation
            ? t(DeparturesTexts.dateNavigation.a11yDisabled)
            : t(DeparturesTexts.dateNavigation.a11yPreviousDayHint)
        }
        testID="previousDayButton"
      />
      <Button
        expanded={false}
        onPress={onLaterTimePress}
        text={searchTimeText}
        accessibilityHint={t(DeparturesTexts.dateNavigation.a11yChangeDateHint)}
        type="small"
        mode="tertiary"
        rightIcon={{svg: DateIcon}}
        testID="setDateButton"
        ref={onCloseFocusRef}
      />
      <Button
        expanded={false}
        onPress={() => {
          setSearchTime(changeDay(searchTime, 1));
        }}
        text={
          shouldShowNextPrevTexts
            ? t(DeparturesTexts.dateNavigation.nextDay)
            : undefined
        }
        type="small"
        mode="tertiary"
        rightIcon={{svg: ArrowRight}}
        accessibilityHint={t(DeparturesTexts.dateNavigation.a11yNextDayHint)}
        testID="nextDayButton"
      />
    </View>
  );
};

function changeDay(
  searchTime: DepartureSearchTime,
  days: number,
): DepartureSearchTime {
  const date =
    searchTime.option === 'now'
      ? addDays(parseISO(searchTime.date).setHours(0, 0), days)
      : addDays(parseISO(searchTime.date), days);
  return {
    option: isInThePast(date) ? 'now' : 'departure',
    date: isInThePast(date) ? new Date().toISOString() : date.toISOString(),
  };
}

function formatToTwoLineDateTime(
  isoDate: string,
  language: Language,
  t: TranslateFunction,
) {
  return t(
    DeparturesTexts.dateNavigation.departureLater(
      '\n' + formatToLongDateTime(isoDate, language),
    ),
  );
}

const useStyles = StyleSheet.createThemeHook(() => ({
  dateNavigator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));
