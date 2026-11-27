import {
  createGooglePayPaymentRequest,
  isGooglePayConfigured,
} from '@atb/modules/payment';
import {notifyBugsnag} from '@atb/utils/bugsnag-utils';
import {Buffer} from 'buffer';
import {Platform} from 'react-native';

export async function startGooglePayPayment({
  totalPrice,
  setPaymentData,
}: {
  totalPrice: number;
  setPaymentData: (data: string) => void;
}) {
  if (Platform.OS !== 'android') {
    notifyBugsnag(`Attempted to start Google Pay on ${Platform.OS}`);
    return;
  }
  if (!isGooglePayConfigured()) {
    notifyBugsnag('Google Pay was selected, but not configured');
    return;
  }

  try {
    // Resolves to null when the user cancels the payment sheet
    const paymentData = await createGooglePayPaymentRequest(totalPrice).show();
    const token = paymentData?.paymentMethodData.tokenizationData?.token;
    if (token) {
      setPaymentData(Buffer.from(token).toString('base64'));
    }
  } catch (error: any) {
    // Ignore payments started while the payment sheet is active, e.g. on double tap
    if (error?.code === 'E_ALREADY_IN_PROGRESS') return;
    notifyBugsnag(error);
  }
}
