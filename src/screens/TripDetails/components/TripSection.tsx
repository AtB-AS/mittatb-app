import {Info, Warning} from '@atb/assets/svg/situations';
import AccessibleText, {
  screenReaderPause,
} from '@atb/components/accessible-text';
import ThemeText from '@atb/components/text';
import TransportationIcon from '@atb/components/transportation-icon';
import {TinyMessageBox} from '@atb/components/message-box';
import {Leg, Place} from '@atb/sdk';
import SituationMessages from '@atb/situations';
import {StyleSheet} from '@atb/theme';
import {
  Language,
  TranslatedString,
  TranslateFunction,
  TripDetailsTexts,
  useTranslation,
} from '@atb/translations';
import {formatToClock, secondsToDuration} from '@atb/utils/date';
import {useTransportationColor} from '@atb/utils/use-transportation-color';
import {
  getLineName,
  getQuayName,
  getTranslatedModeName,
} from '@atb/utils/transportation-names';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View} from 'react-native';
import {DetailScreenNavigationProp} from '../Details';
import {significantWaitTime, significantWalkTime} from '../Details/utils';
import {getTimeRepresentationType, TimeValues} from '../utils';
import Time from './Time';
import TripLegDecoration from './TripLegDecoration';
import TripRow from './TripRow';
import WaitSection, {WaitDetails} from './WaitSection';

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
  const {t, language} = useTranslation();
  const style = useSectionStyles();

  const isWalkSection = leg.mode === 'foot';
  const legColor = useTransportationColor(leg.mode, leg.line?.transportSubmode);

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
            accessibilityLabel={getStopRowA11yTranslated(
              'start',
              getPlaceName(leg.fromPlace),
              startTimes,
              language,
              t,
            )}
            rowLabel={<Time {...startTimes} />}
          >
            <ThemeText>{getPlaceName(leg.fromPlace)}</ThemeText>
          </TripRow>
        )}
        {isWalkSection ? (
          <WalkSection {...leg} />
        ) : (
          <TripRow
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
          <TripRow rowLabel={<Warning />}>
            <SituationMessages mode="no-icon" situations={leg.situations} />
          </TripRow>
        )}

        {leg.notices &&
          leg.notices.map((notice) => {
            return (
              <TripRow rowLabel={<Info />}>
                <TinyMessageBox type="info" message={notice.text} />
              </TripRow>
            );
          })}
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
const IntermediateInfo: React.FC<TripSectionProps> = (leg) => {
  const {t, language} = useTranslation();

  const navigation = useNavigation<DetailScreenNavigationProp>();
  const navigateToDetails = () =>
    navigation.navigate('DepartureDetails', {
      items: [
        {
          serviceJourneyId: leg.serviceJourney.id,
          date: leg.expectedStartTime,
          fromQuayId: leg.fromPlace.quay?.id,
          toQuayId: leg.toPlace.quay?.id,
        },
      ],
    });

  const numberOfIntermediateCalls = leg.intermediateEstimatedCalls.length;
  return (
    <TripRow
      onPress={navigateToDetails}
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
const WalkSection: React.FC<TripSectionProps> = (leg) => {
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

function getPlaceName(place: Place): string {
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
