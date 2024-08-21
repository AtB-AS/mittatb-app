import {FullScreenHeader} from '@atb/components/screen-header';
import React, {useEffect, useState} from 'react';
import {Linking, View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {useAddPaymentMethod} from '@atb/stacks-hierarchy/Root_AddPaymentMethodScreen/use-add-payment-method';
import {dictionary, useTranslation} from '@atb/translations';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {Button} from '@atb/components/button';
import AddPaymentMethodTexts from '@atb/translations/screens/subscreens/AddPaymentMethodTexts';
import WebView from 'react-native-webview';
import {RootStackScreenProps} from '@atb/stacks-hierarchy';
import {Processing} from '@atb/components/loading';
import {useAuthorizeRecurringPaymentMutation} from '@atb/ticketing/use-authorize-recurring-payment-mutation';
import {useCancelRecurringPaymentMutation} from '@atb/ticketing/use-cancel-recurring-payment-mutation';
import queryString from 'query-string';

type Props = RootStackScreenProps<'Root_AddPaymentMethodScreen'>;

export const Root_AddPaymentMethodScreen = ({navigation}: Props) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const [showWebView, setShowWebView] = useState<boolean>(true);

  const {
    mutateAsync: authorizeRecurringPayment,
  } = useAuthorizeRecurringPaymentMutation();

  const {
    mutateAsync: cancelRecurringPayment,
  } = useCancelRecurringPaymentMutation();

  const {
    terminalUrl,
    onWebViewLoadStart,
    onWebViewLoadEnd,
    onWebViewError,
    isLoading,
    error,
  } = useAddPaymentMethod();

  useEffect(
    () => navigation.addListener('blur', () => setShowWebView(false)),
    [navigation],
  );
  useEffect(() => {
    const {remove: unsub} = Linking.addEventListener('url', async (event) => {
      if (
        event.url.includes('response_code') &&
        event.url.includes('recurring_payment_id')
      ) {
        const responseCode = queryString.parseUrl(event.url).query
          .response_code;
        const paymentId = Number(
          queryString.parseUrl(event.url).query.recurring_payment_id,
        );
        if (responseCode === 'OK') {
          await authorizeRecurringPayment(paymentId);
        } else if (responseCode === 'Cancel') {
          await cancelRecurringPayment(paymentId);
        }
      }
    });
    return () => unsub();
  }, [authorizeRecurringPayment, cancelRecurringPayment]);

  return (
    <View style={styles.container}>
      <FullScreenHeader
        title={t(AddPaymentMethodTexts.header)}
        leftButton={{
          type: 'cancel',
        }}
      />
      {isLoading && !error && (
        <View style={styles.center}>
          <Processing message={t(dictionary.loading)} />
        </View>
      )}
      {!!error && (
        <View style={styles.center}>
          <MessageInfoBox
            message={t(AddPaymentMethodTexts.genericError)}
            type="error"
            style={styles.messageBox}
          />
          <Button
            interactiveColor="interactive_1"
            onPress={() => navigation.goBack()}
            text={t(AddPaymentMethodTexts.buttons.goBack)}
          />
        </View>
      )}
      <View
        style={{
          flex: 1,
          position: !isLoading && !error ? 'relative' : 'absolute',
        }}
      >
        {terminalUrl && showWebView && (
          <WebView
            source={{
              uri: terminalUrl,
            }}
            onError={onWebViewError}
            onLoadStart={onWebViewLoadStart}
            onLoadEnd={onWebViewLoadEnd}
          />
        )}
      </View>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.static.background.background_1.background,
  },
  center: {flex: 1, justifyContent: 'center', padding: theme.spacings.medium},
  messageBox: {marginBottom: theme.spacings.small},
}));
