import {useCallback, useMemo, useState} from 'react';
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

  const snackbarTextContent = useMemo(
    () =>
      getSnackbarHasTextContent(snackbarProps?.textContent)
        ? {
            ...snackbarProps?.textContent,
            messageKey, // add unique key to each message
          }
        : undefined,
    [messageKey, snackbarProps?.textContent],
  );

  const snackbarPropsWithTextContent = useMemo(
    () => ({...snackbarProps, snackbarTextContent}),
    [snackbarProps, snackbarTextContent],
  );
  return {
    snackbarProps: snackbarPropsWithTextContent,
    showSnackbar,
    hideSnackbar,
  };
};
