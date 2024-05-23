import {isDefined} from '@atb/utils/presence';
import {SnackbarTextContent} from '@atb/components/snackbar';

export const getSnackbarTextsHaveContent = (texts?: SnackbarTextContent) =>
  isDefined(texts) &&
  (isDefined(texts?.title) || isDefined(texts?.description));
