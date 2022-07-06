import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import {StyleSheet, useTheme} from '@atb/theme';
import Button from '@atb/components/button';
import {
  PurchaseConfirmationTexts,
  ScreenHeaderTexts,
  useTranslation,
} from '@atb/translations';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {Confirm} from '@atb/assets/svg/mono-icons/actions';
import {parseISO} from 'date-fns';
import ThemeText from '@atb/components/text';
import SelectPaymentMethodTexts from '@atb/translations/screens/subscreens/SelectPaymentMethodTexts';
import {listRecurringPayments, PaymentType} from '@atb/tickets';
import {PaymentMethod, SavedPaymentOption} from '../../types';
import {useAuthState} from '@atb/auth';
import {ScreenHeaderWithoutNavigation} from '@atb/components/screen-header';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import FullScreenFooter from '@atb/components/screen-footer/full-footer';
import hexToRgba from 'hex-to-rgba';
import LinearGradient from 'react-native-linear-gradient';
import PaymentBrand from '../PaymentBrand';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';

type Props = {
  onSelect: (value: PaymentMethod) => void;
  close: () => void;
  previousPaymentMethod?: SavedPaymentOption;
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

const remotePaymentOptions: SavedPaymentOption[] = [];

const SelectPaymentMethod: React.FC<Props> = ({
  onSelect,
  previousPaymentMethod,
  close,
}) => {
  const {t} = useTranslation();

  const [loadingRecurringOptions, setLoadingRecurringOptions] =
    useState<boolean>(true);

  const {user} = useAuthState();
  const {theme} = useTheme();
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
  const [remoteOptions, setRemoteOptions] = useState(remotePaymentOptions);
  const styles = useStyles();

  async function getRecurringPaymentOptions(): Promise<
    Array<SavedPaymentOption>
  > {
    if (!user || user.isAnonymous) return [];
    const recurringOptions: Array<SavedPaymentOption> = (
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
    return [...recurringOptions.reverse()];
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
      let remoteOptions = await getRecurringPaymentOptions();
      setRemoteOptions(remoteOptions);
      setLoadingRecurringOptions(false);
    }
    run();
  }, [previousPaymentMethod]);

  return (
    <BottomSheetContainer fullHeight={true}>
      <View style={{flex: 1}}>
        <ScreenHeaderWithoutNavigation
          title={t(SelectPaymentMethodTexts.header.text)}
          leftButton={{
            type: 'cancel',
            onPress: close,
            text: t(ScreenHeaderTexts.headerButton.cancel.text),
          }}
          color={'background_1'}
          setFocusOnLoad={false}
        />
        <View style={{flexShrink: 100, flexGrow: 100}}>
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

            {loadingRecurringOptions && (
              <>
                <ActivityIndicator
                  color={theme.text.colors.primary}
                  style={styles.spinner}
                  animating={true}
                  size="large"
                />
              </>
            )}

            {remoteOptions.length > 0 && (
              <View style={styles.listHeading}>
                <ThemeText>
                  {t(SelectPaymentMethodTexts.saved_cards.text)}
                </ThemeText>
              </View>
            )}

            {remoteOptions.map((option, index) => {
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

          <LinearGradient
            style={styles.gradient}
            colors={[
              hexToRgba(theme.static.background.background_1.background, 0),
              hexToRgba(theme.static.background.background_1.background, 1),
            ]}
            pointerEvents={'none'}
          />
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
            icon={ArrowRight}
            iconPosition="right"
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
  const {user} = useAuthState();

  useEffect(() => {
    if (selected) {
      select();
    }
  }, [save]);

  function getPaymentTexts(option: SavedPaymentOption): {
    text: string;
    label: string;
    hint: string;
  } {
    let paymentTypeName = getPaymentTypeName(option.paymentType);

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
      case 'recurring-without-card':
        return {
          paymentType: option.paymentType,
          recurringPaymentId: option.recurringPaymentId,
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

  const paymentTexts = getPaymentTexts(option);

  return (
    <View style={styles.card}>
      <TouchableOpacity
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

function getPaymentTypeName(paymentType: PaymentType) {
  switch (paymentType) {
    case PaymentType.Visa:
      return 'Visa';
    case PaymentType.Mastercard:
      return 'MasterCard';
    case PaymentType.Vipps:
      return 'Vipps';
    default:
      return '';
  }
}

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
  radioInnner: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: theme.static.background.background_0.background,
  },
  saveCheckbox: {
    marginRight: theme.spacings.medium,
    height: 24,
    width: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: theme.static.background.background_accent_3.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveCheckboxChecked: {
    backgroundColor: theme.static.background.background_accent_3.background,
  },
  saveCheckboxDefault: {
    backgroundColor: theme.static.background.background_0.background,
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
  gradient: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 30,
  },
}));

export default SelectPaymentMethod;
