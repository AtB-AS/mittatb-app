import React, {useEffect} from 'react';
import {Leg, Place} from '../../../sdk';
import {View, ViewProps, TouchableOpacity} from 'react-native';
import ThemeText from '../../../components/text';
import {StyleSheet} from '../../../theme';
import {formatToClock, secondsToDuration} from '../../../utils/date';
import {WalkingPerson} from '../../../assets/svg/icons/transportation';
import {getLineName} from '../../../utils/transportation-names';
import TransportationIcon from '../../../components/transportation-icon';
import {transportationMapLineColor} from '../../../utils/transportation-color';
import {useNavigation} from '@react-navigation/core';
import {DetailScreenNavigationProp} from '.';
import {TinyMessageBox} from '../../../message-box';
import {Warning, Info} from '../../../assets/svg/situations/';
import SituationMessages from '../../../situations';

type TripSectionProps = {
  isLast?: boolean;
  isIntermediate?: boolean;
  isFirst?: boolean;
} & Leg;

const TripSection: React.FC<TripSectionProps> = ({isLast, isFirst, ...leg}) => {
  const style = useSectionStyles();
  const isWalkSection = leg.mode === 'foot';
  const legColor = transportationMapLineColor(leg.mode, leg.line?.publicCode);

  const isLastWalk = isWalkSection && isLast;
  const isFirstWalk = isWalkSection && isFirst;

  const sectionOutput = (
    <View style={style.tripSection}>
      <TripSectionLine
        color={legColor}
        hasStart={!(isLast && isWalkSection)}
        hasEnd={!(isFirst && isWalkSection)}
      />
      {!isLastWalk && (
        <TripRow
          rowLabel={
            <Time
              scheduledTime={leg.aimedStartTime}
              realTime={leg.expectedStartTime}
            />
          }
        >
          <PlaceName place={leg.fromPlace} />
        </TripRow>
      )}
      {isWalkSection ? (
        <TripRow
          rowLabel={
            <TransportationIcon
              mode={leg.mode}
              publicCode={leg.line?.publicCode}
            />
          }
        >
          <ThemeText type="lead" color="faded">
            Gå i {secondsToDuration(leg.duration ?? 0)}
          </ThemeText>
        </TripRow>
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
      {!isFirstWalk && (
        <TripRow
          alignBottom={true}
          rowLabel={
            <Time
              scheduledTime={leg.aimedEndTime}
              realTime={leg.expectedEndTime}
            />
          }
        >
          <PlaceName place={leg.toPlace} />
        </TripRow>
      )}
    </View>
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
type TimeProps = {
  scheduledTime: string;
  realTime?: string;
};
const Time: React.FC<TimeProps> = ({scheduledTime, realTime}) => {
  const scheduled = formatToClock(scheduledTime);
  const real = realTime ? formatToClock(realTime) : '';
  if (real && real !== scheduled) {
    return (
      <View style={{flexDirection: 'column', alignItems: 'flex-end'}}>
        <ThemeText>{real}</ThemeText>
        <ThemeText
          type="lead"
          color="faded"
          style={{textDecorationLine: 'line-through'}}
        >
          {scheduled}
        </ThemeText>
      </View>
    );
  }
  return <ThemeText>{scheduled}</ThemeText>;
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
      <ThemeText>{place.name}</ThemeText>
      {place.quay && (
        <ThemeText type="lead" color="faded">
          {place.quay.name} {place.quay.publicCode}
        </ThemeText>
      )}
    </>
  );
};
type LineProps = {
  hasStart: boolean;
  hasEnd: boolean;
  color: string;
};
const TripSectionLine: React.FC<LineProps> = ({color, hasStart, hasEnd}) => {
  const style = useSectionStyles();
  const colorStyle = {backgroundColor: color};
  return (
    <View style={[style.decoration, colorStyle]}>
      {hasStart && (
        <View
          style={[style.decorationMarker, style.decorationStart, colorStyle]}
        ></View>
      )}
      {hasEnd && (
        <View
          style={[style.decorationMarker, style.decorationEnd, colorStyle]}
        ></View>
      )}
    </View>
  );
};
type TripRowProps = {
  rowLabel: React.ReactNode;
  alignBottom?: boolean;
} & ViewProps;
const TripRow: React.FC<TripRowProps> = ({rowLabel, children, alignBottom}) => {
  const style = useSectionStyles();
  return (
    <View
      style={[style.tripRow, alignBottom ? style.alignEnd : style.alignStart]}
    >
      <View style={style.rowLeft}>{rowLabel}</View>
      <View style={style.decorationPlaceholder}></View>
      <View style={style.rowRight}>{children}</View>
    </View>
  );
};
const useSectionStyles = StyleSheet.createThemeHook((theme) => ({
  tripSection: {
    flex: 1,
    marginVertical: theme.spacings.medium,
  },
  tripRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: theme.spacings.small,
  },
  rowLeft: {
    width: 80,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  rowRight: {
    flex: 5,
  },
  alignStart: {
    alignItems: 'flex-start',
  },
  alignEnd: {
    alignItems: 'flex-end',
  },
  legLineName: {
    fontWeight: 'bold',
  },
  decorationPlaceholder: {
    width: theme.spacings.large,
  },
  decoration: {
    position: 'absolute',
    height: '100%',
    left: 80 + theme.spacings.large / 2,
    width: 4,
    backgroundColor: theme.background.accent,
  },
  decorationMarker: {
    position: 'absolute',
    width: 12,
    left: -4,
    height: 4,
    backgroundColor: theme.background.accent,
  },
  decorationStart: {
    top: 0,
  },
  decorationEnd: {
    bottom: 0,
  },
}));
export default TripSection;
