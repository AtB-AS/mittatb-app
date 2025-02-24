import React, {useState} from 'react';
import {ScrollView, View} from 'react-native';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {Button} from '@atb/components/button';
import {PurchaseConfirmationTexts, useTranslation} from '@atb/translations';
import {Confirm} from '@atb/assets/svg/mono-icons/actions';
import {ThemeText} from '@atb/components/text';
import SelectPaymentMethodTexts from '@atb/translations/screens/subscreens/SelectPaymentMethodTexts';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {FullScreenFooter} from '@atb/components/screen-footer';
import {PaymentBrand} from './PaymentBrand';
import {useFirestoreConfigurationContext} from '@atb/configuration/FirestoreConfigurationContext';
import {getCardExpiryStatus, getExpireDate} from '../../utils';
import {Checkbox} from '@atb/components/checkbox';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {
  CardPaymentMethod,
  PaymentMethod,
  SavedPaymentMethodType,
  VippsPaymentMethod,
} from '@atb/stacks-hierarchy/types';
import {useAuthContext} from '@atb/auth';
import {PaymentType, humanizePaymentType} from '@atb/ticketing';
import {RadioIcon, getRadioA11y} from '@atb/components/radio';
import {MessageInfoText} from '@atb/components/message-info-text';

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
  const {theme} = useThemeContext();
  const styles = useStyles();
  const [shouldSave, setShouldSave] = useState(
    currentOptions?.shouldSavePaymentMethod ?? false,
  );

  const {paymentTypes} = useFirestoreConfigurationContext();
  const defaultPaymentMethods = [
    ...paymentTypes
      .map((paymentType) => ({
        paymentType,
        savedType: SavedPaymentMethodType.Normal,
      }))
      .filter((method) => method.paymentType === PaymentType.Vipps),
    {
      paymentType: paymentTypes.filter(
        (paymentType) => paymentType !== PaymentType.Vipps,
      ),
      savedType: SavedPaymentMethodType.Normal,
    },
  ];
  /* console.log('defaultPaymentMethods = ', defaultPaymentMethods);
  console.log('-------------------'); */

  const [selectedMethod, setSelectedMethod] = useState(
    currentOptions?.paymentMethod,
  );
  return (
    <BottomSheetContainer
      title={t(SelectPaymentMethodTexts.header.text)}
      fullHeight
    >
      <View style={{flex: 1}}>
        <View style={{flexShrink: 1, flexGrow: 1}}>
          <ScrollView style={styles.paymentMethods}>
            {defaultPaymentMethods.map((method, index) => {
              return (
                <PaymentMethodView
                  key={
                    Array.isArray(method.paymentType)
                      ? method.paymentType.join('-')
                      : method.paymentType
                  }
                  paymentMethod={method}
                  shouldSave={shouldSave}
                  onSetShouldSave={setShouldSave}
                  selected={
                    !selectedMethod?.recurringCard &&
                    (Array.isArray(method.paymentType)
                      ? JSON.stringify(selectedMethod?.paymentType) ===
                        JSON.stringify(method.paymentType)
                      : selectedMethod?.paymentType === method.paymentType)
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
            expanded={true}
            style={styles.confirmButton}
            interactiveColor={theme.color.interactive[0]}
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
  const {authenticationType} = useAuthContext();
  const {theme} = useThemeContext();
  const radioColor = theme.color.interactive[2].outline.background;

  function getPaymentTexts(method: PaymentMethod): {
    text: string;
    label: string;
    hint: string;
  } {
    const paymentTypeName = humanizePaymentType(method.paymentType);
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
      if (paymentTypeName == '') {
        return {
          text: t(PurchaseConfirmationTexts.paymentWithAnyService.text),
          label: t(PurchaseConfirmationTexts.paymentWithAnyService.a11yLabel),
          hint: t(PurchaseConfirmationTexts.paymentWithDefaultServices.a11Hint),
        };
      }
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
      return humanizePaymentType(method.paymentType) + 'Button';
    } else {
      return 'recurringPayment' + index;
    }
  }

  const paymentTexts = getPaymentTexts(paymentMethod);

  const canSaveCard =
    authenticationType === 'phone' &&
    paymentMethod.savedType === 'normal' &&
    paymentMethod.paymentType !== PaymentType.Vipps;

  const reccuringCardStatus =
    paymentMethod.recurringCard &&
    getCardExpiryStatus(paymentMethod.recurringCard);

  return (
    <View style={styles.card}>
      <PressableOpacity
        style={[styles.paymentMethod, styles.centerRow]}
        onPress={() => onSelect(paymentMethod)}
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
                {paymentMethod.recurringCard && (
                  <ThemeText
                    style={styles.maskedPanPadding}
                    testID={getPaymentTestId(paymentMethod, index) + 'Number'}
                  >
                    **** {`${paymentMethod.recurringCard.masked_pan}`}
                  </ThemeText>
                )}
              </View>
              {Array.isArray(paymentMethod.paymentType) ? (
                <View style={styles.cardBrandGroup}>
                  {paymentMethod.paymentType.map((brand, index) => (
                    <PaymentBrand key={index} paymentType={brand} />
                  ))}
                </View>
              ) : (
                <PaymentBrand paymentType={paymentMethod.paymentType} />
              )}
            </View>
          </View>

          {reccuringCardStatus && (
            <MessageInfoText
              style={styles.warningMessage}
              type={reccuringCardStatus.expiryMessageType}
              message={`${t(
                SelectPaymentMethodTexts.expiry_messages[
                  reccuringCardStatus.expiryMessageCardType as 'nets' | 'card'
                ][
                  reccuringCardStatus.expiryMessageCardTime as
                    | 'beforeExpiration'
                    | 'afterExpiration'
                ],
              )} ${
                reccuringCardStatus.expiryTime
                  ? getExpireDate(reccuringCardStatus?.expiryTime)
                  : ''
              }`}
            />
          )}
        </View>
      </PressableOpacity>
      {selected && canSaveCard && (
        <PressableOpacity
          onPress={() => onSetShouldSave(!shouldSave)}
          style={styles.saveMethodSection}
        >
          <ThemeText>
            {t(SelectPaymentMethodTexts.save_payment_method_description.text)}
          </ThemeText>
          <ThemeText typography="body__secondary" color="secondary">
            {t(
              SelectPaymentMethodTexts.save_payment_method_description
                .information,
            )}
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
  heading: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingBottom: theme.spacing.xLarge,
  },
  listHeading: {
    flex: 1,
    alignItems: 'center',
    paddingTop: theme.spacing.large,
    paddingBottom: theme.spacing.small,
  },
  spinner: {
    paddingTop: theme.spacing.medium,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  column: {flex: 1, flexDirection: 'column'},
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
    display: 'flex',
    flexDirection: 'column',
    rowGap: theme.spacing.medium,
  },

  container: {
    flex: 1,
    backgroundColor: theme.color.background.neutral[1].background,
    paddingHorizontal: theme.spacing.medium,
  },
  rowJustifyEnd: {flex: 1, flexDirection: 'row', justifyContent: 'flex-end'},
  paymentMethods: {
    paddingHorizontal: theme.spacing.medium,
  },
  paymentMethod: {
    flex: 1,
    flexDirection: 'column',
    padding: theme.spacing.medium,
    borderRadius: theme.border.radius.regular,
  },

  centerRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  radioSelected: {
    backgroundColor: theme.color.background.accent[3].background,
  },
  radioBlank: {
    backgroundColor: theme.color.background.neutral[0].background,
  },
  radio: {
    marginRight: theme.spacing.medium,
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: theme.border.width.medium,
    borderColor: theme.color.background.accent[3].background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: theme.color.background.neutral[0].background,
  },
  saveButton: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  saveButtonCheckbox: {
    marginRight: theme.spacing.medium,
  },
  confirmButton: {
    marginTop: theme.spacing.small,
  },
  maskedPanPadding: {
    color: theme.color.foreground.dynamic.secondary,
  },
  reccuringCard: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: theme.spacing.xSmall,
    paddingLeft: theme.spacing.medium,
    marginRight: 'auto',
  },

  warningMessage: {
    paddingTop: theme.spacing.medium,
  },

  cardBrandGroup: {
    display: 'flex',
    flexDirection: 'row',
    columnGap: theme.spacing.medium,
  },
}));
