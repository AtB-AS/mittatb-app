import React, {useState} from 'react';
import {RouteProp} from '@react-navigation/native';
import {TicketingStackParams} from '../';
import ScreenHeader from '@atb/components/screen-header';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StyleSheet} from '@atb/theme';
import {DismissableStackNavigationProp} from '@atb/navigation/createDismissableStackNavigator';
import {
  DateInputItem,
  RadioSection,
  Section,
  TimeInputItem,
} from '@atb/components/sections';
import {ScrollView} from 'react-native-gesture-handler';
import {TravelDateTexts, useTranslation} from '@atb/translations';
import Button from '@atb/components/button';
import {dateWithReplacedTime, formatLocaleTime} from '@atb/utils/date';
import {View} from 'react-native';

export type TravelDateRouteParams = {
  travelDate?: string;
};

type TravelDateNavigationProp = DismissableStackNavigationProp<
  TicketingStackParams,
  'TravelDate'
>;

export type TravelDateOptions = 'now' | 'futureDate';

type TravelDateRouteProp = RouteProp<TicketingStackParams, 'TravelDate'>;

const TravelDate: React.FC<{
  navigation: TravelDateNavigationProp;
  route: TravelDateRouteProp;
}> = ({navigation, route: {params}}) => {
  const {t, language} = useTranslation();
  const styles = useStyles();

  const {travelDate} = params;
  const defaultDate = travelDate ?? new Date().toISOString();
  const [dateString, setDate] = useState(defaultDate);
  const [timeString, setTime] = useState(() =>
    formatLocaleTime(defaultDate, language),
  );

  const [option, setOption] = useState<TravelDateOptions>(
    travelDate ? 'futureDate' : 'now',
  );

  const onSave = () => {
    navigation.navigate('PurchaseOverview', {
      travelDate:
        option === 'futureDate'
          ? dateWithReplacedTime(dateString, timeString).toISOString()
          : undefined,
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScreenHeader
        title={t(TravelDateTexts.header.title)}
        leftButton={{type: 'back'}}
      />

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <RadioSection<TravelDateOptions>
          selected={option}
          keyExtractor={(s: string) => s}
          items={['now', 'futureDate']}
          onSelect={setOption}
          itemToText={(i) => t(TravelDateTexts.options[i])}
        />

        {option !== 'now' && (
          <View style={styles.dateSelection}>
            <Section>
              <DateInputItem value={dateString} onChange={setDate} />
              <TimeInputItem value={timeString} onChange={setTime} />
            </Section>
          </View>
        )}

        <Button
          onPress={onSave}
          color="primary_2"
          text={t(TravelDateTexts.primaryButton)}
          style={styles.saveButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background_2.backgroundColor,
  },
  contentContainer: {
    padding: theme.spacings.medium,
  },
  dateSelection: {
    marginTop: theme.spacings.medium,
  },
  saveButton: {
    marginTop: theme.spacings.medium,
  },
}));

export default TravelDate;
