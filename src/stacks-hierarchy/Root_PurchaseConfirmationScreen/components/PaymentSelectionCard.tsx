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

export type Brand = {
  paymentType: PaymentType | undefined;
  size?: number;
};

export const PaymentSelectionCard = (props: {
  card: PaymentMethod;
  startAction: Function;
}) => {
  const {card, startAction} = props;
  const paymentName = humanizePaymentType(card.paymentType);
  const style = useStyles();
  const {theme} = useThemeContext();
  const {t} = useTranslation();
  const fontScale = useFontScale();
  const multiplePaymentMethods = !(
    card.recurringCard || card.paymentType === PaymentType.Vipps
  );

  return (
    <View style={style.card}>
      <View style={style.cardTop}>
        <PaymentBrand
          paymentType={multiplePaymentMethods ? undefined : card.paymentType}
        />
        <View style={style.paymentMethod}>
          <ThemeText>
            {multiplePaymentMethods
              ? t(SelectPaymentMethodTexts.multiple_payment.title)
              : paymentName}
          </ThemeText>
          {!multiplePaymentMethods &&
            card.paymentType !== PaymentType.Vipps && (
              <ThemeText
                style={style.maskedPan}
                accessibilityLabel={t(
                  PaymentMethodsTexts.a11y.cardInfo(
                    paymentName,
                    card.recurringCard?.masked_pan ?? '',
                  ),
                )}
              >
                **** {card.recurringCard?.masked_pan}
              </ThemeText>
            )}
        </View>

        <View style={style.cardIcons}>
          <PressableOpacity
            accessibilityLabel={t(
              PaymentMethodsTexts.a11y.deleteCardIcon(
                paymentName,
                card.recurringCard?.masked_pan ?? '',
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
