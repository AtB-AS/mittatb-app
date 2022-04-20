import {Warning} from '@atb/assets/svg/color/situations';
import {Interchange} from '@atb/assets/svg/mono-icons/actions';
import AccessibleText, {
  screenReaderPause,
} from '@atb/components/accessible-text';
import ThemeText from '@atb/components/text';
import TransportationIcon from '@atb/components/transportation-icon';
import {TinyMessageBox} from '@atb/components/message-box';
import SituationMessages from '@atb/situations';
import {StyleSheet} from '@atb/theme';
import {
  Language,
  TranslateFunction,
  TripDetailsTexts,
  useTranslation,
} from '@atb/translations';
import {formatToClock, secondsToDuration} from '@atb/utils/date';
import {useTransportationColor} from '@atb/utils/use-transportation-color';
import {
  getQuayName,
  getTranslatedModeName,
} from '@atb/utils/transportation-names';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View} from 'react-native';
import {DetailScreenNavigationProp} from '../Details';
import {
  getLineName,
  significantWaitTime,
  significantWalkTime,
} from '../Details/utils';
import {getTimeRepresentationType, TimeValues} from '../utils';
import Time from './Time';
import TripLegDecoration from './TripLegDecoration';
import TripRow from './TripRow';
import WaitSection, {WaitDetails} from './WaitSection';
import {DetailsModalNavigationProp} from '@atb/screens/TripDetails';
import {searchByStopPlace} from '@atb/geocoder/search-for-location';
import ThemeIcon from '@atb/components/theme-icon/theme-icon';
import {Leg, Place, Quay} from '@atb/api/types/trips';
import {ServiceJourneyDeparture} from '@atb/screens/TripDetails/DepartureDetails/types';

type TripSectionProps = {
  isLast?: boolean;
  wait?: WaitDetails;
  isFirst?: boolean;
  step?: number;
  interchangeDetails?: InterchangeDetails;
  leg: Leg;
  testID?: string;
};

export type InterchangeDetails = {
  publicCode: string;
  fromPlace: string;
};

const TripSection: React.FC<TripSectionProps> = ({
  isLast,
  isFirst,
  wait,
  step,
  interchangeDetails,
  leg,
  testID,
}) => {
  const {t, language} = useTranslation();
  const style = useSectionStyles();

  const isWalkSection = leg.mode === 'foot';
  const legColor = useTransportationColor(leg.mode, leg.line?.transportSubmode);
  const iconColor = useTransportationColor();

  const showFrom = !isWalkSection || !!(isFirst && isWalkSection);
  const showTo = !isWalkSection || !!(isLast && isWalkSection);

  const {startTimes, endTimes} = mapLegToTimeValues(leg);

  const navigation = useNavigation<DetailsModalNavigationProp>();

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
            rowLabel={<Time {...startTimes} />}
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
              <TransportationIcon
                mode={leg.mode}
                subMode={leg.line?.transportSubmode}
              />
            }
          >
            <ThemeText style={style.legLineName}>{getLineName(leg)}</ThemeText>
          </TripRow>
        )}
        {!!leg.situations.length && (
          <TripRow rowLabel={<ThemeIcon svg={Warning} />}>
            <SituationMessages mode="no-icon" situations={leg.situations} />
          </TripRow>
        )}

        {leg.intermediateEstimatedCalls.length > 0 && (
          <IntermediateInfo {...leg} />
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
            rowLabel={<Time {...endTimes} />}
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
            <TinyMessageBox
              type="info"
              message={t(
                leg.line.publicCode
                  ? TripDetailsTexts.messages.interchange(
                      leg.line.publicCode,
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
    const location = await searchByStopPlace(quay?.stopPlace);
    if (!location) {
      return;
    }
    navigation.navigate('QuayDepartures', {
      location,
    });
  }
};
const IntermediateInfo = (leg: Leg) => {
  const {t, language} = useTranslation();
  const navigation = useNavigation<DetailScreenNavigationProp>();

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
      navigation.navigate('DepartureDetails', {items: [departureData]});
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
  if (!isWalkTimeOfSignificance) {
    return null;
  }
  return (
    <TripRow
      rowLabel={
        <TransportationIcon
          mode={leg.mode}
          subMode={leg.line?.transportSubmode}
        />
      }
      testID="footLeg"
    >
      <ThemeText type="body__secondary" color="secondary">
        {t(
          TripDetailsTexts.trip.leg.walk.label(
            secondsToDuration(leg.duration ?? 0, language),
          ),
        )}
      </ThemeText>
    </TripRow>
  );
};

export function getPlaceName(place: Place): string {
  const fallback = place.name ?? '';
  return place.quay ? getQuayName(place.quay) ?? fallback : fallback;
}
export function mapLegToTimeValues(leg: Leg) {
  const legIsMissingRealTime = !leg.realtime && leg.mode !== 'foot';
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
  const time = formatToClock(values.expectedTime ?? values.aimedTime, language);
  const aimedTime = formatToClock(values.aimedTime, language);

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
}));
export default TripSection;
