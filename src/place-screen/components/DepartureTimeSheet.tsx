import {Confirm} from '@atb/assets/svg/mono-icons/actions';
import {
  BottomSheetContainer,
  useBottomSheetContext,
} from '@atb/components/bottom-sheet';
import {Button} from '@atb/components/button';
import {FullScreenFooter} from '@atb/components/screen-footer';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {DeparturesTexts, useTranslation} from '@atb/translations';
import {isInThePast} from '@atb/utils/date';
import {useKeyboardHeight} from '@atb/utils/use-keyboard-height';
import React, {forwardRef, useState} from 'react';
import {ScrollView} from 'react-native';
import {SearchTime} from '../types';
import {DatePicker} from '@atb/date-picker';

type Props = {
  initialTime: SearchTime;
  setSearchTime: (time: SearchTime) => void;
  allowTimeInPast?: boolean;
};

export const DepartureTimeSheet = forwardRef<ScrollView, Props>(
  ({initialTime, setSearchTime, allowTimeInPast = true}, focusRef) => {
    const styles = useStyles();
    const {t} = useTranslation();
    const {theme} = useThemeContext();
    const interactiveColor = theme.color.interactive[0];

    const [date, setDate] = useState(initialTime.date);

    const {close} = useBottomSheetContext();
    const onSelect = () => {
      if (isInThePast(date) && !allowTimeInPast) {
        setSearchTime({option: 'now', date: new Date().toISOString()});
      } else {
        setSearchTime({option: 'departure', date});
      }
      close();
    };

    const keyboardHeight = useKeyboardHeight();

    return (
      <BottomSheetContainer title={t(DeparturesTexts.dateInput.header)}>
        <ScrollView style={{paddingBottom: keyboardHeight}} ref={focusRef}>
          <DatePicker date={date} onDateChange={setDate} />
        </ScrollView>

        <FullScreenFooter>
          <Button
            expanded={true}
            onPress={onSelect}
            interactiveColor={interactiveColor}
            text={t(DeparturesTexts.dateInput.confirm)}
            rightIcon={{svg: Confirm}}
            accessibilityHint={t(DeparturesTexts.dateInput.a11yInPastHint)}
            style={styles.button}
            testID="searchButton"
          />
        </FullScreenFooter>
      </BottomSheetContainer>
    );
  },
);

const useStyles = StyleSheet.createThemeHook((theme) => ({
  button: {marginTop: theme.spacing.medium},
}));
