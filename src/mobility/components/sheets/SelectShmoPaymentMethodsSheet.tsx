import React from 'react';
import {View} from 'react-native';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {Button} from '@atb/components/button';
import {useTranslation} from '@atb/translations';
import {Confirm} from '@atb/assets/svg/mono-icons/actions';
import SelectPaymentMethodTexts from '@atb/translations/screens/subscreens/SelectPaymentMethodTexts';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {FullScreenFooter} from '@atb/components/screen-footer';
import {ScrollView} from 'react-native-gesture-handler';
import {
  PaymentMethod,
  PaymentSelection,
  SinglePaymentMethod,
  usePreviousPaymentMethods,
} from '@atb/modules/payment';
import {useMapContext} from '@atb/MapContext';
import {MessageInfoBox} from '@atb/components/message-info-box';

type Props = {
  onSelect: () => void;
  recurringPaymentMethods?: PaymentMethod[];
  onClose?: () => void;
  onGoToPaymentPage: () => void;
};

export const SelectShmoPaymentMethodSheet = ({
  onSelect,
  onClose,
  onGoToPaymentPage,
}: Props) => {
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const styles = useStyles();
  const {selectedShmoPaymentMethod, setSelectedShmoPaymentMethod} =
    useMapContext();
  const {recurringPaymentMethods} = usePreviousPaymentMethods();

  return (
    <BottomSheetContainer
      title={t(SelectPaymentMethodTexts.header.text)}
      onClose={onClose}
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
                  key={method.recurringCard?.id}
                  paymentMethod={method}
                  selected={
                    selectedShmoPaymentMethod?.recurringCard?.id ===
                    method.recurringCard?.id
                  }
                  onSelect={(val: PaymentSelection) => {
                    setSelectedShmoPaymentMethod(val);
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
              onPress={() => {
                if (selectedShmoPaymentMethod) {
                  onSelect();
                }
              }}
              disabled={!selectedShmoPaymentMethod}
              rightIcon={{svg: Confirm}}
              testID="confirmButton"
            />
          </FullScreenFooter>
        </View>
      </ScrollView>
    </BottomSheetContainer>
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
