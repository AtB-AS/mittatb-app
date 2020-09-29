import React, {ErrorInfo} from 'react';
import Bugsnag from '@bugsnag/react-native';
import Intercom from 'react-native-intercom';
import ErrorView from './ErrorView';

type State = {
  hasError: boolean;
  errorCode?: string;
  errorCount: number;
};

export default class ErrorBoundary extends React.Component<{}, State> {
  state: State = {
    hasError: false,
    errorCount: 0,
  };

  static getDerivedStateFromError(error: any): State {
    return {hasError: true, errorCount: 0, errorCode: '1'};
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    Bugsnag.notify(error, function (event) {
      event.addMetadata('metadata', {stack: errorInfo.componentStack});
    });
    Intercom.logEvent('error-boundary', {
      error: error.message,
      stack: error.stack || 'empty',
      componentStack: errorInfo.componentStack,
    });
  }
  render() {
    const {hasError, errorCount, errorCode} = this.state;

    const resetChildrenTree = () =>
      this.setState((old) => ({
        hasError: false,
        errorCount: old.errorCount + 1,
      }));

    if (hasError) {
      return (
        <ErrorView onRestartApp={resetChildrenTree} errorCode={errorCode} />
      );
    }
    return (
      <React.Fragment key={errorCount}>{this.props.children}</React.Fragment>
    );
  }
}
