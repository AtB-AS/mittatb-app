import {FullScreenHeader} from '@atb/components/screen-header';
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {StyleSheet, useTheme} from '@atb/theme';
import {useAddPaymentMethod} from '@atb/stacks-hierarchy/Root_AddPaymentMethodScreen/use-add-payment-method';
import {dictionary, useTranslation} from '@atb/translations';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {Button} from '@atb/components/button';
import AddPaymentMethodTexts from '@atb/translations/screens/subscreens/AddPaymentMethodTexts';
import WebView from 'react-native-webview';
import {RootStackScreenProps} from '@atb/stacks-hierarchy';
import {Processing} from '@atb/components/loading';

type Props = RootStackScreenProps<'Root_AddPaymentMethodScreen'>;

export const Root_AddPaymentMethodScreen = ({navigation}: Props) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {theme} = useTheme();
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
            interactiveColor={theme.color.interactive[1]}
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
    backgroundColor: theme.color.background.neutral[1].background,
  },
  center: {flex: 1, justifyContent: 'center', padding: theme.spacing.medium},
  messageBox: {marginBottom: theme.spacing.small},
}));
