import {Platform, ScrollView, View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {themeColor} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/TicketAssistant_WelcomeScreen';
import {DashboardBackground} from '@atb/assets/svg/color/images';
import {ThemeText} from '@atb/components/text';
import {TicketAssistantTexts, useTranslation} from '@atb/translations';
import {SliderComponent} from '@atb/components/slider';
import {Button} from '@atb/components/button';
import React, {useEffect, useState} from 'react';
import {
  sliderColorMax,
  sliderColorMin,
} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/TicketAssistant_FrequencyScreen';
import {TicketAssistantScreenProps} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/navigation-types';
import {useTicketAssistantState} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/TicketAssistantContext';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import {useLocaleContext} from '@atb/LocaleProvider';
import {ThemeIcon} from '@atb/components/theme-icon';
import SvgDate from '@atb/assets/svg/mono-icons/time/Date';
import {format, parseISO} from 'date-fns';
import {dateToDateString} from '@atb/components/sections/items/date-input/utils';
import {useAccessibilityContext} from '@atb/AccessibilityContext';
import {SectionSeparator} from '@atb/components/sections';
import {
  dateDiffInDays,
  getDateFromSlider,
  getDaysWeeksMonths,
  getSliderIndex,
} from './utils';
type DurationProps =
  TicketAssistantScreenProps<'TicketAssistant_DurationScreen'>;

const currentDate = new Date();
const durations = [1, 7, 14, 21, 30, 60, 90, 120, 150, 180];

export const TicketAssistant_DurationScreen = ({navigation}: DurationProps) => {
  const {data, updateData} = useTicketAssistantState();
  const [date, setDate] = useState(dateToDateString(currentDate));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [usedSlider, setUsedSlider] = useState(false);
  const styles = useThemeStyles();
  const {t} = useTranslation();
  const a11yContext = useAccessibilityContext();
  const [sliderValue, setSliderValue] = useState(data.duration);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      if (usedSlider) {
        updateData({...data, duration: sliderValue});
      }
    });
    return () => {
      unsubscribe();
    };
  }, [navigation, data, sliderValue, updateData]);

  const majorVersionIOS = parseInt(String(Platform.Version), 10);
  const style =
    majorVersionIOS < 13 ? {width: undefined, flex: 1} : {width: 130};

  const locale = useLocaleContext();

  function updateDuration(value: number, fromPicker?: boolean) {
    const newData = {...data, duration: fromPicker ? value : durations[value]};
    updateData(newData);
    setSliderValue(newData.duration);
  }

  const duration = usedSlider ? sliderValue : data.duration;
  const daysWeeksMonths = getDaysWeeksMonths(duration);
  const resultString = t(
    duration < 7
      ? TicketAssistantTexts.duration.resultDays({value: daysWeeksMonths})
      : duration < 30
      ? TicketAssistantTexts.duration.resultWeeks({value: daysWeeksMonths})
      : duration < 180
      ? TicketAssistantTexts.duration.resultMonths({value: daysWeeksMonths})
      : TicketAssistantTexts.duration.resultMoreThan180Days,
  );

  return (
    <View style={styles.container}>
      <View style={styles.backdrop}>
        <DashboardBackground width={'100%'} height={'100%'} />
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.mainView}>
          <ThemeText
            type={'heading--big'}
            style={styles.header}
            color={themeColor}
            accessibilityLabel={t(
              TicketAssistantTexts.duration.titleA11yLabel({
                value: data.frequency,
              }),
            )}
          >
            {t(TicketAssistantTexts.duration.title({value: data.frequency}))}
          </ThemeText>
          <View style={styles.durationPickerContainer}>
            <View style={styles.topPart}>
              <View style={styles.datePickerHeader}>
                <ThemeIcon
                  svg={SvgDate}
                  size={'large'}
                  style={styles.dateIcon}
                />
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
                    value={
                      usedSlider
                        ? parseISO(getDateFromSlider(sliderValue))
                        : parseISO(date)
                    }
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
                        setUsedSlider(false);
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
                    text={format(
                      usedSlider
                        ? parseISO(getDateFromSlider(data.duration))
                        : parseISO(date),
                      'dd. MMM. yyyy',
                    )}
                    accessibilityHint={t(
                      TicketAssistantTexts.duration.a11yDatePickerHint,
                    )}
                  />
                )}

                {Platform.OS === 'android' && showDatePicker && (
                  <RNDateTimePicker
                    value={
                      usedSlider
                        ? parseISO(getDateFromSlider(data.duration))
                        : parseISO(date)
                    }
                    mode="date"
                    locale={locale.localeString}
                    textColor={'primary'}
                    display="default"
                    testID="dateInput"
                    minimumDate={new Date()}
                    onChange={(_, date) => {
                      setShowDatePicker(false);
                      if (date) {
                        setUsedSlider(false);
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

                  <SliderComponent
                    style={styles.slider}
                    value={getSliderIndex(data.duration, durations)}
                    maximumTrackTintColor={sliderColorMax}
                    minimumTrackTintColor={sliderColorMin}
                    maximumValue={durations.length - 1}
                    minimumValue={0}
                    step={1}
                    tapToSeek={true}
                    thumbTintColor={sliderColorMin}
                    onValueChange={(value) => {
                      setUsedSlider(true);
                      setSliderValue(durations[value]);
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
        </View>

        <View style={styles.bottomView}>
          <Button
            interactiveColor="interactive_0"
            onPress={() => {
              navigation.navigate('TicketAssistant_ZonePickerScreen');
            }}
            text={t(TicketAssistantTexts.frequency.mainButton)}
            testID="nextButton"
            accessibilityHint={t(
              TicketAssistantTexts.duration.a11yNextPageHint,
            )}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  contentContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: theme.static.background.background_accent_0.background,
    width: '100%',
  },
  mainView: {
    flex: 1,
    paddingHorizontal: theme.spacings.large,
    paddingBottom: theme.spacings.xLarge,
    width: '100%',
  },
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
  header: {
    textAlign: 'center',
    paddingHorizontal: theme.spacings.xLarge,
  },
  bottomView: {
    paddingHorizontal: theme.spacings.xLarge,
    paddingBottom: theme.spacings.xLarge,
  },
  backdrop: {
    position: 'absolute',
    height: 250,
    left: 0,
    right: 0,
    bottom: 45,
    padding: 0,
    margin: 0,
  },
}));
