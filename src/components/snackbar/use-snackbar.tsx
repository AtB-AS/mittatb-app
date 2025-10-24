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

  const snackbarContent = useMemo(
    () =>
      getSnackbarHasTextContent(snackbarProps?.content)
        ? {
            ...snackbarProps?.content,
            messageKey, // add unique key to each message
          }
        : undefined,
    [messageKey, snackbarProps?.content],
  );

  const snackbarPropsWithContent = useMemo(
    () => ({...snackbarProps, snackbarContent: snackbarContent}),
    [snackbarProps, snackbarContent],
  );
  return {
    snackbarProps: snackbarPropsWithContent,
    showSnackbar,
    hideSnackbar,
  };
};
