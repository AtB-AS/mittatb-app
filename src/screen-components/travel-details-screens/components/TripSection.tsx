import {Leg, Place, Quay} from '@atb/api/types/trips';
import {screenReaderPause, ThemeText} from '@atb/components/text';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {ThemeIcon} from '@atb/components/theme-icon';
import {TransportationIconBox} from '@atb/components/icon-box';
import {ServiceJourneyDeparture} from '../types';
import {SituationMessageBox} from '@atb/modules/situations';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {TripDetailsTexts, useTranslation} from '@atb/translations';
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
import {DimensionOverrides, TripRow} from './TripRow';
import {BookingInfoBox} from './BookingInfoBox';

const NEW_DIMENSIONS: DimensionOverrides = {
  labelWidth: 64,
  decorationContainerWidth: 42,
};

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
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {CancelledDepartureMessage} from './CancelledDepartureMessage';
import {WalkFill} from '@atb/assets/svg/mono-icons/transportation';

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

  const hasIntermediateStops = leg.intermediateEstimatedCalls.length > 0;
  const walkBikeRounding = isFirst ? 'floor' : 'ceil';
  const walkA11yLabel = useWalkA11yLabel(leg, wait, walkBikeRounding);
  const bikeA11yLabel = useBikeA11yLabel(leg, wait, walkBikeRounding);
  const isWalkOrBike = isWalkSection || isBikeSection;

  const warningCount =
    leg.situations.length +
    (leg.transportSubmode === TransportSubmode.RailReplacementBus ? 1 : 0);
  const errorCount = leg.fromEstimatedCall?.cancellation ? 1 : 0;
  const noticeCount = notices.length;

  const transportA11yLabel = (() => {
    const parts: string[] = [
      t(
        TripDetailsTexts.trip.leg.transport.a11yLabel.base(
          formatToClock(leg.expectedStartTime, language, 'floor'),
          t(getTranslatedModeName(leg.mode, leg.line?.transportSubmode)),
          getLineName(t, leg),
          getPlaceName(leg.fromPlace),
          getPlaceName(leg.toPlace),
        ),
      ),
    ];

    if (hasIntermediateStops) {
      parts.push(
        t(
          TripDetailsTexts.trip.leg.transport.a11yLabel.intermediateStops(
            leg.intermediateEstimatedCalls.length,
          ),
        ),
      );
    }

    parts.push(
      t(
        TripDetailsTexts.trip.leg.transport.a11yLabel.arrival(
          getPlaceName(leg.toPlace),
          formatToClock(leg.expectedEndTime, language, 'ceil'),
        ),
      ),
    );

    if (noticeCount > 0) {
      parts.push(
        t(TripDetailsTexts.trip.leg.transport.a11yLabel.notices(noticeCount)),
      );
    }
    if (warningCount > 0) {
      parts.push(
        t(TripDetailsTexts.trip.leg.transport.a11yLabel.warnings(warningCount)),
      );
    }
    if (errorCount > 0) {
      parts.push(
        t(TripDetailsTexts.trip.leg.transport.a11yLabel.errors(errorCount)),
      );
    }

    return parts.join('. ') + '.';
  })();

  const fromRowAbsorbsLegA11y = isWalkOrBike && showFrom;

  const sectionOutput = (
    <>
      <View style={style.tripSection} testID={testID}>
        <TripLegDecoration
          dimensionOverrides={NEW_DIMENSIONS}
          color={legColor}
          hasStart={showFrom}
          hasEnd={showTo}
        />
        {showFrom && (
          <TripRow
            dimensionOverrides={NEW_DIMENSIONS}
            alignChildren="flex-start"
            accessibilityLabel={
              fromRowAbsorbsLegA11y
                ? isWalkSection
                  ? walkA11yLabel
                  : bikeA11yLabel
                : transportA11yLabel
            }
            accessibilityHint={
              isWalkOrBike
                ? undefined
                : t(
                    TripDetailsTexts.trip.leg.transport.a11yLabel.hint(
                      getPlaceName(leg.fromPlace),
                    ),
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
            <WalkSection
              leg={leg}
              wait={wait}
              timeRounding={walkBikeRounding}
            />
          </View>
        ) : isBikeSection ? (
          <View
            accessibilityElementsHidden={fromRowAbsorbsLegA11y}
            importantForAccessibility={
              fromRowAbsorbsLegA11y ? 'no-hide-descendants' : 'auto'
            }
          >
            <BikeSection
              leg={leg}
              wait={wait}
              timeRounding={walkBikeRounding}
            />
          </View>
        ) : (
          <TripRow
            dimensionOverrides={NEW_DIMENSIONS}
            testID={`${testID}Mode`}
            accessibilityLabel={
              t(
                TripDetailsTexts.trip.leg.transport.lineA11yLabel(
                  t(
                    getTranslatedModeName(leg.mode, leg.line?.transportSubmode),
                  ),
                  getLineName(t, leg),
                ),
              ) +
              (isFlexible
                ? screenReaderPause +
                  t(TripDetailsTexts.flexibleTransport.onDemandTransportLabel)
                : '') +
              (realtimeText ? screenReaderPause + realtimeText : '')
            }
            accessibilityHint={
              hasIntermediateStops
                ? t(TripDetailsTexts.trip.leg.transport.a11yHint)
                : undefined
            }
            onPress={
              hasIntermediateStops ? () => handleDeparturePress(leg) : undefined
            }
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
                spacious
                rounded
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
          <TripRow dimensionOverrides={NEW_DIMENSIONS}>
            <CancelledDepartureMessage />
          </TripRow>
        )}
        {leg.situations.map((situation) => (
          <TripRow dimensionOverrides={NEW_DIMENSIONS} key={situation.id}>
            <SituationMessageBox situation={situation} />
          </TripRow>
        ))}
        {notices.map((notice) => (
          <TripRow dimensionOverrides={NEW_DIMENSIONS} key={notice.id}>
            <MessageInfoBox type="info" message={notice.text} />
          </TripRow>
        ))}
        {bookingStatus !== 'none' && (
          <TripRow dimensionOverrides={NEW_DIMENSIONS} accessible={false}>
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
            <TripRow dimensionOverrides={NEW_DIMENSIONS} accessible={false}>
              <BookingOptions bookingArrangements={leg.bookingArrangements} />
            </TripRow>
          </View>
        )}

        {leg.transportSubmode === TransportSubmode.RailReplacementBus && (
          <TripRow dimensionOverrides={NEW_DIMENSIONS}>
            <MessageInfoBox
              type="warning"
              message={t(
                TripDetailsTexts.messages.departureIsRailReplacementBus,
              )}
            />
          </TripRow>
        )}
        {leg.authority && <AuthorityRow {...leg.authority} />}
        {realtimeText && (
          <View
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          >
            <TripRow dimensionOverrides={NEW_DIMENSIONS}>
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
          </View>
        )}
        {onPressShowLive && serviceJourneyPolyline ? (
          <TripRow dimensionOverrides={NEW_DIMENSIONS}>
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
        {hasIntermediateStops && <IntermediateInfo leg={leg} testID={testID} />}
        {showTo && (
          <TripRow
            dimensionOverrides={NEW_DIMENSIONS}
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
      <TripRow
        dimensionOverrides={NEW_DIMENSIONS}
        testID={`${testID}IntermediateStops`}
        accessible={true}
      >
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
        leg.intermediateEstimatedCalls.map((call) => {
          return (
            <View key={call.stopPositionInPattern} style={style.intermediateStop}>
              <TripLegDecoration
                dimensionOverrides={NEW_DIMENSIONS}
                color={legColor}
                hasCenter
              />
              <TripRow
                dimensionOverrides={NEW_DIMENSIONS}
                alignChildren="center"
                style={style.intermediateStopRow}
                rowLabel={
                  <Time
                      timeValues={{
                        aimedTime: call.aimedDepartureTime,
                        expectedTime: call.expectedDepartureTime,
                        isRealtime: call.realtime,
                      }}
                      roundingMethod="floor"
                    />
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
function useWalkA11yLabel(
  leg: Leg,
  wait?: WaitDetails,
  roundingMethod: 'floor' | 'ceil' = 'floor',
): string {
  const {t, language} = useTranslation();
  const isWalkTimeOfSignificance = significantWalkTime(leg.duration);
  const humanizedDistance = useHumanizeDistance(leg.distance);
  const durationText = secondsToDuration(leg.duration ?? 0, language);
  const time = formatToClock(leg.expectedStartTime, language, roundingMethod);
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

function useBikeA11yLabel(
  leg: Leg,
  wait?: WaitDetails,
  roundingMethod: 'floor' | 'ceil' = 'floor',
): string {
  const {t, language} = useTranslation();
  const durationText = secondsToDuration(leg.duration ?? 0, language);
  const time = formatToClock(leg.expectedStartTime, language, roundingMethod);
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
  timeRounding?: 'floor' | 'ceil';
};

const WalkSection = ({leg, wait, timeRounding = 'floor'}: WalkSectionProps) => {
  const {t, language} = useTranslation();
  const style = useSectionStyles();
  const isWalkTimeOfSignificance = significantWalkTime(leg.duration);
  const humanizedDistance = useHumanizeDistance(leg.distance);
  const durationText = secondsToDuration(leg.duration ?? 0, language);
  const a11yLabel = useWalkA11yLabel(leg, wait, timeRounding);

  return (
    <TripRow
      dimensionOverrides={NEW_DIMENSIONS}
      testID="footLeg"
      accessibilityLabel={a11yLabel}
    >
      <View style={style.transportLine}>
        <ThemeIcon
          size="normal"
          svg={WalkFill}
          accessibilityLabel={t(getTranslatedModeName('foot'))}
        />
        <ThemeText typography="body__s" type="secondary">
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
  timeRounding?: 'floor' | 'ceil';
};

const BikeSection = ({leg, wait, timeRounding = 'floor'}: BikeSectionProps) => {
  const {t, language} = useTranslation();
  const style = useSectionStyles();
  const durationText = secondsToDuration(leg.duration ?? 0, language);
  const humanizedDistance = useHumanizeDistance(leg.distance);
  const a11yLabel = useBikeA11yLabel(leg, wait, timeRounding);

  return (
    <TripRow
      dimensionOverrides={NEW_DIMENSIONS}
      testID="bikeLeg"
      accessibilityLabel={a11yLabel}
    >
      <View style={style.transportLine}>
        <TransportationIconBox
          mode={leg.mode}
          subMode={leg.line?.transportSubmode}
          spacious
          rounded
        />
        <ThemeText typography="body__s" type="secondary">
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
      <TripRow dimensionOverrides={NEW_DIMENSIONS}>
        <View style={style.authoritySection}>
          <ThemeText typography="body__s" type="secondary">
            {t(TripDetailsTexts.trip.leg.buyTicketFrom) + ' ' + name}
          </ThemeText>
        </View>
      </TripRow>
    );
  }
  return (
    <TripRow dimensionOverrides={NEW_DIMENSIONS} accessible={false}>
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
        dimensionOverrides={NEW_DIMENSIONS}
        color={legColor.background}
        hasStart={false}
        hasEnd={false}
      />
      <TripRow dimensionOverrides={NEW_DIMENSIONS}>
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

const useSectionStyles = StyleSheet.createThemeHook((theme) => ({
  tripSection: {
    flex: 1,
    marginBottom: theme.spacing.large,
  },
  transportLine: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
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
