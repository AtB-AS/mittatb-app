import Button from '@atb/components/button';
import ScreenHeader from '@atb/components/screen-header';
import {ButtonInput, RadioSection, Section} from '@atb/components/sections';
import {StyleSheet} from '@atb/theme';
import {JourneyDatePickerTexts, useTranslation} from '@atb/translations';
import {formatLocaleTime, formatToSimpleDate} from '@atb/utils/date';
import DateTimePicker from '@react-native-community/datetimepicker';
import {NavigationProp, RouteProp} from '@react-navigation/core';
import React, {useEffect, useState} from 'react';
import {ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AssistantParams} from '..';

export type DateTimePickerParams = {
  searchTime: SearchTime;
  onChange(searchTime: SearchTime): void;
};

export type DateTimeNavigationProp = NavigationProp<AssistantParams>;
export type DateTimeRouteProp = RouteProp<AssistantParams, 'DateTimePicker'>;

type JourneyDatePickerProps = {
  navigation: DateTimeNavigationProp;
  route: DateTimeRouteProp;
};
const DateOptions = ['now', 'departure', 'arrival'] as const;
type DateOptionType = typeof DateOptions[number];

type DateMode = 'date' | 'time' | undefined;

export type SearchTime = {
  option: DateOptionType;
  date: Date;
};
const JourneyDatePicker: React.FC<JourneyDatePickerProps> = ({
  navigation,
  route,
}) => {
  const {t, language} = useTranslation();
  const styles = useStyles();
  const dateItems = Array.from(DateOptions);

  const {onChange: updateSearchTime, searchTime} = route.params;
  const [option, setOption] = useState<DateOptionType>(searchTime.option);
  const [currentDate, setDate] = useState<Date>(searchTime.date);

  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<DateMode>('date');

  useEffect(() => {}, [currentDate, option]);

  const showMode = (currentMode: DateMode) => {
    setShowPicker(true);
    setPickerMode(currentMode);
  };
  const showDatepicker = () => {
    showMode('date');
  };
  const showTimepicker = () => {
    showMode('time');
  };
  const closeDatePicker = () => {
    setShowPicker(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title={t(JourneyDatePickerTexts.header.title)}
        leftButton={{type: 'back'}}
      />

      <ScrollView style={styles.contentContainer}>
        <RadioSection<DateOptionType>
          selected={option ?? dateItems[0]}
          keyExtractor={(s: string) => s}
          items={dateItems}
          withBottomPadding
          onSelect={(s: DateOptionType) => setOption(s)}
          itemToText={(s: DateOptionType) => t(getDateOptionText(s))}
        ></RadioSection>

        {option !== 'now' && (
          <Section withBottomPadding>
            <ButtonInput
              onPress={showDatepicker}
              label={t(JourneyDatePickerTexts.dateTime.date)}
              value={formatToSimpleDate(currentDate, language)}
            />
            <ButtonInput
              onPress={showTimepicker}
              label={t(JourneyDatePickerTexts.dateTime.time)}
              value={formatLocaleTime(currentDate, language)}
            />
            {showPicker && (
              <DateTimePicker
                value={currentDate}
                mode={pickerMode}
                is24Hour={true}
                display="spinner"
                onChange={(e, date) => {
                  closeDatePicker();
                  setDate(date ?? new Date());
                }}
              />
            )}
          </Section>
        )}

        <Button
          onPress={() => {
            updateSearchTime({date: currentDate, option});
            navigation.goBack();
          }}
          color="primary_2"
          text={t(JourneyDatePickerTexts.searchButton.text)}
        ></Button>
      </ScrollView>
    </SafeAreaView>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.background.level2,
  },
  contentContainer: {
    padding: theme.spacings.medium,
  },
  dateOptions: {
    margin: theme.spacings.medium,
  },
}));
export const getDateOptionText = (dateOption: DateOptionType) => {
  switch (dateOption) {
    case 'now':
      return JourneyDatePickerTexts.options.now;
    case 'arrival':
      return JourneyDatePickerTexts.options.arrival;
    case 'departure':
    default:
      return JourneyDatePickerTexts.options.departure;
  }
};
export default JourneyDatePicker;
