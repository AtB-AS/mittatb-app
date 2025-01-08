import {Confirm} from '@atb/assets/svg/mono-icons/actions';
import {
  BottomSheetContainer,
  useBottomSheetContext,
} from '@atb/components/bottom-sheet';
import {Button} from '@atb/components/button';
import {FullScreenFooter} from '@atb/components/screen-footer';
import {
  DateInputSectionItem,
  Section,
  TimeInputSectionItem,
} from '@atb/components/sections';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {DeparturesTexts, useTranslation} from '@atb/translations';
import {
  dateWithReplacedTime,
  formatLocaleTime,
  isInThePast,
} from '@atb/utils/date';
import {useKeyboardHeight} from '@atb/utils/use-keyboard-height';
import React, {forwardRef, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {SearchTime} from '../types';

type Props = {
  initialTime: SearchTime;
  setSearchTime: (time: SearchTime) => void;
  allowTimeInPast?: boolean;
};

export const DepartureTimeSheet = forwardRef<ScrollView, Props>(
  ({initialTime, setSearchTime, allowTimeInPast = true}, focusRef) => {
    const styles = useStyles();
    const {t, language} = useTranslation();
    const {theme} = useThemeContext();
    const interactiveColor = theme.color.interactive[0];

    const [date, setDate] = useState(initialTime.date);
    const [time, setTime] = useState(
      formatLocaleTime(initialTime.date, language),
    );

    const {close} = useBottomSheetContext();
    const onSelect = () => {
      const calculatedTime = dateWithReplacedTime(date, time).toISOString();
      if (isInThePast(calculatedTime) && !allowTimeInPast) {
        setSearchTime({option: 'now', date: new Date().toISOString()});
      } else {
        setSearchTime({option: 'departure', date: calculatedTime});
      }
      close();
    };

    const keyboardHeight = useKeyboardHeight();

    return (
      <BottomSheetContainer title={t(DeparturesTexts.dateInput.header)}>
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          style={{paddingBottom: keyboardHeight}}
          ref={focusRef}
        >
          <Section style={styles.section} testID="dateTimePickerSection">
            <DateInputSectionItem
              value={date}
              onChange={setDate}
              testID="datePicker"
            />
            <TimeInputSectionItem
              value={time}
              onChange={setTime}
              testID="timePicker"
            />
          </Section>

          <Button
            expanded={true}
            onPress={onSelect}
            interactiveColor={interactiveColor}
            text={t(DeparturesTexts.dateInput.confirm)}
            rightIcon={{svg: Confirm}}
            accessibilityHint={t(DeparturesTexts.dateInput.a11yInPastHint)}
            testID="searchButton"
          />
        </ScrollView>

        <FullScreenFooter>
          <View />
        </FullScreenFooter>
      </BottomSheetContainer>
    );
  },
);

const useStyles = StyleSheet.createThemeHook((theme) => {
  return {
    contentContainer: {
      padding: theme.spacing.medium,
    },
    section: {
      marginBottom: theme.spacing.large,
    },
  };
});
