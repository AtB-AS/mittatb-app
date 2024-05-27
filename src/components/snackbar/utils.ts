import {SnackbarTextContent} from '@atb/components/snackbar';

export const getSnackbarHasTextContent = (textContent?: SnackbarTextContent) =>
  textContent?.title || textContent?.description || false;
