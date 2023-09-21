import {Platform, View} from 'react-native';
import {ThemeIcon} from '@atb/components/theme-icon';
import SvgDate from '@atb/assets/svg/mono-icons/time/Date';
import {ThemeText} from '@atb/components/text';
import {TicketAssistantTexts, useTranslation} from '@atb/translations';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import {addDays, daysInWeek} from 'date-fns';
import {
  dateDiffInDays,
  getSliderIndex,
  getDurationText,
} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/TicketAssistant_DurationScreen/utils';
import {SectionSeparator} from '@atb/components/sections';
import {Slider} from '@atb/components/slider';
import React, {useState} from 'react';
import {StyleSheet} from '@atb/theme';
import {useAccessibilityContext} from '@atb/AccessibilityContext';
import {useLocaleContext} from '@atb/LocaleProvider';
import {useTicketAssistantState} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/TicketAssistantContext';
import {Button} from '@atb/components/button';
import {formatToVerboseFullDate} from '@atb/utils/date';

type DurationPickerProps = {
  duration: number;
  setDuration: (duration: number) => void;
};
const DURATIONS_IN_DAYS = [
  1, 2, 3, 4, 5, 6, 7, 14, 21, 30, 60, 90, 120, 150, 180,
];
export const DurationPicker = ({
  duration,
  setDuration,
}: DurationPickerProps) => {
  const currentDate = new Date();

  const {inputParams} = useTicketAssistantState();
  const [date, setDate] = useState(
    addDays(currentDate, inputParams.duration ?? duration),
  );
  const styles = useThemeStyles();
  const {t, language} = useTranslation();
  const a11yContext = useAccessibilityContext();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const locale = useLocaleContext();

  function updateDurationFromPicker(duration: number) {
    setDuration(duration);
    setSliderIndex(getSliderIndex(duration, DURATIONS_IN_DAYS));
  }

  function updateDurationFromSlider(sliderValue: number) {
    setDate(addDays(currentDate, DURATIONS_IN_DAYS[sliderValue]));
    setDuration(DURATIONS_IN_DAYS[sliderValue]);
  }

  const [sliderIndex, setSliderIndex] = useState<number>(
    getSliderIndex(duration ?? daysInWeek, DURATIONS_IN_DAYS),
  );

  const durationText = getDurationText(duration, t);

  return (
    <View style={styles.durationPickerContainer}>
      <View style={styles.topPart}>
        <View style={styles.datePickerHeader}>
          <ThemeIcon svg={SvgDate} size={'large'} style={styles.dateIcon} />
          <ThemeText
            type={'body__primary--bold'}
            style={styles.sliderText}
            color={'primary'}
            accessibilityLabel={t(
              TicketAssistantTexts.duration.datePickerHeaderA11yLabel,
            )}
          >
            {t(TicketAssistantTexts.duration.datePickerHeader)}
          </ThemeText>
        </View>
        <View style={styles.datePicker}>
          {Platform.OS === 'ios' ? (
            <RNDateTimePicker
              value={date}
              mode="date"
              locale={locale.localeString}
              style={{
                alignSelf: 'flex-end',
              }}
              textColor={'primary'}
              display="compact"
              testID="dateInput"
              minimumDate={new Date()}
              onChange={(_, date) => {
                if (date) {
                  setDate(date);
                  updateDurationFromPicker(dateDiffInDays(currentDate, date));
                }
              }}
              accessibilityHint={t(
                TicketAssistantTexts.duration.a11yDatePickerHint,
              )}
            />
          ) : (
            <Button
              style={styles.datePickerButton}
              interactiveColor="interactive_2"
              type="inline"
              mode="tertiary"
              onPress={() => setShowDatePicker(true)}
              text={formatToVerboseFullDate(date, language)}
              accessibilityHint={t(
                TicketAssistantTexts.duration.a11yDatePickerHint,
              )}
            />
          )}

          {Platform.OS === 'android' && showDatePicker && (
            <RNDateTimePicker
              value={date}
              mode="date"
              locale={locale.localeString}
              textColor={'primary'}
              display="default"
              testID="dateInput"
              minimumDate={new Date()}
              onChange={(_, date) => {
                setShowDatePicker(false);
                if (date) {
                  setDate(date);
                  updateDurationFromPicker(dateDiffInDays(currentDate, date));
                }
              }}
            />
          )}
        </View>
      </View>

      {!a11yContext.isScreenReaderEnabled && (
        <>
          <SectionSeparator />
          <View style={styles.sliderContainer}>
            <View style={styles.limitHeader}>
              <ThemeText
                type={'body__primary'}
                style={styles.sliderText}
                color={'primary'}
                accessibilityLabel={t(
                  TicketAssistantTexts.duration.minLimitA11yLabel,
                )}
              >
                {t(
                  TicketAssistantTexts.duration.minLimit(DURATIONS_IN_DAYS[0]),
                )}
              </ThemeText>
              <ThemeText
                type={'body__primary'}
                style={styles.sliderText}
                accessibilityLabel={t(
                  TicketAssistantTexts.duration.maxLimitA11yLabel,
                )}
              >
                {t(TicketAssistantTexts.duration.maxLimit)}
              </ThemeText>
            </View>

            <Slider
              containerStyle={styles.slider}
              maximumValue={DURATIONS_IN_DAYS.length - 1}
              minimumValue={0}
              step={1}
              value={sliderIndex}
              onValueChange={(value) => {
                setSliderIndex(value);
                updateDurationFromSlider(value);
              }}
            />
          </View>
        </>
      )}

      <SectionSeparator />
      <ThemeText
        type={'body__primary'}
        style={styles.description}
        accessibilityLabel={durationText}
      >
        {durationText}
      </ThemeText>
    </View>
  );
};

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  durationPickerContainer: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingVertical: theme.spacings.small,
    paddingHorizontal: theme.spacings.medium,
    borderRadius: theme.border.radius.regular,
    backgroundColor: theme.static.background.background_0.background,
    marginVertical: theme.spacings.xLarge,
  },
  topPart: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  datePickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateIcon: {
    marginRight: theme.spacings.xSmall,
  },
  datePicker: {
    paddingVertical: theme.spacings.medium,
    flexShrink: 1,
  },
  datePickerText: {
    marginLeft: theme.spacings.medium,
    textAlign: 'center',
  },
  datePickerButton: {
    alignSelf: 'flex-end',
    backgroundColor: theme.static.background.background_1.background,
  },
  sliderContainer: {
    width: '100%',
    flexDirection: 'column',
    paddingHorizontal: theme.spacings.medium,
    paddingVertical: theme.spacings.large,
  },
  slider: {
    width: '100%',
    alignSelf: 'center',
    marginTop: theme.spacings.medium,
  },
  limitHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderText: {
    textAlign: 'center',
    height: '100%',
  },
  description: {
    textAlign: 'center',
    paddingVertical: theme.spacings.medium,
  },
}));
