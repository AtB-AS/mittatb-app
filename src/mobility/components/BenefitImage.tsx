import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {View, ViewStyle} from 'react-native';
import {Check} from '@atb/assets/svg/color/icons/status';
import {StyleSheet} from '@atb/theme';
import React from 'react';
import {SvgProps} from 'react-native-svg';
import {
  ThemedBundlingCarSharing,
  ThemedBundlingCityBike,
} from '@atb/theme/ThemedAssets';

type BenefitImageProps = {
  formFactor: FormFactor;
  eligible: boolean;
  style?: ViewStyle;
};

export const BenefitImage = ({
  formFactor,
  eligible,
  style,
}: BenefitImageProps): JSX.Element => {
  return (
    <View style={style}>
      <BenefitImageAsset formFactor={formFactor} />
      {eligible && <BenefitEligibilityIndicator />}
    </View>
  );
};

export const BenefitImageAsset = ({
  formFactor,
  svgProps,
}: {
  formFactor: FormFactor;
  svgProps?: SvgProps;
}) => {
  switch (formFactor) {
    case FormFactor.Car:
      return <ThemedBundlingCarSharing {...svgProps} />;
    case FormFactor.Bicycle:
      return <ThemedBundlingCityBike {...svgProps} />;
    default:
      return null;
  }
};

const BenefitEligibilityIndicator = () => {
  const styles = useStyles();

  return (
    <View style={styles.indicator}>
      <Check width={24} height={24} />
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  indicator: {
    position: 'absolute',
    right: theme.spacings.medium,
  },
}));
