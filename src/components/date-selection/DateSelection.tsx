import {ArrowLeft, ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {Date as DateIcon} from '@atb/assets/svg/mono-icons/time';
import {Button} from '@atb/components/button';
import {StyleSheet} from '@atb/theme';
import {DeparturesTexts, useTranslation} from '@atb/translations';
import {
  formatToLongDateTime,
  isInThePast,
  parseISOFromCET,
} from '@atb/utils/date';
import {addDays, isToday, parseISO} from 'date-fns';
import React, {useRef} from 'react';
import {View} from 'react-native';
import {DatePickerSheet} from './DatePickerSheet';
import type {ContrastColor} from '@atb-as/theme';
import {DepartureDateOptions, type DepartureSearchTime} from './types';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {NativeBlockButton} from '@atb/components/native-button';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '../theme-icon';
import {useFontScale} from '@atb/utils/use-font-scale';

type DateSelectionProps = {
  searchTime: DepartureSearchTime;
  setSearchTime: (searchTime: DepartureSearchTime) => void;
  backgroundColor: ContrastColor;
  latestDate?: Date;
};

export const DateSelection = ({
  searchTime,
  setSearchTime,
  backgroundColor,
  latestDate,
}: DateSelectionProps): React.JSX.Element => {
  const styles = useStyles();
  const {t, language} = useTranslation();
  const disablePreviousDayNavigation = isToday(
    parseISOFromCET(searchTime.date),
  );
  const onCloseFocusRef = useRef<View | null>(null);
  const bottomSheetModalRef = useRef<BottomSheetModal | null>(null);

  const fontScale = useFontScale();
  const shouldShowNextPrevTexts = fontScale <= 1.3;

  const searchTimeText =
    searchTime.option === 'now'
      ? t(DeparturesTexts.dateNavigation.today)
      : formatToLongDateTime(searchTime.date, language);

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

  const onLaterTimePress = () => {
    bottomSheetModalRef.current?.present();
  };

  return (
    <>
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
          style={styles.nextPrevButtons}
          leftIcon={{svg: ArrowLeft}}
          disabled={disablePreviousDayNavigation}
          accessibilityHint={
            disablePreviousDayNavigation
              ? t(DeparturesTexts.dateNavigation.a11yDisabled)
              : t(DeparturesTexts.dateNavigation.a11yPreviousDayHint)
          }
          testID="previousDayButton"
          backgroundColor={backgroundColor}
        />

        <NativeBlockButton
          onPress={onLaterTimePress}
          style={[
            styles.setDateButton,
            {flexDirection: searchTime.option === 'now' ? 'row' : 'column'},
          ]}
          accessibilityHint={t(
            DeparturesTexts.dateNavigation.a11yChangeDateHint,
          )}
          testID="setDateButton"
          ref={onCloseFocusRef}
        >
          <ThemeIcon svg={DateIcon} color={backgroundColor} />
          <ThemeText color={backgroundColor} typography="body__s">
            {searchTimeText}
          </ThemeText>
        </NativeBlockButton>
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
          style={styles.nextPrevButtons}
          rightIcon={{svg: ArrowRight}}
          accessibilityHint={t(DeparturesTexts.dateNavigation.a11yNextDayHint)}
          testID="nextDayButton"
          backgroundColor={backgroundColor}
        />
      </View>
      <DatePickerSheet
        initialDate={searchTime.date}
        initialOption={searchTime.option}
        onSave={onSetSearchTime}
        options={DepartureDateOptions.map((option) => ({
          option,
          text: t(DeparturesTexts.dateNavigation.options[option]),
          selected: searchTime.option === option,
        }))}
        bottomSheetModalRef={bottomSheetModalRef}
        onCloseFocusRef={onCloseFocusRef}
        maximumDate={latestDate}
      />
    </>
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

const useStyles = StyleSheet.createThemeHook((theme) => ({
  dateNavigator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nextPrevButtons: {
    alignSelf: 'center',
  },
  setDateButton: {
    alignItems: 'center',
    alignSelf: 'center',
    gap: theme.spacing.xSmall,
  },
}));
