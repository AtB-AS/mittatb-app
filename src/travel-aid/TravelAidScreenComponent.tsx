import {Close} from '@atb/assets/svg/mono-icons/actions';
import {Button} from '@atb/components/button';
import {EstimatedCallInfo} from '@atb/components/estimated-call';
import {StyleSheet, useTheme} from '@atb/theme';
import {ServiceJourneyDeparture} from '@atb/travel-details-screens/types';
import React, {Ref, useCallback, useEffect, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTravelAidDataQuery} from './use-travel-aid-data';
import {ScrollView} from 'react-native-gesture-handler';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {
  AccessibilityInfo,
  ActivityIndicator,
  Platform,
  View,
} from 'react-native';
import {screenReaderPause, ThemeText} from '@atb/components/text';
import {formatToClock, formatToClockOrRelativeMinutes} from '@atb/utils/date';
import {
  CancelledDepartureTexts,
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
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {getQuayName} from '@atb/utils/transportation-names.ts';
import {NoticeFragment} from '@atb/api/types/generated/fragments/notices';
import {SituationMessageBox} from '@atb/situations';
import {getSituationSummary} from '@atb/situations/utils';
import {SituationType} from '@atb/situations/types';
import {isDefined} from '@atb/utils/presence';
import {onlyUniques} from '@atb/utils/only-uniques';
import {CancelledDepartureMessage} from '@atb/travel-details-screens/components/CancelledDepartureMessage';
import {StopSignalButton} from '@atb/travel-aid/components/StopSignalButton';
import type {ServiceJourneyWithGuaranteedCalls} from '@atb/travel-aid/types';
import {useStopSignalMutation} from '@atb/travel-aid/use-stop-signal-mutation';
import {MutationStatus} from '@tanstack/react-query';
import type {SendStopSignalRequestType} from '@atb/api/stop-signal';
import type {ContrastColor} from '@atb/theme/colors';

// Each situation/notification has a lifetime since the accessibility does not queue the messages, this is a time
// for them not being interrupted too early.
const ANNOUNCE_LIFETIME = 10000;

// Delay restriction between adding new messages to the announcement queue.
// This prevents adding part of the same message when announced situations/notices are marked as announced.
const MIN_ANNOUNCE_DELAY = 2000;

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
  const stopSignalMutation = useStopSignalMutation();
  const styles = useStyles();
  const {t} = useTranslation();
  const {theme, themeName} = useTheme();
  const focusRef = useFocusOnLoad();

  const {
    data: serviceJourney,
    status,
    refetch,
  } = useTravelAidDataQuery(
    serviceJourneyDeparture.serviceJourneyId,
    serviceJourneyDeparture.serviceDate,
  );

  const bgContrastColor: ContrastColor =
    stopSignalMutation.status === 'success'
      ? theme.color.background.accent['2']
      : theme.color.background.neutral['1'];

  return (
    <SafeAreaView
      style={{
        ...styles.container,
        backgroundColor: bgContrastColor.background,
      }}
    >
      <StatusBarOnFocus
        barStyle={themeName === 'light' ? 'dark-content' : 'light-content'}
      />
      <Button
        onPress={goBack}
        text={t(TravelAidTexts.close)}
        leftIcon={{svg: Close}}
        mode="tertiary"
        type="medium"
        backgroundColor={bgContrastColor}
      />
      <ScrollView contentContainerStyle={styles.scrollView}>
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
            sendStopSignal={stopSignalMutation.mutate}
            sendStopSignalStatus={stopSignalMutation.status}
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
  sendStopSignal,
  sendStopSignalStatus,
}: {
  serviceJourney: ServiceJourneyWithGuaranteedCalls;
  fromQuayId?: string;
  focusRef: Ref<any>;
  sendStopSignal: (args: SendStopSignalRequestType) => void;
  sendStopSignalStatus: MutationStatus;
}) => {
  const styles = useStyles();
  const {t, language} = useTranslation();

  const {status, focusedEstimatedCall} = getFocusedEstimatedCall(
    serviceJourney.estimatedCalls,
    fromQuayId,
  );

  const situationsForFocused =
    focusedEstimatedCall.situations.sort((n1, n2) =>
      n1.id.localeCompare(n2.id),
    ) ?? [];
  const noticesForFocused =
    getNoticesForServiceJourney(
      serviceJourney,
      focusedEstimatedCall.quay.id,
    ).sort((n1, n2) => n1.id.localeCompare(n2.id)) ?? [];

  const isCancelled = focusedEstimatedCall.cancellation;

  useTravelAidAnnouncements(
    {status, focusedEstimatedCall},
    situationsForFocused,
    noticesForFocused,
    isCancelled,
  );

  const quayName = getQuayName(focusedEstimatedCall.quay) ?? '';

  const focussedStateA11yLabel = getFocussedStateA11yLabel(
    {status, focusedEstimatedCall},
    t,
    language,
  );

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
      <GenericSectionItem>
        <View style={styles.sectionContainer}>
          {status === TravelAidStatus.NoRealtime && (
            <MessageInfoBox
              type="warning"
              title={t(TravelAidTexts.noRealtimeError.title)}
              message={t(TravelAidTexts.noRealtimeError.message)}
            />
          )}

          {(isCancelled ||
            situationsForFocused.length > 0 ||
            noticesForFocused.length > 0) && (
            <View style={styles.subContainer}>
              {isCancelled && <CancelledDepartureMessage />}

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
          <View
            accessible
            accessibilityLabel={focussedStateA11yLabel}
            style={styles.stopHeaderContainer}
          >
            <View>
              <ThemeText type="body__tertiary--bold">
                {getStopHeader(status, t)}
              </ThemeText>
              <ThemeText type="heading__title">{quayName}</ThemeText>
            </View>
            <TimeInfo state={{status, focusedEstimatedCall}} />
          </View>
          <StopSignalButton
            serviceJourney={serviceJourney}
            fromQuayId={fromQuayId}
            onPress={sendStopSignal}
            status={sendStopSignalStatus}
          />
        </View>
      </GenericSectionItem>
    </Section>
  );
};

const useTravelAidAnnouncements = (
  state: FocusedEstimatedCallState,
  situationsForFocusedStop: SituationType[],
  noticesForFocusedStop: NoticeFragment[],
  cancelled: boolean,
) => {
  const {language, t} = useTranslation();

  const previousQuayId = useRef<string | null>(null);

  const [announcedSituationIds, setAnnouncedSituationIds] = useState<string[]>(
    situationsForFocusedStop.map((s) => s.id).filter(onlyUniques),
  );
  const [announcedNoticeIds, setAnnouncedNoticeIds] = useState<string[]>(
    noticesForFocusedStop.map((n) => n.id).filter(onlyUniques),
  );

  const newSituations = situationsForFocusedStop.filter(
    (s) => !announcedSituationIds.includes(s.id),
  );
  const newNotices = noticesForFocusedStop.filter(
    (n) => !announcedNoticeIds.includes(n.id),
  );

  const newSituationIds = newSituations.map((s) => s.id);
  const newNoticeIds = newNotices.map((n) => n.id);

  const focusedStateWithCancelled =
    getFocussedStateA11yLabel(state, t, language) +
    (cancelled ? screenReaderPause + t(CancelledDepartureTexts.message) : '');

  const timeInfoMessage = getTimeInfoA11yLabel(state, t, language);

  const message =
    focusedStateWithCancelled +
    screenReaderPause +
    getSituationA11yLabel(newSituations, language) +
    screenReaderPause +
    getNoticesA11yLabel(newNotices);

  const [announcementQueue, setAnnouncementQueue] = useState<string[]>([]);
  const [isAnnouncing, setIsAnnouncing] = useState(false);
  const [lastAnnounceTime, setLastAnnounceTime] = useState<number>(0);

  const announceMessage = useCallback(
    (msg: string) => {
      const currentTime = Date.now();
      if (currentTime - lastAnnounceTime >= MIN_ANNOUNCE_DELAY) {
        if (Platform.OS === 'ios') {
          AccessibilityInfo.announceForAccessibilityWithOptions(msg, {
            queue: true,
          });
        } else {
          setAnnouncementQueue((prevQueue) => [...prevQueue, msg]);
        }
        setLastAnnounceTime(currentTime);
      }
    },
    [lastAnnounceTime],
  );

  useEffect(() => {
    if (Platform.OS !== 'ios') return;

    const processQueue = async () => {
      if (isAnnouncing || announcementQueue.length === 0) return;

      setIsAnnouncing(true);

      const nextMessage = announcementQueue[0];
      AccessibilityInfo.announceForAccessibility(nextMessage);
      await new Promise((resolve) => setTimeout(resolve, ANNOUNCE_LIFETIME));

      setAnnouncementQueue((prevQueue) => prevQueue.slice(1));

      setIsAnnouncing(false);
    };

    processQueue();
  }, [announcementQueue, isAnnouncing]);

  useEffect(() => {
    if (newSituationIds.length > 0) {
      setAnnouncedSituationIds((prev) => [...prev, ...newSituationIds]);
    }

    if (newNoticeIds.length > 0) {
      setAnnouncedNoticeIds((prev) => [...prev, ...newNoticeIds]);
    }
  }, [newSituationIds, newNoticeIds]);

  useEffect(() => {
    if (!previousQuayId.current) {
      // If previousQuayId is null, it is the first render, and we should not
      // announce the time or situations/notifications.
      previousQuayId.current = state.focusedEstimatedCall.quay.id;
      return;
    }

    if (previousQuayId.current === state.focusedEstimatedCall.quay.id) {
      // Only announce the time if the focused estimated call hasn't changed
      announceMessage(timeInfoMessage);
    } else {
      announceMessage(message);
    }

    previousQuayId.current = state.focusedEstimatedCall.quay.id;
  }, [
    message,
    timeInfoMessage,
    state.focusedEstimatedCall.quay.id,
    announceMessage,
  ]);
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
          {t(TravelAidTexts.scheduledTime(clock))}
        </ThemeText>
      );
    case TravelAidStatus.NotYetArrived:
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
    case TravelAidStatus.Arrived:
    case TravelAidStatus.BetweenStops:
      return (
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
      return t(TravelAidTexts.scheduledTime(scheduledClock));
    case TravelAidStatus.Arrived:
    case TravelAidStatus.BetweenStops:
      return `${t(dictionary.a11yRealTimePrefix)} ${relativeRealtime}`;
    case TravelAidStatus.NotYetArrived:
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
  container: {flex: 1},
  scrollView: {
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
  stopHeaderContainer: {
    gap: theme.spacing.large,
  },
  realTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xSmall,
  },
}));
