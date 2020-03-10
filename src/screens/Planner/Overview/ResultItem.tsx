import React from 'react';
import {View, Text, Animated} from 'react-native';
import nb from 'date-fns/locale/nb';
import colors, {
  Themes,
  themes,
  createExtendedTheme,
} from '../../../theme/colors';
import {StyleSheet, Theme, useTheme} from '../../../theme';
import {TripPattern, Leg} from '../../../sdk';
import {secondsToDuration, formatToClock} from '../../../utils/date';
import LegIcons from '../LegIcons';
import {TouchableHighlight} from 'react-native-gesture-handler';
import {
  StackCardInterpolationProps,
  StackCardInterpolatedStyle,
} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {ResultTabParams} from './Results';
import Dash from 'react-native-dash';

type ResultItemProps = {
  tripPattern: TripPattern;
};

const ResultItem: React.FC<ResultItemProps> = ({tripPattern}) => {
  const styles = useThemeStyles();

  return (
    <View style={styles.legContainer}>
      <Dash
        dashCount={4}
        dashGap={3}
        dashThickness={8}
        dashLength={8}
        dashColor={colors.primary.green}
        style={styles.dash}
        dashStyle={styles.dashItem}
      />
      <Text style={styles.stopName}>{tripPattern.legs[1].fromPlace.name}</Text>
      <Text style={styles.time}>
        {formatToClock(tripPattern.legs[1].aimedStartTime)}
      </Text>
      <Text style={styles.lineName}>
        {getLineDisplayName(tripPattern.legs[1])}
      </Text>
    </View>
  );
};

function getLineDisplayName(leg: Leg) {
  const name =
    leg.intermediateEstimatedCalls[0]?.destinationDisplay?.frontText ??
    leg.line?.name;
  return leg.line?.publicCode + ' ' + name;
}

const useThemeStyles = StyleSheet.createThemeHook(theme => ({
  legContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 50,
    width: '100%',
  },
  dash: {
    height: 50,
    flexDirection: 'column',
  },
  dashItem: {
    borderRadius: 8,
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
