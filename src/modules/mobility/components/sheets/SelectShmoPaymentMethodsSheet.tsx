import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {Button} from '@atb/components/button';
import {dictionary, useTranslation} from '@atb/translations';
import {Close, Confirm} from '@atb/assets/svg/mono-icons/actions';
import SelectPaymentMethodTexts from '@atb/translations/screens/subscreens/SelectPaymentMethodTexts';
import {FullScreenFooter} from '@atb/components/screen-footer';
import {ScrollView} from 'react-native-gesture-handler';
import {
  PaymentMethod,
  savePreviousPaymentMethodByUser,
  SinglePaymentMethod,
  usePreviousPaymentMethods,
  useSelectedShmoPaymentMethod,
} from '@atb/modules/payment';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {useAuthContext} from '@atb/modules/auth';
import {useMutation} from '@tanstack/react-query';
import {MapBottomSheet} from '@atb/components/bottom-sheet-map';

type Props = {
  onSelect: () => void;
  recurringPaymentMethods?: PaymentMethod[];
  onClose?: () => void;
  onGoToPaymentPage: () => void;
  positionArrowCallback: () => void;
};

export const SelectShmoPaymentMethodSheet = ({
  onSelect,
  onClose,
  onGoToPaymentPage,
  positionArrowCallback,
}: Props) => {
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const styles = useStyles();
  const {recurringPaymentMethods} = usePreviousPaymentMethods();
  const {userId} = useAuthContext();
  const defaultPaymentMethod = useSelectedShmoPaymentMethod();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    PaymentMethod | undefined
  >();

  const {mutate: savePrevPaymentMethod, isLoading} = useMutation({
    mutationFn: (params: {userId: string; paymentMethod: PaymentMethod}) =>
      savePreviousPaymentMethodByUser(params.userId, params.paymentMethod),
    onSuccess: onSelect,
  });

  useEffect(() => {
    if (defaultPaymentMethod) {
      setSelectedPaymentMethod(defaultPaymentMethod);
    }
  }, [defaultPaymentMethod]);

  return (
    <MapBottomSheet
      closeCallback={onClose}
      enableDynamicSizing={true}
      rightIconText={t(dictionary.appNavigation.close.text)}
      rightIcon={Close}
      positionArrowCallback={positionArrowCallback}
    >
      <ScrollView>
        <View style={{flex: 1}}>
          <View style={styles.paymentMethods}>
            <MessageInfoBox
              type="info"
              title={t(SelectPaymentMethodTexts.new_card_info.title)}
              message={t(SelectPaymentMethodTexts.new_card_info.text)}
              onPressConfig={{
                action: onGoToPaymentPage,
                text: t(SelectPaymentMethodTexts.new_card_info.link_profile),
              }}
            />
            <View>
              {recurringPaymentMethods?.map((method, index) => (
                <SinglePaymentMethod
                  key={method.recurringPayment?.id}
                  paymentMethod={method}
                  selected={
                    selectedPaymentMethod?.recurringPayment?.id ===
                    method.recurringPayment?.id
                  }
                  onSelect={(val: PaymentMethod) => {
                    if (!val?.recurringPayment) return;
                    setSelectedPaymentMethod(val);
                  }}
                  index={index}
                />
              ))}
            </View>
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
              onPress={async () => {
                if (
                  selectedPaymentMethod &&
                  selectedPaymentMethod.recurringPayment &&
                  userId
                ) {
                  savePrevPaymentMethod({
                    userId,
                    paymentMethod: {
                      paymentType: selectedPaymentMethod?.paymentType,
                      recurringPayment: selectedPaymentMethod.recurringPayment,
                    },
                  });
                }
              }}
              disabled={!selectedPaymentMethod}
              loading={isLoading}
              rightIcon={{svg: Confirm}}
              testID="confirmButton"
            />
          </FullScreenFooter>
        </View>
      </ScrollView>
    </MapBottomSheet>
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
    paddingBottom: theme.spacing.medium,
    gap: theme.spacing.xSmall,
  },
  confirmButton: {
    marginTop: theme.spacing.small,
  },
  warningMessageAnonym: {
    paddingTop: theme.spacing.medium,
    paddingLeft: theme.spacing.medium,
  },
}));
