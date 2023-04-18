import React, {ErrorInfo} from 'react';
import Bugsnag from '@bugsnag/react-native';
import Intercom from 'react-native-intercom';
import {FullScreenErrorView} from './FullScreenErrorView';
import {ComponentErrorView} from './ComponentErrorView';

type Props =
  | {
      type: 'full-screen';
      message?: string;
    }
  | {
      type?: 'component';
      message: string;
    };

type State = {
  hasError: boolean;
  errorCode?: string;
  errorCount: number;
};

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = {
    hasError: false,
    errorCount: 0,
  };

  static getDerivedStateFromError(): State {
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
    const {type = 'component', message} = this.props;
    const {hasError, errorCount, errorCode} = this.state;

    if (hasError) {
      const resetChildrenTree = () =>
        this.setState((old) => ({
          hasError: false,
          errorCount: old.errorCount + 1,
        }));

      switch (type) {
        case 'full-screen':
          return (
            <FullScreenErrorView
              onRestartApp={resetChildrenTree}
              errorCode={errorCode}
            />
          );
        case 'component':
        default:
          return <ComponentErrorView message={message!} />;
      }
    }
    return (
      <React.Fragment key={errorCount}>{this.props.children}</React.Fragment>
    );
  }
}
