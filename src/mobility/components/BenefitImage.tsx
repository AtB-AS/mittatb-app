import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {View, ViewStyle} from 'react-native';
import {Check as CheckDark} from '@atb/assets/svg/color/icons/status/dark';
import {Check as CheckLight} from '@atb/assets/svg/color/icons/status/light';
import {StyleSheet, useThemeContext} from '@atb/theme';
import React from 'react';
import {SvgProps} from 'react-native-svg';
import {
  ThemedBundlingCarSharing,
  ThemedBundlingCarSharingActive,
  ThemedBundlingCityBikeActive,
  ThemedCityBike,
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
      <BenefitImageAsset eligible={eligible} formFactor={formFactor} />
    </View>
  );
};

export const BenefitImageAsset = ({
  eligible,
  formFactor,
  svgProps,
}: {
  eligible: boolean;
  formFactor: FormFactor;
  svgProps?: SvgProps;
}) => {
  switch (formFactor) {
    case FormFactor.Car:
      return eligible ? (
        <ThemedBundlingCarSharingActive height={54} width={70} {...svgProps} />
      ) : (
        <ThemedBundlingCarSharing height={54} width={70} {...svgProps} />
      );
    case FormFactor.Bicycle:
      return eligible ? (
        <ThemedBundlingCityBikeActive height={54} width={70} {...svgProps} />
      ) : (
        <ThemedCityBike height={54} width={70} {...svgProps} />
      );
    default:
      return null;
  }
};

const BenefitEligibilityIndicator = () => {
  const styles = useStyles();
  const {themeName} = useThemeContext();
  const Check = themeName === 'dark' ? CheckDark : CheckLight;

  return (
    <View style={styles.indicator}>
      <Check width={24} height={24} />
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook(() => ({
  indicator: {
    position: 'absolute',
    right: 0,
  },
}));
