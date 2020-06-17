import React from 'react';
import {Text, View} from 'react-native';
import bugsnag from '../diagnostics/bugsnag';

export default class ErrorBoundary extends React.Component {
  state = {
    hasError: false,
  };

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return {hasError: true};
  }
  componentDidCatch(error: any, errorInfo: any) {
    // You can also log the error to an error reporting service
    bugsnag.notify(error);
  }
  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <View>
          <Text>Ooops</Text>
        </View>
      );
    }
    return this.props.children;
  }
}
