import {SnackbarContent} from '@atb/components/snackbar';

export const getSnackbarHasTextContent = (
  textContent?: SnackbarContent,
): boolean => !!(textContent?.title || textContent?.description);
