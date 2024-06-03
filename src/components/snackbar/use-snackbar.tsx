import {useState} from 'react';
import {SnackbarTextContent} from './Snackbar';
import {getSnackbarHasTextContent} from './utils';

export const useSnackbar = () => {
  const [textContent, setTextContent] = useState<SnackbarTextContent>();
  const [messageKey, setMessageKey] = useState(0);

  const showSnackbar = (textContent?: SnackbarTextContent) => {
    setMessageKey((messageKey) => messageKey + 1);
    setTextContent(textContent);
  };
  const hideSnackbar = () => setTextContent(undefined);

  return {
    snackbarTextContent: getSnackbarHasTextContent(textContent)
      ? {
          ...textContent,
          messageKey,
        }
      : undefined,
    showSnackbar,
    hideSnackbar,
  };
};
