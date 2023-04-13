import * as React from 'react';
import {View} from 'react-native';
import {PaymentType} from '@atb/ticketing';
import {MasterCard, Vipps, Visa} from '@atb/assets/svg/color/icons/ticketing';
import {useFontScale} from '@atb/utils/use-font-scale';

export type Brand = {
  icon: PaymentType;
  size?: number;
};

export const PaymentBrand: React.FC<Brand> = ({icon, size = 40}) => {
  const fontScale = useFontScale();
  const BrandLogo =
    icon == PaymentType.Vipps ? (
      <Vipps height="100%" width="100%" />
    ) : icon == PaymentType.Visa ? (
      <Visa height="100%" width="100%" />
    ) : icon == PaymentType.Mastercard ? (
      <MasterCard height="100%" width="100%" />
    ) : null;

  return (
    <View style={{aspectRatio: 1, height: size * fontScale}}>{BrandLogo}</View>
  );
};
