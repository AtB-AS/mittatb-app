import React from 'react';
import {Leg, Place} from '../../../sdk';
import {View} from 'react-native';
import ThemeText from '../../../components/text';
import {StyleSheet} from '../../../theme';
import {formatToClock, secondsToDuration} from '../../../utils/date';
import {
  getLineName,
  getQuayName,
  getTranslatedModeName,
} from '../../../utils/transportation-names';
import TransportationIcon from '../../../components/transportation-icon';
import {transportationMapLineColor} from '../../../utils/transportation-color';
import {useNavigation} from '@react-navigation/core';
import {DetailScreenNavigationProp} from '../Details';
import {TinyMessageBox} from '../../../message-box';
import {Warning, Info} from '../../../assets/svg/situations';
import SituationMessages from '../../../situations';
import Time from './Time';
import TripLegDecoration from './TripLegDecoration';
import {significantWaitTime, significantWalkTime} from '../Details/utils';
import TripRow from './TripRow';
import WaitSection, {WaitDetails} from './WaitSection';
import {
  TranslatedString,
  TripDetailsTexts,
  useTranslation,
} from '../../../translations';
import AccessibleText, {
  screenReaderPause,
} from '../../../components/accessible-text';
import {getTimeRepresentationType, TimeValues} from '../utils';

type TripSectionProps = {
  isLast?: boolean;
  wait?: WaitDetails;
  isFirst?: boolean;
  step?: number;
} & Leg;

const TripSection: React.FC<TripSectionProps> = ({
  isLast,
  isFirst,
  wait,
  step,
  ...leg
}) => {
  const {t} = useTranslation();
  const style = useSectionStyles();
  const isWalkSection = leg.mode === 'foot';
  const legColor = transportationMapLineColor(leg.mode, leg.line?.publicCode);
  const showFrom = !isWalkSection || !!(isFirst && isWalkSection);
  const showTo = !isWalkSection || !!(isLast && isWalkSection);

  const {startTimes, endTimes} = mapLegToTimeValues(leg);

  const sectionOutput = (
    <>
      <View style={style.tripSection}>
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
            accessibilityLabel={t(
              getStopRowA11yTranslated(
                'start',
                getPlaceName(leg.fromPlace),
                startTimes,
              ),
            )}
            rowLabel={<Time {...startTimes} />}
          >
            <ThemeText>{getPlaceName(leg.fromPlace)}</ThemeText>
          </TripRow>
        )}
        {isWalkSection ? <WalkSection {...leg} /> : <LineSection {...leg} />}
        {!!leg.situations.length && (
          <TripRow rowLabel={<Warning />}>
            <SituationMessages mode="no-icon" situations={leg.situations} />
          </TripRow>
        )}
        {leg.notices &&
          leg.notices.map((notice) => {
            return (
              <TripRow rowLabel={<Info />}>
                <TinyMessageBox
                  type="info"
                  message={notice.text}
                ></TinyMessageBox>
              </TripRow>
            );
          })}
        {showTo && (
          <TripRow
            alignChildren="flex-end"
            accessibilityLabel={t(
              getStopRowA11yTranslated(
                'end',
                getPlaceName(leg.toPlace),
                endTimes,
              ),
            )}
            rowLabel={<Time {...endTimes} />}
          >
            <ThemeText>{getPlaceName(leg.toPlace)}</ThemeText>
          </TripRow>
        )}
      </View>
    </>
  );
  return (
    <>
      {sectionOutput}
      {wait?.waitAfter && significantWaitTime(wait.waitSeconds) && (
        <WaitSection {...wait} />
      )}
    </>
  );
};
const LineSection: React.FC<TripSectionProps> = (leg) => {
  const {t} = useTranslation();
  const style = useSectionStyles();

  const navigation = useNavigation<DetailScreenNavigationProp>();
  const navigateToDetails = () =>
    navigation.navigate('DepartureDetails', {
      title: getLineName(leg),
      serviceJourneyId: leg.serviceJourney.id,
      date: leg.expectedStartTime,
      fromQuayId: leg.fromPlace.quay?.id,
      toQuayId: leg.toPlace.quay?.id,
      isBack: true,
    });

  const numberOfIntermediateCalls = leg.intermediateEstimatedCalls.length;
  return (
    <>
      <TripRow
        accessibilityLabel={t(
          TripDetailsTexts.trip.leg.transport.a11ylabel(
            t(getTranslatedModeName(leg.line?.transportMode)),
            getLineName(leg),
          ),
        )}
        rowLabel={
          <TransportationIcon
            mode={leg.mode}
            publicCode={leg.line?.publicCode}
          />
        }
      >
        <ThemeText style={style.legLineName}>{getLineName(leg)}</ThemeText>
      </TripRow>
      {numberOfIntermediateCalls > 0 && (
        <TripRow
          onPress={navigateToDetails}
          accessibilityLabel={
            t(
              TripDetailsTexts.trip.leg.intermediateStops.a11yLabel(
                numberOfIntermediateCalls,
                secondsToDuration(leg.duration),
              ),
            ) + screenReaderPause
          }
          accessibilityHint={t(
            TripDetailsTexts.trip.leg.intermediateStops.a11yHint,
          )}
        >
          <ThemeText type="lead" color="faded">
            {t(
              TripDetailsTexts.trip.leg.intermediateStops.label(
                numberOfIntermediateCalls,
                secondsToDuration(leg.duration),
              ),
            )}
          </ThemeText>
        </TripRow>
      )}
    </>
  );
};
const WalkSection: React.FC<TripSectionProps> = (leg) => {
  const {t} = useTranslation();
  const isWalkTimeOfSignificance = significantWalkTime(leg.duration);
  if (!isWalkTimeOfSignificance) {
    return null;
  }
  return (
    <TripRow
      rowLabel={
        <TransportationIcon mode={leg.mode} publicCode={leg.line?.publicCode} />
      }
    >
      <ThemeText type="lead" color="faded">
        {t(
          TripDetailsTexts.trip.leg.walk.label(
            secondsToDuration(leg.duration ?? 0),
          ),
        )}
      </ThemeText>
    </TripRow>
  );
};

function getPlaceName(place: Place): string {
  const fallback = place.name ?? '';
  return place.quay ? getQuayName(place.quay) ?? fallback : fallback;
}
export function mapLegToTimeValues(leg: Leg) {
  return {
    startTimes: {
      expectedTime: leg.expectedStartTime,
      aimedTime: leg.aimedStartTime,
      missingRealTime: !leg.realtime,
    },
    endTimes: {
      expectedTime: leg.expectedEndTime,
      aimedTime: leg.aimedEndTime,
      missingRealTime: !leg.realtime,
    },
  };
}
function getStopRowA11yTranslated(
  key: 'start' | 'end',
  placeName: string,
  values: TimeValues,
): TranslatedString {
  const timeType = getTimeRepresentationType(values);
  const a11yLabels = TripDetailsTexts.trip.leg[key].a11yLabel;
  const time = formatToClock(values.expectedTime ?? values.aimedTime);
  switch (timeType) {
    case 'no-realtime':
      return a11yLabels.noRealTime(placeName, time);
    case 'no-significant-difference':
      return a11yLabels.singularTime(placeName, time);
    case 'significant-difference':
      const aimed = formatToClock(values.aimedTime);
      return a11yLabels.realAndAimed(placeName, time, aimed);
  }
}

const useSectionStyles = StyleSheet.createThemeHook((theme) => ({
  tripSection: {
    flex: 1,
    marginVertical: theme.spacings.medium,
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
