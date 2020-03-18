import React from 'react';
import {View, Text, ViewStyle} from 'react-native';
import colors from '../../../theme/colors';
import {StyleSheet} from '../../../theme';
import {TripPattern, Leg} from '../../../sdk';
import {secondsToDuration, formatToClock} from '../../../utils/date';
import nb from 'date-fns/locale/nb';
import Dash from 'react-native-dash';
import WalkingPerson from '../../../assets/svg/WalkingPerson';

type ResultItemProps = {
  tripPattern: TripPattern;
};

const ResultItem: React.FC<ResultItemProps> = ({tripPattern}) => {
  const styles = useThemeStyles();
  console.log(tripPattern);
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
        <View style={{flexDirection: 'row', paddingVertical: 4}}>
          <WalkingPerson fill={styles.walkingPerson.backgroundColor} />
          <Text style={{fontSize: 16}}>
            Gå i {secondsToDuration(tripPattern.legs[0].duration ?? 0, nb)}
          </Text>
        </View>
        <DetailDash count={2} />
      </View>
      <Text style={styles.stopName}>{tripPattern.legs[1].fromPlace.name}</Text>
      <Text style={styles.time}>
        {formatToClock(tripPattern.legs[1].aimedStartTime)}
      </Text>
      <Text style={styles.lineName}>
        {getLineDisplayName(tripPattern.legs[1])}
      </Text>
      <View
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 12,
          height: 88,
        }}
      >
        <DetailDash count={4} />
        {/* <Text style={{fontSize: 16}}>1 bytte</Text> */}
        <View style={{paddingVertical: 4}}>
          <Text style={{fontSize: 12}}>Vis detaljer</Text>
        </View>
        <DetailDash count={2} />
      </View>
    </View>
  );
};

const DetailDash = ({count}: {count?: number}) => (
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
    leg.intermediateEstimatedCalls[0]?.destinationDisplay?.frontText ??
    leg.line?.name;
  return leg.line?.publicCode + ' ' + name;
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
  },
}));

export default ResultItem;
