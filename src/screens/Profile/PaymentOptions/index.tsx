import SvgDelete from '@atb/assets/svg/mono-icons/actions/Delete';
import {useAuthState} from '@atb/auth';
import FullScreenHeader from '@atb/components/screen-header/full-header';
import ThemeText from '@atb/components/text';
import PaymentBrand from '@atb/screens/Ticketing/Purchase/Payment/PaymentBrand';
import {SavedPaymentOption} from '@atb/screens/Ticketing/Purchase/types';
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
import {OperatorActivitiesEnumeration} from '@entur-private/abt-protobuf-js-grpc-node/lib/uk/org/netex/www/netex/uk_org_netex_www_netex_pb';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Alert, TouchableOpacity, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {destructiveAlert} from '../Home/utils';
import * as Sections from '@atb/components/sections';
import MessageBox from '@atb/components/message-box';

export default function PaymentOptions() {
  const style = useStyle();
  const {theme} = useTheme();
  const {t} = useTranslation();
  const {user} = useAuthState();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [storedCards, setStoredCards] = useState<RecurringPayment[]>([]);

  async function getRecurringPaymentOptions(): Promise<
    Array<RecurringPayment>
  > {
    if (!user || user.isAnonymous) return [];
    const recurringOptions: Array<RecurringPayment> =
      await listRecurringPayments();
    return [...recurringOptions.reverse()];
  }

  useEffect(() => {
    async function run() {
      let remoteOptions = await getRecurringPaymentOptions();
      setStoredCards(remoteOptions);
      setIsLoading(false);
    }
    run();
  }, []);

  async function handleRemovePayment(paymentOption: RecurringPayment) {
    setIsLoading(true);
    await deleteRecurringPayment(paymentOption.id);
    const remoteOptions = await getRecurringPaymentOptions();
    setStoredCards(remoteOptions);
    setIsLoading(false);
  }

  return (
    <View style={style.container}>
      <FullScreenHeader
        title={t(PaymentOptionsTexts.header.title)}
        leftButton={{type: 'back'}}
      />

      
      {isLoading && (
        <ActivityIndicator
          color={theme.text.colors.secondary}
          size="large"
          style={{paddingTop: theme.spacings.xLarge}}
        />
      )}

      {!isLoading && storedCards.length > 0 && (
        <ScrollView style={style.contentMargin}>
          {storedCards.map((card) => (
            <Card card={card} removePaymentHandler={handleRemovePayment} />
          ))}
        </ScrollView>
      )}

      {!isLoading && storedCards.length == 0 && (
        <MessageBox message={t(PaymentOptionsTexts.noStoredCards)} withMargin={true} containerStyle={{marginTop: theme.spacings.xLarge}} />
      )}
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

  return (
    <View style={style.card}>
      <View style={style.cardTop}>
        <View>
          <ThemeText>
            {paymentName} **** {card.masked_pan}
          </ThemeText>
        </View>

        <View style={style.cardIcons}>
          <PaymentBrand icon={card.payment_type} />
          <TouchableOpacity
            accessibilityLabel={t(PaymentOptionsTexts.a11y.deleteCardIcon(paymentName, card.masked_pan))}
            style={{marginLeft: theme.spacings.medium}}
            onPress={() => {
              destructiveAlert({
                alertTitleString: t(PaymentOptionsTexts.deleteModal.title),
                alertMessageString: t(PaymentOptionsTexts.deleteModal.message),
                cancelAlertString: t(PaymentOptionsTexts.deleteModal.cancelButton),
                confirmAlertString: t(PaymentOptionsTexts.deleteModal.confirmButton),
                destructiveArrowFunction: () => removePaymentHandler(card),
              });
            }}
          >
            <SvgDelete
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
    paddingHorizontal: theme.spacings.medium,
    paddingTop: theme.spacings.medium,
    paddingBottom: theme.spacings.medium,
  },
  cardTop: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardName: {},
  cardIcons: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
}));
