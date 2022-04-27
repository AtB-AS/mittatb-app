import {StyleSheet, useTheme} from '@atb/theme';
import React, {Dispatch, SetStateAction} from 'react';
import {View} from 'react-native';
import Button from '@atb/components/button';
import {Language, useTranslation} from '@atb/translations';
import {
  formatToClock,
  formatToShortDate,
  formatToVerboseDateTime,
  isInThePast,
} from '@atb/utils/date';
import {ArrowLeft, ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {Date as DateIcon} from '@atb/assets/svg/mono-icons/time';
import {SearchTime} from '../NearbyPlaces';
import {addDays, isSameDay, isToday, parseISO} from 'date-fns';
import DepartureTimeSheet from '../../Nearby/DepartureTimeSheet';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import DeparturesTexts from '@atb/translations/screens/Departures';

type DateNavigationProps = {
  searchTime: SearchTime;
  setSearchTime: (searchTime: SearchTime) => void;
};

export default function DateNavigation({
  searchTime,
  setSearchTime,
}: DateNavigationProps): JSX.Element {
  const styles = useStyles();
  const {theme} = useTheme();
  const {t, language} = useTranslation();
  const disablePreviousDayNavigation = isToday(parseISO(searchTime.date));

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
        formatToClock(parsed, language)
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

  const {open: openBottomSheet} = useBottomSheet();
  const onLaterTimePress = () => {
    openBottomSheet((close, focusRef) => (
      <DepartureTimeSheet
        ref={focusRef}
        close={close}
        initialTime={searchTime}
        setSearchTime={onSetSearchTime}
        allowTimeInPast={false}
      ></DepartureTimeSheet>
    ));
  };

  return (
    <View style={styles.dateNavigator}>
      <Button
        interactiveColor="interactive_2"
        onPress={() => {
          setSearchTime(changeDay(searchTime, -1));
        }}
        text={t(DeparturesTexts.dateNavigation.prevDay)}
        type="inline"
        mode="tertiary"
        icon={ArrowLeft}
        disabled={disablePreviousDayNavigation}
        accessibilityHint={
          disablePreviousDayNavigation
            ? t(DeparturesTexts.dateNavigation.a11yDisabled)
            : t(DeparturesTexts.dateNavigation.a11yPreviousDayHint)
        }
        textStyle={{
          marginLeft: theme.spacings.xSmall,
        }}
        testID="previousDayButton"
      ></Button>
      <Button
        interactiveColor="interactive_2"
        onPress={onLaterTimePress}
        text={searchTimeText}
        accessibilityLabel={t(
          DeparturesTexts.dateNavigation.a11ySelectedLabel(
            getA11ySearchTimeText(),
          ),
        )}
        accessibilityHint={t(DeparturesTexts.dateNavigation.a11yChangeDateHint)}
        type="compact"
        mode="tertiary"
        iconPosition="right"
        icon={DateIcon}
        textStyle={{
          textAlign: 'center',
          marginRight: theme.spacings.xSmall,
        }}
        testID="setDateButton"
      ></Button>
      <Button
        interactiveColor="interactive_2"
        onPress={() => {
          setSearchTime(changeDay(searchTime, 1));
        }}
        text={t(DeparturesTexts.dateNavigation.nextDay)}
        type="compact"
        iconPosition="right"
        mode="tertiary"
        icon={ArrowRight}
        textStyle={{
          marginRight: theme.spacings.xSmall,
        }}
        accessibilityHint={t(DeparturesTexts.dateNavigation.a11yNextDayHint)}
        testID="nextDayButton"
      ></Button>
    </View>
  );
}

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
    return formatToClock(parsed, language);
  }
  return (
    formatToShortDate(parsed, language) + '\n' + formatToClock(parsed, language)
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  dateNavigator: {
    flexDirection: 'row',
    flexGrow: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: theme.spacings.medium,
  },
}));
