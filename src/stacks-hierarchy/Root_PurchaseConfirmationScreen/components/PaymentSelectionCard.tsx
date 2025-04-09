import {PressableOpacity} from '@atb/components/pressable-opacity';
import {ThemeText} from '@atb/components/text';

import {StyleSheet, useThemeContext} from '@atb/theme';
import {humanizePaymentType, PaymentType} from '@atb/ticketing';
import {useTranslation} from '@atb/translations';
import React from 'react';

import {useFontScale} from '@atb/utils/use-font-scale';
import {PaymentBrand} from './PaymentBrand';
import PaymentMethodsTexts from '@atb/translations/screens/subscreens/PaymentMethods';
import SelectPaymentMethodTexts from '@atb/translations/screens/subscreens/SelectPaymentMethodTexts';
import SvgEdit from '@atb/assets/svg/mono-icons/actions/Edit';
import {View} from 'react-native';
import {PaymentMethod} from '@atb/stacks-hierarchy/types';

type PaymentSelectionCardProps = {
  paymentMethod: PaymentMethod;
  startAction: () => void;
};

export const PaymentSelectionCard = ({
  paymentMethod,
  startAction,
}: PaymentSelectionCardProps) => {
  const paymentName = humanizePaymentType(paymentMethod.paymentType);
  const style = useStyles();
  const {theme} = useThemeContext();
  const {t} = useTranslation();
  const fontScale = useFontScale();
  const multiplePaymentMethods = !(
    paymentMethod.recurringCard ||
    paymentMethod.paymentType === PaymentType.Vipps
  );

  return (
    <View style={style.card}>
      <PressableOpacity
        accessibilityLabel={t(
          PaymentMethodsTexts.a11y.editCardIcon(
            paymentName,
            paymentMethod.recurringCard?.masked_pan ?? '',
          ),
        )}
        onPress={startAction}
      >
        <View style={style.cardTop}>
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

          <View style={style.cardIcons}>
            <PressableOpacity
              accessibilityLabel={t(
                PaymentMethodsTexts.a11y.editCardIcon(
                  paymentName,
                  paymentMethod.recurringCard?.masked_pan ?? '',
                ),
              )}
              style={style.actionButton}
              onPress={() => {
                startAction();
              }}
            >
              <ThemeText>{t(PaymentMethodsTexts.editPaymentMethod)}</ThemeText>
              <SvgEdit
                height={21 * fontScale}
                width={21 * fontScale}
                fill={theme.color.foreground.dynamic.primary}
              />
            </PressableOpacity>
          </View>
        </View>
      </PressableOpacity>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  warningMessage: {
    marginBottom: theme.spacing.medium,
  },

  card: {flex: 1},
  cardTop: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardIcons: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
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
