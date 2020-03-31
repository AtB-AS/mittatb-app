import nb from 'date-fns/locale/nb';
import React from 'react';
import {Text, View, ViewStyle} from 'react-native';
import Dash from 'react-native-dash';
import WalkingPerson from '../../assets/svg/WalkingPerson';
import {Leg, LegMode, TripPattern} from '../../sdk';
import {StyleSheet} from '../../theme';
import colors from '../../theme/colors';
import {formatToClock, secondsToDuration} from '../../utils/date';
import JourneyBusIcon from './svg/JourneyBusIcon';
import JourneyTrainIcon from './svg/JourneyTrainIcon';
import JourneyTramIcon from './svg/JourneyTramIcon';
import {TouchableOpacity} from 'react-native-gesture-handler';

type ResultItemProps = {
  tripPattern: TripPattern;
  onDetailsPressed?(tripPattern: TripPattern): void;
};

const ResultItem: React.FC<ResultItemProps> = ({
  tripPattern,
  onDetailsPressed,
}) => {
  const styles = useThemeStyles();

  if (!tripPattern?.legs?.length) return null;

  let [firstLeg, secondLeg, ...restLegs] = tripPattern.legs;
  const transferCount = restLegs.filter(
    l => l.mode !== 'foot' && l.mode !== 'bicycle',
  ).length;

  const firstLegIsOnFoot = firstLeg && firstLeg.mode === 'foot';
  const hasSecondLeg = !!secondLeg;

  return (
    <View style={styles.legContainer}>
      <DetailDash count={2} />
      {firstLegIsOnFoot && hasSecondLeg ? (
        <FootLeg leg={firstLeg} />
      ) : (
        <DetailDash count={2} />
      )}
      <DetailDash count={2} style={{marginBottom: 12}} />

      <HighlightedLeg
        leg={firstLegIsOnFoot && hasSecondLeg ? secondLeg : firstLeg}
      />

      <View style={styles.detailsContainer}>
        {transferCount ? (
          <>
            <DetailDash count={2} />
            <Text style={styles.transferText}>
              {transferCount} bytte{transferCount > 1 ? 'r' : ''}
            </Text>
          </>
        ) : (
          <DetailDash count={4} />
        )}
        {onDetailsPressed && (
          <TouchableOpacity
            style={{paddingVertical: 4}}
            onPress={() => onDetailsPressed(tripPattern)}
            hitSlop={{bottom: 8, top: 8, right: 16, left: 16}}
          >
            <Text style={styles.detailsText}>Vis detaljer</Text>
          </TouchableOpacity>
        )}
        <DetailDash count={2} />
      </View>
    </View>
  );
};

const useThemeStyles = StyleSheet.createThemeHook(theme => ({
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
  detailsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 12,
    height: 88,
  },
  transferText: {fontSize: 16},
  detailsText: {fontSize: 12, textDecorationLine: 'underline'},
}));

const FootLeg = ({leg}: {leg: Leg}) => {
  const styles = useFootLegStyles();
  return (
    <View style={styles.legContainer}>
      <WalkingPerson fill={styles.walkingPerson.backgroundColor} />
      <Text style={{fontSize: 16}}>
        Gå i {secondsToDuration(leg.duration ?? 0, nb)}
      </Text>
    </View>
  );
};

const useFootLegStyles = StyleSheet.createThemeHook(theme => ({
  legContainer: {flexDirection: 'row', paddingVertical: 4},
  walkingPerson: {
    backgroundColor: theme.text.primary,
  },
}));

const HighlightedLeg = ({leg}: {leg: Leg}) => {
  const styles = useHighlighetedLegStyles();
  if (leg.mode === 'foot') {
    return (
      <>
        <DetailDash count={2} />
        <Text style={styles.time}>
          Gå i {secondsToDuration(leg.duration ?? 0, nb)}
        </Text>
        <DetailDash count={2} />
      </>
    );
  } else {
    return (
      <>
        <Text style={styles.stopName}>
          {leg?.fromEstimatedCall?.quay?.name}
        </Text>
        <Text style={styles.time}>{formatToClock(leg?.aimedStartTime)}</Text>
        <View style={styles.lineContainer}>
          <LegModeIcon mode={leg.mode} />
          <Text style={styles.lineName}>{getLineDisplayName(leg)}</Text>
        </View>
      </>
    );
  }
};

const useHighlighetedLegStyles = StyleSheet.createThemeHook(theme => ({
  stopName: {
    fontSize: 16,
    color: theme.text.primary,
    flexShrink: 1,
  },
  lineContainer: {flexDirection: 'row', alignItems: 'center'},
  time: {fontSize: 32, color: theme.text.primary, marginVertical: 8},
  lineName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text.primary,
    textAlign: 'center',
    marginLeft: 8,
  },
}));

const DetailDash = ({count, style}: {count: number; style?: ViewStyle}) => (
  <Dash
    dashCount={count}
    dashGap={3}
    dashThickness={8}
    dashLength={8}
    dashColor={colors.general.gray}
    style={[dashStyles.dash, style]}
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

export default ResultItem;
