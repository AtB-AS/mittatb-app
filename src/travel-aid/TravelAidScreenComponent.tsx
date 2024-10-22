import {Close} from '@atb/assets/svg/mono-icons/actions';
import {Button} from '@atb/components/button';
import {EstimatedCallInfo} from '@atb/components/estimated-call';
import {StyleSheet, useTheme} from '@atb/theme';
import {ServiceJourneyDeparture} from '@atb/travel-details-screens/types';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTravelAidDataQuery} from './use-travel-aid-data';
import {ScrollView} from 'react-native-gesture-handler';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {formatToClock, formatToClockOrRelativeMinutes} from '@atb/utils/date';
import {TranslateFunction, dictionary, useTranslation} from '@atb/translations';
import {TravelAidTexts} from '@atb/translations/screens/subscreens/TravelAid';
import {ThemeIcon} from '@atb/components/theme-icon';
import {Realtime as RealtimeDark} from '@atb/assets/svg/color/icons/status/dark';
import {Realtime as RealtimeLight} from '@atb/assets/svg/color/icons/status/light';
import {StatusBarOnFocus} from '@atb/components/status-bar-on-focus';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {
  FocusedEstimatedCallState,
  TravelAidStatus,
  getFocusedEstimatedCall,
} from './get-focused-estimated-call';

export type TravelAidScreenParams = {
  serviceJourneyDeparture: ServiceJourneyDeparture;
};
type Props = TravelAidScreenParams & {
  goBack: () => void;
};
export const TravelAidScreenComponent = ({
  serviceJourneyDeparture,
  goBack,
}: Props) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {themeName} = useTheme();

  // TODO: Add error handling and loading state
  const {data: serviceJourney} = useTravelAidDataQuery(
    serviceJourneyDeparture.serviceJourneyId,
    serviceJourneyDeparture.serviceDate,
  );

  const state =
    serviceJourney?.estimatedCalls && serviceJourney.estimatedCalls.length > 0
      ? getFocusedEstimatedCall(
          serviceJourney.estimatedCalls,
          serviceJourneyDeparture.fromQuayId,
        )
      : undefined;

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBarOnFocus
        barStyle={themeName === 'light' ? 'dark-content' : 'light-content'}
      />
      <Button
        onPress={goBack}
        text={t(TravelAidTexts.close)}
        leftIcon={{svg: Close}}
        mode="tertiary"
        type="medium"
      />
      <ScrollView contentContainerStyle={styles.container}>
        {state && (
          <Section>
            <GenericSectionItem style={styles.sectionContainer}>
              <EstimatedCallInfo
                departure={{
                  cancellation: false,
                  predictionInaccurate: false,
                  serviceJourney: serviceJourney ?? {},
                  destinationDisplay:
                    state.focusedEstimatedCall.destinationDisplay,
                }}
              />
            </GenericSectionItem>
            <GenericSectionItem>
              <View style={styles.sectionContainer}>
                {state.status === TravelAidStatus.NoRealtime && (
                  <MessageInfoBox
                    type="error"
                    title={t(TravelAidTexts.noRealtimeError.title)}
                    message={t(TravelAidTexts.noRealtimeError.message)}
                  />
                )}
                <View style={styles.subContainer}>
                  <ThemeText type="body__tertiary--bold">
                    {getStopHeader(state.status, t)}
                  </ThemeText>
                  <ThemeText type="heading__title">
                    {state.focusedEstimatedCall.quay.stopPlace?.name}{' '}
                    {state.focusedEstimatedCall.quay.publicCode}
                  </ThemeText>
                </View>
                <TimeInfo state={state} />
              </View>
            </GenericSectionItem>
          </Section>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const TimeInfo = ({state}: {state: FocusedEstimatedCallState}) => {
  const {language, t} = useTranslation();
  const styles = useStyles();
  const {themeName} = useTheme();
  const {focusedEstimatedCall, status} = state;

  const clock = formatToClock(
    focusedEstimatedCall.aimedDepartureTime,
    language,
    'round',
  );

  switch (status) {
    case TravelAidStatus.EndOfLine:
      return null;
    case TravelAidStatus.NoRealtime:
    case TravelAidStatus.NotGettingUpdates:
      return (
        <ThemeText type="body__secondary--bold">
          {t(TravelAidTexts.clock(clock))}
        </ThemeText>
      );
    case TravelAidStatus.NotYetArrived:
    case TravelAidStatus.Arrived:
    case TravelAidStatus.BetweenStops:
      return (
        <View>
          <View style={styles.realTime}>
            <ThemeIcon
              svg={themeName === 'light' ? RealtimeLight : RealtimeDark}
              size="xSmall"
            />
            <ThemeText type="heading__title">
              {formatToClockOrRelativeMinutes(
                focusedEstimatedCall.expectedDepartureTime,
                language,
                t(dictionary.date.units.now),
              )}
            </ThemeText>
          </View>
          <ThemeText type="body__secondary--bold">
            {t(TravelAidTexts.scheduledTime(clock))}
          </ThemeText>
        </View>
      );
  }
};

const getStopHeader = (
  state: TravelAidStatus,
  t: TranslateFunction,
): string => {
  switch (state) {
    case TravelAidStatus.NotYetArrived:
    case TravelAidStatus.NoRealtime:
    case TravelAidStatus.NotGettingUpdates:
      return t(TravelAidTexts.stopPlaceHeader.from);
    case TravelAidStatus.Arrived:
    case TravelAidStatus.BetweenStops:
      return t(TravelAidTexts.stopPlaceHeader.nextStop);
    case TravelAidStatus.EndOfLine:
      return t(TravelAidTexts.stopPlaceHeader.endOfLine);
  }
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    paddingHorizontal: theme.spacings.medium,
  },
  sectionContainer: {
    flex: 1,
    gap: theme.spacings.xLarge,
  },
  subContainer: {
    gap: theme.spacings.small,
  },
  horizontalRule: {
    borderBottomWidth: 1,
    borderBottomColor: theme.static.background.background_0.text,
    width: '100%',
  },
  realTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacings.xSmall,
  },
}));
