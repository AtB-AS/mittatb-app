import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {StyleSheet, useTheme} from '@atb/theme';
import Button from '@atb/components/button';
import {
  PurchaseConfirmationTexts,
  ScreenHeaderTexts,
  useTranslation,
} from '@atb/translations';
import {ArrowRight} from '@atb/assets/svg/icons/navigation';
import {SavedPaymentOption} from '@atb/preferences';
import {Confirm} from '@atb/assets/svg/icons/actions';
import {parseISO} from 'date-fns';
import ThemeText from '@atb/components/text';
import SelectPaymentMethodTexts from '@atb/translations/screens/subscreens/SelectPaymentMethodTexts';
import {listRecurringPayments, PaymentType} from '@atb/tickets';
import {PaymentMethod} from '../../types';
import {useAuthState} from '@atb/auth';
import {ScreenHeaderWithoutNavigation} from '@atb/components/screen-header';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import FullScreenFooter from '@atb/components/screen-footer/full-footer';
import PaymentBrand from '@atb/assets/svg/icons/ticketing/PaymentBrand';

type Props = {
  onSelect: (value: PaymentMethod) => void;
  close: () => void;
  previousPaymentMethod?: SavedPaymentOption;
};

function getSelectedPaymentMethod(
  previousPaymentMethod?: SavedPaymentOption,
): PaymentMethod | undefined {
  if (!previousPaymentMethod) return undefined;
  const {savedType} = previousPaymentMethod;

  switch (savedType) {
    case 'normal':
      const {paymentType} = previousPaymentMethod;
      switch (paymentType) {
        case PaymentType.Vipps:
          return {
            paymentType,
          };
        default:
        case PaymentType.MasterCard:
        case PaymentType.VISA:
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

function isRecurring(
  option: PaymentMethod,
): option is {
  paymentType: PaymentType.VISA | PaymentType.MasterCard;
  recurringPaymentId: number;
} {
  return (
    (option.paymentType === PaymentType.VISA ||
      option.paymentType === PaymentType.MasterCard) &&
    'recurringPaymentId' in option
  );
}

const defaultPaymentOptions: SavedPaymentOption[] = [
  {
    paymentType: PaymentType.Vipps,
    savedType: 'normal',
  },
  {
    paymentType: PaymentType.VISA,
    savedType: 'normal',
  },
  {
    paymentType: PaymentType.MasterCard,
    savedType: 'normal',
  },
];

const SelectPaymentMethod: React.FC<Props> = ({
  onSelect,
  previousPaymentMethod,
  close,
}) => {
  const {t} = useTranslation();

  const [loadingRemoteOption, setLoadingRemoteOptions] = useState<boolean>(
    true,
  );

  const {user} = useAuthState();

  const {height} = useWindowDimensions();

  const [selectedOption, setSelectedOption] = useState<
    PaymentMethod | undefined
  >(getSelectedPaymentMethod(previousPaymentMethod));
  const [options, setOptions] = useState(defaultPaymentOptions);
  const styles = useStyles();

  async function getOptions(): Promise<Array<SavedPaymentOption>> {
    if (!user?.phoneNumber) return [...options];
    const remoteOptions: Array<SavedPaymentOption> = (
      await listRecurringPayments()
    ).map((option) => {
      return {
        savedType: 'recurring',
        paymentType: option.payment_type,
        recurringCard: {
          id: option.id,
          masked_pan: option.masked_pan,
          expires_at: option.expires_at,
          payment_type: option.payment_type,
        },
      };
    });
    return [...remoteOptions.reverse(), ...defaultPaymentOptions];
  }

  const isSelectedOption = (item: SavedPaymentOption) => {
    // False if types doesn't match
    if (!(selectedOption?.paymentType === item.paymentType)) return false;

    const itemIsReccurring = !!selectedOption && isRecurring(selectedOption);
    const selectedIsRecurring = item.savedType === 'recurring';

    // True if recurring ID matches
    if (itemIsReccurring && selectedIsRecurring) {
      return item.recurringCard.id === selectedOption.recurringPaymentId;
    }

    // True if both are not recurring, false otherwise
    return !itemIsReccurring && !selectedIsRecurring;
  };

  useEffect(() => {
    async function run() {
      let remoteOptions = await getOptions();
      setOptions(remoteOptions);
      setLoadingRemoteOptions(false);
    }
    run();
  }, [previousPaymentMethod]);

  return (
    <BottomSheetContainer>
      <ScreenHeaderWithoutNavigation
        title={t(SelectPaymentMethodTexts.header.text)}
        leftButton={{
          type: 'cancel',
          onPress: close,
          text: t(ScreenHeaderTexts.headerButton.cancel.text),
        }}
        color={'background_2'}
        setFocusOnLoad={false}
      />
      {loadingRemoteOption ? <ActivityIndicator /> : null}
      <FlatList
        style={{
          maxHeight: height * (2 / 3),
          ...styles.paymentOptions,
        }}
        data={options}
        keyExtractor={(item) =>
          `${item.paymentType}_${
            item.savedType === 'recurring' ? item.recurringCard.id : 0
          }`
        }
        renderItem={({item}) => {
          return (
            <PaymentOptionView
              option={item}
              selected={isSelectedOption(item)}
              onSelect={(val: PaymentMethod) => {
                setSelectedOption(val);
              }}
            />
          );
        }}
      />
      <FullScreenFooter>
        <Button
          style={styles.confirmButton}
          color="primary_2"
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
          icon={ArrowRight}
          iconPosition="right"
        />
      </FullScreenFooter>
    </BottomSheetContainer>
  );
};

type PaymentOptionsProps = {
  option: SavedPaymentOption;
  selected: boolean;
  onSelect: (value: PaymentMethod) => void;
};

const PaymentOptionView: React.FC<PaymentOptionsProps> = ({
  option,
  selected,
  onSelect,
}) => {
  const {theme} = useTheme();
  const [save, setSave] = useState<boolean>(false);
  const {t} = useTranslation();
  const styles = useStyles();
  const {user} = useAuthState();

  useEffect(() => {
    if (selected) {
      select();
    }
  }, [save]);

  function getPaymentInfo(
    type: PaymentType,
  ): {brand: PaymentType; text: string; a11y: string} {
    switch (type) {
      case PaymentType.Vipps:
        return {
          brand: type,
          text: t(PurchaseConfirmationTexts.paymentButtonVipps.text),
          a11y: t(PurchaseConfirmationTexts.paymentButtonVipps.a11yHint),
        };
      case PaymentType.MasterCard:
        return {
          brand: type,
          text: t(PurchaseConfirmationTexts.paymentButtonCardMC.text),
          a11y: t(PurchaseConfirmationTexts.paymentButtonCardMC.a11yHint),
        };
      case PaymentType.VISA:
        return {
          brand: type,
          text: t(PurchaseConfirmationTexts.paymentButtonCardVisa.text),
          a11y: t(PurchaseConfirmationTexts.paymentButtonCardVisa.a11yHint),
        };
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

  function getExpireDate(iso: string): string {
    let date = parseISO(iso);
    let year = date.getFullYear();
    let month = date.getMonth();
    if (month === 0) {
      month = 12;
      year--;
    }
    return `${month < 10 ? '0' + month : month}/${year.toString().slice(2, 4)}`;
  }

  const paymentInfo = getPaymentInfo(option.paymentType);

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={[styles.paymentOption, styles.centerRow]}
        onPress={select}
        accessibilityLabel={paymentInfo.a11y}
        accessibilityHint={paymentInfo.a11y}
        accessibilityRole="radio"
        accessibilityState={{selected: selected}}
      >
        <View style={styles.column}>
          <View style={styles.row}>
            <View style={styles.centerRow}>
              <RadioView checked={selected} />
              <ThemeText>{paymentInfo.text}</ThemeText>
              {option.savedType === 'recurring' ? (
                <ThemeText style={styles.maskedPanPadding}>
                  **** {`${option.recurringCard.masked_pan}`}
                </ThemeText>
              ) : null}
            </View>
            <PaymentBrand icon={paymentInfo.brand} />
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
      </TouchableOpacity>
      {selected &&
      user?.phoneNumber &&
      option.savedType === 'normal' &&
      option.paymentType !== PaymentType.Vipps ? (
        <TouchableOpacity
          onPress={() => {
            setSave(!save);
          }}
          style={styles.saveOptionSection}
          accessibilityLabel={t(
            save
              ? SelectPaymentMethodTexts.not_save_card.a11yhint
              : SelectPaymentMethodTexts.save_card.a11yhint,
          )}
          accessibilityHint={t(
            save
              ? SelectPaymentMethodTexts.not_save_card.a11yhint
              : SelectPaymentMethodTexts.save_card.a11yhint,
          )}
          accessibilityRole="checkbox"
          accessibilityState={{selected: save}}
        >
          <ThemeText style={styles.saveOptionTextPadding}>
            {t(SelectPaymentMethodTexts.save_payment_option_description.text)}
          </ThemeText>
          <View style={styles.saveButton}>
            <SavedCheckbox checked={save} />
            <ThemeText>
              {t(
                save
                  ? SelectPaymentMethodTexts.not_save_card.text
                  : SelectPaymentMethodTexts.save_card.text,
              )}
            </ThemeText>
          </View>
        </TouchableOpacity>
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
      {checked ? <View style={styles.radioInnner} /> : null}
    </View>
  );
};

const SavedCheckbox: React.FC<CheckedProps> = ({checked}) => {
  const {theme} = useTheme();
  const styles = useStyles();
  return (
    <View
      style={[
        styles.saveCheckbox,
        checked ? styles.saveCheckboxChecked : styles.saveCheckboxDefault,
      ]}
    >
      {checked ? <Confirm fill="white"></Confirm> : null}
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
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  column: {flex: 1, flexDirection: 'column'},
  card: {
    marginVertical: theme.spacings.xSmall,
    borderRadius: theme.border.radius.regular,
    backgroundColor: theme.colors.background_0.backgroundColor,
  },
  saveOptionSection: {
    paddingHorizontal: theme.spacings.xLarge,
    paddingBottom: theme.spacings.xLarge,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background_2.backgroundColor,
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
    backgroundColor: theme.colors.primary_2.backgroundColor,
  },
  radioBlank: {
    backgroundColor: theme.colors.background_0.backgroundColor,
  },
  radio: {
    marginRight: theme.spacings.medium,
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: theme.border.width.medium,
    borderColor: theme.colors.primary_2.backgroundColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInnner: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.background_0.backgroundColor,
  },
  saveCheckbox: {
    marginRight: theme.spacings.medium,
    height: 24,
    width: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: theme.colors.primary_2.backgroundColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveCheckboxChecked: {
    backgroundColor: theme.colors.primary_2.backgroundColor,
  },
  saveCheckboxDefault: {
    backgroundColor: theme.colors.background_0.backgroundColor,
  },
  saveButton: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    paddingTop: theme.spacings.small,
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

export default SelectPaymentMethod;
