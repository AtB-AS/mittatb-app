import {useCallback, useState} from 'react';
import {SnackbarProps} from './Snackbar';
import {getSnackbarHasTextContent} from './utils';

export const useSnackbar = () => {
  const [snackbarProps, setSnackbarProps] = useState<SnackbarProps>();
  const [messageKey, setMessageKey] = useState(0);

  const showSnackbar = useCallback((snackbarProps?: SnackbarProps) => {
    setMessageKey((messageKey) => messageKey + 1);
    setSnackbarProps(snackbarProps);
  }, []);
  const hideSnackbar = useCallback(() => setSnackbarProps(undefined), []);

  const snackbarTextContent = getSnackbarHasTextContent(
    snackbarProps?.textContent,
  )
    ? {
        ...snackbarProps?.textContent,
        messageKey, // add unique key to each message
      }
    : undefined;

  return {
    snackbarProps: {...snackbarProps, snackbarTextContent},
    showSnackbar,
    hideSnackbar,
  };
};
