import React from 'react';
import {View, Text} from 'react-native';

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
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <BusFront />
          <Text style={{fontSize: 12, color: colors.general.white}}>
            {leg.line?.publicCode}
          </Text>
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
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
    }}
  >
    {legs.map((leg, index) => (
      <>
        <LegIcon leg={leg} />
        {index < legs.length - 1 ? <ArrowRight /> : null}
      </>
    ))}
  </View>
);

export default LegIcons;
