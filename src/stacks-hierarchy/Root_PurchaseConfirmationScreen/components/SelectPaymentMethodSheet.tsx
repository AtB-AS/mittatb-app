import React, {useEffect, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {Button} from '@atb/components/button';
import {PurchaseConfirmationTexts, useTranslation} from '@atb/translations';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {ThemeText} from '@atb/components/text';
import SelectPaymentMethodTexts from '@atb/translations/screens/subscreens/SelectPaymentMethodTexts';
import {PaymentType, RecurringPayment} from '@atb/ticketing';
import {
  PaymentMethod,
  RecurringPaymentOption,
  SavedPaymentOption,
} from '../../types';
import {useAuthState} from '@atb/auth';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {FullScreenFooter} from '@atb/components/screen-footer';
import {PaymentBrand} from './PaymentBrand';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';
import {getExpireDate, getPaymentTypeName} from '../../utils';
import {Checkbox} from '@atb/components/checkbox';
import {PressableOpacity} from '@atb/components/pressable-opacity';

type Props = {
  onSelect: (value: PaymentMethod) => void;
  previousPaymentMethod?: SavedPaymentOption;
  recurringPayments?: RecurringPayment[];
};

function getSelectedPaymentMethod(
  paymentTypes: PaymentType[],
  previousPaymentMethod?: SavedPaymentOption,
): PaymentMethod | undefined {
  if (!previousPaymentMethod) return undefined;
  const {savedType, paymentType} = previousPaymentMethod;
  if (!paymentTypes.includes(paymentType)) {
    return undefined;
  }
  switch (savedType) {
    case 'normal':
      switch (paymentType) {
        case PaymentType.Vipps:
          return {
            paymentType,
          };
        default:
        case PaymentType.Mastercard:
        case PaymentType.Visa:
          return {
            paymentType,
            save: false,
          };
      }
    case 'recurring':
      return {
        paymentType: previousPaymentMethod.paymentType,
        recurringPaymentId: previousPaymentMethod.recurringCard.id,
      };
  }
}

function isRecurring(option: PaymentMethod): option is {
  paymentType: PaymentType.Visa | PaymentType.Mastercard;
  recurringPaymentId: number;
} {
  return (
    (option.paymentType === PaymentType.Visa ||
      option.paymentType === PaymentType.Mastercard) &&
    'recurringPaymentId' in option
  );
}

export const SelectPaymentMethodSheet: React.FC<Props> = ({
  onSelect,
  previousPaymentMethod,
  recurringPayments,
}) => {
  const {t} = useTranslation();
  const {paymentTypes} = useFirestoreConfiguration();

  const defaultPaymentOptions: SavedPaymentOption[] = paymentTypes.map(
    (paymentType) => {
      return {
        paymentType: paymentType,
        savedType: 'normal',
      };
    },
  );

  const [selectedOption, setSelectedOption] = useState<
    PaymentMethod | undefined
  >(getSelectedPaymentMethod(paymentTypes, previousPaymentMethod));
  const styles = useStyles();

  const remoteOptions: RecurringPaymentOption[] | undefined = recurringPayments
    ?.map((option) => ({
      savedType: 'recurring' as 'recurring', // Workaround for a TypeScript bug
      paymentType: option.payment_type,
      recurringCard: option,
    }))
    .reverse();

  const isSelectedOption = (item: SavedPaymentOption) => {
    // False if types doesn't match
    if (!(selectedOption?.paymentType === item.paymentType)) return false;

    const itemIsRecurring = !!selectedOption && isRecurring(selectedOption);
    const selectedIsRecurring = item.savedType === 'recurring';

    // True if recurring ID matches
    if (itemIsRecurring && selectedIsRecurring) {
      return item.recurringCard.id === selectedOption.recurringPaymentId;
    }

    // True if both are not recurring, false otherwise
    return !itemIsRecurring && !selectedIsRecurring;
  };

  return (
    <BottomSheetContainer
      title={t(SelectPaymentMethodTexts.header.text)}
      fullHeight
    >
      <View style={{flex: 1}}>
        <View style={{flexShrink: 1, flexGrow: 1}}>
          <ScrollView style={styles.paymentOptions}>
            {defaultPaymentOptions.map((option, index) => {
              return (
                <PaymentOptionView
                  key={option.paymentType}
                  option={option}
                  selected={isSelectedOption(option)}
                  onSelect={(val: PaymentMethod) => {
                    setSelectedOption(val);
                  }}
                  index={index}
                />
              );
            })}

            {remoteOptions && remoteOptions.length > 0 && (
              <View style={styles.listHeading}>
                <ThemeText>
                  {t(SelectPaymentMethodTexts.saved_cards.text)}
                </ThemeText>
              </View>
            )}

            {remoteOptions?.map((option, index) => {
              return (
                <PaymentOptionView
                  key={
                    option.savedType === 'recurring'
                      ? option.recurringCard.id
                      : option.paymentType
                  }
                  option={option}
                  selected={isSelectedOption(option)}
                  onSelect={(val: PaymentMethod) => {
                    setSelectedOption(val);
                  }}
                  index={index}
                />
              );
            })}
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
              if (selectedOption) {
                onSelect(selectedOption);
              }
            }}
            disabled={!selectedOption}
            rightIcon={{svg: ArrowRight}}
            testID="confirmButton"
          />
        </FullScreenFooter>
      </View>
    </BottomSheetContainer>
  );
};

type PaymentOptionsProps = {
  option: SavedPaymentOption;
  selected: boolean;
  onSelect: (value: PaymentMethod) => void;
  index: number;
};

const PaymentOptionView: React.FC<PaymentOptionsProps> = ({
  option,
  selected,
  onSelect,
  index,
}) => {
  const [save, setSave] = useState<boolean>(false);
  const {t} = useTranslation();
  const styles = useStyles();
  const {authenticationType} = useAuthState();

  useEffect(() => {
    if (selected) {
      select();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [save]);

  function getPaymentTexts(option: SavedPaymentOption): {
    text: string;
    label: string;
    hint: string;
  } {
    const paymentTypeName = getPaymentTypeName(option.paymentType);

    if (option.savedType === 'normal') {
      return {
        text: paymentTypeName,
        label: t(
          PurchaseConfirmationTexts.paymentWithDefaultServices.a11yLabel(
            paymentTypeName,
          ),
        ),
        hint: t(PurchaseConfirmationTexts.paymentWithDefaultServices.a11Hint),
      };
    } else if (option.savedType === 'recurring') {
      return {
        text: paymentTypeName,
        label: t(
          PurchaseConfirmationTexts.paymentWithStoredCard.a11yLabel(
            paymentTypeName,
            option.recurringCard.masked_pan,
          ),
        ),
        hint: t(PurchaseConfirmationTexts.paymentWithStoredCard.a11yHint),
      };
    } else {
      return {
        text: '',
        label: '',
        hint: '',
      };
    }
  }

  function getPaymentTestId(option: SavedPaymentOption, index: number) {
    if (option.savedType === 'normal') {
      return getPaymentTypeName(option.paymentType) + 'Button';
    } else {
      return 'recurringPayment' + index;
    }
  }

  function getSelectOption(): PaymentMethod {
    switch (option.savedType) {
      case 'normal':
        if (option.paymentType === PaymentType.Vipps) {
          return {paymentType: PaymentType.Vipps};
        } else {
          return {
            paymentType: option.paymentType,
            save,
          };
        }
      case 'recurring':
        return {
          paymentType: option.paymentType,
          recurringPaymentId: option.recurringCard.id,
        };
    }
  }

  function select() {
    onSelect(getSelectOption());
  }

  const paymentTexts = getPaymentTexts(option);

  return (
    <View style={styles.card}>
      <PressableOpacity
        style={[styles.paymentOption, styles.centerRow]}
        onPress={select}
        accessibilityLabel={paymentTexts.label}
        accessibilityHint={paymentTexts.hint}
        accessibilityRole="radio"
        accessibilityState={{selected: selected}}
        testID={getPaymentTestId(option, index)}
      >
        <View style={styles.column}>
          <View style={styles.row}>
            <View style={styles.centerRow}>
              <RadioView checked={selected} />
              <ThemeText>{paymentTexts.text}</ThemeText>
              {option.savedType === 'recurring' ? (
                <ThemeText
                  style={styles.maskedPanPadding}
                  testID={getPaymentTestId(option, index) + 'Number'}
                >
                  **** {`${option.recurringCard.masked_pan}`}
                </ThemeText>
              ) : null}
            </View>
            <PaymentBrand icon={option.paymentType} />
          </View>
          {option.savedType === 'recurring' &&
          option.recurringCard.expires_at ? (
            <View>
              <ThemeText style={styles.expireDate}>
                {getExpireDate(option.recurringCard.expires_at)}
              </ThemeText>
            </View>
          ) : null}
        </View>
      </PressableOpacity>
      {selected &&
      authenticationType === 'phone' &&
      option.savedType === 'normal' &&
      option.paymentType !== PaymentType.Vipps ? (
        <PressableOpacity
          onPress={() => {
            setSave(!save);
          }}
          style={styles.saveOptionSection}
        >
          <ThemeText style={styles.saveOptionTextPadding}>
            {t(SelectPaymentMethodTexts.save_payment_option_description.text)}
          </ThemeText>
          <View style={styles.saveButton}>
            <Checkbox
              style={styles.saveButtonCheckbox}
              checked={save}
              accessibility={{
                accessibilityHint: t(
                  save
                    ? SelectPaymentMethodTexts.a11yHint.notSave
                    : SelectPaymentMethodTexts.a11yHint.save,
                ),
              }}
              testID="saveCard"
            />
            <ThemeText>{t(SelectPaymentMethodTexts.save_card)}</ThemeText>
          </View>
        </PressableOpacity>
      ) : null}
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
  saveOptionSection: {
    paddingHorizontal: theme.spacings.xLarge,
    paddingBottom: theme.spacings.xLarge,
  },
  container: {
    flex: 1,
    backgroundColor: theme.static.background.background_1.background,
    paddingHorizontal: theme.spacings.medium,
  },
  rowJustifyEnd: {flex: 1, flexDirection: 'row', justifyContent: 'flex-end'},
  paymentOptions: {
    paddingHorizontal: theme.spacings.medium,
  },
  paymentOption: {
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
  saveOptionTextPadding: {
    paddingTop: theme.spacings.medium,
    opacity: 0.6,
  },
}));
