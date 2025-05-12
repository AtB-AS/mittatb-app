import {Confirm} from '@atb/assets/svg/mono-icons/actions';
import {
  BottomSheetContainer,
  useBottomSheetContext,
} from '@atb/components/bottom-sheet';
import {Button} from '@atb/components/button';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {
  DatePickerSheetTexts,
  dictionary,
  useTranslation,
} from '@atb/translations';
import {useKeyboardHeight} from '@atb/utils/use-keyboard-height';
import React, {type Ref, useState} from 'react';
import {ScrollView} from 'react-native';
import {RadioSegments} from '@atb/components/radio';
import {animateNextChange} from '@atb/utils/animation';
import type {
  DateOptionAndText,
  DateOptionAndValue,
} from '@atb/date-picker/types';
import {default as RNDatePicker} from 'react-native-date-picker';
import {getTimeZoneOffsetInMinutes, parseDate} from '@atb/utils/date';
import {useLocaleContext} from '@atb/modules/locale';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type Props<T extends string> = {
  initialDate?: string;
  options: DateOptionAndText<T>[];
  onSave: (optionAndValue: DateOptionAndValue<T>) => void;
  ref?: Ref<any>;
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
  ref,
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

  const {close} = useBottomSheetContext();
  const onSelect = () => {
    onSave({option: selectedOptionId, date});
    close();
  };

  return (
    <BottomSheetContainer title={t(DatePickerSheetTexts.heading)}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        ref={ref}
      >
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
          <RNDatePicker
            date={parseDate(date)}
            onDateChange={(date) => setDate(date.toISOString())}
            mode="datetime"
            locale={locale.localeString}
            onStateChange={(state) => setIsSpinning(state === 'spinning')}
            // Applies timezone offset between CET and UTC to enforce CET timezone on date picker
            timeZoneOffsetInMinutes={getTimeZoneOffsetInMinutes()}
            theme={themeName}
          />
        )}

        <Button
          expanded={true}
          onPress={onSelect}
          text={t(dictionary.confirm)}
          rightIcon={{svg: Confirm}}
          style={styles.button}
          disabled={isSpinning}
          testID="searchButton"
        />
      </ScrollView>
    </BottomSheetContainer>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  const keyboardHeight = useKeyboardHeight();
  const {bottom: safeAreaBottom} = useSafeAreaInsets();
  return {
    scrollView: {
      paddingHorizontal: theme.spacing.medium,
      paddingBottom: keyboardHeight + safeAreaBottom,
    },
    scrollViewContent: {alignItems: 'center'},
    button: {marginVertical: theme.spacing.medium},
  };
});
