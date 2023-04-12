import {Platform, ScrollView, StyleProp, View, ViewStyle} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {themeColor} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/TicketAssistant_WelcomeScreen';
import {DashboardBackground} from '@atb/assets/svg/color/images';
import {ThemeText} from '@atb/components/text';
import {TicketAssistantTexts, useTranslation} from '@atb/translations';
import {SliderComponent} from '@atb/components/slider';
import {Button} from '@atb/components/button';
import React, {useContext, useState} from 'react';
import {
  sliderColorMax,
  sliderColorMin,
} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/TicketAssistant_FrequencyScreen';
import {TicketAssistantScreenProps} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/navigation-types';
import TicketAssistantContext from '@atb/stacks-hierarchy/Root_TicketAssistantStack/TicketAssistantContext';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import {useLocaleContext} from '@atb/LocaleProvider';
import {ThemeIcon} from '@atb/components/theme-icon';
import SvgDate from '@atb/assets/svg/mono-icons/time/Date';
import {addDays, format, parseISO} from 'date-fns';
import {dateToDateString} from '@atb/components/sections/items/date-input/utils';
type DurationProps =
  TicketAssistantScreenProps<'TicketAssistant_DurationScreen'>;

const currentDate = new Date();
const durations = [1, 7, 14, 21, 30, 60, 90, 120, 150, 180];

export const TicketAssistant_DurationScreen = ({navigation}: DurationProps) => {
  const [date, setDate] = useState(dateToDateString(currentDate));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [usedSlider, setUsedSlider] = useState(false);
  const styles = useThemeStyles();
  const {t} = useTranslation();

  const majorVersionIOS = parseInt(String(Platform.Version), 10);
  let style: StyleProp<ViewStyle> = {width: 130};
  if (majorVersionIOS < 13) {
    style = {width: undefined, flex: 1};
  }
  const contextValue = useContext(TicketAssistantContext);

  if (!contextValue) throw new Error('Context is undefined!');

  const {data, updateData} = contextValue;
  const locale = useLocaleContext();
  function updateDuration(value: number, fromPicker?: boolean) {
    let newData = {...data};
    if (fromPicker) {
      newData = {...data, duration: value};
    } else {
      newData = {...data, duration: durations[value]};
    }
    updateData(newData);
  }
  let resultString = '';
  if (data.duration < 7) {
    resultString = t(
      TicketAssistantTexts.duration.resultDays({
        value: getDaysWeeksMonths(data.duration),
      }),
    );
  } else if (data.duration >= 7 && data.duration < 30) {
    resultString = t(
      TicketAssistantTexts.duration.resultWeeks({
        value: getDaysWeeksMonths(data.duration),
      }),
    );
  } else if (data.duration >= 30 && data.duration < 180) {
    resultString = t(
      TicketAssistantTexts.duration.resultMonths({
        value: getDaysWeeksMonths(data.duration),
      }),
    );
  } else {
    resultString = t(TicketAssistantTexts.duration.resultMoreThan180Days);
  }
  return (
    <View style={styles.container}>
      <View style={styles.backdrop}>
        <DashboardBackground width={'100%'} height={'100%'} />
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.mainView}>
          <ThemeText
            type={'body__primary--jumbo--bold'}
            style={styles.header}
            color={themeColor}
            accessibilityLabel={t(TicketAssistantTexts.welcome.titleA11yLabel)}
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
                >
                  {t(TicketAssistantTexts.duration.datePickerHeader)}
                </ThemeText>
              </View>
              <View style={styles.datePicker}>
                {Platform.OS === 'ios' ? (
                  <RNDateTimePicker
                    value={
                      usedSlider
                        ? parseISO(getDateFromSlider(data.duration))
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
            <View style={styles.sliderContainer}>
              <View style={styles.limitHeader}>
                <ThemeText
                  type={'body__primary'}
                  style={styles.sliderText}
                  color={'primary'}
                >
                  {t(TicketAssistantTexts.duration.minLimit)}
                </ThemeText>
                <ThemeText
                  type={'body__primary'}
                  style={styles.sliderText}
                  color={'primary'}
                >
                  {t(TicketAssistantTexts.duration.maxLimit)}
                </ThemeText>
              </View>
              <SliderComponent
                style={styles.slider}
                value={getSliderIndex(data.duration)}
                maximumTrackTintColor={sliderColorMax}
                minimumTrackTintColor={sliderColorMin}
                maximumValue={durations.length - 1}
                minimumValue={0}
                step={1}
                tapToSeek={true}
                thumbTintColor={sliderColorMin}
                onValueChange={(value) => {
                  setUsedSlider(true);
                  updateDuration(value, false);
                }}
              />
            </View>
          </View>
          <ThemeText
            type={'body__primary'}
            style={styles.description}
            color={themeColor}
          >
            {resultString}
          </ThemeText>
        </View>

        <View style={styles.bottomView}>
          <Button
            interactiveColor="interactive_0"
            onPress={() => {
              navigation.navigate('TicketAssistant_ZonePickerScreen');
            }}
            text={t(TicketAssistantTexts.frequency.mainButton)}
            testID="nextButton"
          />
        </View>
      </ScrollView>
    </View>
  );
};

// Functions to calculate days between two dates
function dateDiffInDays(a: Date, b: Date) {
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  let _MS_PER_DAY = 1000 * 60 * 60 * 24;
  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

// Function for getting days weeks or months from days
function getDaysWeeksMonths(days: number) {
  if (days < 7) {
    return days;
  } else if (days < 30) {
    const weeks = Math.round(days / 7);
    return weeks === 0 ? weeks + 1 : weeks;
  } else {
    const months = Math.round(days / 30);
    return months === 0 ? months + 1 : months;
  }
}

// Function for getting index on slider from days
function getSliderIndex(days: number) {
  let closestIndex = 0;
  let minDifference = Math.abs(days - durations[0]);

  for (let i = 1; i < durations.length; i++) {
    let difference = Math.abs(days - durations[i]);
    if (difference < minDifference) {
      closestIndex = i;
      minDifference = difference;
    }
  }

  return closestIndex;
}

// Functions for getting the date from the slider
function getDateFromSlider(days: number) {
  // Current date + days from slider
  const date = addDays(new Date(), days);
  return dateToDateString(date);
}

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  contentContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: theme.static.background[themeColor].background,
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
    borderRadius: theme.border.radius.regular,
    backgroundColor: theme.static.background[themeColor].text,
    marginVertical: theme.spacings.xLarge,
  },
  topPart: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: theme.border.primary,
    borderBottomWidth: 1,
    paddingHorizontal: theme.spacings.medium,
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
    paddingHorizontal: theme.spacings.xLarge,
    paddingVertical: theme.spacings.small,
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
