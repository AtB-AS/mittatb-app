import {Leg, Place, Quay} from '@atb/api/types/trips';
import {Info, Warning} from '@atb/assets/svg/color/icons/status';
import {Phone} from '@atb/assets/svg/mono-icons/devices';
import {Interchange} from '@atb/assets/svg/mono-icons/actions';
import {
  AccessibleText,
  screenReaderPause,
  ThemeText,
} from '@atb/components/text';
import {MessageBox} from '@atb/components/message-box';
import {ThemeIcon} from '@atb/components/theme-icon';
import {TransportationIconBox} from '@atb/components/icon-box';
import {ServiceJourneyDeparture} from '@atb/travel-details-screens/types';
import {SituationMessageBox, SituationOrNoticeIcon} from '@atb/situations';
import {StyleSheet, useTheme} from '@atb/theme';
import {
  Language,
  TranslateFunction,
  TripDetailsTexts,
  useTranslation,
} from '@atb/translations';
import {formatToClock, secondsToDuration} from '@atb/utils/date';
import {
  getQuayName,
  getTranslatedModeName,
} from '@atb/utils/transportation-names';
import {useTransportationColor} from '@atb/utils/use-transportation-color';
import {TransportSubmode} from '@entur/sdk/lib/journeyPlanner/types';
import React from 'react';
import {View, Linking} from 'react-native';
import {
  getBookingRequirementForLeg,
  getLineName,
  getNoticesForLeg,
  getTimeRepresentationType,
  isLegFlexibleTransport,
  significantWaitTime,
  significantWalkTime,
  TimeValues,
} from '../utils';
import {Time} from './Time';
import {TripLegDecoration} from './TripLegDecoration';
import {TripRow} from './TripRow';
import {FlexibleTransportMessageBox} from './FlexibleTransportMessageBox';
import {WaitSection, WaitDetails} from './WaitSection';
import {Realtime as RealtimeDark} from '@atb/assets/svg/color/icons/status/dark';
import {Realtime as RealtimeLight} from '@atb/assets/svg/color/icons/status/light';
import {TripProps} from '@atb/travel-details-screens/components/Trip';
import {Button} from '@atb/components/button';
import {Map} from '@atb/assets/svg/mono-icons/map';
import {ServiceJourneyMapInfoData_v3} from '@atb/api/types/serviceJourney';
import {useMapData} from '@atb/travel-details-screens/use-map-data';
import {useRealtimeText} from '@atb/travel-details-screens/use-realtime-text';
import {useNow} from '@atb/utils/use-now';
import {ExternalLink} from '@atb/assets/svg/mono-icons/navigation';

type TripSectionProps = {
  isLast?: boolean;
  wait?: WaitDetails;
  isFirst?: boolean;
  step?: number;
  interchangeDetails?: InterchangeDetails;
  leg: Leg;
  testID?: string;
  onPressShowLive?(mapData: ServiceJourneyMapInfoData_v3): void;
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
  step,
  interchangeDetails,
  leg,
  testID,
  onPressShowLive,
  onPressDeparture,
  onPressQuay,
}) => {
  const {t, language} = useTranslation();
  const style = useSectionStyles();
  const {themeName} = useTheme();

  const isWalkSection = leg.mode === 'foot';
  const isFlexible = isLegFlexibleTransport(leg);
  const legColor = useTransportationColor(
    isFlexible ? 'flex' : leg.mode,
    leg.line?.transportSubmode,
  );
  const iconColor = useTransportationColor();

  const showFrom = !isWalkSection || !!(isFirst && isWalkSection);
  const showTo = !isWalkSection || !!(isLast && isWalkSection);

  const {startTimes, endTimes} = mapLegToTimeValues(leg);

  const notices = getNoticesForLeg(leg);

  const realtimeText = useRealtimeText(leg.serviceJourneyEstimatedCalls);

  const mapData = useMapData(
    leg.serviceJourney?.id,
    leg.fromPlace.quay?.id,
    leg.toPlace.quay?.id,
  );

  const publicCode =
    leg.fromPlace.quay?.publicCode || leg.line?.publicCode || '';

  const now = useNow(2500);
  const bookingRequirement = getBookingRequirementForLeg(leg, now);

  const atbAuthorityId = 'ATB:Authority:2';
  const legAuthorityIsAtB = leg.authority?.id === atbAuthorityId;

  const bookingArrangements = leg.bookingArrangements;

  const bookingPhone = bookingArrangements?.bookingContact?.phone;
  const bookingUrl = bookingArrangements?.bookingContact?.url;

  const bookingMethods = bookingArrangements?.bookingMethods;
  const showBookOnlineOption =
    bookingUrl && bookingMethods?.some((bm) => bm === 'online');
  const showBookByPhoneOption =
    bookingPhone && bookingMethods?.some((bm) => bm === 'callOffice');

  const sectionOutput = (
    <>
      <View style={style.tripSection} testID={testID}>
        {step && leg.mode && (
          <AccessibleText
            style={style.a11yHelper}
            prefix={t(
              TripDetailsTexts.trip.leg.a11yHelper(
                step,
                t(getTranslatedModeName(leg.mode)),
              ),
            )}
          />
        )}
        <TripLegDecoration
          color={legColor}
          hasStart={showFrom}
          hasEnd={showTo}
        />
        {showFrom && (
          <TripRow
            alignChildren="flex-start"
            accessibilityLabel={getStopRowA11yTranslated(
              'start',
              getPlaceName(leg.fromPlace),
              startTimes,
              language,
              t,
            )}
            rowLabel={
              <Time
                timeValues={startTimes}
                roundingMethod="floor"
                isCirca={isFlexible}
              />
            }
            onPress={() => handleQuayPress(leg.fromPlace.quay)}
            testID="fromPlace"
          >
            <ThemeText testID="fromPlaceName">
              {getPlaceName(leg.fromPlace)}
            </ThemeText>
          </TripRow>
        )}
        {isWalkSection ? (
          <WalkSection {...leg} />
        ) : (
          <TripRow
            testID="transportationLeg"
            accessibilityLabel={t(
              TripDetailsTexts.trip.leg.transport.a11ylabel(
                t(getTranslatedModeName(leg.mode)),
                getLineName(leg),
              ),
            )}
            rowLabel={
              <TransportationIconBox
                mode={isFlexible ? 'flex' : leg.mode}
                subMode={leg.line?.transportSubmode}
              />
            }
          >
            <ThemeText style={style.legLineName}>{getLineName(leg)}</ThemeText>
            {isFlexible && (
              <ThemeText
                color="secondary"
                type="body__secondary"
                style={style.onDemandTransportLabel}
              >
                {t(TripDetailsTexts.trip.leg.onDemandTransportLabel)}
              </ThemeText>
            )}
          </TripRow>
        )}
        {leg.situations.map((situation, i) => (
          <TripRow
            key={i}
            rowLabel={<SituationOrNoticeIcon situation={situation} />}
          >
            <SituationMessageBox noStatusIcon={true} situation={situation} />
          </TripRow>
        ))}
        {notices.map((notice, i) => (
          <TripRow key={i} rowLabel={<ThemeIcon svg={Info} />}>
            <MessageBox noStatusIcon={true} type="info" message={notice.text} />
          </TripRow>
        ))}
        {isFlexible && (
          <TripRow
            rowLabel={
              <ThemeIcon
                svg={
                  bookingRequirement.requiresBookingUrgently ? Warning : Info
                }
              />
            }
          >
            <FlexibleTransportMessageBox
              bookingRequirement={bookingRequirement}
              publicCode={publicCode}
              now={now}
              onPressConfig={
                legAuthorityIsAtB
                  ? {
                      text: t(
                        TripDetailsTexts.trip.leg.needsBookingWhatIsThis(
                          publicCode,
                        ),
                      ),
                      action: () => {
                        //openContactFlexibleTransport(bookingDetails); // TODO: implement this
                      },
                    }
                  : undefined
              }
            />
          </TripRow>
        )}
        {isFlexible && (showBookOnlineOption || showBookByPhoneOption) && (
          <View style={style.flexBookingOptions}>
            <TripRow>
              {showBookOnlineOption && (
                <View style={style.flexBookingOption}>
                  <Button
                    text={t(TripDetailsTexts.trip.leg.bookOnline)}
                    onPress={() => Linking.openURL(bookingUrl)}
                    mode="primary"
                    type="pill"
                    interactiveColor="interactive_0"
                    leftIcon={{svg: ExternalLink}}
                  />
                </View>
              )}
              {showBookByPhoneOption && (
                <View style={style.flexBookingOption}>
                  <Button
                    text={t(
                      TripDetailsTexts.trip.leg.bookByPhone(bookingPhone),
                    )}
                    onPress={() => Linking.openURL(`tel:${bookingPhone}`)}
                    style={style.bookByPhoneButton}
                    type="pill"
                    interactiveColor="interactive_3"
                    leftIcon={{svg: Phone}}
                  />
                </View>
              )}
            </TripRow>
          </View>
        )}

        {leg.transportSubmode === TransportSubmode.RailReplacementBus && (
          <TripRow rowLabel={<ThemeIcon svg={Warning} />}>
            <MessageBox
              type="warning"
              noStatusIcon={true}
              message={t(
                TripDetailsTexts.messages.departureIsRailReplacementBus,
              )}
            />
          </TripRow>
        )}
        {onPressShowLive && mapData ? (
          <TripRow>
            <Button
              type="pill"
              leftIcon={{svg: Map}}
              text={t(TripDetailsTexts.trip.leg.live)}
              interactiveColor="interactive_3"
              onPress={() => onPressShowLive(mapData)}
            />
          </TripRow>
        ) : null}
        {realtimeText && (
          <TripRow>
            <View style={style.realtime}>
              <ThemeIcon
                svg={themeName == 'dark' ? RealtimeDark : RealtimeLight}
                size="small"
                style={style.realtimeIcon}
              />
              <ThemeText
                style={style.realtimeText}
                type="body__secondary"
                color="secondary"
              >
                {realtimeText}
              </ThemeText>
            </View>
          </TripRow>
        )}
        {leg.intermediateEstimatedCalls.length > 0 && (
          <IntermediateInfo leg={leg} onPressDeparture={onPressDeparture} />
        )}
        {showTo && (
          <TripRow
            alignChildren="flex-end"
            accessibilityLabel={getStopRowA11yTranslated(
              'end',
              getPlaceName(leg.toPlace),
              endTimes,
              language,
              t,
            )}
            rowLabel={
              <Time
                timeValues={endTimes}
                roundingMethod="ceil"
                isCirca={isFlexible}
              />
            }
            onPress={() => handleQuayPress(leg.toPlace.quay)}
            testID="toPlace"
          >
            <ThemeText testID="toPlaceName">
              {getPlaceName(leg.toPlace)}
            </ThemeText>
          </TripRow>
        )}
      </View>
      {leg.interchangeTo?.guaranteed && interchangeDetails && leg.line && (
        <View>
          <TripLegDecoration
            color={iconColor}
            hasStart={false}
            hasEnd={false}
          />
          <TripRow rowLabel={<ThemeIcon svg={Interchange} />}>
            <MessageBox
              noStatusIcon={true}
              type="info"
              message={t(
                publicCode
                  ? TripDetailsTexts.messages.interchange(
                      publicCode,
                      interchangeDetails.publicCode,
                      interchangeDetails.fromPlace,
                    )
                  : TripDetailsTexts.messages.interchangeWithUnknownFromPublicCode(
                      interchangeDetails.publicCode,
                      interchangeDetails.fromPlace,
                    ),
              )}
            />
          </TripRow>
        </View>
      )}
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

  async function handleQuayPress(quay: Quay | undefined) {
    const stopPlace = quay?.stopPlace;
    if (!stopPlace) return;

    onPressQuay(stopPlace, quay.id);
  }
};
const IntermediateInfo = ({
  leg,
  onPressDeparture,
}: {
  leg: Leg;
  onPressDeparture: TripProps['onPressDeparture'];
}) => {
  const {t, language} = useTranslation();

  const numberOfIntermediateCalls = leg.intermediateEstimatedCalls.length;

  const navigateToDeparture = () => {
    if (leg.serviceJourney?.id) {
      const departureData: ServiceJourneyDeparture = {
        serviceJourneyId: leg.serviceJourney.id,
        date: leg.expectedStartTime,
        serviceDate: leg.intermediateEstimatedCalls[0].date,
        fromQuayId: leg.fromPlace.quay?.id,
        toQuayId: leg.toPlace.quay?.id,
      };
      onPressDeparture([departureData], 0);
    }
    return null;
  };

  return (
    <TripRow
      testID="intermediateStops"
      onPress={navigateToDeparture}
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
    >
      <ThemeText type="body__secondary" color="secondary">
        {t(
          TripDetailsTexts.trip.leg.intermediateStops.label(
            numberOfIntermediateCalls,
            secondsToDuration(leg.duration, language),
          ),
        )}
      </ThemeText>
    </TripRow>
  );
};
const WalkSection = (leg: Leg) => {
  const {t, language} = useTranslation();
  const isWalkTimeOfSignificance = significantWalkTime(leg.duration);

  return (
    <TripRow
      rowLabel={
        <TransportationIconBox
          mode={leg.mode}
          subMode={leg.line?.transportSubmode}
        />
      }
      testID="footLeg"
    >
      <ThemeText type="body__secondary" color="secondary">
        {isWalkTimeOfSignificance
          ? t(
              TripDetailsTexts.trip.leg.walk.label(
                secondsToDuration(leg.duration ?? 0, language),
              ),
            )
          : t(TripDetailsTexts.trip.leg.shortWalk)}
      </ThemeText>
    </TripRow>
  );
};

export function getPlaceName(place: Place): string {
  const fallback = place.name ?? '';
  return place.quay ? getQuayName(place.quay) ?? fallback : fallback;
}
export function mapLegToTimeValues(leg: Leg) {
  const legIsMissingRealTime = !leg.realtime;
  return {
    startTimes: {
      expectedTime: leg.expectedStartTime,
      aimedTime: leg.aimedStartTime,
      missingRealTime: legIsMissingRealTime,
    },
    endTimes: {
      expectedTime: leg.expectedEndTime,
      aimedTime: leg.aimedEndTime,
      missingRealTime: legIsMissingRealTime,
    },
  };
}
function getStopRowA11yTranslated(
  key: 'start' | 'end',
  placeName: string,
  values: TimeValues,
  language: Language,
  t: TranslateFunction,
): string {
  const timeType = getTimeRepresentationType(values);
  const time = formatToClock(
    values.expectedTime ?? values.aimedTime,
    language,
    'floor',
  );
  const aimedTime = formatToClock(values.aimedTime, language, 'floor');

  switch (timeType) {
    case 'no-realtime':
      return t(
        TripDetailsTexts.trip.leg[key].a11yLabel.noRealTime(
          placeName,
          aimedTime,
        ),
      );
    case 'no-significant-difference':
      return t(
        TripDetailsTexts.trip.leg[key].a11yLabel.singularTime(placeName, time),
      );
    case 'significant-difference':
      return t(
        TripDetailsTexts.trip.leg[key].a11yLabel.realAndAimed(
          placeName,
          time,
          aimedTime,
        ),
      );
  }
}

const useSectionStyles = StyleSheet.createThemeHook((theme) => ({
  tripSection: {
    flex: 1,
    marginBottom: theme.spacings.large,
  },
  a11yHelper: {
    position: 'absolute',
    top: -theme.spacings.medium,
    left: 0,
    width: '100%',
  },
  legLineName: {
    fontWeight: 'bold',
  },
  onDemandTransportLabel: {
    paddingTop: theme.spacings.xSmall,
  },
  flexBookingOptions: {
    paddingVertical: theme.spacings.medium / 2,
  },
  flexBookingOption: {
    paddingVertical: theme.spacings.medium / 2,
  },
  bookByPhoneButton: {
    backgroundColor: theme.interactive.interactive_3.default.background,
  },
  realtime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  realtimeIcon: {
    marginRight: theme.spacings.xSmall,
  },
  realtimeText: {
    flex: 1,
  },
}));
