import Button from '@atb/components/button';
import ScreenHeader from '@atb/components/screen-header';
import {
  DateInputItem,
  RadioSection,
  Section,
  TimeInputItem,
} from '@atb/components/sections';
import {StyleSheet, useTheme} from '@atb/theme';
import {
  JourneyDatePickerTexts,
  TranslateFunction,
  useTranslation,
} from '@atb/translations';
import {dateWithReplacedTime, formatLocaleTime} from '@atb/utils/date';
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
  useRoute,
} from '@react-navigation/native';
import React, {useRef, useState} from 'react';
import {ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AssistantParams} from '..';

export type DateTimePickerParams = {
  searchTime: SearchTime;
  callerRouteName: string;
  callerRouteParam: string;
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
  date: string;
};
const JourneyDatePicker: React.FC<JourneyDatePickerProps> = ({
  navigation,
  route,
}) => {
  const {t, language, locale} = useTranslation();
  const styles = useStyles();
  const {theme} = useTheme();
  const dateItems = Array.from(DateOptions);

  const {callerRouteName, callerRouteParam, searchTime} = route.params;
  const [dateString, setDate] = useState<string>(searchTime.date);
  const [timeString, setTime] = useState<string>(() =>
    formatLocaleTime(searchTime.date, language),
  );
  // const currentDate = parseISO(dateString ?? new Date());

  const onSelect = () => {
    const calculatedTime: SearchTime = {
      date: dateWithReplacedTime(dateString, timeString).toISOString(),
      option,
    };
    navigation.navigate(callerRouteName as any, {
      [callerRouteParam]: calculatedTime,
    });
  };

  const [option, setOption] = useState<DateOptionType>(searchTime.option);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScreenHeader
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
          <Section withBottomPadding>
            <DateInputItem value={dateString} onChange={setDate} />
            <TimeInputItem value={timeString} onChange={setTime} />
          </Section>
        )}

        <Button
          onPress={onSelect}
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
  T extends RouteProp<any, any> & {params: ParamListBase}
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
