import {Add} from '@atb/assets/svg/mono-icons/actions';
import SvgDelete from '@atb/assets/svg/mono-icons/actions/Delete';
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
import {addPaymentMethod, RecurringPayment} from '@atb/ticketing';
import {useTranslation} from '@atb/translations';
import PaymentMethodsTexts from '@atb/translations/screens/subscreens/PaymentMethods';
import {useFontScale} from '@atb/utils/use-font-scale';
import queryString from 'query-string';
import React from 'react';
import {RefreshControl, View} from 'react-native';
import {destructiveAlert} from './utils';
import {FullScreenView} from '@atb/components/screen-view';
import {ScreenHeading} from '@atb/components/heading';
import {useListRecurringPaymentsQuery} from '@atb/ticketing/use-list-recurring-payments-query';
import {useDeleteRecurringPaymentMutation} from '@atb/ticketing/use-delete-recurring-payment-mutation';
import {useAuthorizeRecurringPaymentMutation} from '@atb/ticketing/use-authorize-recurring-payment-mutation';
import {useCancelRecurringPaymentMutation} from '@atb/ticketing/use-cancel-recurring-payment-mutation';
import {APP_SCHEME} from '@env';
import {openInAppBrowser} from '@atb/in-app-browser/in-app-browser';

export const Profile_PaymentMethodsScreen = () => {
  const styles = useStyles();
  const {t} = useTranslation();

  const {
    data: recurringPayment,
    refetch: refetchRecurringPayment,
    isError: recurringPaymentError,
    isFetching: recurringPaymentLoading,
  } = useListRecurringPaymentsQuery();

  const {
    mutateAsync: deleteRecurringPayment,
    isError: deleteRecurringPaymentError,
  } = useDeleteRecurringPaymentMutation();

  const {
    mutateAsync: authorizeRecurringPayment,
    isError: authorizeRecurringPaymentError,
  } = useAuthorizeRecurringPaymentMutation();

  const {
    mutateAsync: cancelRecurringPayment,
    isError: cancelRecurringPaymentError,
  } = useCancelRecurringPaymentMutation();

  const isError =
    recurringPaymentError ||
    deleteRecurringPaymentError ||
    authorizeRecurringPaymentError ||
    cancelRecurringPaymentError;

  const addPaymentMethodCallbackHandler = (url: string) => {
    if (url.includes('response_code') && url.includes('recurring_payment_id')) {
      const responseCode = queryString.parseUrl(url).query.response_code;
      const paymentId = Number(
        queryString.parseUrl(url).query.recurring_payment_id,
      );
      if (responseCode === 'OK') {
        authorizeRecurringPayment(paymentId);
      } else if (responseCode === 'Cancel') {
        cancelRecurringPayment(paymentId);
      }
    }
  };

  const onAddRecurringPayment = async () => {
    const callbackUrl = `${APP_SCHEME}://payment-method-callback`;
    const response = await addPaymentMethod(callbackUrl);
    openInAppBrowser(
      response.data.terminal_url,
      'cancel',
      callbackUrl,
      addPaymentMethodCallbackHandler,
    );
  };

  return (
    <FullScreenView
      headerProps={{
        title: t(PaymentMethodsTexts.header.title),
        leftButton: {type: 'back', withIcon: true},
      }}
      refreshControl={
        <RefreshControl
          refreshing={recurringPaymentLoading}
          onRefresh={refetchRecurringPayment}
        />
      }
      parallaxContent={(focusRef) => (
        <ScreenHeading
          ref={focusRef}
          text={t(PaymentMethodsTexts.header.title)}
        />
      )}
    >
      <View style={styles.content}>
        {isError && <GenericError />}
        {recurringPayment && recurringPayment.length > 0 && (
          <Section>
            {recurringPayment.map((card) => (
              <GenericSectionItem key={'card-' + card.id}>
                <Card
                  card={card}
                  removePaymentHandler={(card) =>
                    deleteRecurringPayment(card.id)
                  }
                />
              </GenericSectionItem>
            ))}
          </Section>
        )}
        {!recurringPaymentError &&
          !recurringPaymentLoading &&
          (!recurringPayment || recurringPayment?.length == 0) && (
            <NoCardsInfo />
          )}

        <Section>
          <LinkSectionItem
            text={t(PaymentMethodsTexts.addPaymentMethod)}
            onPress={onAddRecurringPayment}
            icon={<ThemeIcon svg={Add} />}
          />
        </Section>
        <MessageInfoBox
          message={t(PaymentMethodsTexts.vippsInfo)}
          type="info"
        />
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
              PaymentMethodsTexts.a11y.cardInfo(paymentName, card.masked_pan),
            )}
          >
            {paymentName} **** {card.masked_pan}
          </ThemeText>
        </View>

        <View style={style.cardIcons}>
          <PaymentBrand icon={card.payment_type} />
          <PressableOpacity
            accessibilityLabel={t(
              PaymentMethodsTexts.a11y.deleteCardIcon(
                paymentName,
                card.masked_pan,
              ),
            )}
            style={{marginLeft: theme.spacing.medium}}
            onPress={() => {
              destructiveAlert({
                alertTitleString: t(PaymentMethodsTexts.deleteModal.title),
                alertMessageString: t(PaymentMethodsTexts.deleteModal.message),
                cancelAlertString: t(
                  PaymentMethodsTexts.deleteModal.cancelButton,
                ),
                confirmAlertString: t(
                  PaymentMethodsTexts.deleteModal.confirmButton,
                ),
                destructiveArrowFunction: () => removePaymentHandler(card),
              });
            }}
          >
            <SvgDelete
              height={21 * fontScale}
              width={21 * fontScale}
              fill={theme.color.interactive.destructive.default.background}
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
        message={t(PaymentMethodsTexts.noStoredCards)}
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
        message={t(PaymentMethodsTexts.genericError)}
      />
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme: Theme) => ({
  content: {
    padding: theme.spacing.medium,
    rowGap: theme.spacing.medium,
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
