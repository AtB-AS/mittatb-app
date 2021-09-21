import React from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {Vipps} from '@atb/assets/svg/icons/ticketing';
import {StyleSheet, useTheme} from '@atb/theme';
import Button from '@atb/components/button';
import {SafeAreaView} from 'react-native-safe-area-context';
import {PurchaseConfirmationTexts, useTranslation} from '@atb/translations';
import {useState, useEffect} from 'react';
import {ArrowRight} from '@atb/assets/svg/icons/navigation';
import {SavedPaymentOption} from '@atb/preferences';
import {Confirm} from '@atb/assets/svg/icons/actions';
import {parseISO} from 'date-fns';
import VisaLogo from '@atb/assets/svg/icons/ticketing/Visa';
import MasterCardLogo from '@atb/assets/svg/icons/ticketing/MasterCard';
import ThemeText from '@atb/components/text';
import SelectPaymentMethodTexts from '@atb/translations/screens/subscreens/SelectPaymentMethodTexts';
import {listRecurringPayments, PaymentType} from '@atb/tickets';
import {PaymentMethod} from '../../types';
import {useAuthState} from '@atb/auth';

type Props = {
  onSelect: (value: PaymentMethod) => void;
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

const SelectPaymentMethod: React.FC<Props> = ({
  onSelect,
  previousPaymentMethod,
}) => {
  const {t} = useTranslation();

  const [loadingRemoteOption, setLoadingRemoteOptions] = useState<boolean>(
    true,
  );

  const {user} = useAuthState();

  const [selectedOption, setSelectedOption] = useState<
    PaymentMethod | undefined
  >(getSelectedPaymentMethod(previousPaymentMethod));
  const [options, setOptions] = useState<SavedPaymentOption[]>([
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
  ]);
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
    return [...remoteOptions.reverse(), ...options];
  }

  useEffect(() => {
    async function run() {
      let remoteOptions = await getOptions();
      setOptions(remoteOptions);
      setLoadingRemoteOptions(false);
    }
    run();
  }, [previousPaymentMethod]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.heading}>
        <ThemeText type="heading__title">
          {t(SelectPaymentMethodTexts.header.text)}
        </ThemeText>
      </View>
      {loadingRemoteOption ? <ActivityIndicator /> : null}
      <FlatList
        data={options}
        keyExtractor={(item) =>
          `${item.paymentType}_${
            item.savedType === 'recurring' ? item.recurringCard.id : 0
          }`
        }
        renderItem={({item}) => {
          return (
            <PaymentOptionView
              key={item.paymentType}
              option={item}
              selected={
                JSON.stringify({
                  type: selectedOption?.paymentType,
                  id:
                    !!selectedOption && isRecurring(selectedOption)
                      ? selectedOption.recurringPaymentId
                      : 0,
                }) ===
                JSON.stringify({
                  type: item.paymentType,
                  id:
                    item.savedType === 'recurring' ? item.recurringCard.id : 0,
                })
              }
              onSelect={(val: PaymentMethod) => {
                setSelectedOption(val);
              }}
            ></PaymentOptionView>
          );
        }}
      ></FlatList>
      <Button
        style={{
          marginTop: 6,
        }}
        color="primary_2"
        text={t(SelectPaymentMethodTexts.confirm_button.text)}
        accessibilityHint={t(SelectPaymentMethodTexts.confirm_button.a11yhint)}
        onPress={() => {
          if (selectedOption) {
            onSelect(selectedOption);
          }
        }}
        disabled={!selectedOption}
        icon={ArrowRight}
        iconPosition="right"
      ></Button>
    </SafeAreaView>
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
  ): {icon: React.ReactElement; text: string; a11y: string} {
    switch (type) {
      case PaymentType.Vipps:
        return {
          icon: <Vipps />,
          text: t(PurchaseConfirmationTexts.paymentButtonVipps.text),
          a11y: t(PurchaseConfirmationTexts.paymentButtonVipps.a11yHint),
        };
      case PaymentType.MasterCard:
        return {
          icon: <MasterCardLogo />,
          text: t(PurchaseConfirmationTexts.payWithMasterCard.text),
          a11y: t(PurchaseConfirmationTexts.payWithMasterCard.a11yHint),
        };
      case PaymentType.VISA:
        return {
          icon: <VisaLogo />,
          text: t(PurchaseConfirmationTexts.payWithVisa.text),
          a11y: t(PurchaseConfirmationTexts.payWithVisa.a11yHint),
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
    return `${month < 10 ? '0' + month : month}/${year.toString().slice(2, 4)}`;
  }

  const info = getPaymentInfo(option.paymentType);

  return (
    <TouchableOpacity
      style={styles.paymentOption}
      onPress={select}
      accessibilityHint={info.a11y}
    >
      <View style={styles.centerRow}>
        <View style={styles.centerRow}>
          <RadioView checked={selected} />
          <ThemeText>{info.text}</ThemeText>
          {option.savedType === 'recurring' ? (
            <ThemeText
              style={{
                paddingLeft: 8,
              }}
            >
              **** {`${option.recurringCard.masked_pan}`}
            </ThemeText>
          ) : null}
        </View>
        {option.savedType === 'recurring' ||
        option.paymentType === PaymentType.Vipps
          ? info.icon
          : null}
      </View>
      {selected &&
      user?.phoneNumber &&
      option.savedType === 'normal' &&
      option.paymentType !== PaymentType.Vipps ? (
        <View>
          <ThemeText
            style={{
              paddingTop: 18,
              opacity: 0.6,
            }}
          >
            {t(SelectPaymentMethodTexts.save_payment_option_description.text)}
          </ThemeText>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => {
              setSave(!save);
            }}
          >
            <SavedCheckbox checked={save} />
            <ThemeText>{t(SelectPaymentMethodTexts.save_card.text)}</ThemeText>
          </TouchableOpacity>
        </View>
      ) : null}
      {option.savedType === 'recurring' && option.recurringCard.expires_at ? (
        <View>
          <ThemeText style={styles.masked}>
            {getExpireDate(option.recurringCard.expires_at)}
          </ThemeText>
        </View>
      ) : null}
    </TouchableOpacity>
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
    justifyContent: 'center',
    paddingBottom: 24,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background_2.backgroundColor,
    paddingHorizontal: 12,
  },
  paymentOption: {
    flex: 1,
    flexDirection: 'column',
    marginVertical: 6,
    padding: 24,
    backgroundColor: theme.colors.background_0.backgroundColor,
    borderRadius: 8,
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
    marginRight: 12,
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
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
    marginRight: 12,
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
    paddingTop: 6,
  },
  masked: {
    opacity: 0.6,
    paddingTop: 18,
    paddingLeft: 36,
  },
}));

export default SelectPaymentMethod;
