import {SnackbarTextContent} from '@atb/components/snackbar';

export const getSnackbarHasTextContent = (
  textContent?: SnackbarTextContent,
): boolean => !!(textContent?.title || textContent?.description);
