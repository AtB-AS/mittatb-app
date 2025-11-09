import {useCallback, useMemo, useState} from 'react';
import {SnackbarProps} from './Snackbar';
import {getSnackbarHasTextContent} from './utils';

export const useSnackbar = () => {
  const [snackbarProps, setSnackbarProps] = useState<SnackbarProps>();
  const [messageKey, setMessageKey] = useState(0);

  const showSnackbar = useCallback((snackbarProps?: SnackbarProps) => {
    console.log('show snackbar');
    setMessageKey((messageKey) => messageKey + 1);
    setSnackbarProps(snackbarProps);
  }, []);
  const hideSnackbar = useCallback(() => setSnackbarProps(undefined), []);

  const snackbarContent = useMemo(() => {
    console.log(
      'getSnackbarHasTextContent(snackbarProps?.content)',
      getSnackbarHasTextContent(snackbarProps?.content),
    );
    return getSnackbarHasTextContent(snackbarProps?.content)
      ? {
          ...snackbarProps?.content,
          messageKey, // add unique key to each message
        }
      : undefined;
  }, [messageKey, snackbarProps?.content]);

  const snackbarPropsWithContent = useMemo(() => {
    console.log('snackbarContent', snackbarContent);
    console.log('snackbarProps', snackbarProps);
    return {...snackbarProps, snackbarContent: snackbarContent};
  }, [snackbarProps, snackbarContent]);
  return {
    snackbarProps: snackbarPropsWithContent,
    showSnackbar,
    hideSnackbar,
  };
};
