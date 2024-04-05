import {KeyboardAvoidingView, Platform, View} from 'react-native';
import WebView from 'react-native-webview';
import React, {useEffect} from 'react';
import {OfferReservation} from '@atb/ticketing';
import {StyleSheet} from '@atb/theme';
import {logToBugsnag, notifyBugsnag} from '@atb/utils/bugsnag-utils';
import {WebViewStatus} from '@atb/stacks-hierarchy/types';

type Props = {
  offerReservation: OfferReservation;
  onWebViewStatusChange: (status: WebViewStatus) => void;
};
export const WebViewTerminal = ({
  offerReservation,
  onWebViewStatusChange,
}: Props) => {
  const styles = useStyles();

  useEffect(() => onWebViewStatusChange('loading'), [onWebViewStatusChange]);

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'android' ? 'padding' : undefined}
        style={styles.keyboardAvoidingView}
      >
        <WebView
          source={{uri: offerReservation.url}}
          onError={(e: any) => {
            notifyBugsnag(e);
            onWebViewStatusChange('error');
          }}
          onLoadStart={(event) =>
            logToBugsnag('terminal_navigation', {
              url: event?.nativeEvent?.url,
            })
          }
          onLoad={() => onWebViewStatusChange('success')}
        />
      </KeyboardAvoidingView>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {flex: 1},
  keyboardAvoidingView: {flex: 1},
  loadingOverlay: {
    zIndex: 100,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacings.medium,
  },
}));
