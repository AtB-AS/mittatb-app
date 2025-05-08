import * as React from 'react';
import {View} from 'react-native';
import {PaymentType} from '@atb/modules/ticketing';
import {
  Amex,
  MasterCard,
  Vipps,
  Visa,
} from '@atb/assets/svg/color/icons/ticketing';
import {useFontScale} from '@atb/utils/use-font-scale';
import {Card} from '@atb/assets/svg/mono-icons/ticketing';
import {ThemeIcon} from '@atb/components/theme-icon';
import {useThemeContext} from '@atb/theme';

type PaymentBrandProps = {
  paymentType: PaymentType | undefined;
  size?: number;
};

export const PaymentBrand: React.FC<PaymentBrandProps> = ({
  paymentType,
  size,
}) => {
  const fontScale = useFontScale();
  const {theme} = useThemeContext();
  return (
    <View
      style={{
        aspectRatio: 1,
        height: size || theme.icon.size.normal * fontScale,
      }}
    >
      <Logo paymentType={paymentType} />
    </View>
  );
};

const Logo = ({
  paymentType,
}: {
  paymentType: PaymentType | undefined;
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
      return <ThemeIcon svg={Card} />;
  }
};
