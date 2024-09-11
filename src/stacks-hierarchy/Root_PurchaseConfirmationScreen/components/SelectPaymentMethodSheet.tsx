import React, {useState} from 'react';
import {ScrollView, View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {Button} from '@atb/components/button';
import {PurchaseConfirmationTexts, useTranslation} from '@atb/translations';
import {Confirm} from '@atb/assets/svg/mono-icons/actions';
import {ThemeText} from '@atb/components/text';
import SelectPaymentMethodTexts from '@atb/translations/screens/subscreens/SelectPaymentMethodTexts';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {FullScreenFooter} from '@atb/components/screen-footer';
import {PaymentBrand} from './PaymentBrand';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';
import {getExpireDate, getPaymentTypeName} from '../../utils';
import {Checkbox} from '@atb/components/checkbox';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {
  PaymentMethod,
  SavedPaymentMethodType,
} from '@atb/stacks-hierarchy/types';
import {useAuthState} from '@atb/auth';
import {PaymentType} from '@atb/ticketing';

type Props = {
  onSelect: (
    paymentMethod: PaymentMethod,
    shouldSavePaymentMethod: boolean,
  ) => void;
  currentOptions?: {
    shouldSavePaymentMethod?: boolean;
    paymentMethod?: PaymentMethod;
  };
  recurringPaymentMethods?: PaymentMethod[];
};

export const SelectPaymentMethodSheet: React.FC<Props> = ({
  onSelect,
  recurringPaymentMethods,
  currentOptions,
}) => {
  const {t} = useTranslation();
  const styles = useStyles();
  const [shouldSave, setShouldSave] = useState(
    currentOptions?.shouldSavePaymentMethod ?? false,
  );

  const {paymentTypes} = useFirestoreConfiguration();
  const defaultPaymentMethods: PaymentMethod[] = paymentTypes.map(
    (paymentType) => ({
      paymentType,
      savedType: SavedPaymentMethodType.Normal,
    }),
  );
  const [selectedMethod, setSelectedMethod] = useState(
    currentOptions?.paymentMethod,
  );

  return (
    <BottomSheetContainer
      title={t(SelectPaymentMethodTexts.header.text)}
      //fullHeight
    >
      <View style={{flex: 1}}>
        <View style={{flexShrink: 1, flexGrow: 1}}>
          <ScrollView style={styles.paymentMethods}>
            {defaultPaymentMethods.map((method, index) => {
              return (
                <PaymentMethodView
                  key={method.paymentType}
                  paymentMethod={method}
                  shouldSave={shouldSave}
                  onSetShouldSave={setShouldSave}
                  selected={
                    !selectedMethod?.recurringCard &&
                    selectedMethod?.paymentType === method.paymentType
                  }
                  onSelect={(val: PaymentMethod) => {
                    setSelectedMethod(val);
                    setShouldSave(false);
                  }}
                  index={index}
                />
              );
            })}

            {recurringPaymentMethods && recurringPaymentMethods?.length > 0 && (
              <View style={styles.listHeading}>
                <ThemeText>
                  {t(SelectPaymentMethodTexts.saved_cards.text)}
                </ThemeText>
              </View>
            )}
            {recurringPaymentMethods?.map((method, index) => (
              <PaymentMethodView
                key={method.recurringCard?.id}
                paymentMethod={method}
                selected={
                  selectedMethod?.recurringCard?.id === method.recurringCard?.id
                }
                shouldSave={shouldSave}
                onSetShouldSave={setShouldSave}
                onSelect={setSelectedMethod}
                index={index}
              />
            ))}
          </ScrollView>
        </View>
        <FullScreenFooter>
          <Button
            style={styles.confirmButton}
            interactiveColor="interactive_0"
            text={t(SelectPaymentMethodTexts.confirm_button.text)}
            accessibilityHint={t(
              SelectPaymentMethodTexts.confirm_button.a11yhint,
            )}
            onPress={() => {
              if (selectedMethod) onSelect(selectedMethod, shouldSave);
            }}
            disabled={!selectedMethod}
            rightIcon={{svg: Confirm}}
            testID="confirmButton"
          />
        </FullScreenFooter>
      </View>
    </BottomSheetContainer>
  );
};

type PaymentMethodProps = {
  paymentMethod: PaymentMethod;
  selected: boolean;
  onSelect: (value: PaymentMethod) => void;
  shouldSave: boolean;
  onSetShouldSave: (val: boolean) => void;
  index: number;
};

const PaymentMethodView: React.FC<PaymentMethodProps> = ({
  paymentMethod,
  selected,
  onSelect,
  shouldSave,
  onSetShouldSave,
  index,
}) => {
  const {t} = useTranslation();
  const styles = useStyles();
  const {authenticationType} = useAuthState();

  function getPaymentTexts(method: PaymentMethod): {
    text: string;
    label: string;
    hint: string;
  } {
    const paymentTypeName = getPaymentTypeName(method.paymentType);
    if (method.recurringCard) {
      return {
        text: paymentTypeName,
        label: t(
          PurchaseConfirmationTexts.paymentWithStoredCard.a11yLabel(
            paymentTypeName,
            method.recurringCard!.masked_pan,
          ),
        ),
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
        hint: t(PurchaseConfirmationTexts.paymentWithDefaultServices.a11Hint),
      };
    }
  }

  function getPaymentTestId(method: PaymentMethod, index: number) {
    if (method.savedType === 'normal') {
      return getPaymentTypeName(method.paymentType) + 'Button';
    } else {
      return 'recurringPayment' + index;
    }
  }

  const paymentTexts = getPaymentTexts(paymentMethod);

  const canSaveCard =
    authenticationType === 'phone' &&
    paymentMethod.savedType === 'normal' &&
    paymentMethod.paymentType !== PaymentType.Vipps;

  return (
    <View style={styles.card}>
      <PressableOpacity
        style={[styles.paymentMethod, styles.centerRow]}
        onPress={() => onSelect(paymentMethod)}
        accessibilityLabel={paymentTexts.label}
        accessibilityHint={paymentTexts.hint}
        accessibilityRole="radio"
        accessibilityState={{selected: selected}}
        testID={getPaymentTestId(paymentMethod, index)}
      >
        <View style={styles.column}>
          <View style={styles.row}>
            <View style={styles.centerRow}>
              <RadioView checked={selected} />
              <ThemeText>{paymentTexts.text}</ThemeText>
              {paymentMethod.recurringCard && (
                <ThemeText
                  style={styles.maskedPanPadding}
                  testID={getPaymentTestId(paymentMethod, index) + 'Number'}
                >
                  **** {`${paymentMethod.recurringCard.masked_pan}`}
                </ThemeText>
              )}
            </View>
            <PaymentBrand icon={paymentMethod.paymentType} />
          </View>
          {paymentMethod.recurringCard && (
            <ThemeText style={styles.expireDate}>
              {getExpireDate(paymentMethod.recurringCard.expires_at)}
            </ThemeText>
          )}
        </View>
      </PressableOpacity>
      {selected && canSaveCard && (
        <PressableOpacity
          onPress={() => onSetShouldSave(!shouldSave)}
          style={styles.saveMethodSection}
        >
          <ThemeText style={styles.saveMethodTextPadding}>
            {t(SelectPaymentMethodTexts.save_payment_method_description.text)}
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

type CheckedProps = {
  checked: boolean;
};

const RadioView: React.FC<CheckedProps> = ({checked}) => {
  const styles = useStyles();
  return (
    <View
      style={[styles.radio, checked ? styles.radioSelected : styles.radioBlank]}
    >
      {checked ? <View style={styles.radioInner} /> : null}
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  heading: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingBottom: theme.spacings.xLarge,
  },
  listHeading: {
    flex: 1,
    alignItems: 'center',
    paddingTop: theme.spacings.large,
    paddingBottom: theme.spacings.small,
  },
  spinner: {
    paddingTop: theme.spacings.medium,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  column: {flex: 1, flexDirection: 'column'},
  card: {
    marginVertical: theme.spacings.xSmall,
    borderRadius: theme.border.radius.regular,
    backgroundColor: theme.static.background.background_0.background,
  },
  saveMethodSection: {
    paddingHorizontal: theme.spacings.xLarge,
    paddingBottom: theme.spacings.xLarge,
  },
  container: {
    flex: 1,
    backgroundColor: theme.static.background.background_1.background,
    paddingHorizontal: theme.spacings.medium,
  },
  rowJustifyEnd: {flex: 1, flexDirection: 'row', justifyContent: 'flex-end'},
  paymentMethods: {
    paddingHorizontal: theme.spacings.medium,
  },
  paymentMethod: {
    flex: 1,
    flexDirection: 'column',
    padding: theme.spacings.xLarge,
    borderRadius: theme.border.radius.regular,
  },
  centerRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioSelected: {
    backgroundColor: theme.static.background.background_accent_3.background,
  },
  radioBlank: {
    backgroundColor: theme.static.background.background_0.background,
  },
  radio: {
    marginRight: theme.spacings.medium,
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: theme.border.width.medium,
    borderColor: theme.static.background.background_accent_3.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: theme.static.background.background_0.background,
  },
  saveButton: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    paddingTop: theme.spacings.small,
  },
  saveButtonCheckbox: {
    marginRight: theme.spacings.small,
  },
  expireDate: {
    opacity: 0.6,
    paddingTop: theme.spacings.small,
    paddingLeft: 36,
  },
  confirmButton: {
    marginTop: theme.spacings.small,
  },
  maskedPanPadding: {
    paddingLeft: theme.spacings.small,
  },
  saveMethodTextPadding: {
    paddingTop: theme.spacings.medium,
    opacity: 0.6,
  },
}));
