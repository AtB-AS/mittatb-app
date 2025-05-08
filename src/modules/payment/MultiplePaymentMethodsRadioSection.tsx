import {PurchaseConfirmationTexts, useTranslation} from '@atb/translations';
import {PaymentMethod} from './types';
import {useAuthContext} from '@atb/modules/auth';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {humanizePaymentType} from '@atb/modules/ticketing';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {View} from 'react-native';
import {getRadioA11y, RadioIcon} from '@atb/components/radio';
import {ThemeText} from '@atb/components/text';
import SelectPaymentMethodTexts from '@atb/translations/screens/subscreens/SelectPaymentMethodTexts';
import {PaymentBrand} from './PaymentBrand';
import {Checkbox} from '@atb/components/checkbox';

type MultiplePaymentMethodsProps = {
  selected: boolean;
  onSelect: () => void;
  shouldSave: boolean;
  toggleShouldSave: () => void;
  paymentMethodsInGroup: PaymentMethod[];
  testID?: string;
};

export const MultiplePaymentMethodsRadioSection = ({
  selected,
  onSelect,
  shouldSave,
  toggleShouldSave,
  paymentMethodsInGroup,
}: MultiplePaymentMethodsProps) => {
  const {t} = useTranslation();
  const styles = useStyles();
  const {authenticationType} = useAuthContext();
  const {theme} = useThemeContext();
  const radioColor = theme.color.interactive[2].outline.background;

  function getPaymentTexts(method: PaymentMethod[]): {
    label: string;
    hint: string;
  } {
    const methods = method
      .map((payment) => humanizePaymentType(payment.paymentType))
      .join(', ');

    return {
      label: t(
        PurchaseConfirmationTexts.paymentWithMultiplePaymentMethods.a11yLabel(
          methods,
        ),
      ),
      hint: t(
        PurchaseConfirmationTexts.paymentWithMultiplePaymentMethods.a11Hint,
      ),
    };
  }

  const paymentTexts = getPaymentTexts(paymentMethodsInGroup);
  const canSaveCard = authenticationType === 'phone';

  return (
    <View style={styles.card}>
      <PressableOpacity
        style={[styles.paymentMethod, styles.centerRow]}
        onPress={onSelect}
        accessibilityHint={paymentTexts.hint}
        {...getRadioA11y(paymentTexts.label, selected, t)}
        testID="multiple payment methods"
      >
        <View style={styles.column}>
          <View style={styles.row}>
            <View style={styles.centerRow}>
              <RadioIcon checked={selected} color={radioColor} />
              <View style={styles.reccuringCard}>
                <ThemeText>
                  {t(SelectPaymentMethodTexts.multiple_payment.title)}
                </ThemeText>
              </View>
              <View style={styles.paymentIconsGroup}>
                {paymentMethodsInGroup.map((payment) => (
                  <PaymentBrand
                    paymentType={payment.paymentType}
                    key={payment.paymentType}
                  />
                ))}
              </View>
            </View>
          </View>
        </View>
      </PressableOpacity>
      {selected && canSaveCard && (
        <PressableOpacity
          onPress={toggleShouldSave}
          style={styles.saveMethodSection}
        >
          <ThemeText>
            {t(SelectPaymentMethodTexts.multiple_payment.text)}
          </ThemeText>
          <ThemeText typography="body__secondary" color="secondary">
            {t(SelectPaymentMethodTexts.multiple_payment.information)}
          </ThemeText>
          <View style={styles.saveButton}>
            <Checkbox
              style={styles.saveButtonCheckbox}
              checked={shouldSave}
              accessibility={{
                accessibilityHint: t(
                  shouldSave
                    ? SelectPaymentMethodTexts.a11yHint.notSave
                    : SelectPaymentMethodTexts.a11yHint.save,
                ),
              }}
              testID="saveCard"
            />
            <ThemeText>{t(SelectPaymentMethodTexts.save_card)}</ThemeText>
          </View>
        </PressableOpacity>
      )}
    </View>
  );
};

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
  saveMethodSection: {
    paddingHorizontal: theme.spacing.medium,
    paddingBottom: theme.spacing.medium,
    paddingTop: theme.spacing.small,
    borderTopWidth: theme.border.width.slim,
    borderTopColor: theme.color.border.primary.background,
    rowGap: theme.spacing.medium,
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
  saveButton: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  saveButtonCheckbox: {
    marginRight: theme.spacing.medium,
  },
  reccuringCard: {
    rowGap: theme.spacing.xSmall,
    paddingLeft: theme.spacing.medium,
    marginRight: 'auto',
    color: theme.color.foreground.dynamic.secondary,
  },
  paymentIconsGroup: {
    flexDirection: 'row',
    columnGap: theme.spacing.medium,
  },
}));
