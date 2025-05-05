import React from 'react';
import {View} from 'react-native';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {Button} from '@atb/components/button';
import {useTranslation} from '@atb/translations';
import {Confirm} from '@atb/assets/svg/mono-icons/actions';
import {ThemeText} from '@atb/components/text';
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
type Props = {
  onSelect: () => void;
  recurringPaymentMethods?: PaymentMethod[];
  onClose?: () => void;
};

export const SelectShmoPaymentMethodSheet = ({onSelect, onClose}: Props) => {
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const styles = useStyles();
  const {selectedPaymentMethod, setSelectedPaymentMethod} = useMapContext();
  const {recurringPaymentMethods} = usePreviousPaymentMethods();

  return (
    <BottomSheetContainer
      title={t(SelectPaymentMethodTexts.header.text)}
      onClose={onClose}
    >
      <ScrollView>
        <View style={{flex: 1}}>
          <View style={styles.paymentMethods}>
            <View>
              {recurringPaymentMethods &&
                recurringPaymentMethods?.length > 0 && (
                  <View style={styles.listHeading}>
                    <ThemeText color="secondary">
                      {t(SelectPaymentMethodTexts.saved_cards.text)}
                    </ThemeText>
                  </View>
                )}
              {recurringPaymentMethods?.map((method, index) => (
                <SinglePaymentMethod
                  key={method.recurringCard?.id}
                  paymentMethod={method}
                  selected={
                    selectedPaymentMethod?.recurringCard?.id ===
                    method.recurringCard?.id
                  }
                  onSelect={(val: PaymentSelection) => {
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
              onPress={() => {
                if (selectedPaymentMethod) {
                  onSelect();
                }
              }}
              disabled={!selectedPaymentMethod}
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
