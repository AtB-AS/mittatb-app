import {Platform, View} from 'react-native';
import {ThemeIcon} from '@atb/components/theme-icon';
import SvgDate from '@atb/assets/svg/mono-icons/time/Date';
import {ThemeText} from '@atb/components/text';
import {TicketAssistantTexts, useTranslation} from '@atb/translations';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import {format, parseISO} from 'date-fns';
import {
  dateDiffInDays,
  addDaysToCurrent,
  getSliderIndex,
  getResultString,
} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/TicketAssistant_DurationScreen/utils';
import {dateToDateString} from '@atb/components/sections/items/date-input/utils';
import {Button} from '@atb/components/button';
import {SectionSeparator} from '@atb/components/sections';
import {Slider} from '@atb/components/slider';
import React, {useState} from 'react';
import {StyleSheet} from '@atb/theme';
import {useAccessibilityContext} from '@atb/AccessibilityContext';
import {useLocaleContext} from '@atb/LocaleProvider';
import {useTicketAssistantState} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/TicketAssistantContext';

type DurationPickerProps = {
  date: string;
  setDate: (date: string) => void;
  currentDate: Date;
};

const durations = [1, 7, 14, 21, 30, 60, 90, 120, 150, 180];
export const DurationPicker = ({
  date,
  setDate,
  currentDate,
}: DurationPickerProps) => {
  const styles = useThemeStyles();
  const {t} = useTranslation();
  const a11yContext = useAccessibilityContext();
  const {inputParams, updateInputParams} = useTicketAssistantState();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const majorVersionIOS = parseInt(String(Platform.Version), 10);
  const style =
    majorVersionIOS < 13 ? {width: undefined, flex: 1} : {width: 130};

  const locale = useLocaleContext();
  function updateDuration(value: number, fromPicker?: boolean) {
    if (!fromPicker) {
      setSliderIndex(getSliderIndex(value, durations));
      setDate(addDaysToCurrent(value));
    } else {
      const newData = {
        ...inputParams,
        duration: fromPicker ? value : durations[value],
      };
      setSliderIndex(getSliderIndex(newData.duration, durations));
      updateInputParams(newData);
    }
  }

  const [sliderIndex, setSliderIndex] = useState<number>(
    getSliderIndex(inputParams.duration ?? 7, durations),
  );

  const duration = dateDiffInDays(currentDate, parseISO(date));
  const resultString = getResultString(duration, t);

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
              value={parseISO(date)}
              mode="date"
              locale={locale.localeString}
              style={{
                ...style,
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
                alignSelf: 'flex-end',
              }}
              textColor={'primary'}
              display="compact"
              testID="dateInput"
              minimumDate={new Date()}
              onChange={(_, date) => {
                if (date) {
                  setDate(dateToDateString(date));
                  updateDuration(dateDiffInDays(currentDate, date), true);
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
              text={format(parseISO(date), 'dd. MMM. yyyy')}
              accessibilityHint={t(
                TicketAssistantTexts.duration.a11yDatePickerHint,
              )}
            />
          )}

          {Platform.OS === 'android' && showDatePicker && (
            <RNDateTimePicker
              value={parseISO(date)}
              mode="date"
              locale={locale.localeString}
              textColor={'primary'}
              display="default"
              testID="dateInput"
              minimumDate={new Date()}
              onChange={(_, date) => {
                setShowDatePicker(false);
                if (date) {
                  setDate(dateToDateString(date));
                  updateDuration(dateDiffInDays(currentDate, date), true);
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
                {t(TicketAssistantTexts.duration.minLimit)}
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
              maximumValue={durations.length - 1}
              minimumValue={2}
              step={1}
              trackClickable={true}
              thumbTouchSize={{width: 40, height: 40}}
              thumbStyle={styles.sliderThumb}
              onSlidingComplete={() => {
                updateInputParams({...inputParams, frequency: sliderIndex});
              }}
              value={sliderIndex}
              maximumTrackTintColor={'interactive_0'}
              minimumTrackTintColor={'interactive_0'}
              thumbTintColor={'interactive_0'}
              onValueChange={(value) => {
                updateDuration(durations[value], false);
              }}
            />
          </View>
        </>
      )}

      <SectionSeparator />
      <ThemeText
        type={'body__primary'}
        style={styles.description}
        accessibilityLabel={resultString}
      >
        {resultString}
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
  },
  datePickerText: {
    marginLeft: theme.spacings.medium,
    textAlign: 'center',
  },
  datePickerButton: {
    backgroundColor: theme.static.background.background_3.background,
  },
  sliderContainer: {
    width: '100%',
    flexDirection: 'column',
    paddingHorizontal: theme.spacings.medium,
    paddingVertical: theme.spacings.large,
  },
  sliderThumb: {
    width: 20,
    height: 20,
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
