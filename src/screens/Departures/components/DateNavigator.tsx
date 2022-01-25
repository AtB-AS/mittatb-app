import {StyleSheet, useTheme} from '@atb/theme';
import React, {Dispatch, SetStateAction} from 'react';
import {View} from 'react-native';
import Button from '@atb/components/button';
import {Language, useTranslation} from '@atb/translations';
import {
  formatToClock,
  formatToShortDate,
  formatToSimpleDateTime,
  isInThePast,
} from '@atb/utils/date';
import {ArrowLeft, ArrowRight} from '@atb/assets/svg/icons/navigation';
import {Date as DateIcon} from '@atb/assets/svg/icons/time';
import {SearchTime} from '../NearbyPlaces';
import {addDays, isSameDay, isToday, parseISO} from 'date-fns';
import DepartureTimeSheet from '../../Nearby/DepartureTimeSheet';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import DeparturesTexts from '@atb/translations/screens/Departures';

type DateNavigationProps = {
  searchTime: SearchTime;
  setSearchTime: Dispatch<SetStateAction<SearchTime>>;
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
  const a11ySearchTimeText =
    searchTime.option === 'now'
      ? t(DeparturesTexts.dateNavigation.today)
      : formatToSimpleDateTime(searchTime.date, language);

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
      ></DepartureTimeSheet>
    ));
  };

  return (
    <View style={styles.dateNavigator}>
      <Button
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
            : undefined
        }
        textStyle={{
          marginLeft: theme.spacings.xSmall,
        }}
      ></Button>
      <Button
        onPress={onLaterTimePress}
        text={searchTimeText}
        accessibilityLabel={t(
          DeparturesTexts.dateNavigation.a11ySelectedLabel(a11ySearchTimeText),
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
      ></Button>
      <Button
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
      ></Button>
    </View>
  );
}

function changeDay(searchTime: SearchTime, days: number): SearchTime {
  const date = addDays(parseISO(searchTime.date).setHours(0, 0), days);
  return {
    option: isToday(date) ? 'now' : 'departure',
    date: isToday(date) ? new Date().toISOString() : date.toISOString(),
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
