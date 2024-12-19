import * as React from 'react';
import {View} from 'react-native';
import {PaymentType} from '@atb/ticketing';
import {
  Amex,
  MasterCard,
  Vipps,
  Visa,
} from '@atb/assets/svg/color/icons/ticketing';
import {useFontScale} from '@atb/utils/use-font-scale';

export type Brand = {
  paymentType: PaymentType;
  size?: number;
};

export const PaymentBrand: React.FC<Brand> = ({paymentType, size = 40}) => {
  const fontScale = useFontScale();
  return (
    <View style={{aspectRatio: 1, height: size * fontScale}}>
      <Logo paymentType={paymentType} />
    </View>
  );
};

const Logo = ({
  paymentType,
}: {
  paymentType: PaymentType;
}): JSX.Element | null => {
  switch (paymentType) {
    case PaymentType.Visa:
      return <Visa height="100%" width="100%" />;
    case PaymentType.Mastercard:
      return <MasterCard height="100%" width="100%" />;
    case PaymentType.Vipps:
      return <Vipps height="100%" width="100%" />;
    case PaymentType.Amex:
      return <Amex height="100%" width="100%" />;
    default:
      return null;
  }
};
