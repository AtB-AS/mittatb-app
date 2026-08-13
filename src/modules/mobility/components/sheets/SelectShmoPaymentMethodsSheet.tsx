import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import SelectPaymentMethodTexts from '@atb/translations/screens/subscreens/SelectPaymentMethodTexts';
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
} from '@atb/components/bottom-sheet';

type Props = {
  recurringPaymentMethods?: PaymentMethod[];
  onClose?: () => void;
  onGoToPaymentPage: () => void;
  locationArrowOnPress: () => void;
  navigateToScanQrCode: () => void;
};

export const SelectShmoPaymentMethodSheet = ({
  onClose,
  onGoToPaymentPage,
  locationArrowOnPress,
  navigateToScanQrCode,
}: Props) => {
  const {t} = useTranslation();
  const styles = useStyles();
  const {recurringPaymentMethods} = usePreviousPaymentMethods();
  const {userId} = useAuthContext();
  const defaultPaymentMethod = useSelectedShmoPaymentMethod();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    PaymentMethod | undefined
  >();

  const {mutate: savePrevPaymentMethod} = useMutation({
    mutationFn: (params: {userId: string; paymentMethod: PaymentMethod}) =>
      savePreviousPaymentMethodByUser(params.userId, params.paymentMethod),
  });

  useEffect(() => {
    if (defaultPaymentMethod) {
      setSelectedPaymentMethod(defaultPaymentMethod);
    }
  }, [defaultPaymentMethod]);

  return (
    <MapBottomSheet
      closeCallback={onClose}
      bottomSheetHeaderType={BottomSheetHeaderType.Confirm}
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
        {recurringPaymentMethods?.map((method, index) => (
          <SinglePaymentMethod
            key={method.recurringPayment?.id}
            paymentMethod={method}
            selected={
              selectedPaymentMethod?.recurringPayment?.id ===
              method.recurringPayment?.id
            }
            onSelect={(val: PaymentMethod) => {
              if (!val?.recurringPayment || !userId) return;
              setSelectedPaymentMethod(val);
              savePrevPaymentMethod({
                userId,
                paymentMethod: {
                  paymentType: val.paymentType,
                  recurringPayment: val.recurringPayment,
                },
              });
            }}
            index={index}
          />
        ))}
      </View>
    </MapBottomSheet>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  listHeading: {
    flex: 1,
    paddingBottom: theme.spacing.small,
  },
  paymentMethods: {
    paddingHorizontal: theme.spacing.medium,
    paddingBottom: theme.spacing.medium,
    gap: theme.spacing.xSmall,
  },
  warningMessageAnonym: {
    paddingTop: theme.spacing.medium,
    paddingLeft: theme.spacing.medium,
  },
}));
