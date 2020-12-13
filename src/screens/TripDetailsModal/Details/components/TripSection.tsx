import React from 'react';
import {Leg, Place} from '../../../../sdk';
import {View, ViewProps, TouchableOpacity} from 'react-native';
import ThemeText from '../../../../components/text';
import {StyleSheet} from '../../../../theme';
import {secondsToDuration} from '../../../../utils/date';
import {getLineName, getQuayName} from '../../../../utils/transportation-names';
import TransportationIcon from '../../../../components/transportation-icon';
import {transportationMapLineColor} from '../../../../utils/transportation-color';
import {useNavigation} from '@react-navigation/core';
import {DetailScreenNavigationProp} from '..';
import {TinyMessageBox} from '../../../../message-box';
import {Warning, Info} from '../../../../assets/svg/situations';
import SituationMessages from '../../../../situations';
import Time from './Time';
import TripLegDecoration from './TripLegDecoration';
import {significantWaitTime, significantWalkTime} from '../utils';
import TripRow from './TripRow';
import WaitSection, {WaitDetails} from './WaitSection';

type TripSectionProps = {
  isLast?: boolean;
  wait?: WaitDetails;
  isFirst?: boolean;
} & Leg;

const TripSection: React.FC<TripSectionProps> = ({
  isLast,
  isFirst,
  wait,
  ...leg
}) => {
  const style = useSectionStyles();
  const isWalkSection = leg.mode === 'foot';
  const missingRealTime = !isWalkSection && !leg.realtime;
  const legColor = transportationMapLineColor(leg.mode, leg.line?.publicCode);
  const showFrom = !isWalkSection || !!(isFirst && isWalkSection);
  const showTo = !isWalkSection || !!(isLast && isWalkSection);

  const sectionOutput = (
    <>
      <View style={style.tripSection}>
        <TripLegDecoration
          color={legColor}
          hasStart={showFrom}
          hasEnd={showTo}
        />
        {showFrom && (
          <TripRow
            alignChildren="flex-start"
            rowLabel={
              <Time
                scheduledTime={leg.aimedStartTime}
                expectedTime={leg.expectedStartTime}
                missingRealTime={missingRealTime}
              />
            }
          >
            <PlaceName place={leg.fromPlace} />
          </TripRow>
        )}
        {isWalkSection ? (
          <WalkSection {...leg}></WalkSection>
        ) : (
          <TripRow
            rowLabel={
              <TransportationIcon
                mode={leg.mode}
                publicCode={leg.line?.publicCode}
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
            rowLabel={
              <Time
                scheduledTime={leg.aimedEndTime}
                expectedTime={leg.expectedEndTime}
                missingRealTime={missingRealTime}
              />
            }
          >
            <PlaceName place={leg.toPlace} />
          </TripRow>
        )}
      </View>
      {wait?.waitAfter && significantWaitTime(wait.waitSeconds) && (
        <WaitSection {...wait} />
      )}
    </>
  );
  return (
    <>
      {isWalkSection ? (
        sectionOutput
      ) : (
        <WithFurtherDetails leg={leg}>{sectionOutput}</WithFurtherDetails>
      )}
    </>
  );
};
const WalkSection: React.FC<TripSectionProps> = (leg) => {
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
        Gå i {secondsToDuration(leg.duration ?? 0)}
      </ThemeText>
    </TripRow>
  );
};

const WithFurtherDetails: React.FC<{leg: Leg} & ViewProps> = ({
  leg,
  children,
}) => {
  const navigation = useNavigation<DetailScreenNavigationProp>();
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('DepartureDetails', {
          title: getLineName(leg),
          serviceJourneyId: leg.serviceJourney.id,
          date: leg.expectedStartTime,
          fromQuayId: leg.fromPlace.quay?.id,
          toQuayId: leg.toPlace.quay?.id,
          isBack: true,
        })
      }
    >
      {children}
    </TouchableOpacity>
  );
};
const PlaceName: React.FC<{place: Place}> = ({place}) => {
  return (
    <>
      {place.quay ? (
        <ThemeText>{getQuayName(place.quay)}</ThemeText>
      ) : (
        <ThemeText>{place.name}</ThemeText>
      )}
    </>
  );
};

const useSectionStyles = StyleSheet.createThemeHook((theme) => ({
  tripSection: {
    flex: 1,
    marginVertical: theme.spacings.medium,
  },
  legLineName: {
    fontWeight: 'bold',
  },
}));
export default TripSection;
