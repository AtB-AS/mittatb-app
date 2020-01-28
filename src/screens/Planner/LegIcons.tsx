import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

import WalkingPerson from '../../assets/svg/WalkingPerson';
import BusFront from '../../assets/svg/BusFront';
import ArrowRight from '../../assets/svg/ArrowRight';
import TramFront from '../../assets/svg/TramFront';

import colors from '../../assets/colors';
import {Leg} from '../../sdk';

type LegIconProps = {
  leg: Leg;
};

const LegIcon: React.FC<LegIconProps> = ({leg}) => {
  switch (leg.mode) {
    case 'foot':
      return <WalkingPerson />;
    case 'bus':
      return (
        <View style={styles.busIconContainer}>
          <BusFront />
          <Text style={styles.busText}>{leg.line?.publicCode}</Text>
        </View>
      );
    case 'tram':
      return <TramFront />;
    default:
      return <View />;
  }
};

type LegIconsProps = {
  legs: Leg[];
};

const LegIcons: React.FC<LegIconsProps> = ({legs}) => (
  <View style={styles.iconContainer}>
    {legs.map((leg, index) => (
      <React.Fragment key={leg.mode + index}>
        <LegIcon leg={leg} />
        {index < legs.length - 1 ? <ArrowRight style={styles.arrow} /> : null}
      </React.Fragment>
    ))}
  </View>
);

const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  busIconContainer: {flexDirection: 'row', alignItems: 'center'},
  busText: {fontSize: 12, color: colors.general.white, marginLeft: 4.5},
  arrow: {marginHorizontal: 4.5},
});

export default LegIcons;
