import {Leg, Place, Quay} from '@atb/api/types/trips';
import {screenReaderPause, ThemeText} from '@atb/components/text';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {ThemeIcon} from '@atb/components/theme-icon';
import {TransportationIconBox} from '@atb/components/icon-box';
import {ServiceJourneyDeparture} from '../types';
import {SituationMessageBox} from '@atb/modules/situations';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {
  Language,
  TranslateFunction,
  TripDetailsTexts,
  useTranslation,
} from '@atb/translations';
import {
  formatToClock,
  secondsToDuration,
  secondsToDurationShort,
} from '@atb/utils/date';
import {
  getQuayName,
  getTranslatedModeName,
} from '@atb/utils/transportation-names';
import {useTransportColor} from '@atb/utils/use-transport-color';
import React, {useState} from 'react';
import {View} from 'react-native';
import {openUrl} from '@atb/utils/open-url';
import {useHumanizeDistance} from '@atb/utils/location';
import {
  getLineDestinationName,
  getLineName,
  getNoticesForLeg,
  getPublicCodeFromLeg,
  isLineFlexibleTransport,
  getBookingStatus,
  significantWalkTime,
} from '../utils';
import {significantWaitTime} from '@atb/modules/trip-patterns';
import {Time} from './Time';
import {TripLegDecoration} from './TripLegDecoration';
import {TripRow} from './TripRow';
import {BookingInfoBox} from './BookingInfoBox';

import {WaitDetails, WaitSection} from './WaitSection';
import {Realtime as RealtimeDark} from '@atb/assets/svg/color/icons/status/dark';
import {Realtime as RealtimeLight} from '@atb/assets/svg/color/icons/status/light';
import {TripProps} from './Trip';
import {Button} from '@atb/components/button';
import {Map} from '@atb/assets/svg/mono-icons/map';
import {ServiceJourneyPolylines} from '@atb/api/types/serviceJourney';
import {useServiceJourneyPolylineQuery} from '../use-service-journey-polyline-query';
import {useRealtimeText} from '../use-realtime-text';
import {useNow} from '@atb/utils/use-now';
import {useIsScreenReaderEnabled} from '@atb/utils/use-is-screen-reader-enabled';
import {useRemoteConfigContext} from '@atb/modules/remote-config';
import {BookingOptions} from './BookingOptions';
import {FlexibleTransportBookingDetailsSheet} from './FlexibleTransportBookingDetailsSheet';
import {
  Mode,
  TransportSubmode,
} from '@atb/api/types/generated/journey_planner_v3_types';
import {
  ExternalLink,
  ExpandLess,
  ExpandMore,
} from '@atb/assets/svg/mono-icons/navigation';
import {animateNextChange} from '@atb/utils/animation';
import {AUTHORITY} from '@env';
import {AuthorityFragment} from '@atb/api/types/generated/fragments/authority';
import {getRealtimeState, type TimeValues} from '@atb/utils/realtime';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {CancelledDepartureMessage} from './CancelledDepartureMessage';

type TripSectionProps = {
  isLast?: boolean;
  wait?: WaitDetails;
  isFirst?: boolean;
  interchangeDetails?: InterchangeDetails;
  leg: Leg;
  testID?: string;
  onPressShowLive?(serviceJourneyPolylines: ServiceJourneyPolylines): void;
  onPressDeparture: TripProps['onPressDeparture'];
  onPressQuay: TripProps['onPressQuay'];
};

export type InterchangeDetails = {
  publicCode: string;
  fromPlace: string;
};

export const TripSection: React.FC<TripSectionProps> = ({
  isLast,
  isFirst,
  wait,
  interchangeDetails,
  leg,
  testID,
  onPressShowLive,
  onPressDeparture,
  onPressQuay,
}) => {
  const {t, language} = useTranslation();
  const style = useSectionStyles();
  const {theme, themeName} = useThemeContext();
  const isScreenReaderEnabled = useIsScreenReaderEnabled();
  const onCloseFocusRef = React.useRef(null);
  const bottomSheetModalRef = React.useRef<BottomSheetModal | null>(null);

  const isWalkSection = leg.mode === Mode.Foot;
  const isBikeSection = leg.mode === Mode.Bicycle;
  const isFlexible = isLineFlexibleTransport(leg.line);
  const timesAreApproximations = isFlexible;
  const legColor = useTransportColor(
    leg.mode,
    leg.line?.transportSubmode,
    isFlexible,
  ).secondary.background;

  const showFrom = !isWalkSection || !!(isFirst && isWalkSection);
  const showTo = !isWalkSection || !!(isLast && isWalkSection);

  const {startTimes, endTimes} = mapLegToTimeValues(leg);

  const notices = getNoticesForLeg(leg);

  const realtimeText = useRealtimeText(leg.serviceJourneyEstimatedCalls);

  const {data: serviceJourneyPolyline} = useServiceJourneyPolylineQuery(
    leg.serviceJourney?.id,
    leg.fromPlace.quay?.id,
    leg.toPlace.quay?.id,
  );

  const publicCode = getPublicCodeFromLeg(leg);

  const now = useNow(30000);
  const {flex_booking_number_of_days_available} = useRemoteConfigContext();
  const bookingStatus = getBookingStatus(
    leg.bookingArrangements,
    leg.aimedStartTime,
    now,
    flex_booking_number_of_days_available,
  );

  const atbAuthorityId = 'ATB:Authority:2';
  const shouldShowButtonForOpeningFlexBottomSheet =
    isLineFlexibleTransport(leg.line) && leg.authority?.id === atbAuthorityId;

  function openBookingDetails() {
    bottomSheetModalRef.current?.present();
  }

  const translatedModeName = getTranslatedModeName(leg.mode);

  const showInterchangeSection =
    leg.interchangeTo?.guaranteed && interchangeDetails && leg.line;

  const showQuayDescription =
    !!leg.fromPlace.quay?.description && !isWalkSection && !isBikeSection;

  const walkA11yLabel = useWalkA11yLabel(leg, wait);
  const bikeA11yLabel = useBikeA11yLabel(leg, wait);
  const isWalkOrBike = isWalkSection || isBikeSection;
  const fromRowAbsorbsLegA11y = isWalkOrBike && showFrom;

  const sectionOutput = (
    <>
      <View style={style.tripSection} testID={testID}>
        <TripLegDecoration
          color={legColor}
          hasStart={showFrom}
          hasEnd={showTo}
        />
        {showFrom && (
          <TripRow
            alignChildren="flex-start"
            accessibilityLabel={
              fromRowAbsorbsLegA11y
                ? isWalkSection
                  ? walkA11yLabel
                  : bikeA11yLabel
                : getStartPlaceA11yLabel(
                    getPlaceName(leg.fromPlace) +
                      (showQuayDescription
                        ? ` ${leg.fromPlace.quay?.description}`
                        : ''),
                    startTimes,
                    timesAreApproximations,
                    language,
                    t,
                  )
            }
            rowLabel={
              <Time
                timeValues={startTimes}
                roundingMethod="floor"
                timeIsApproximation={timesAreApproximations}
              />
            }
            onPress={
              isWalkOrBike
                ? undefined
                : () => handleQuayPress(leg.fromPlace.quay)
            }
            testID={`${testID}FromPlace`}
          >
            <ThemeText
              typography="body__m__strong"
              testID={`${testID}FromPlaceName`}
            >
              {getPlaceName(leg.fromPlace)}
            </ThemeText>
            {showQuayDescription && (
              <ThemeText
                testID={`${testID}FromPlaceQuayDescription`}
                typography="body__s"
                type="secondary"
              >
                {leg.fromPlace.quay?.description}
              </ThemeText>
            )}
          </TripRow>
        )}
        {isWalkSection ? (
          <View
            accessibilityElementsHidden={fromRowAbsorbsLegA11y}
            importantForAccessibility={
              fromRowAbsorbsLegA11y ? 'no-hide-descendants' : 'auto'
            }
          >
            <WalkSection leg={leg} wait={wait} />
          </View>
        ) : isBikeSection ? (
          <View
            accessibilityElementsHidden={fromRowAbsorbsLegA11y}
            importantForAccessibility={
              fromRowAbsorbsLegA11y ? 'no-hide-descendants' : 'auto'
            }
          >
            <BikeSection leg={leg} wait={wait} />
          </View>
        ) : (
          <TripRow
            testID={`${testID}Mode`}
            accessibilityLabel={
              t(
                TripDetailsTexts.trip.leg.transport.a11ylabel(
                  t(
                    getTranslatedModeName(leg.mode, leg.line?.transportSubmode),
                  ),
                  getLineName(t, leg),
                ),
              ) +
              (isFlexible
                ? screenReaderPause +
                  t(TripDetailsTexts.flexibleTransport.onDemandTransportLabel)
                : '')
            }
            onPress={() => handleDeparturePress(leg)}
          >
            {leg.transportSubmode === TransportSubmode.NightBus && (
              <ThemeText
                type="secondary"
                typography="body__s"
                style={style.secondaryTransportLabel}
              >
                {t(getTranslatedModeName(leg.mode, leg.line?.transportSubmode))}
              </ThemeText>
            )}
            <View style={style.transportLine}>
              <TransportationIconBox
                mode={leg.mode}
                subMode={leg.line?.transportSubmode}
                isFlexible={isFlexible}
                lineNumber={publicCode}
              />
              <ThemeText typography="body__m__strong">
                {getLineDestinationName(t, leg)}
              </ThemeText>
            </View>
            {isFlexible && (
              <ThemeText
                type="secondary"
                typography="body__s"
                style={style.onDemandTransportLabel}
              >
                {t(TripDetailsTexts.flexibleTransport.onDemandTransportLabel)}
              </ThemeText>
            )}
          </TripRow>
        )}
        {leg.fromEstimatedCall?.cancellation && (
          <TripRow>
            <CancelledDepartureMessage />
          </TripRow>
        )}
        {leg.situations.map((situation) => (
          <TripRow key={situation.id}>
            <SituationMessageBox situation={situation} />
          </TripRow>
        ))}
        {notices.map((notice) => (
          <TripRow key={notice.id}>
            <MessageInfoBox type="info" message={notice.text} />
          </TripRow>
        ))}
        {bookingStatus !== 'none' && (
          <TripRow accessible={false}>
            <BookingInfoBox
              bookingArrangements={leg.bookingArrangements}
              aimedStartTime={leg.aimedStartTime}
              now={now}
              focusRef={onCloseFocusRef}
              onPressConfig={
                shouldShowButtonForOpeningFlexBottomSheet
                  ? {
                      text: t(
                        TripDetailsTexts.flexibleTransport.needsBookingWhatIsThis(
                          publicCode,
                        ),
                      ),
                      action: openBookingDetails,
                    }
                  : undefined
              }
            />
          </TripRow>
        )}
        {bookingStatus === 'bookable' && (
          <View style={style.flexBookingOptions}>
            <TripRow accessible={false}>
              <BookingOptions bookingArrangements={leg.bookingArrangements} />
            </TripRow>
          </View>
        )}

        {leg.transportSubmode === TransportSubmode.RailReplacementBus && (
          <TripRow>
            <MessageInfoBox
              type="warning"
              message={t(
                TripDetailsTexts.messages.departureIsRailReplacementBus,
              )}
            />
          </TripRow>
        )}
        {leg.authority && <AuthorityRow {...leg.authority} />}
        {onPressShowLive && serviceJourneyPolyline && !isScreenReaderEnabled ? (
          <TripRow>
            <Button
              type="small"
              expanded={false}
              mode="secondary"
              leftIcon={{svg: Map}}
              text={t(TripDetailsTexts.trip.leg.live(t(translatedModeName)))}
              backgroundColor={theme.color.background.neutral[1]}
              onPress={() => onPressShowLive(serviceJourneyPolyline)}
            />
          </TripRow>
        ) : null}
        {realtimeText && (
          <TripRow>
            <View style={style.realtime}>
              <ThemeIcon
                svg={themeName == 'dark' ? RealtimeDark : RealtimeLight}
                size="xSmall"
                style={style.realtimeIcon}
              />
              <ThemeText
                style={style.realtimeText}
                typography="body__s"
                type="secondary"
              >
                {realtimeText}
              </ThemeText>
            </View>
          </TripRow>
        )}
        {leg.intermediateEstimatedCalls.length > 0 && (
          <IntermediateInfo leg={leg} testID={testID} />
        )}
        {showTo && (
          <TripRow
            alignChildren="flex-end"
            accessibilityLabel={t(
              TripDetailsTexts.trip.leg.end.a11yLabel(
                getPlaceName(leg.toPlace),
                formatToClock(
                  endTimes.expectedTime ?? endTimes.aimedTime,
                  language,
                  'ceil',
                ),
              ),
            )}
            accessibilityHint={t(
              TripDetailsTexts.trip.leg.end.a11yHint(getPlaceName(leg.toPlace)),
            )}
            rowLabel={
              <Time
                timeValues={endTimes}
                roundingMethod="ceil"
                timeIsApproximation={timesAreApproximations}
              />
            }
            onPress={() => handleQuayPress(leg.toPlace.quay)}
            testID={`${testID}ToPlace`}
          >
            <ThemeText
              typography="body__m__strong"
              testID={`${testID}ToPlaceName`}
            >
              {getPlaceName(leg.toPlace)}
            </ThemeText>
          </TripRow>
        )}
      </View>
      {showInterchangeSection && (
        <InterchangeSection
          publicCode={publicCode}
          interchangeDetails={interchangeDetails}
          maximumWaitTime={leg.interchangeTo?.maximumWaitTime}
          staySeated={leg.interchangeTo?.staySeated}
        />
      )}
      <FlexibleTransportBookingDetailsSheet
        leg={leg}
        bottomSheetModalRef={bottomSheetModalRef}
        onCloseFocusRef={onCloseFocusRef}
      />
    </>
  );
  return (
    <>
      {sectionOutput}
      {wait?.mustWaitForNextLeg &&
        significantWaitTime(wait.waitTimeInSeconds) && (
          <WaitSection {...wait} />
        )}
    </>
  );

  function handleDeparturePress(pressedLeg: Leg) {
    if (pressedLeg.serviceJourney?.id) {
      const departureData: ServiceJourneyDeparture = {
        serviceJourneyId: pressedLeg.serviceJourney.id,
        date: pressedLeg.expectedStartTime,
        serviceDate: pressedLeg.intermediateEstimatedCalls[0]?.date,
        fromStopPosition:
          pressedLeg.fromEstimatedCall?.stopPositionInPattern || 0,
        toStopPosition: pressedLeg.toEstimatedCall?.stopPositionInPattern,
      };
      onPressDeparture([departureData], 0);
    }
  }

  async function handleQuayPress(quay: Quay | undefined) {
    const stopPlace = quay?.stopPlace;
    if (!stopPlace) return;

    onPressQuay(stopPlace, quay.id);
  }
};
const IntermediateInfo = ({leg, testID}: {leg: Leg; testID?: string}) => {
  const {t, language} = useTranslation();
  const {theme} = useThemeContext();
  const style = useSectionStyles();
  const [expanded, setExpanded] = useState(false);
  const legColor = useTransportColor(leg.mode, leg.line?.transportSubmode)
    .secondary.background;

  const numberOfIntermediateCalls = leg.intermediateEstimatedCalls.length;

  const toggleExpanded = () => {
    animateNextChange();
    setExpanded(!expanded);
  };

  return (
    <>
      <TripRow testID={`${testID}IntermediateStops`} accessible={false}>
        <Button
          type="small"
          expanded={false}
          mode="secondary"
          backgroundColor={theme.color.background.neutral[1]}
          rightIcon={{svg: expanded ? ExpandLess : ExpandMore}}
          text={t(
            TripDetailsTexts.trip.leg.intermediateStops.label(
              numberOfIntermediateCalls,
              secondsToDurationShort(leg.duration, language),
            ),
          )}
          onPress={toggleExpanded}
          accessibilityLabel={
            t(
              TripDetailsTexts.trip.leg.intermediateStops.a11yLabel(
                numberOfIntermediateCalls,
                secondsToDuration(leg.duration, language),
              ),
            ) + screenReaderPause
          }
          accessibilityHint={t(
            TripDetailsTexts.trip.leg.intermediateStops.a11yHint,
          )}
        />
      </TripRow>
      {expanded &&
        leg.intermediateEstimatedCalls.map((call, index) => {
          const sjCall = leg.serviceJourneyEstimatedCalls.find(
            (c) => c.quay.name === call.quay.name,
          );
          return (
            <View key={call.quay.id ?? index} style={style.intermediateStop}>
              <TripLegDecoration color={legColor} hasCenter />
              <TripRow
                alignChildren="center"
                style={style.intermediateStopRow}
                rowLabel={
                  sjCall ? (
                    <Time
                      timeValues={{
                        aimedTime: sjCall.aimedDepartureTime,
                        expectedTime: sjCall.expectedDepartureTime,
                        isRealtime: sjCall.realtime,
                      }}
                      roundingMethod="floor"
                    />
                  ) : undefined
                }
              >
                <ThemeText>{call.quay.name}</ThemeText>
              </TripRow>
            </View>
          );
        })}
    </>
  );
};
function useWalkA11yLabel(leg: Leg, wait?: WaitDetails): string {
  const {t, language} = useTranslation();
  const isWalkTimeOfSignificance = significantWalkTime(leg.duration);
  const humanizedDistance = useHumanizeDistance(leg.distance);
  const durationText = secondsToDuration(leg.duration ?? 0, language);
  const time = formatToClock(leg.expectedStartTime, language, 'floor');
  const fromPlace = getPlaceName(leg.fromPlace);
  const toPlace = getPlaceName(leg.toPlace);

  const parts: string[] = [];

  if (isWalkTimeOfSignificance) {
    parts.push(
      t(
        TripDetailsTexts.trip.leg.walk.a11yLabel.base(
          time,
          durationText,
          fromPlace,
          toPlace,
        ),
      ),
    );
  } else {
    parts.push(
      t(
        TripDetailsTexts.trip.leg.walk.a11yLabel.baseShortWalk(
          time,
          fromPlace,
          toPlace,
        ),
      ),
    );
  }

  if (humanizedDistance) {
    parts.push(
      t(TripDetailsTexts.trip.leg.walk.a11yLabel.distance(humanizedDistance)),
    );
  }

  if (wait?.mustWaitForNextLeg && significantWaitTime(wait.waitTimeInSeconds)) {
    parts.push(
      t(
        TripDetailsTexts.trip.leg.walk.a11yLabel.waitTime(
          secondsToDuration(wait.waitTimeInSeconds, language),
        ),
      ),
    );
  }

  return parts.join('. ') + '.';
}

function useBikeA11yLabel(leg: Leg, wait?: WaitDetails): string {
  const {t, language} = useTranslation();
  const durationText = secondsToDuration(leg.duration ?? 0, language);
  const time = formatToClock(leg.expectedStartTime, language, 'floor');
  const fromPlace = getPlaceName(leg.fromPlace);
  const toPlace = getPlaceName(leg.toPlace);
  const humanizedDistance = useHumanizeDistance(leg.distance);

  const parts: string[] = [
    t(
      TripDetailsTexts.trip.leg.bicycle.a11yLabel.base(
        time,
        durationText,
        fromPlace,
        toPlace,
      ),
    ),
  ];

  if (humanizedDistance) {
    parts.push(
      t(
        TripDetailsTexts.trip.leg.bicycle.a11yLabel.distance(humanizedDistance),
      ),
    );
  }

  if (wait?.mustWaitForNextLeg && significantWaitTime(wait.waitTimeInSeconds)) {
    parts.push(
      t(
        TripDetailsTexts.trip.leg.bicycle.a11yLabel.waitTime(
          secondsToDuration(wait.waitTimeInSeconds, language),
        ),
      ),
    );
  }

  return parts.join('. ') + '.';
}

type WalkSectionProps = {
  leg: Leg;
  wait?: WaitDetails;
};

const WalkSection = ({leg, wait}: WalkSectionProps) => {
  const {t, language} = useTranslation();
  const style = useSectionStyles();
  const isWalkTimeOfSignificance = significantWalkTime(leg.duration);
  const humanizedDistance = useHumanizeDistance(leg.distance);
  const durationText = secondsToDuration(leg.duration ?? 0, language);
  const a11yLabel = useWalkA11yLabel(leg, wait);

  return (
    <TripRow testID="footLeg" accessibilityLabel={a11yLabel}>
      <View style={style.transportLine}>
        <TransportationIconBox
          mode={leg.mode}
          subMode={leg.line?.transportSubmode}
        />
        <ThemeText typography="body__s" color="secondary">
          {isWalkTimeOfSignificance && humanizedDistance
            ? t(
                TripDetailsTexts.trip.leg.walk.labelWithDistance(
                  durationText,
                  humanizedDistance,
                ),
              )
            : isWalkTimeOfSignificance
              ? t(TripDetailsTexts.trip.leg.walk.label(durationText))
              : t(TripDetailsTexts.trip.leg.shortWalk)}
        </ThemeText>
      </View>
    </TripRow>
  );
};

type BikeSectionProps = {
  leg: Leg;
  wait?: WaitDetails;
};

const BikeSection = ({leg, wait}: BikeSectionProps) => {
  const {t, language} = useTranslation();
  const style = useSectionStyles();
  const durationText = secondsToDuration(leg.duration ?? 0, language);
  const humanizedDistance = useHumanizeDistance(leg.distance);
  const a11yLabel = useBikeA11yLabel(leg, wait);

  return (
    <TripRow testID="bikeLeg" accessibilityLabel={a11yLabel}>
      <View style={style.transportLine}>
        <TransportationIconBox
          mode={leg.mode}
          subMode={leg.line?.transportSubmode}
        />
        <ThemeText typography="body__s" color="secondary">
          {humanizedDistance
            ? t(
                TripDetailsTexts.trip.leg.bicycle.labelWithDistance(
                  durationText,
                  humanizedDistance,
                ),
              )
            : t(TripDetailsTexts.trip.leg.bicycle.label(durationText))}
        </ThemeText>
      </View>
    </TripRow>
  );
};

const AuthorityRow = ({id, name, url}: AuthorityFragment) => {
  const style = useSectionStyles();
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const interactiveColor = theme.color.interactive[3];

  if (id === AUTHORITY) return null;
  if (!url) {
    return (
      <TripRow>
        <View style={style.authoritySection}>
          <ThemeText typography="body__s" type="secondary">
            {t(TripDetailsTexts.trip.leg.buyTicketFrom) + ' ' + name}
          </ThemeText>
        </View>
      </TripRow>
    );
  }
  return (
    <TripRow accessible={false}>
      <View style={style.authoritySection}>
        <ThemeText typography="body__s" type="secondary" accessible={false}>
          {t(TripDetailsTexts.trip.leg.buyTicketFrom)}
        </ThemeText>
        <Button
          accessibilityRole="link"
          accessibilityLabel={t(
            TripDetailsTexts.trip.leg.buyTicketFromA11yLabel(name),
          )}
          leftIcon={{svg: ExternalLink}}
          onPress={() => url && openUrl(url)}
          mode="primary"
          type="small"
          expanded={false}
          interactiveColor={interactiveColor}
          text={name}
        />
      </View>
    </TripRow>
  );
};

type InterchangeSectionProps = {
  publicCode: string;
  interchangeDetails: InterchangeDetails;
  maximumWaitTime?: number;
  staySeated?: boolean;
};

function InterchangeSection({
  publicCode,
  interchangeDetails,
  maximumWaitTime,
  staySeated,
}: InterchangeSectionProps) {
  const {t, language} = useTranslation();
  const style = useSectionStyles();
  const legColor = useTransportColor().secondary;

  let text = '';
  if (publicCode && staySeated) {
    text = t(
      TripDetailsTexts.messages.lineChangeStaySeated(
        publicCode,
        interchangeDetails.publicCode,
      ),
    );
  } else if (publicCode) {
    text = t(
      TripDetailsTexts.messages.interchange(
        publicCode,
        interchangeDetails.publicCode,
        interchangeDetails.fromPlace,
      ),
    );
  } else {
    text = t(
      TripDetailsTexts.messages.interchangeWithUnknownFromPublicCode(
        interchangeDetails.publicCode,
        interchangeDetails.fromPlace,
      ),
    );
  }

  // If maximum wait time is defined or over 0, append it to the message.
  // In some cases with missing data the maximum wait time can be -1.
  if (maximumWaitTime && maximumWaitTime > 0 && !staySeated) {
    text =
      text +
      ' ' +
      t(
        TripDetailsTexts.messages.interchangeMaxWait(
          secondsToDuration(maximumWaitTime, language),
        ),
      );
  }

  return (
    <View style={style.interchangeSection}>
      <TripLegDecoration
        color={legColor.background}
        hasStart={false}
        hasEnd={false}
      />
      <TripRow>
        <MessageInfoBox type="info" message={text} />
      </TripRow>
    </View>
  );
}

export function getPlaceName(place: Place): string {
  const fallback = place.name ?? '';
  return place.quay ? (getQuayName(place.quay) ?? fallback) : fallback;
}

export function mapLegToTimeValues(leg: Leg) {
  return {
    startTimes: {
      expectedTime: leg.expectedStartTime,
      aimedTime: leg.aimedStartTime,
      isRealtime: leg.realtime,
    },
    endTimes: {
      expectedTime: leg.expectedEndTime,
      aimedTime: leg.aimedEndTime,
      isRealtime: leg.realtime,
    },
  };
}

function getStartPlaceA11yLabel(
  placeName: string,
  values: TimeValues,
  timesAreApproximations: boolean,
  language: Language,
  t: TranslateFunction,
): string {
  const timeType = getRealtimeState(values);
  const time = formatToClock(
    values.expectedTime ?? values.aimedTime,
    language,
    'floor',
  );
  const aimedTime = formatToClock(values.aimedTime, language, 'floor');

  switch (timeType) {
    case 'no-realtime':
      return t(
        TripDetailsTexts.trip.leg.start.a11yLabel.noRealTime(
          placeName,
          aimedTime,
          timesAreApproximations,
        ),
      );
    case 'no-significant-difference':
      return t(
        TripDetailsTexts.trip.leg.start.a11yLabel.singularTime(placeName, time),
      );
    case 'significant-difference':
      return t(
        TripDetailsTexts.trip.leg.start.a11yLabel.realAndAimed(
          placeName,
          time,
          aimedTime,
          timesAreApproximations,
        ),
      );
  }
}

const useSectionStyles = StyleSheet.createThemeHook((theme) => ({
  tripSection: {
    flex: 1,
    marginBottom: theme.spacing.large,
  },
  transportLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.small,
  },
  onDemandTransportLabel: {
    paddingTop: theme.spacing.xSmall,
  },
  secondaryTransportLabel: {
    paddingTop: theme.spacing.xSmall,
  },
  flexBookingOptions: {
    paddingVertical: theme.spacing.medium / 2,
  },
  intermediateStopRow: {
    minHeight: 60,
  },
  realtime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  realtimeIcon: {
    marginRight: theme.spacing.xSmall,
  },
  realtimeText: {
    flex: 1,
  },
  authoritySection: {
    rowGap: theme.spacing.medium,
  },
  interchangeSection: {
    marginBottom: theme.spacing.large,
  },
  intermediateStop: {
    flex: 1,
  },
}));
