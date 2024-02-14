import {ConfirmationTexts} from '@atb/translations/screens/subscreens/PurchaseConfirmation';
import {ConfirmationScreenResolver} from '@atb/stacks-hierarchy/Root_ConfirmationScreen';

export type Root_ConfirmationScreenParams = {
  message?: keyof typeof ConfirmationTexts;
  // Time that must be wait until onComplete is called (in milliseconds)
  delayBeforeCompleted?: number;
  nextScreen?: keyof typeof ConfirmationScreenResolver;
};
