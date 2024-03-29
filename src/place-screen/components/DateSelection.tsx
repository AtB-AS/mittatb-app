import {StyleSheet} from '@atb/theme';
import React from 'react';
import {View} from 'react-native';
import {Button} from '@atb/components/button';
import {DeparturesTexts, Language, useTranslation} from '@atb/translations';
import {
  formatToClock,
  formatToShortDate,
  formatToVerboseDateTime,
  isInThePast,
} from '@atb/utils/date';
import {ArrowLeft, ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {Date as DateIcon} from '@atb/assets/svg/mono-icons/time';
import {addDays, isSameDay, isToday, parseISO} from 'date-fns';
import {DepartureTimeSheet} from './DepartureTimeSheet';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import {SearchTime} from '../types';
import {useFontScale} from '@atb/utils/use-font-scale';

type DateSelectionProps = {
  searchTime: SearchTime;
  setSearchTime: (searchTime: SearchTime) => void;
};

export const DateSelection = ({
  searchTime,
  setSearchTime,
}: DateSelectionProps): JSX.Element => {
  const styles = useStyles();
  const {t, language} = useTranslation();
  const disablePreviousDayNavigation = isToday(parseISO(searchTime.date));

  const fontScale = useFontScale();
  const shouldShowNextPrevTexts = fontScale < 1.3;

  const searchTimeText =
    searchTime.option === 'now'
      ? t(DeparturesTexts.dateNavigation.today)
      : formatToTwoLineDateTime(searchTime.date, language);

  const getA11ySearchTimeText = () => {
    const parsed = parseISO(searchTime.date);

    if (searchTime.option === 'now')
      return t(DeparturesTexts.dateNavigation.today);

    if (isSameDay(parsed, new Date()))
      return (
        t(DeparturesTexts.dateNavigation.today) +
        ', ' +
        formatToClock(parsed, language, 'floor')
      );

    return formatToVerboseDateTime(parsed, language);
  };

  const onSetSearchTime = (time: SearchTime) => {
    if (isInThePast(time.date)) {
      setSearchTime({
        date: new Date().toISOString(),
        option: 'now',
      });
      return;
    }
    setSearchTime(time);
  };

  const {open: openBottomSheet, onOpenFocusRef} = useBottomSheet();
  const onLaterTimePress = () => {
    openBottomSheet(() => (
      <DepartureTimeSheet
        ref={onOpenFocusRef}
        initialTime={searchTime}
        setSearchTime={onSetSearchTime}
        allowTimeInPast={false}
      />
    ));
  };

  return (
    <View style={styles.dateNavigator}>
      <Button
        onPress={() => {
          setSearchTime(changeDay(searchTime, -1));
        }}
        text={
          shouldShowNextPrevTexts
            ? t(DeparturesTexts.dateNavigation.prevDay)
            : undefined
        }
        type="medium"
        mode="tertiary"
        compact={true}
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
        onPress={onLaterTimePress}
        text={searchTimeText}
        accessibilityLabel={t(
          DeparturesTexts.dateNavigation.a11ySelectedLabel(
            getA11ySearchTimeText(),
          ),
        )}
        accessibilityHint={t(DeparturesTexts.dateNavigation.a11yChangeDateHint)}
        type="medium"
        compact={true}
        mode="tertiary"
        rightIcon={{svg: DateIcon}}
        testID="setDateButton"
      />
      <Button
        onPress={() => {
          setSearchTime(changeDay(searchTime, 1));
        }}
        text={
          shouldShowNextPrevTexts
            ? t(DeparturesTexts.dateNavigation.nextDay)
            : undefined
        }
        type="medium"
        compact={true}
        mode="tertiary"
        rightIcon={{svg: ArrowRight}}
        accessibilityHint={t(DeparturesTexts.dateNavigation.a11yNextDayHint)}
        testID="nextDayButton"
      />
    </View>
  );
};

function changeDay(searchTime: SearchTime, days: number): SearchTime {
  const date =
    searchTime.option === 'now'
      ? addDays(parseISO(searchTime.date).setHours(0, 0), days)
      : addDays(parseISO(searchTime.date), days);
  return {
    option: isInThePast(date) ? 'now' : 'departure',
    date: isInThePast(date) ? new Date().toISOString() : date.toISOString(),
  };
}

function formatToTwoLineDateTime(isoDate: string, language: Language) {
  const parsed = parseISO(isoDate);
  if (isSameDay(parsed, new Date())) {
    return formatToClock(parsed, language, 'floor');
  }
  return (
    formatToShortDate(parsed, language) +
    '\n' +
    formatToClock(parsed, language, 'floor')
  );
}

const useStyles = StyleSheet.createThemeHook(() => ({
  dateNavigator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));
