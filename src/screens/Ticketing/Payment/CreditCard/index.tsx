import React from 'react';
import WebView, {WebViewNavigation} from 'react-native-webview';

function log(event: WebViewNavigation) {
  console.log(event);
}

type Props = {
  uri: string;
};

const Offer: React.FC<Props> = ({uri}) => (
  <WebView
    source={{
      uri,
    }}
    onNavigationStateChange={log}
  />
);

export default Offer;
