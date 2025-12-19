import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {Button} from '@atb/components/button';
import {useTranslation} from '@atb/translations';
import {Confirm} from '@atb/assets/svg/mono-icons/actions';
import SelectPaymentMethodTexts from '@atb/translations/screens/subscreens/SelectPaymentMethodTexts';
import {FullScreenFooter} from '@atb/components/screen-footer';
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
import {
  BottomSheetHeaderType,
  MapBottomSheet,
} from '@atb/components/bottom-sheet-v2';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';

type Props = {
  onSelect: () => void;
  recurringPaymentMethods?: PaymentMethod[];
  onClose?: () => void;
  onGoToPaymentPage: () => void;
  locationArrowOnPress: () => void;
  navigateToScanQrCode: () => void;
};

export const SelectShmoPaymentMethodSheet = ({
  onSelect,
  onClose,
  onGoToPaymentPage,
  locationArrowOnPress,
  navigateToScanQrCode,
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

  const {mutate: savePrevPaymentMethod, isPending} = useMutation({
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
      snapPoints={['70%']}
      closeCallback={onClose}
      enableDynamicSizing={false}
      bottomSheetHeaderType={BottomSheetHeaderType.Close}
      locationArrowOnPress={locationArrowOnPress}
      navigateToScanQrCode={navigateToScanQrCode}
    >
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
        <BottomSheetScrollView>
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
        </BottomSheetScrollView>
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
          loading={isPending}
          rightIcon={{svg: Confirm}}
          testID="confirmButton"
        />
      </FullScreenFooter>
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
