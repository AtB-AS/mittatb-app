import {ThemeText} from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {humanizePaymentType, PaymentType} from '@atb/modules/ticketing';
import {useTranslation} from '@atb/translations';
import React, {forwardRef} from 'react';
import PaymentMethodsTexts from '@atb/translations/screens/subscreens/PaymentMethods';
import SelectPaymentMethodTexts from '@atb/translations/screens/subscreens/SelectPaymentMethodTexts';
import SvgEdit from '@atb/assets/svg/mono-icons/actions/Edit';
import {View} from 'react-native';
import {ThemeIcon} from '@atb/components/theme-icon';
import {SectionItemProps, useSectionItem} from '@atb/components/sections';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {PaymentMethod} from './types';
import {PaymentBrand} from './PaymentBrand';

type PaymentSelectionCardProps = SectionItemProps<{
  paymentMethod: PaymentMethod;
  onPress(): void;
}>;

export const PaymentSelectionSectionItem = forwardRef<
  any,
  PaymentSelectionCardProps
>(({paymentMethod, ...props}, focusRef) => {
  const style = useStyles();
  const {t} = useTranslation();
  const multiplePaymentMethods = !(
    paymentMethod.recurringPayment ||
    paymentMethod.paymentType === PaymentType.Vipps
  );
  const {topContainer} = useSectionItem(props);

  const paymentName =
    humanizePaymentType(paymentMethod.paymentType) ||
    t(PaymentMethodsTexts.a11y.paymentCard); // TODO: Figure out a better fallback value than "payment card"
  const a11yLabel = paymentMethod.recurringPayment?.maskedPan
    ? t(
        PaymentMethodsTexts.a11y.editCardWithMaskedPan(
          paymentName,
          paymentMethod.recurringPayment.maskedPan,
        ),
      )
    : t(PaymentMethodsTexts.a11y.editCard(paymentName));

  return (
    <PressableOpacity
      {...props}
      ref={focusRef}
      accessibilityLabel={a11yLabel}
      accessibilityHint={t(PaymentMethodsTexts.a11y.editCardHint)}
      accessibilityRole="button"
    >
      <View style={[topContainer, style.container]}>
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
                    paymentMethod.recurringPayment?.maskedPan ?? '',
                  ),
                )}
              >
                **** {paymentMethod.recurringPayment?.maskedPan}
              </ThemeText>
            )}
        </View>
        <View style={style.actionButton}>
          <ThemeText>{t(PaymentMethodsTexts.editPaymentMethod)}</ThemeText>
          <ThemeIcon svg={SvgEdit} />
        </View>
      </View>
    </PressableOpacity>
  );
});

const useStyles = StyleSheet.createThemeHook((theme) => ({
  warningMessage: {
    marginBottom: theme.spacing.medium,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    rowGap: theme.spacing.medium,
    flexWrap: 'wrap',
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
