import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {
  BundlingCarSharing,
  BundlingCityBike,
} from '@atb/assets/svg/color/images/mobility';
import {View, ViewStyle} from 'react-native';
import {Check} from '@atb/assets/svg/color/icons/status';
import {StyleSheet} from '@atb/theme';
import React from 'react';

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

const BenefitImageAsset = ({formFactor}: {formFactor: FormFactor}) => {
  switch (formFactor) {
    case FormFactor.Car:
      return <BundlingCarSharing />;
    case FormFactor.Bicycle:
      return <BundlingCityBike />;
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
