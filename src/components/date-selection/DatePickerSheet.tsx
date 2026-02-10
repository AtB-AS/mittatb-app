import {StyleSheet, useThemeContext} from '@atb/theme';
import {DatePickerSheetTexts, useTranslation} from '@atb/translations';
import {useKeyboardHeight} from '@atb/utils/use-keyboard-height';
import React, {useState} from 'react';
import {View} from 'react-native';
import {RadioSegments} from '@atb/components/radio';
import {animateNextChange} from '@atb/utils/animation';
import type {
  DateOptionAndText,
  DateOptionAndValue,
} from '@atb/components/date-selection';
import {default as RNDatePicker} from 'react-native-date-picker';
import {getTimeZoneOffsetInMinutes, parseDate} from '@atb/utils/date';
import {useLocaleContext} from '@atb/modules/locale';
import {BottomSheetModal} from '../bottom-sheet';
import {giveFocus} from '@atb/utils/use-focus-on-load';
import {RefObject} from '@testing-library/react-native/build/types';
import {BottomSheetModal as GorhomBottomSheetModal} from '@gorhom/bottom-sheet';
import {BottomSheetHeaderType} from '../bottom-sheet/use-bottom-sheet-header-type';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';

type Props<T extends string> = {
  initialDate?: string;
  options: DateOptionAndText<T>[];
  onSave: (optionAndValue: DateOptionAndValue<T>) => void;
  bottomSheetModalRef: React.RefObject<GorhomBottomSheetModal | null>;
  onCloseFocusRef: RefObject<View | null>;
};

/**
 * A date picker bottom sheet that should be used for selecting date and time in
 * the app. The date picker options (like "now", "departure", "arrival") are
 * customisable from the parent component.
 *
 * Note that when using the date picker option 'now' there is some specific
 * handling:
 * - The date picker component is not shown when 'now' are the selected option.
 * - Selecting 'now' sets the date to the current date and time.
 */
export const DatePickerSheet = <T extends string>({
  initialDate = new Date().toISOString(),
  options,
  onSave,
  bottomSheetModalRef,
  onCloseFocusRef,
}: Props<T>) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {theme, themeName} = useThemeContext();
  const locale = useLocaleContext();

  const [isSpinning, setIsSpinning] = useState(false);
  const [date, setDate] = useState(initialDate);
  const [selectedOptionId, setSelectedOptionId] = useState<T>(
    options.find((o) => o.selected)?.option || options[0].option,
  );

  const nativeGesture = Gesture.Native().disallowInterruption(true);

  return (
    <BottomSheetModal
      bottomSheetModalRef={bottomSheetModalRef}
      heading={t(DatePickerSheetTexts.heading)}
      bottomSheetHeaderType={BottomSheetHeaderType.Confirm}
      closeCallback={() => {
        if (initialDate !== date) {
          onSave({option: selectedOptionId, date});
        }
        giveFocus(onCloseFocusRef);
      }}
      overrideCloseFunction={isSpinning ? () => {} : undefined}
      closeOnBackdropPress={!isSpinning}
      enablePanDownToClose={!isSpinning}
    >
      <View style={styles.container}>
        <RadioSegments
          color={theme.color.interactive[2]}
          activeIndex={options.findIndex((o) => o.option === selectedOptionId)}
          options={options.map((o) => ({
            text: o.text,
            onPress: () => {
              animateNextChange();
              setSelectedOptionId(o.option);
              if (o.option === 'now') setDate(new Date().toISOString());
            },
          }))}
        />

        {selectedOptionId !== 'now' && (
          <GestureDetector gesture={nativeGesture}>
            <RNDatePicker
              date={parseDate(date)}
              onDateChange={(date) => {
                date.setSeconds(0, 0);
                setDate(date.toISOString());
              }}
              mode="datetime"
              locale={locale.localeString}
              onStateChange={(state) => setIsSpinning(state === 'spinning')}
              // Applies timezone offset between CET and UTC to enforce CET timezone on date picker
              timeZoneOffsetInMinutes={getTimeZoneOffsetInMinutes()}
              theme={themeName}
            />
          </GestureDetector>
        )}
      </View>
    </BottomSheetModal>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  const keyboardHeight = useKeyboardHeight();

  return {
    container: {
      paddingHorizontal: theme.spacing.medium,
      paddingBottom: keyboardHeight,
      alignItems: 'center',
    },
    button: {marginVertical: theme.spacing.medium},
  };
});
