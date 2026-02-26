import {PurchaseConfirmationTexts, useTranslation} from '@atb/translations';
import {PaymentMethod, PaymentSelection} from './types';
import {humanizePaymentType, PaymentType} from '@atb/modules/ticketing';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {NativeButton} from '@atb/components/native-button';
import {View} from 'react-native';
import {getRadioA11y, RadioIcon} from '@atb/components/radio';
import {ThemeText} from '@atb/components/text';
import {PaymentBrand} from './PaymentBrand';
import {ExpiryMessage, getExpiryMessageText} from './ExpiryMessage';

type SinglePaymentMethodProps = {
  paymentMethod: PaymentMethod;
  selected: boolean;
  onSelect: (value: PaymentSelection) => void;
  index: number;
};

export const SinglePaymentMethod = ({
  paymentMethod,
  selected,
  onSelect,
  index,
}: SinglePaymentMethodProps) => {
  const {t, language} = useTranslation();
  const styles = useStyles();

  function getPaymentTexts(method: PaymentMethod): {
    text: string;
    label: string;
    hint: string;
  } {
    const paymentTypeName = humanizePaymentType(method.paymentType);
    if (method.recurringPayment) {
      return {
        text: paymentTypeName,
        label: `${t(
          PurchaseConfirmationTexts.paymentWithStoredCard.a11yLabel(
            paymentTypeName,
            method.recurringPayment.maskedPan,
          ),
        )} ${getExpiryMessageText(method.recurringPayment, t, language)}`,
        hint: t(PurchaseConfirmationTexts.paymentWithStoredCard.a11yHint),
      };
    } else {
      return {
        text: paymentTypeName,
        label: t(
          PurchaseConfirmationTexts.paymentWithDefaultServices.a11yLabel(
            paymentTypeName,
          ),
        ),
        hint: t(PurchaseConfirmationTexts.paymentWithDefaultServices.a11yHint),
      };
    }
  }

  function getPaymentTestId(method: PaymentMethod, index: number) {
    if (!method.recurringPayment) {
      return humanizePaymentType(method.paymentType) + 'Button';
    } else {
      return 'recurringPayment' + index;
    }
  }

  const paymentTexts = getPaymentTexts(paymentMethod);
  const {theme} = useThemeContext();
  const radioColor = theme.color.interactive[2].outline.background;
  const paymentSelection = getPaymentSelection(paymentMethod);

  return (
    <View style={styles.card}>
      <NativeButton
        style={[styles.paymentMethod, styles.centerRow]}
        onPress={() => onSelect(paymentSelection)}
        accessibilityHint={paymentTexts.hint}
        {...getRadioA11y(paymentTexts.label, selected, t)}
        testID={getPaymentTestId(paymentMethod, index)}
      >
        <View style={styles.column}>
          <View style={styles.row}>
            <View style={styles.centerRow}>
              <RadioIcon checked={selected} color={radioColor} />
              <View style={styles.reccuringCard}>
                <ThemeText>{paymentTexts.text}</ThemeText>
                {paymentMethod.recurringPayment && (
                  <ThemeText
                    style={styles.maskedPanPadding}
                    testID={getPaymentTestId(paymentMethod, index) + 'Number'}
                  >
                    **** {paymentMethod.recurringPayment.maskedPan}
                  </ThemeText>
                )}
              </View>
              <PaymentBrand paymentType={paymentMethod.paymentType} />
            </View>
          </View>

          <ExpiryMessage recurringPayment={paymentMethod.recurringPayment} />
        </View>
      </NativeButton>
    </View>
  );
};

function getPaymentSelection(
  paymentMethod: PaymentMethod,
  shouldSave: boolean = false,
): PaymentSelection {
  const paymentSelection: PaymentSelection =
    paymentMethod.paymentType === PaymentType.PaymentCard
      ? {
          paymentType: PaymentType.PaymentCard,
          shouldSavePaymentMethod: shouldSave,
        }
      : paymentMethod.recurringPayment
        ? {
            paymentType: paymentMethod.paymentType,
            recurringPayment: paymentMethod.recurringPayment,
          }
        : {
            paymentType: paymentMethod.paymentType,
          };
  return paymentSelection;
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  column: {flex: 1},
  card: {
    marginVertical: theme.spacing.xSmall,
    borderRadius: theme.border.radius.regular,
    backgroundColor: theme.color.background.neutral[0].background,
  },
  paymentMethod: {
    flex: 1,
    padding: theme.spacing.medium,
    borderRadius: theme.border.radius.regular,
  },
  centerRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  maskedPanPadding: {
    color: theme.color.foreground.dynamic.secondary,
  },
  reccuringCard: {
    rowGap: theme.spacing.xSmall,
    paddingLeft: theme.spacing.medium,
    marginRight: 'auto',
    color: theme.color.foreground.dynamic.secondary,
  },
}));
