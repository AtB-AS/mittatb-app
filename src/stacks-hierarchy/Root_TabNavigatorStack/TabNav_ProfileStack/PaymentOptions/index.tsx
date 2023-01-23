import SvgDelete from '@atb/assets/svg/mono-icons/actions/Delete';
import {useAuthState} from '@atb/auth';
import {MessageBox} from '@atb/components/message-box';
import {FullScreenHeader} from '@atb/components/screen-header';
import {ThemeText} from '@atb/components/text';
import PaymentBrand from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/Purchase/Payment/PaymentBrand';
import {
  getExpireDate,
  getPaymentTypeName,
} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/Purchase/utils';
import {StyleSheet, Theme, useTheme} from '@atb/theme';
import {
  deleteRecurringPayment,
  listRecurringPayments,
  RecurringPayment,
} from '@atb/ticketing';
import {useTranslation} from '@atb/translations';
import PaymentOptionsTexts from '@atb/translations/screens/subscreens/PaymentOptions';
import useFontScale from '@atb/utils/use-font-scale';
import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {FlatList, TouchableOpacity, View} from 'react-native';
import {destructiveAlert} from '../Home/utils';
import {ProfileScreenProps} from '../types';

type PaymentOptionsProps = ProfileScreenProps<'PaymentOptions'>;

type RecurringPaymentRenderItem = {
  item: RecurringPayment;
};

export default function PaymentOptions({}: PaymentOptionsProps) {
  const style = useStyle();
  const {t} = useTranslation();
  const {user} = useAuthState();
  const isFocused = useIsFocused();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [storedCards, setStoredCards] = useState<RecurringPayment[]>([]);
  const [showError, setShowError] = useState<boolean>(false);

  async function getRecurringPaymentOptions(): Promise<RecurringPayment[]> {
    if (!user || user.isAnonymous) return [];
    try {
      const recurringOptions = await listRecurringPayments();
      return recurringOptions.reverse();
    } catch (error: any) {
      setShowError(true);
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
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={style.container}>
      <View>
        <FullScreenHeader
          style={{elevation: 1000, zIndex: 1000}}
          title={t(PaymentOptionsTexts.header.title)}
          leftButton={{type: 'back'}}
        />
      </View>
      <View style={style.contentContainer}>
        <FlatList
          ListHeaderComponent={
            !isLoading && showError ? (
              <GenericError />
            ) : !isLoading && storedCards.length == 0 ? (
              <NoCardsInfo />
            ) : null
          }
          refreshing={isLoading}
          onRefresh={() => refreshCards()}
          progressViewOffset={0}
          data={storedCards}
          keyExtractor={(item) => 'card-' + item.id}
          renderItem={({item}: RecurringPaymentRenderItem) => (
            <Card card={item} removePaymentHandler={handleRemovePayment} />
          )}
        />
      </View>
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

const NoCardsInfo = () => {
  const style = useStyle();
  const {t} = useTranslation();
  return (
    <View accessibilityLiveRegion="polite">
      <MessageBox
        type="info"
        message={t(PaymentOptionsTexts.noStoredCards)}
        style={style.messageStyle}
      />
    </View>
  );
};

const GenericError = () => {
  const style = useStyle();
  const {t} = useTranslation();
  return (
    <View accessibilityLiveRegion="polite">
      <MessageBox
        type="error"
        message={t(PaymentOptionsTexts.genericError)}
        style={style.messageStyle}
      />
    </View>
  );
};

const useStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    backgroundColor: theme.static.background.background_1.background,
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacings.medium,
    overflow: 'hidden',
    height: '100%',
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
  messageStyle: {
    marginBottom: theme.spacings.medium,
  },
}));
