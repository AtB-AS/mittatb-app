import {Button} from '@atb/components/button';
import {FullScreenHeader} from '@atb/components/screen-header';
import {
  DateInputSectionItem,
  RadioGroupSection,
  Section,
  TimeInputSectionItem,
} from '@atb/components/sections';
import {StyleSheet, useThemeContext} from '@atb/theme';
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

export type JourneyDatePickerScreenParams = {
  searchTime: SearchTime;
};

const DateOptions = ['now', 'departure', 'arrival'] as const;
type DateOptionType = (typeof DateOptions)[number];
export type DateString = string;

export type SearchTime = {
  option: DateOptionType;
  date: DateString;
};

type Props = JourneyDatePickerScreenParams & {
  onSave: (searchTime: SearchTime) => void;
};

export const JourneyDatePickerScreenComponent = ({
  searchTime,
  onSave,
}: Props) => {
  const {t, language} = useTranslation();
  const styles = useStyles();
  const {theme} = useThemeContext();
  const interactiveColor = theme.color.interactive[0];

  const dateItems = Array.from(DateOptions);

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
    onSave(calculatedTime);
  };

  const [option, setOption] = useState<DateOptionType>(searchTime.option);

  return (
    <View style={styles.container}>
      <FullScreenHeader
        title={t(JourneyDatePickerTexts.header.title)}
        leftButton={{type: 'back'}}
      />

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <RadioGroupSection<DateOptionType>
          selected={option ?? dateItems[0]}
          keyExtractor={(s: string) => s}
          items={dateItems}
          style={styles.section}
          onSelect={setOption}
          itemToText={(s: DateOptionType) => getDateOptionText(s, t)}
        />

        {option !== 'now' && (
          <Section style={styles.section} testID="dateTimePickerSection">
            <DateInputSectionItem
              value={dateString}
              onChange={setDate}
              testID="datePicker"
            />
            <TimeInputSectionItem
              value={timeString}
              onChange={setTime}
              testID="timePicker"
            />
          </Section>
        )}

        <Button
          expanded={true}
          onPress={onSelect}
          interactiveColor={interactiveColor}
          text={t(JourneyDatePickerTexts.searchButton.text)}
          testID="searchButton"
        />
      </ScrollView>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.color.background.neutral[2].background,
  },
  contentContainer: {
    padding: theme.spacing.medium,
  },
  dateOptions: {
    margin: theme.spacing.medium,
  },
  section: {
    marginBottom: theme.spacing.large,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
