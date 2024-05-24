import {isDefined} from '@atb/utils/presence';
import {SnackbarTextContent} from '@atb/components/snackbar';

export const getSnackbarHasTextContent = (textContent?: SnackbarTextContent) =>
  isDefined(textContent) &&
  (isDefined(textContent?.title) || isDefined(textContent?.description));
