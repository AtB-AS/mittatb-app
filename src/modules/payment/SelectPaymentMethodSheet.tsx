import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {Button} from '@atb/components/button';
import {useTranslation} from '@atb/translations';
import {Confirm} from '@atb/assets/svg/mono-icons/actions';
import {ThemeText} from '@atb/components/text';
import SelectPaymentMethodTexts from '@atb/translations/screens/subscreens/SelectPaymentMethodTexts';
import {FullScreenFooter} from '@atb/components/screen-footer';
import {useFirestoreConfigurationContext} from '@atb/modules/configuration';
import {useAuthContext} from '@atb/modules/auth';
import {PaymentType} from '@atb/modules/ticketing';
import {MessageInfoText} from '@atb/components/message-info-text';
import AnonymousPurchases from '@atb/translations/screens/subscreens/AnonymousPurchases';
import {
  CardPaymentMethod,
  PaymentMethod,
  PaymentSelection,
  NonRecurringPaymentMethod,
} from './types';
import {SinglePaymentMethod} from './SinglePaymentMethod';
import {MultiplePaymentMethodsRadioSection} from './MultiplePaymentMethodsRadioSection';
import {
  BottomSheetHeaderType,
  BottomSheetModal,
} from '@atb/components/bottom-sheet';
import {BottomSheetModal as GorhomBottomSheetModal} from '@gorhom/bottom-sheet';
import {giveFocus} from '@atb/utils/use-focus-on-load';

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
  bottomSheetModalRef: React.RefObject<GorhomBottomSheetModal | null>;
  onCloseFocusRef: React.RefObject<View | null>;
};

export const SelectPaymentMethodSheet: React.FC<Props> = ({
  onSelect,
  recurringPaymentMethods,
  currentOptions,
  bottomSheetModalRef,
  onCloseFocusRef,
}) => {
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const styles = useStyles();
  const [shouldSave, setShouldSave] = useState(
    currentOptions?.shouldSavePaymentMethod ?? false,
  );
  const {authenticationType} = useAuthContext();

  const {paymentTypes} = useFirestoreConfigurationContext();
  const defaultPaymentMethods = paymentTypes.map((paymentType) => ({
    paymentType,
  }));
  const singlePaymentMethods = defaultPaymentMethods.filter(
    (method): method is NonRecurringPaymentMethod =>
      [PaymentType.Vipps, PaymentType.ApplePay].includes(method.paymentType),
  );

  singlePaymentMethods.push({paymentType: PaymentType.ApplePay});

  const multiplePaymentMethods = defaultPaymentMethods.filter(
    (method): method is CardPaymentMethod =>
      [PaymentType.Mastercard, PaymentType.Visa, PaymentType.Amex].includes(
        method.paymentType,
      ),
  );

  const [selectedMethod, setSelectedMethod] = useState(
    currentOptions?.paymentMethod,
  );

  useEffect(() => {
    if (currentOptions?.paymentMethod) {
      setSelectedMethod(currentOptions?.paymentMethod);
    }
  }, [currentOptions?.paymentMethod]);

  const toggleShouldSave = () => setShouldSave((shouldSave) => !shouldSave);

  const Footer = () => (
    <FullScreenFooter>
      <Button
        expanded={true}
        style={styles.confirmButton}
        interactiveColor={theme.color.interactive[0]}
        text={t(SelectPaymentMethodTexts.confirm_button.text)}
        accessibilityHint={t(SelectPaymentMethodTexts.confirm_button.a11yhint)}
        onPress={() => {
          if (selectedMethod) onSelect(selectedMethod, shouldSave);
        }}
        disabled={!selectedMethod}
        rightIcon={{svg: Confirm}}
        testID="confirmButton"
      />
    </FullScreenFooter>
  );

  return (
    <BottomSheetModal
      bottomSheetModalRef={bottomSheetModalRef}
      heading={t(SelectPaymentMethodTexts.header.text)}
      bottomSheetHeaderType={BottomSheetHeaderType.Close}
      Footer={Footer}
      closeCallback={() => giveFocus(onCloseFocusRef)}
    >
      <View style={styles.paymentMethods}>
        <View>
          {recurringPaymentMethods && recurringPaymentMethods?.length > 0 && (
            <View style={styles.listHeading}>
              <ThemeText color="secondary">
                {t(SelectPaymentMethodTexts.saved_cards.text)}
              </ThemeText>
            </View>
          )}
          {recurringPaymentMethods?.map((method, index) => (
            <SinglePaymentMethod
              key={method.recurringPayment?.id}
              paymentMethod={method}
              selected={
                selectedMethod?.recurringPayment?.id ===
                method.recurringPayment?.id
              }
              onSelect={(val: PaymentSelection) => {
                setSelectedMethod(val);
              }}
              index={index}
            />
          ))}
        </View>

        <View>
          {recurringPaymentMethods && recurringPaymentMethods?.length > 0 && (
            <View style={styles.listHeading}>
              <ThemeText color="secondary">
                {t(SelectPaymentMethodTexts.other_cards.text)}
              </ThemeText>
            </View>
          )}

          {singlePaymentMethods.map((method, index) => {
            return (
              <SinglePaymentMethod
                key={method.paymentType}
                paymentMethod={method}
                selected={selectedMethod?.paymentType === method.paymentType}
                onSelect={(val: PaymentSelection) => {
                  setSelectedMethod(val);
                }}
                index={index}
              />
            );
          })}

          <MultiplePaymentMethodsRadioSection
            shouldSave={shouldSave}
            toggleShouldSave={toggleShouldSave}
            selected={selectedMethod?.paymentType === PaymentType.PaymentCard}
            onSelect={() => {
              setSelectedMethod({
                paymentType: PaymentType.PaymentCard,
              });
            }}
            paymentMethodsInGroup={multiplePaymentMethods}
            testID="multiplePaymentMethods"
          />
        </View>

        {authenticationType !== 'phone' && (
          <MessageInfoText
            style={styles.warningMessageAnonym}
            message={t(AnonymousPurchases.consequences.select_payment_method)}
            type="warning"
          />
        )}
      </View>
    </BottomSheetModal>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  listHeading: {
    flex: 1,
    paddingBottom: theme.spacing.small,
  },
  paymentMethods: {
    flex: 1,
    paddingHorizontal: theme.spacing.medium,
    rowGap: theme.spacing.large,
  },
  paymentMethod: {
    flex: 1,
    padding: theme.spacing.medium,
    borderRadius: theme.border.radius.regular,
  },
  confirmButton: {
    marginTop: theme.spacing.small,
  },
  warningMessageAnonym: {
    paddingTop: theme.spacing.medium,
    paddingLeft: theme.spacing.medium,
  },
}));
