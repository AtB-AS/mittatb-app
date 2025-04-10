import {ThemeText} from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {humanizePaymentType, PaymentType} from '@atb/ticketing';
import {useTranslation} from '@atb/translations';
import React from 'react';
import {PaymentBrand} from './PaymentBrand';
import PaymentMethodsTexts from '@atb/translations/screens/subscreens/PaymentMethods';
import SelectPaymentMethodTexts from '@atb/translations/screens/subscreens/SelectPaymentMethodTexts';
import SvgEdit from '@atb/assets/svg/mono-icons/actions/Edit';
import {View} from 'react-native';
import {PaymentMethod} from '@atb/stacks-hierarchy/types';
import {ThemeIcon} from '@atb/components/theme-icon';

type PaymentSelectionCardProps = {
  paymentMethod: PaymentMethod;
};

export const PaymentSelectionCard = ({
  paymentMethod,
}: PaymentSelectionCardProps) => {
  const paymentName = humanizePaymentType(paymentMethod.paymentType);
  const style = useStyles();
  const {t} = useTranslation();
  const multiplePaymentMethods = !(
    paymentMethod.recurringCard ||
    paymentMethod.paymentType === PaymentType.Vipps
  );

  return (
    <View style={style.container}>
      <PaymentBrand
        paymentType={
          multiplePaymentMethods ? undefined : paymentMethod.paymentType
        }
      />
      <View style={style.paymentMethod}>
        <ThemeText>
          {multiplePaymentMethods
            ? t(SelectPaymentMethodTexts.multiple_payment.title)
            : paymentName}
        </ThemeText>
        {!multiplePaymentMethods &&
          paymentMethod.paymentType !== PaymentType.Vipps && (
            <ThemeText
              style={style.maskedPan}
              accessibilityLabel={t(
                PaymentMethodsTexts.a11y.cardInfo(
                  paymentName,
                  paymentMethod.recurringCard?.masked_pan ?? '',
                ),
              )}
            >
              **** {paymentMethod.recurringCard?.masked_pan}
            </ThemeText>
          )}
      </View>
      <View style={style.actionButton}>
        <ThemeText>{t(PaymentMethodsTexts.editPaymentMethod)}</ThemeText>
        <ThemeIcon svg={SvgEdit} />
      </View>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  warningMessage: {
    marginBottom: theme.spacing.medium,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paymentMethod: {
    rowGap: theme.spacing.xSmall,
    paddingLeft: theme.spacing.medium,
    marginRight: 'auto',
  },
  maskedPan: {
    color: theme.color.foreground.dynamic.secondary,
  },

  actionButton: {
    marginLeft: theme.spacing.medium,
    flexDirection: 'row',
    columnGap: theme.spacing.small,
    paddingHorizontal: theme.spacing.medium,
  },
}));
