import {Add} from '@atb/assets/svg/mono-icons/actions';
import SvgDelete from '@atb/assets/svg/mono-icons/actions/Delete';
import {useAuthState} from '@atb/auth';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {
  GenericSectionItem,
  LinkSectionItem,
  Section,
} from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {PaymentBrand} from '@atb/stacks-hierarchy/Root_PurchaseConfirmationScreen/components/PaymentBrand';
import {getExpireDate, getPaymentTypeName} from '@atb/stacks-hierarchy/utils';
import {StyleSheet, Theme, useTheme} from '@atb/theme';
import {
  RecurringPayment,
  authorizeRecurringPayment,
  cancelRecurringPayment,
  deleteRecurringPayment,
  listRecurringPayments,
} from '@atb/ticketing';
import {useTranslation} from '@atb/translations';
import PaymentOptionsTexts from '@atb/translations/screens/subscreens/PaymentOptions';
import {useFontScale} from '@atb/utils/use-font-scale';
import {parseUrl} from 'query-string/base';
import React, {useEffect, useState} from 'react';
import {Linking, RefreshControl, View} from 'react-native';
import {ProfileScreenProps} from './navigation-types';
import {destructiveAlert} from './utils';
import {animateNextChange} from '@atb/utils/animation';
import {FullScreenView} from '@atb/components/screen-view';
import {ScreenHeading} from '@atb/components/heading';

type PaymentOptionsProps = ProfileScreenProps<'Profile_PaymentOptionsScreen'>;

export const Profile_PaymentOptionsScreen = ({
  navigation,
}: PaymentOptionsProps) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {authenticationType} = useAuthState();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [storedCards, setStoredCards] = useState<RecurringPayment[]>([]);
  const [showError, setShowError] = useState<boolean>(false);

  async function getRecurringPaymentOptions(): Promise<RecurringPayment[]> {
    if (authenticationType !== 'phone') return [];
    try {
      const recurringOptions = await listRecurringPayments();
      return recurringOptions.reverse();
    } catch (error: any) {
      setShowError(true);
      return [];
    }
  }

  useEffect(() => {
    const addPaymentMethodCallbackHandler = async ({url}: {url: string}) => {
      if (
        url.includes('response_code') &&
        url.includes('recurring_payment_id')
      ) {
        // Timeout required to make loading spinner appear,
        // see https://github.com/facebook/react-native/issues/37308
        setTimeout(() => setIsLoading(true), 20);
        const responseCode = parseUrl(url).query.response_code;
        const paymentId = Number(parseUrl(url).query.recurring_payment_id);
        try {
          if (responseCode === 'OK') {
            await authorizeRecurringPayment(paymentId);
            await refreshCards();
          } else if (responseCode === 'Cancel') {
            await cancelRecurringPayment(paymentId);
          }
        } catch (error: any) {
          setShowError(true);
        } finally {
          setIsLoading(false);
        }
      }
    };

    refreshCards();

    // Listen to deep link redirects back here after
    // the add card process completes.
    const eventSubscription = Linking.addEventListener(
      'url',
      addPaymentMethodCallbackHandler,
    );
    return () => eventSubscription.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      animateNextChange();
      setStoredCards(remoteOptions);
    } catch (error: any) {
    } finally {
      setIsLoading(false);
    }
  }

  const onAddRecurringPayment = async () => {
    navigation.push('Root_AddPaymentMethodScreen');
  };

  return (
    <FullScreenView
      headerProps={{
        title: t(PaymentOptionsTexts.header.title),
        leftButton: {type: 'back', withIcon: true},
      }}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refreshCards} />
      }
      parallaxContent={(focusRef) => (
        <ScreenHeading
          ref={focusRef}
          text={t(PaymentOptionsTexts.header.title)}
        />
      )}
    >
      <View style={styles.content}>
        {showError && <GenericError />}
        {storedCards.length > 0 && (
          <Section>
            {storedCards.map((sc) => (
              <GenericSectionItem key={'card-' + sc.id}>
                <Card card={sc} removePaymentHandler={handleRemovePayment} />
              </GenericSectionItem>
            ))}
          </Section>
        )}
        {!isLoading && storedCards.length == 0 && <NoCardsInfo />}
        <Section>
          <LinkSectionItem
            text={t(PaymentOptionsTexts.addPaymentMethod)}
            onPress={onAddRecurringPayment}
            icon={<ThemeIcon svg={Add} />}
          />
        </Section>
      </View>
    </FullScreenView>
  );
};

const Card = (props: {
  card: RecurringPayment;
  removePaymentHandler: (card: RecurringPayment) => void;
}) => {
  const {card, removePaymentHandler} = props;
  const paymentName = getPaymentTypeName(card.payment_type);
  const style = useStyles();
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
          <PressableOpacity
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
          </PressableOpacity>
        </View>
      </View>

      <ThemeText color="secondary" type="body__secondary">
        {getExpireDate(card.expires_at)}
      </ThemeText>
    </View>
  );
};

const NoCardsInfo = () => {
  const {t} = useTranslation();
  return (
    <View accessibilityLiveRegion="polite">
      <MessageInfoBox
        type="info"
        message={t(PaymentOptionsTexts.noStoredCards)}
      />
    </View>
  );
};

const GenericError = () => {
  const {t} = useTranslation();
  return (
    <View accessibilityLiveRegion="polite">
      <MessageInfoBox
        type="error"
        message={t(PaymentOptionsTexts.genericError)}
      />
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme: Theme) => ({
  content: {
    padding: theme.spacings.medium,
    rowGap: theme.spacings.medium,
  },
  card: {flex: 1},
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
