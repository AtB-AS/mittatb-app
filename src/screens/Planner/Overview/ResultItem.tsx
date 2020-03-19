import React from 'react';
import {View, Text, ViewStyle} from 'react-native';
import colors from '../../../theme/colors';
import {StyleSheet} from '../../../theme';
import {TripPattern, Leg, LegMode} from '../../../sdk';
import {secondsToDuration, formatToClock} from '../../../utils/date';
import nb from 'date-fns/locale/nb';
import Dash from 'react-native-dash';
import WalkingPerson from '../../../assets/svg/WalkingPerson';
import JourneyBusIcon from './svg/JourneyBusIcon';
import JourneyTramIcon from './svg/JourneyTramIcon';
import JourneyTrainIcon from './svg/JourneyTrainIcon';

type ResultItemProps = {
  tripPattern: TripPattern;
};

const ResultItem: React.FC<ResultItemProps> = ({tripPattern}) => {
  const styles = useThemeStyles();

  const [firstLeg, secondLeg, ...restLegs] = tripPattern.legs;
  const transferCount = restLegs.filter(
    l => l.mode !== 'foot' && l.mode !== 'bicycle',
  ).length;

  return (
    <View style={styles.legContainer}>
      <View
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          paddingBottom: 12,
        }}
      >
        <DetailDash count={2} />
        {firstLeg && firstLeg.mode === 'foot' ? (
          <>
            <View style={{flexDirection: 'row', paddingVertical: 4}}>
              <WalkingPerson fill={styles.walkingPerson.backgroundColor} />
              <Text style={{fontSize: 16}}>
                Gå i {secondsToDuration(firstLeg.duration ?? 0, nb)}
              </Text>
            </View>
            <DetailDash count={2} />
          </>
        ) : null}
      </View>
      {secondLeg ? (
        <>
          <Text style={styles.stopName}>{secondLeg?.fromPlace.name}</Text>
          <Text style={styles.time}>
            {formatToClock(secondLeg?.aimedStartTime)}
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <LegModeIcon mode={secondLeg.mode} />
            <Text style={styles.lineName}>{getLineDisplayName(secondLeg)}</Text>
          </View>
        </>
      ) : null}

      <View
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 12,
          height: 88,
        }}
      >
        {transferCount ? (
          <>
            <DetailDash count={2} />
            <Text style={{fontSize: 16}}>
              {transferCount} bytte{transferCount > 1 ? 'r' : ''}
            </Text>
          </>
        ) : (
          <DetailDash count={4} />
        )}
        <View style={{paddingVertical: 4}}>
          <Text style={{fontSize: 12}}>Vis detaljer</Text>
        </View>
        <DetailDash count={2} />
      </View>
    </View>
  );
};

const DetailDash = ({count}: {count: number}) => (
  <Dash
    dashCount={count}
    dashGap={3}
    dashThickness={8}
    dashLength={8}
    dashColor={colors.general.gray}
    style={dashStyles.dash}
    dashStyle={dashStyles.dashItem}
  />
);

const dashStyles = StyleSheet.create({
  dash: {
    flexDirection: 'column',
  },
  dashItem: {
    borderRadius: 8,
  },
});

function getLineDisplayName(leg: Leg) {
  const name =
    leg.fromEstimatedCall?.destinationDisplay?.frontText ?? leg.line?.name;
  return leg.line?.publicCode + ' ' + name;
}

function LegModeIcon({mode}: {mode: LegMode}) {
  switch (mode) {
    case 'bus':
    case 'coach':
      return <JourneyBusIcon pathFill="#fff" />;
    case 'rail':
    case 'metro':
      return <JourneyTrainIcon pathFill="#fff" />;
    case 'tram':
      return <JourneyTramIcon pathFill="#fff" />;
    case 'car':
    case 'water':
    case 'air':
    case 'bicycle':
    default:
      return <JourneyBusIcon pathFill="#fff" />;
  }
}

const useThemeStyles = StyleSheet.createThemeHook(theme => ({
  walkingPerson: {
    backgroundColor: theme.text.primary,
  },
  legContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 50,
    width: '100%',
  },
  stopName: {
    fontSize: 16,
    color: theme.text.primary,
    flexShrink: 1,
  },
  lineContainer: {
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  time: {fontSize: 32, color: theme.text.primary, marginVertical: 8},
  lineName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text.primary,
    textAlign: 'center',
    marginLeft: 8,
  },
}));

export default ResultItem;
