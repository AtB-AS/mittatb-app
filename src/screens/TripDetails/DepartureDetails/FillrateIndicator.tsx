import React from 'react';
import {View, ViewProps} from 'react-native';
import ThemeIcon from '@atb/components/theme-icon';
import TripRow from '@atb/screens/TripDetails/components/TripRow';
import {Fillrate, WalkingPerson} from '@atb/assets/svg/icons/transportation';
import {StyleSheet} from '@atb/theme';

type FillrateProps = {
  rate: 'max' | 'med' | 'min' | 'unknown';
} & ViewProps;

const FillrateIndicator: React.FC<FillrateProps> = ({
  rate = 'unknown',
  ...props
}) => {
  const styles = useStyle();
  return (
    <View style={{flexDirection: 'row'}}>
      <ThemeIcon style={styles.icon} svg={Fillrate} />
      <ThemeIcon svg={Fillrate} />
      <ThemeIcon svg={Fillrate} />
    </View>
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => ({
  icon: {
    marginLeft: -10,
  },
}));

export default FillrateIndicator;
