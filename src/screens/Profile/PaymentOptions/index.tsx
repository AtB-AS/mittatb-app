import SvgDelete from '@atb/assets/svg/mono-icons/actions/Delete';
import {useAuthState} from '@atb/auth';
import FullScreenHeader from '@atb/components/screen-header/full-header';
import ThemeText from '@atb/components/text';
import PaymentBrand from '@atb/screens/Ticketing/Purchase/Payment/PaymentBrand';
import {
  getExpireDate,
  getPaymentTypeName,
} from '@atb/screens/Ticketing/Purchase/utils';
import {StyleSheet, Theme, useTheme} from '@atb/theme';
import {
  deleteRecurringPayment,
  listRecurringPayments,
  RecurringPayment,
} from '@atb/tickets';
import {useTranslation} from '@atb/translations';
import PaymentOptionsTexts from '@atb/translations/screens/subscreens/PaymentOptions';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, TouchableOpacity, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {destructiveAlert} from '../Home/utils';
import MessageBox from '@atb/components/message-box';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '@atb/navigation';
import useFontScale from '@atb/utils/use-font-scale';
import Bugsnag from '@bugsnag/react-native';
import {useIsFocused} from '@react-navigation/native';

type PaymentOptionsProps = {
  navigation: StackNavigationProp<RootStackParamList>;
};

export default function PaymentOptions({navigation}: PaymentOptionsProps) {
  const style = useStyle();
  const {theme} = useTheme();
  const {t} = useTranslation();
  const {user} = useAuthState();
  const isFocused = useIsFocused();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [storedCards, setStoredCards] = useState<RecurringPayment[]>([]);

  async function getRecurringPaymentOptions(): Promise<RecurringPayment[]> {
    if (!user || user.isAnonymous) return [];
    try {
      const recurringOptions = await listRecurringPayments();
      return recurringOptions.reverse();
    } catch (error: any) {
      Bugsnag.notify(error);
      return [];
    }
  }

  useEffect(() => {
    if (isFocused) {
      refreshCards();
    }
  }, [isFocused]);

  async function handleRemovePayment(paymentOption: RecurringPayment) {
    setIsLoading(true);
    try {
      await deleteRecurringPayment(paymentOption.id);
    } catch (error: any) {
      Bugsnag.notify(error);
    } finally {
      refreshCards();
    }
  }

  async function refreshCards() {
    setIsLoading(true);
    try {
      const remoteOptions = await getRecurringPaymentOptions();
      setStoredCards(remoteOptions);
    } catch (error: any) {
      Bugsnag.notify(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={style.container}>
      <FullScreenHeader
        title={t(PaymentOptionsTexts.header.title)}
        leftButton={{type: 'back'}}
      />

      {!isLoading && storedCards.length == 0 && (
        <View accessibilityLiveRegion="polite">
          <MessageBox
            message={t(PaymentOptionsTexts.noStoredCards)}
            withMargin={true}
            containerStyle={{marginTop: theme.spacings.xLarge}}
          />
        </View>
      )}

      <ScrollView style={style.contentMargin}>
        {storedCards.length > 0 &&
          storedCards.map((card) => (
            <Card
              card={card}
              removePaymentHandler={handleRemovePayment}
              key={card.id}
            />
          ))}
        {isLoading && (
          <ActivityIndicator
            key={'spinner'}
            color={theme.text.colors.secondary}
            size="large"
            style={{paddingTop: theme.spacings.xLarge}}
          />
        )}
      </ScrollView>
    </View>
  );
}

const Card = (props: {
  card: RecurringPayment;
  removePaymentHandler: (card: RecurringPayment) => void;
}) => {
  const {card, removePaymentHandler} = props;
  const paymentName = getPaymentTypeName(card.payment_type);
  const style = useStyle();
  const {theme} = useTheme();
  const {t} = useTranslation();
  const fontScale = useFontScale();

  return (
    <View style={style.card}>
      <View style={style.cardTop}>
        <View>
          <ThemeText
            accessibilityLabel={t(
              PaymentOptionsTexts.a11y.cardInfo(paymentName, card.masked_pan),
            )}
          >
            {paymentName} **** {card.masked_pan}
          </ThemeText>
        </View>

        <View style={style.cardIcons}>
          <PaymentBrand icon={card.payment_type} />
          <TouchableOpacity
            accessibilityLabel={t(
              PaymentOptionsTexts.a11y.deleteCardIcon(
                paymentName,
                card.masked_pan,
              ),
            )}
            style={{marginLeft: theme.spacings.medium}}
            onPress={() => {
              destructiveAlert({
                alertTitleString: t(PaymentOptionsTexts.deleteModal.title),
                alertMessageString: t(PaymentOptionsTexts.deleteModal.message),
                cancelAlertString: t(
                  PaymentOptionsTexts.deleteModal.cancelButton,
                ),
                confirmAlertString: t(
                  PaymentOptionsTexts.deleteModal.confirmButton,
                ),
                destructiveArrowFunction: () => removePaymentHandler(card),
              });
            }}
          >
            <SvgDelete
              height={21 * fontScale}
              width={21 * fontScale}
              fill={
                theme.interactive.interactive_destructive.default.background
              }
            />
          </TouchableOpacity>
        </View>
      </View>

      <ThemeText color="secondary" type="body__secondary">
        {getExpireDate(card.expires_at)}
      </ThemeText>
    </View>
  );
};

const useStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    backgroundColor: theme.static.background.background_1.background,
    flex: 1,
  },
  contentMargin: {
    margin: theme.spacings.medium,
  },
  card: {
    marginVertical: theme.spacings.xSmall,
    borderRadius: theme.border.radius.regular,
    backgroundColor: theme.static.background.background_0.background,
    padding: theme.spacings.medium,
  },
  cardTop: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardIcons: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
}));
