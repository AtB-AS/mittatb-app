import {ChevronLeft, ChevronRight} from '@atb/assets/svg/mono-icons/navigation';
import {Date as DateIcon} from '@atb/assets/svg/mono-icons/time';
import {Button} from '@atb/components/button';
import {StyleSheet, useThemeContext} from '@atb/theme';
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
import {DepartureDateOptions, type DepartureSearchTime} from './types';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {EditActionSectionItem, Section} from '../sections';

type DateSelectionProps = {
  searchTime: DepartureSearchTime;
  setSearchTime: (searchTime: DepartureSearchTime) => void;
};

export const DateSelection = ({
  searchTime,
  setSearchTime,
}: DateSelectionProps): React.JSX.Element => {
  const styles = useStyles();
  const {t, language} = useTranslation();
  const {theme} = useThemeContext();
  const disablePreviousDayNavigation = isToday(
    parseISOFromCET(searchTime.date),
  );
  const onCloseFocusRef = useRef<View | null>(null);
  const bottomSheetModalRef = useRef<BottomSheetModal | null>(null);

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
        {!disablePreviousDayNavigation && (
          <Button
            expanded={false}
            onPress={() => {
              setSearchTime(changeDay(searchTime, -1));
            }}
            accessibilityLabel={t(DeparturesTexts.dateNavigation.prevDay)}
            mode="primary"
            interactiveColor={theme.color.interactive[2]}
            style={styles.nextPrevButtons}
            leftIcon={{svg: ChevronLeft}}
            disabled={disablePreviousDayNavigation}
            accessibilityHint={
              disablePreviousDayNavigation
                ? t(DeparturesTexts.dateNavigation.a11yDisabled)
                : t(DeparturesTexts.dateNavigation.a11yPreviousDayHint)
            }
            testID="previousDayButton"
          />
        )}
        <Section style={styles.setDateButton}>
          <EditActionSectionItem
            ref={onCloseFocusRef}
            onPress={onLaterTimePress}
            leftIcon={DateIcon}
            accessibilityHint={t(
              DeparturesTexts.dateNavigation.a11yChangeDateHint,
            )}
            text={
              searchTime.option === 'now'
                ? t(DeparturesTexts.dateNavigation.leaveNow)
                : t(DeparturesTexts.dateNavigation.leaveAt)
            }
            subText={
              searchTime.option === 'now'
                ? undefined
                : formatToLongDateTime(searchTime.date, language)
            }
            testID="setDateButton"
          />
        </Section>
        <Button
          expanded={false}
          onPress={() => {
            setSearchTime(changeDay(searchTime, 1));
          }}
          mode="primary"
          interactiveColor={theme.color.interactive[2]}
          style={styles.nextPrevButtons}
          rightIcon={{svg: ChevronRight}}
          accessibilityLabel={t(DeparturesTexts.dateNavigation.nextDay)}
          accessibilityHint={t(DeparturesTexts.dateNavigation.a11yNextDayHint)}
          testID="nextDayButton"
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
    gap: theme.spacing.small,
  },
  nextPrevButtons: {
    alignSelf: 'center',
  },
  textContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
    gap: theme.spacing.xSmall,
  },
  setDateButton: {
    flex: 1,
  },
}));
