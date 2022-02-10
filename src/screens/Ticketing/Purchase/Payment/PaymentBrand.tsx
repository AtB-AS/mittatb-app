import * as React from 'react';
import {View} from 'react-native';
import {PaymentType} from '@atb/tickets';
import MasterCard from '@atb/assets/svg/mono-icons/ticketing/MasterCard';
import Vipps from '@atb/assets/svg/mono-icons/ticketing/Vipps';
import Visa from '@atb/assets/svg/mono-icons/ticketing/Visa';
import useFontScale from '@atb/utils/use-font-scale';

export type Brand = {
  icon: PaymentType;
  size?: number;
  fill?: string;
};

const PaymentBrand: React.FC<Brand> = ({icon, size = 40, fill = 'black'}) => {
  const fontScale = useFontScale();
  const BrandLogo =
    icon == PaymentType.Vipps ? (
      <Vipps height="100%" width="100%" />
    ) : icon == PaymentType.VISA ? (
      <Visa height="100%" width="100%" />
    ) : icon == PaymentType.MasterCard ? (
      <MasterCard height="100%" width="100%" />
    ) : null;

  return (
    <View style={{aspectRatio: 1, height: size * fontScale}}>{BrandLogo}</View>
  );
};

export default PaymentBrand;
