import Button from '@atb/components/button';
import FullScreenHeader from '@atb/components/screen-header/full-header';
import {
  DateInputItem,
  RadioSection,
  Section,
  TimeInputItem,
} from '@atb/components/sections';
import {StyleSheet} from '@atb/theme';
import {
  JourneyDatePickerTexts,
  Language,
  TranslateFunction,
  useTranslation,
} from '@atb/translations';
import {
  dateWithReplacedTime,
  formatLocaleTime,
  formatToLongDateTime,
} from '@atb/utils/date';
import {TFunc} from '@leile/lobo-t';
import {ParamListBase, RouteProp, useRoute} from '@react-navigation/native';
import React, {useRef, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {AssistantScreenProps} from '../types';

export type DateTimePickerParams = {
  searchTime: SearchTime;
  callerRouteName: string;
  callerRouteParam: string;
};

type JourneyDatePickerProps = AssistantScreenProps<'DateTimePicker'>;

const DateOptions = ['now', 'departure', 'arrival'] as const;
type DateOptionType = typeof DateOptions[number];
export type DateString = string;

export type SearchTime = {
  option: DateOptionType;
  date: DateString;
};
const JourneyDatePicker: React.FC<JourneyDatePickerProps> = ({
  navigation,
  route,
}) => {
  const {t, language} = useTranslation();
  const styles = useStyles();
  const dateItems = Array.from(DateOptions);

  const {callerRouteName, callerRouteParam, searchTime} = route.params;
  const [dateString, setDate] = useState<string>(searchTime.date);
  const [timeString, setTime] = useState<string>(() =>
    formatLocaleTime(searchTime.date, language),
  );

  const onSelect = () => {
    const calculatedTime: SearchTime = {
      date:
        option === 'now'
          ? new Date().toISOString()
          : dateWithReplacedTime(dateString, timeString).toISOString(),
      option,
    };
    navigation.navigate(callerRouteName as any, {
      [callerRouteParam]: calculatedTime,
    });
  };

  const [option, setOption] = useState<DateOptionType>(searchTime.option);

  return (
    <View style={styles.container}>
      <FullScreenHeader
        title={t(JourneyDatePickerTexts.header.title)}
        leftButton={{type: 'back'}}
      />

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <RadioSection<DateOptionType>
          selected={option ?? dateItems[0]}
          keyExtractor={(s: string) => s}
          items={dateItems}
          withBottomPadding
          onSelect={setOption}
          itemToText={(s: DateOptionType) => getDateOptionText(s, t)}
        />

        {option !== 'now' && (
          <Section withBottomPadding testID="dateTimePickerSection">
            <DateInputItem value={dateString} onChange={setDate} />
            <TimeInputItem value={timeString} onChange={setTime} />
          </Section>
        )}

        <Button
          onPress={onSelect}
          interactiveColor="interactive_0"
          text={t(JourneyDatePickerTexts.searchButton.text)}
          testID="searchButton"
        ></Button>
      </ScrollView>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.static.background.background_2.background,
  },
  contentContainer: {
    padding: theme.spacings.medium,
  },
  dateOptions: {
    margin: theme.spacings.medium,
  },
}));

const getDateOptionText = (
  dateOption: DateOptionType,
  t: TranslateFunction,
) => {
  switch (dateOption) {
    case 'now':
      return t(JourneyDatePickerTexts.options.now);
    case 'arrival':
      return t(JourneyDatePickerTexts.options.arrival);
    case 'departure':
    default:
      return t(JourneyDatePickerTexts.options.departure);
  }
};
export default JourneyDatePicker;

export function useSearchTimeValue<
  T extends RouteProp<any, any> & {params: ParamListBase},
>(callerRouteParam: keyof T['params'], initialValue: SearchTime): SearchTime {
  const route = useRoute<T>();
  const firstTimeRef = useRef(true);
  const [searchTime, setSearchTime] = React.useState<SearchTime>(initialValue);

  React.useEffect(() => {
    if (
      firstTimeRef.current &&
      route.params?.[callerRouteParam] === undefined
    ) {
      firstTimeRef.current = false;
      return;
    }
    if (route.params?.[callerRouteParam]) {
      setSearchTime(route.params?.[callerRouteParam]);
    }
  }, [route.params?.[callerRouteParam]]);

  return searchTime;
}

export function getSearchTimeLabel(
  searchTime: SearchTime,
  timeOfLastSearch: string,
  t: TFunc<typeof Language>,
  language: Language,
) {
  const date = searchTime.option === 'now' ? timeOfLastSearch : searchTime.date;
  const time = formatToLongDateTime(date, language);

  switch (searchTime.option) {
    case 'now':
      return t(JourneyDatePickerTexts.dateInput.departureNow(time));
    case 'arrival':
      return t(JourneyDatePickerTexts.dateInput.arrival(time));
    case 'departure':
      return t(JourneyDatePickerTexts.dateInput.departure(time));
  }
  return time;
}
