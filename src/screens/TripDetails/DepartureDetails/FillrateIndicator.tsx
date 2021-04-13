import React from 'react';
import {View, ViewProps} from 'react-native';
import ThemeIcon from '@atb/components/theme-icon';
import TripRow from '@atb/screens/TripDetails/components/TripRow';
import {Fillrate, WalkingPerson} from '@atb/assets/svg/icons/transportation';
import {StyleSheet, useTheme} from '@atb/theme';

type FillrateProps = {
  rate: 'max' | 'med' | 'min' | 'unknown';
} & ViewProps;

const FillrateIndicator: React.FC<FillrateProps> = ({
  rate = 'unknown',
  ...props
}) => {
  const styles = useStyle();
  const {theme} = useTheme();

  const cMax = theme.status.error.main.backgroundColor.toString();
  const cMed = theme.status.info.main.backgroundColor.toString();
  const cMin = theme.status.valid.main.backgroundColor.toString();
  const cOff = '#bbb';

  let iconColors: string[] = [cMin, cMed, cMax];
  if (rate === 'max') {
    iconColors = [cMax, cMax, cMax];
  }
  if (rate === 'med') {
    iconColors = [cOff, cMed, cMed];
  }
  if (rate === 'min') {
    iconColors = [cOff, cOff, cMin];
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-end',
      }}
    >
      <Fillrate fillColor={iconColors[0]} style={styles.icon} />
      <Fillrate fillColor={iconColors[1]} style={styles.icon} />
      <Fillrate fillColor={iconColors[2]} style={styles.icon} />
    </View>
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => ({
  icon: {
    marginLeft: -10,
  },
}));

export default FillrateIndicator;
