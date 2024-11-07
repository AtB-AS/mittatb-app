import {Close} from '@atb/assets/svg/mono-icons/actions';
import {Button} from '@atb/components/button';
import {EstimatedCallInfo} from '@atb/components/estimated-call';
import {StyleSheet, useTheme} from '@atb/theme';
import {ServiceJourneyDeparture} from '@atb/travel-details-screens/types';
import React, {Ref, useEffect, useRef} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTravelAidDataQuery} from './use-travel-aid-data';
import {ScrollView} from 'react-native-gesture-handler';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {AccessibilityInfo, ActivityIndicator, View} from 'react-native';
import {screenReaderPause, ThemeText} from '@atb/components/text';
import {formatToClock, formatToClockOrRelativeMinutes} from '@atb/utils/date';
import {
  Language,
  TranslateFunction,
  dictionary,
  useTranslation,
} from '@atb/translations';
import {TravelAidTexts} from '@atb/translations/screens/subscreens/TravelAid';
import {
  getLineA11yLabel,
  getNoticesForServiceJourney,
} from '@atb/travel-details-screens/utils';
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
import {ServiceJourneyWithEstCallsFragment} from '@atb/api/types/generated/fragments/service-journeys';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {getQuayName} from '@atb/utils/transportation-names.ts';
import {NoticeFragment} from '@atb/api/types/generated/fragments/notices';
import {SituationMessageBox} from '@atb/situations';
import {RequireValue} from '@atb/utils/object';
import {getSituationSummary} from '@atb/situations/utils';
import {SituationType} from '@atb/situations/types';
import {isDefined} from '@atb/utils/presence';

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
  const focusRef = useFocusOnLoad();

  const {
    data: serviceJourney,
    status,
    refetch,
  } = useTravelAidDataQuery(
    serviceJourneyDeparture.serviceJourneyId,
    serviceJourneyDeparture.serviceDate,
  );

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
        {status === 'loading' && (
          <ActivityIndicator size="large" ref={focusRef} />
        )}
        {status === 'error' && (
          <View ref={focusRef}>
            <MessageInfoBox
              type="error"
              message={t(TravelAidTexts.error.message)}
              onPressConfig={{action: refetch, text: t(dictionary.retry)}}
            />
          </View>
        )}
        {status === 'success' && serviceJourney.estimatedCalls && (
          <TravelAidSection
            serviceJourney={{
              ...serviceJourney,
              estimatedCalls: serviceJourney.estimatedCalls,
            }}
            fromQuayId={serviceJourneyDeparture.fromQuayId}
            focusRef={focusRef}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const TravelAidSection = ({
  serviceJourney,
  fromQuayId,
  focusRef,
}: {
  serviceJourney: RequireValue<
    ServiceJourneyWithEstCallsFragment,
    'estimatedCalls'
  >;
  fromQuayId?: string;
  focusRef: Ref<any>;
}) => {
  const styles = useStyles();
  const {t, language} = useTranslation();

  const {status, focusedEstimatedCall} = getFocusedEstimatedCall(
    serviceJourney.estimatedCalls,
    fromQuayId,
  );

  const situationsForFocused = focusedEstimatedCall.situations ?? [];
  const noticesForFocused = getNoticesForServiceJourney(
    serviceJourney,
    focusedEstimatedCall.quay.id,
  );

  useTravelAidAnnouncements(
    {status, focusedEstimatedCall},
    situationsForFocused,
    noticesForFocused,
  );

  const quayName = getQuayName(focusedEstimatedCall.quay) ?? '';

  const accessibilityLabel =
    getNoticesA11yLabel(noticesForFocused) +
    screenReaderPause +
    getSituationA11yLabel(situationsForFocused, language) +
    screenReaderPause +
    getFocussedStateA11yLabel({status, focusedEstimatedCall}, t, language);

  return (
    <Section ref={focusRef}>
      <GenericSectionItem
        style={styles.sectionContainer}
        accessibility={{
          accessible: true,
          accessibilityLabel: getLineA11yLabel(
            focusedEstimatedCall.destinationDisplay,
            serviceJourney.line.publicCode,
            t,
          ),
          importantForAccessibility: 'yes',
        }}
      >
        <EstimatedCallInfo
          departure={{
            cancellation: false,
            predictionInaccurate: false,
            serviceJourney: serviceJourney ?? {},
            destinationDisplay: focusedEstimatedCall.destinationDisplay,
          }}
        />
      </GenericSectionItem>
      <GenericSectionItem
        accessibility={{
          accessible: true,
          accessibilityLabel: accessibilityLabel,
        }}
      >
        <View style={styles.sectionContainer}>
          {status === TravelAidStatus.NoRealtime && (
            <MessageInfoBox
              type="error"
              title={t(TravelAidTexts.noRealtimeError.title)}
              message={t(TravelAidTexts.noRealtimeError.message)}
            />
          )}
          {(situationsForFocused.length > 0 ||
            noticesForFocused.length > 0) && (
            <View style={styles.subContainer}>
              {situationsForFocused.map((situation) => (
                <SituationMessageBox key={situation.id} situation={situation} />
              ))}

              {noticesForFocused.map(
                (notice) =>
                  notice.text && (
                    <MessageInfoBox type="info" message={notice.text} />
                  ),
              )}
            </View>
          )}
          <View style={styles.subContainer}>
            <ThemeText type="body__tertiary--bold">
              {getStopHeader(status, t)}
            </ThemeText>
            <ThemeText type="heading__title">{quayName}</ThemeText>
          </View>
          <TimeInfo state={{status, focusedEstimatedCall}} />
        </View>
      </GenericSectionItem>
    </Section>
  );
};

const useTravelAidAnnouncements = (
  state: FocusedEstimatedCallState,
  situationsForFocusedStop: SituationType[],
  noticesForFocusedStop: NoticeFragment[],
) => {
  const {language, t} = useTranslation();
  const isFirstRender = useRef(true);
  const message = getFocussedStateA11yLabel(state, t, language);
  const situations = getSituationA11yLabel(situationsForFocusedStop, language);
  const notices = getNoticesA11yLabel(noticesForFocusedStop);
  const previousQuayId = useRef(state.focusedEstimatedCall.quay.id);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (state.focusedEstimatedCall.quay.id !== previousQuayId.current) {
      previousQuayId.current = state.focusedEstimatedCall.quay.id;
      AccessibilityInfo.announceForAccessibility(
        message + screenReaderPause + noticies + screenReaderPause + situations,
      );
    } else {
      AccessibilityInfo.announceForAccessibility(message);
    }
  }, [message, situations, noticies, state.focusedEstimatedCall.quay.id]);
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

const getFocussedStateA11yLabel = (
  state: FocusedEstimatedCallState,
  t: TranslateFunction,
  language: Language,
) => {
  const quayName = getQuayName(state.focusedEstimatedCall.quay) ?? '';

  return (
    getStopHeader(state.status, t) +
    ' ' +
    quayName +
    '. ' +
    getTimeInfoA11yLabel(state, t, language)
  );
};

const getSituationA11yLabel = (
  situations: SituationType[],
  language: Language,
) => {
  return situations
    .map((s) => getSituationSummary(s, language))
    .filter(isDefined)
    .join(screenReaderPause);
};

const getNoticesA11yLabel = (notices: NoticeFragment[]) => {
  return notices
    .map((notice) => notice.text)
    .filter(isDefined)
    .join(screenReaderPause);
};

const getTimeInfoA11yLabel = (
  state: FocusedEstimatedCallState,
  t: TranslateFunction,
  language: Language,
) => {
  const scheduledClock = formatToClock(
    state.focusedEstimatedCall.aimedDepartureTime,
    language,
    'round',
  );
  const relativeRealtime = formatToClockOrRelativeMinutes(
    state.focusedEstimatedCall.expectedDepartureTime,
    language,
    t(dictionary.date.units.now),
  );
  switch (state.status) {
    case TravelAidStatus.EndOfLine:
      return '';
    case TravelAidStatus.NoRealtime:
    case TravelAidStatus.NotGettingUpdates:
      return t(TravelAidTexts.clock(scheduledClock));
    case TravelAidStatus.NotYetArrived:
    case TravelAidStatus.Arrived:
    case TravelAidStatus.BetweenStops:
      return `${t(dictionary.a11yRealTimePrefix)} ${relativeRealtime}, ${t(
        TravelAidTexts.scheduledTimeA11yLabel(scheduledClock),
      )}`;
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
    paddingHorizontal: theme.spacing.medium,
    gap: theme.spacing.medium,
  },
  sectionContainer: {
    flex: 1,
    gap: theme.spacing.xLarge,
  },
  subContainer: {
    gap: theme.spacing.small,
  },
  horizontalRule: {
    borderBottomWidth: 1,
    borderBottomColor: theme.color.background.neutral[0].foreground.primary,
    width: '100%',
  },
  realTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xSmall,
  },
}));
