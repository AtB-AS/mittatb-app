import React, {useState} from 'react';
import {ScrollView, View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {Button} from '@atb/components/button';
import {PurchaseConfirmationTexts, useTranslation} from '@atb/translations';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {ThemeText} from '@atb/components/text';
import SelectPaymentMethodTexts from '@atb/translations/screens/subscreens/SelectPaymentMethodTexts';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {FullScreenFooter} from '@atb/components/screen-footer';
import {PaymentBrand} from './PaymentBrand';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';
import {getExpireDate, getPaymentTypeName} from '../../utils';
import {Checkbox} from '@atb/components/checkbox';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {PaymentOption} from '@atb/stacks-hierarchy/types';
import {useAuthState} from '@atb/auth';
import {PaymentType} from '@atb/ticketing';

type Props = {
  onSelect: (value: PaymentOption, save: boolean) => void;
  previousPaymentMethod?: PaymentOption;
  recurringPaymentOptions?: PaymentOption[];
};

export const SelectPaymentMethodSheet: React.FC<Props> = ({
  onSelect,
  previousPaymentMethod,
  recurringPaymentOptions,
}) => {
  const {t} = useTranslation();
  const styles = useStyles();
  const [shouldSave, setShouldSave] = useState(false);

  const {paymentTypes} = useFirestoreConfiguration();
  const defaultPaymentOptions: PaymentOption[] = paymentTypes.map(
    (paymentType) => ({
      paymentType,
      savedType: 'normal',
    }),
  );
  const [selectedOption, setSelectedOption] = useState(previousPaymentMethod);

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
                  shouldSave={shouldSave}
                  onSetShouldSave={setShouldSave}
                  selected={
                    !selectedOption?.recurringCard &&
                    selectedOption?.paymentType === option.paymentType
                  }
                  onSelect={(val: PaymentOption) => {
                    setSelectedOption(val);
                    setShouldSave(false);
                  }}
                  index={index}
                />
              );
            })}

            {recurringPaymentOptions && recurringPaymentOptions?.length > 0 && (
              <View style={styles.listHeading}>
                <ThemeText>
                  {t(SelectPaymentMethodTexts.saved_cards.text)}
                </ThemeText>
              </View>
            )}
            {recurringPaymentOptions?.map((option, index) => (
              <PaymentOptionView
                key={option.recurringCard?.id}
                option={option}
                selected={
                  selectedOption?.recurringCard?.id === option.recurringCard?.id
                }
                shouldSave={shouldSave}
                onSetShouldSave={setShouldSave}
                onSelect={setSelectedOption}
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
              if (selectedOption) onSelect(selectedOption, shouldSave);
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
  option: PaymentOption;
  selected: boolean;
  onSelect: (value: PaymentOption) => void;
  shouldSave: boolean;
  onSetShouldSave: (val: boolean) => void;
  index: number;
};

const PaymentOptionView: React.FC<PaymentOptionsProps> = ({
  option,
  selected,
  onSelect,
  shouldSave,
  onSetShouldSave,
  index,
}) => {
  const {t} = useTranslation();
  const styles = useStyles();
  const {authenticationType} = useAuthState();

  function getPaymentTexts(option: PaymentOption): {
    text: string;
    label: string;
    hint: string;
  } {
    const paymentTypeName = getPaymentTypeName(option.paymentType);
    if (option.recurringCard) {
      return {
        text: paymentTypeName,
        label: t(
          PurchaseConfirmationTexts.paymentWithStoredCard.a11yLabel(
            paymentTypeName,
            option.recurringCard!.masked_pan,
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

  function getPaymentTestId(option: PaymentOption, index: number) {
    if (option.savedType === 'normal') {
      return getPaymentTypeName(option.paymentType) + 'Button';
    } else {
      return 'recurringPayment' + index;
    }
  }

  const paymentTexts = getPaymentTexts(option);

  const canSaveCard =
    authenticationType === 'phone' &&
    option.savedType === 'normal' &&
    option.paymentType !== PaymentType.Vipps;

  return (
    <View style={styles.card}>
      <PressableOpacity
        style={[styles.paymentOption, styles.centerRow]}
        onPress={() => onSelect(option)}
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
              {option.recurringCard && (
                <ThemeText
                  style={styles.maskedPanPadding}
                  testID={getPaymentTestId(option, index) + 'Number'}
                >
                  **** {`${option.recurringCard.masked_pan}`}
                </ThemeText>
              )}
            </View>
            <PaymentBrand icon={option.paymentType} />
          </View>
          {option.recurringCard && (
            <ThemeText style={styles.expireDate}>
              {getExpireDate(option.recurringCard.expires_at)}
            </ThemeText>
          )}
        </View>
      </PressableOpacity>
      {selected && canSaveCard && (
        <PressableOpacity
          onPress={() => onSetShouldSave(!shouldSave)}
          style={styles.saveOptionSection}
        >
          <ThemeText style={styles.saveOptionTextPadding}>
            {t(SelectPaymentMethodTexts.save_payment_option_description.text)}
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
