import React from 'react';
import {View, ViewStyle} from 'react-native';
import Dash from 'react-native-dash';
import {useTheme} from '../../../theme';
import colors from '../../../theme/colors';

const ValidityLine: React.FC<{
  isValid: boolean;
  nowSeconds: number;
  validFrom: number;
  validTo: number;
}> = ({isValid, nowSeconds, validFrom, validTo}) => {
  const {theme} = useTheme();
  const container: ViewStyle = {
    marginVertical: theme.spacings.medium,
    marginHorizontal: -theme.spacings.medium,
    flexDirection: 'row',
  };

  if (isValid) {
    const durationSeconds = validTo - validFrom;
    const timeLeftSeconds = validTo - nowSeconds;
    const validityPercent = Math.ceil(
      (timeLeftSeconds / durationSeconds) * 100,
    );

    return (
      <View style={container}>
        <Dash
          style={{width: `${validityPercent}%`}}
          dashGap={0}
          dashLength={1}
          dashThickness={8}
          dashColor={colors.primary.green_500}
        />
        <Dash
          style={{width: `${100 - validityPercent}%`}}
          dashGap={0}
          dashLength={1}
          dashThickness={8}
          dashColor={colors.primary.gray_500}
        />
      </View>
    );
  } else {
    return (
      <View style={container}>
        <Dash
          style={{width: '100%'}}
          dashGap={0}
          dashLength={1}
          dashThickness={1}
          dashColor={theme.background.level1}
        />
      </View>
    );
  }
};

export default ValidityLine;
