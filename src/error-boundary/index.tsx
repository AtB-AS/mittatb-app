import React, {ErrorInfo} from 'react';
import bugsnag from '../diagnostics/bugsnag';
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
    bugsnag.notify(error, function (report) {
      report.metadata = {
        ...report.metadata,
        component: {
          stack: errorInfo.componentStack,
        },
      };
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
