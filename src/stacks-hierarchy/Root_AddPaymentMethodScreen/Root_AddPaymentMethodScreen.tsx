import {FullScreenHeader} from '@atb/components/screen-header';
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {useAddPaymentMethod} from '@atb/stacks-hierarchy/Root_AddPaymentMethodScreen/use-add-payment-method';
import {Processing} from '@atb/stacks-hierarchy/Root_PurchasePaymentWithCreditCardScreen/Processing';
import {dictionary, useTranslation} from '@atb/translations';
import {MessageBox} from '@atb/components/message-box';
import {Button} from '@atb/components/button';
import AddPaymentMethodTexts from '@atb/translations/screens/subscreens/AddPaymentMethodTexts';
import WebView from 'react-native-webview';
import {RootStackScreenProps} from '@atb/stacks-hierarchy';

type Props = RootStackScreenProps<'Root_AddPaymentMethodScreen'>;

export const Root_AddPaymentMethodScreen = ({navigation}: Props) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const [showWebView, setShowWebView] = useState<boolean>(true);
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

  return (
    <View style={styles.container}>
      <FullScreenHeader
        title={t(AddPaymentMethodTexts.header)}
        leftButton={{
          type: 'cancel',
          onPress: () => navigation.goBack(),
        }}
      />
      {isLoading && !error && (
        <View style={styles.center}>
          <Processing message={t(dictionary.loading)} />
        </View>
      )}
      {!!error && (
        <View style={styles.center}>
          <MessageBox
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
