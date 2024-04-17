import {Confirm} from '@atb/assets/svg/mono-icons/actions';
import {
  BottomSheetContainer,
  useBottomSheet,
} from '@atb/components/bottom-sheet';
import {Button} from '@atb/components/button';
import {FullScreenFooter} from '@atb/components/screen-footer';
import {
  DateInputSectionItem,
  Section,
  TimeInputSectionItem,
} from '@atb/components/sections';
import {StyleSheet} from '@atb/theme';
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

    const [date, setDate] = useState(initialTime.date);
    const [time, setTime] = useState(
      formatLocaleTime(initialTime.date, language),
    );

    const {close} = useBottomSheet();
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
          <Section style={styles.section}>
            <DateInputSectionItem value={date} onChange={setDate} />
            <TimeInputSectionItem value={time} onChange={setTime} />
          </Section>

          <Button
            onPress={onSelect}
            interactiveColor="interactive_0"
            text={t(DeparturesTexts.dateInput.confirm)}
            rightIcon={{svg: Confirm}}
            accessibilityHint={t(DeparturesTexts.dateInput.a11yInPastHint)}
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
      padding: theme.spacings.medium,
    },
    section: {
      marginBottom: theme.spacings.large,
    },
  };
});
