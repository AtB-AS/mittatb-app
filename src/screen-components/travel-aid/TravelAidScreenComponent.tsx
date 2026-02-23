import {Close} from '@atb/assets/svg/mono-icons/actions';
import {Button} from '@atb/components/button';
import {EstimatedCallInfo} from '@atb/components/estimated-call';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {ServiceJourneyDeparture} from '@atb/screen-components/travel-details-screens';
import React, {Ref} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTravelAidDataQuery} from './use-travel-aid-data';
import {ScrollView} from 'react-native-gesture-handler';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {View} from 'react-native';
import {screenReaderPause, ThemeText} from '@atb/components/text';
import {formatToClock, formatToClockOrRelativeMinutes} from '@atb/utils/date';
import {TranslateFunction, dictionary, useTranslation} from '@atb/translations';
import {TravelAidTexts} from '@atb/translations';
import {
  getLineA11yLabel,
  getNoticesForServiceJourney,
} from '@atb/screen-components/travel-details-screens';
import {ThemeIcon} from '@atb/components/theme-icon';
import {Realtime as RealtimeDark} from '@atb/assets/svg/color/icons/status/dark';
import {Realtime as RealtimeLight} from '@atb/assets/svg/color/icons/status/light';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {
  FocusedEstimatedCallState,
  TravelAidStatus,
  getFocusedEstimatedCall,
} from './get-focused-estimated-call';
import {getQuayName} from '@atb/utils/transportation-names';
import {SituationMessageBox} from '@atb/modules/situations';
import {CancelledDepartureMessage} from '@atb/screen-components/travel-details-screens';
import {StopSignalButton} from './components/StopSignalButton';
import type {ServiceJourneyWithGuaranteedCalls} from './types';
import {useStopSignalMutation} from './use-stop-signal-mutation';
import {MutationStatus} from '@tanstack/react-query';
import type {SendStopSignalRequestType} from '@atb/api/stop-signal';
import type {ContrastColor} from '@atb/theme/colors';
import {createSentStopSignalsCache} from './sent-stop-signals-cache';
import {LiveRegionWrapper} from '@atb/components/screen-reader-announcement';
import {useKeepAwake} from '@sayem314/react-native-keep-awake';
import {useIsFocusedAndActive} from '@atb/utils/use-is-focused-and-active';
import {Loading} from '@atb/components/loading';

export type TravelAidScreenParams = {
  serviceJourneyDeparture: ServiceJourneyDeparture;
};
type Props = TravelAidScreenParams & {
  goBack: () => void;
  focusRef: Ref<any>;
};

const sentStopSignalsCache = createSentStopSignalsCache();

export const TravelAidScreenComponent = ({
  serviceJourneyDeparture,
  goBack,
  focusRef,
}: Props) => {
  const stopSignalMutation = useStopSignalMutation({
    onSuccess: () => sentStopSignalsCache.addSent(serviceJourneyDeparture),
  });
  const styles = useStyles();
  const {t} = useTranslation();
  const {theme} = useThemeContext();

  useKeepAwake();

  const hasSentStopSignal = sentStopSignalsCache.hasSent(
    serviceJourneyDeparture,
  );
  const sendStopSignalStatus = hasSentStopSignal
    ? 'success'
    : stopSignalMutation.status;

  const isFocusedAndActive = useIsFocusedAndActive();

  const {
    data: serviceJourney,
    status,
    refetch,
  } = useTravelAidDataQuery(
    isFocusedAndActive,
    serviceJourneyDeparture.serviceJourneyId,
    serviceJourneyDeparture.serviceDate,
  );

  // Skip cancelled calls, since they won't get actualDepartureTimes
  const estimatedCalls = serviceJourney?.estimatedCalls?.filter(
    (ec) => !ec.cancellation,
  );

  const bgContrastColor: ContrastColor =
    sendStopSignalStatus === 'success'
      ? theme.color.background.accent['2']
      : theme.color.background.neutral['1'];

  return (
    <SafeAreaView
      style={{
        ...styles.container,
        backgroundColor: bgContrastColor.background,
      }}
    >
      <Button
        expanded={false}
        onPress={goBack}
        text={t(TravelAidTexts.close)}
        leftIcon={{svg: Close}}
        mode="tertiary"
        backgroundColor={bgContrastColor}
        testID="closeJourneyAidButton"
      />
      <ScrollView contentContainerStyle={styles.scrollView}>
        {status === 'pending' && <Loading size="large" ref={focusRef} />}
        {status === 'error' && (
          <View ref={focusRef}>
            <MessageInfoBox
              type="error"
              message={t(TravelAidTexts.apiError.message)}
              onPressConfig={{action: refetch, text: t(dictionary.retry)}}
            />
          </View>
        )}
        {estimatedCalls && estimatedCalls.length === 0 && (
          <View ref={focusRef}>
            <MessageInfoBox
              type="error"
              message={t(TravelAidTexts.noEstimatedCallsError.message)}
            />
          </View>
        )}
        {status === 'success' &&
          estimatedCalls &&
          estimatedCalls.length > 0 && (
            <TravelAidSection
              serviceJourney={{
                ...serviceJourney,
                estimatedCalls,
              }}
              fromStopPosition={serviceJourneyDeparture.fromStopPosition}
              focusRef={focusRef}
              sendStopSignal={stopSignalMutation.mutate}
              sendStopSignalStatus={sendStopSignalStatus}
            />
          )}
      </ScrollView>
    </SafeAreaView>
  );
};

const TravelAidSection = ({
  serviceJourney,
  fromStopPosition,
  focusRef,
  sendStopSignal,
  sendStopSignalStatus,
}: {
  serviceJourney: ServiceJourneyWithGuaranteedCalls;
  fromStopPosition: number;
  focusRef: Ref<any>;
  sendStopSignal: (args: SendStopSignalRequestType) => void;
  sendStopSignalStatus: MutationStatus;
}) => {
  const styles = useStyles();
  const {t} = useTranslation();

  const {status, focusedEstimatedCall} = getFocusedEstimatedCall(
    serviceJourney.estimatedCalls,
    fromStopPosition,
  );

  const situationsForFocused =
    focusedEstimatedCall.situations.sort((n1, n2) =>
      n1.id.localeCompare(n2.id),
    ) ?? [];
  const noticesForFocused =
    getNoticesForServiceJourney(
      serviceJourney,
      focusedEstimatedCall.stopPositionInPattern,
    ).sort((n1, n2) => n1.id.localeCompare(n2.id)) ?? [];

  const isCancelled = focusedEstimatedCall.cancellation;

  const quayName = getQuayName(focusedEstimatedCall.quay) ?? '';

  return (
    <Section ref={focusRef} testID="journeyAidSection">
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
      <GenericSectionItem>
        <View style={styles.sectionContainer}>
          {status === TravelAidStatus.NoRealtime && (
            <MessageInfoBox
              type="warning"
              title={t(TravelAidTexts.noRealtimeError.title)}
              message={t(TravelAidTexts.noRealtimeError.message)}
              a11yLiveRegion="polite"
            />
          )}

          {(isCancelled ||
            situationsForFocused.length > 0 ||
            noticesForFocused.length > 0) && (
            <View style={styles.subContainer}>
              {isCancelled && (
                <CancelledDepartureMessage a11yLiveRegion="polite" />
              )}

              {situationsForFocused.map((situation) => (
                <SituationMessageBox
                  key={situation.id}
                  situation={situation}
                  a11yLiveRegion="polite"
                />
              ))}

              {noticesForFocused.map(
                (notice) =>
                  notice.text && (
                    <MessageInfoBox
                      type="info"
                      message={notice.text}
                      a11yLiveRegion="polite"
                    />
                  ),
              )}
            </View>
          )}
          <View accessible style={styles.stopHeaderContainer}>
            <LiveRegionWrapper
              accessibilityLabel={
                getStopHeader(status, t) + screenReaderPause + quayName
              }
            >
              <ThemeText typography="heading__xs">
                {getStopHeader(status, t)}
              </ThemeText>
              <ThemeText typography="heading__m">{quayName}</ThemeText>
            </LiveRegionWrapper>
            <TimeInfo state={{status, focusedEstimatedCall}} />
          </View>
          <StopSignalButton
            serviceJourney={serviceJourney}
            fromStopPosition={fromStopPosition}
            onPress={sendStopSignal}
            status={sendStopSignalStatus}
          />
        </View>
      </GenericSectionItem>
    </Section>
  );
};

const TimeInfo = ({state}: {state: FocusedEstimatedCallState}) => {
  const {language, t} = useTranslation();
  const styles = useStyles();
  const {themeName} = useThemeContext();
  const {focusedEstimatedCall, status} = state;

  const scheduledClock = formatToClock(
    focusedEstimatedCall.aimedDepartureTime,
    language,
    'round',
  );
  const relativeRealtime = formatToClockOrRelativeMinutes(
    focusedEstimatedCall.expectedDepartureTime,
    language,
    t(dictionary.date.units.now),
  );

  switch (status) {
    case TravelAidStatus.EndOfLine:
      return null;
    case TravelAidStatus.NoRealtime:
    case TravelAidStatus.NotGettingUpdates:
      return (
        <LiveRegionWrapper
          accessibilityLabel={t(TravelAidTexts.scheduledTime(scheduledClock))}
        >
          <ThemeText typography="body__s__strong">
            {t(TravelAidTexts.scheduledTime(scheduledClock))}
          </ThemeText>
        </LiveRegionWrapper>
      );
    case TravelAidStatus.NotYetArrived:
      return (
        <View>
          <LiveRegionWrapper
            accessibilityLabel={`${t(
              dictionary.a11yRealTimePrefix,
            )} ${relativeRealtime}`}
          >
            <View style={styles.realTime}>
              <ThemeIcon
                svg={themeName === 'light' ? RealtimeLight : RealtimeDark}
                size="xSmall"
              />
              <ThemeText typography="heading__m">{relativeRealtime}</ThemeText>
            </View>
          </LiveRegionWrapper>
          <LiveRegionWrapper
            accessibilityLabel={`${t(
              TravelAidTexts.scheduledTimeA11yLabel(scheduledClock),
            )}`}
          >
            <ThemeText typography="body__s__strong">
              {t(TravelAidTexts.scheduledTime(scheduledClock))}
            </ThemeText>
          </LiveRegionWrapper>
        </View>
      );
    case TravelAidStatus.Arrived:
    case TravelAidStatus.BetweenStops:
      return (
        <LiveRegionWrapper
          accessibilityLabel={`${t(
            dictionary.a11yRealTimePrefix,
          )} ${relativeRealtime}`}
        >
          <View style={styles.realTime}>
            <ThemeIcon
              svg={themeName === 'light' ? RealtimeLight : RealtimeDark}
              size="xSmall"
            />
            <ThemeText typography="heading__m">{relativeRealtime}</ThemeText>
          </View>
        </LiveRegionWrapper>
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
  container: {flex: 1},
  scrollView: {
    paddingHorizontal: theme.spacing.medium,
    gap: theme.spacing.medium,
  },
  sectionContainer: {
    flex: 1,
    gap: theme.spacing.large,
  },
  subContainer: {
    gap: theme.spacing.small,
  },
  stopHeaderContainer: {
    gap: theme.spacing.large,
  },
  realTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xSmall,
  },
}));
