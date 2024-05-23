import {isDefined} from '@atb/utils/presence';
import {SnackbarTextContent} from '@atb/components/snackbar';

export const getSnackbarTextHasContent = (texts?: SnackbarTextContent) =>
  isDefined(texts) &&
  (isDefined(texts?.title) || isDefined(texts?.description));
