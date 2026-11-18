import {getPosthogClientGlobal} from '@atb/modules/analytics';

// Only kept in memory, so nothing is logged if the app is closed meanwhile
let vippsOpenedAt: number | undefined;

/** Call when Vipps has been opened to confirm a new payment agreement */
export const markPaymentAgreementVippsOpened = () => {
  vippsOpenedAt = Date.now();
};

/**
 * Call when Vipps sends the user back to the app. Logs how long they were in
 * Vipps, if they went there to confirm a new payment agreement.
 */
export const logPaymentAgreementVippsReturn = () => {
  if (vippsOpenedAt === undefined) return;
  getPosthogClientGlobal()?.capture('Payment agreement: Returned from Vipps', {
    secondsInVipps: Math.round((Date.now() - vippsOpenedAt) / 1000),
  });
  vippsOpenedAt = undefined;
};
