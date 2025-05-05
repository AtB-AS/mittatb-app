import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {View, ViewStyle} from 'react-native';
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
      <BenefitImageAsset formFactor={formFactor} eligible={eligible}/>
    </View>
  );
};

export const BenefitImageAsset = ({
  eligible,
  formFactor,
  svgProps,
}: {
  formFactor: FormFactor;
  eligible?: boolean;
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
        <ThemedBundlingCityBikeActive height={51} width={54.5} {...svgProps} />
      ) : (
        <ThemedCityBike height={54} width={70} {...svgProps} />
      );
    default:
      return null;
  }
};

