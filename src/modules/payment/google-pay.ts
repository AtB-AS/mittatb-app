import {
  GOOGLE_PAY_PMI,
  PaymentRequest,
  type GooglePayPaymentDataRequest,
} from '@google/react-native-make-payment';
import {
  APP_NAME,
  GOOGLE_PAY_GATEWAY,
  GOOGLE_PAY_GATEWAY_MERCHANT_ID,
  GOOGLE_PAY_MERCHANT_ID,
} from '@env';
import {Platform} from 'react-native';

const ALLOWED_CARD_NETWORKS = ['AMEX', 'MASTERCARD', 'VISA'];
const ALLOWED_AUTH_METHODS = ['PAN_ONLY', 'CRYPTOGRAM_3DS']; // TEMP: PAN_ONLY added to test on emulator

/**
 * Google Pay is only available on Android, and only when the build has the
 * merchant and gateway configured.
 */
export function isGooglePayConfigured(): boolean {
  return (
    Platform.OS === 'android' &&
    !!GOOGLE_PAY_MERCHANT_ID &&
    !!GOOGLE_PAY_GATEWAY &&
    !!GOOGLE_PAY_GATEWAY_MERCHANT_ID
  );
}

/**
 * Creates a Google Pay PaymentDataRequest.
 * https://developers.google.com/pay/api/android/reference/request-objects#PaymentDataRequest
 *
 * @param totalPrice Total price in NOK. When undefined, the price is marked as
 * not currently known, which is used for readiness checks.
 */
export function createGooglePayRequest(
  totalPrice?: number,
): GooglePayPaymentDataRequest {
  return {
    apiVersion: 2,
    apiVersionMinor: 0,
    allowedPaymentMethods: [
      {
        type: 'CARD',
        parameters: {
          allowedAuthMethods: ALLOWED_AUTH_METHODS,
          allowedCardNetworks: ALLOWED_CARD_NETWORKS,
        },
        tokenizationSpecification: {
          type: 'PAYMENT_GATEWAY',
          parameters: {
            gateway: GOOGLE_PAY_GATEWAY ?? '',
            gatewayMerchantId: GOOGLE_PAY_GATEWAY_MERCHANT_ID ?? '',
          },
        },
      },
    ],
    transactionInfo: {
      totalPriceStatus:
        totalPrice === undefined ? 'NOT_CURRENTLY_KNOWN' : 'FINAL',
      totalPrice: (totalPrice ?? 0).toFixed(2),
      currencyCode: 'NOK',
      countryCode: 'NO',
    },
    merchantInfo: {
      merchantId: GOOGLE_PAY_MERCHANT_ID,
      merchantName: APP_NAME,
    },
  };
}

export function createGooglePayPaymentRequest(
  totalPrice?: number,
): PaymentRequest {
  return new PaymentRequest(
    [
      {
        supportedMethods: GOOGLE_PAY_PMI,
        data: createGooglePayRequest(totalPrice),
      },
    ],
    {},
  );
}

/**
 * Checks whether the device and Google account can pay with Google Pay.
 * Resolves to false instead of rejecting.
 */
export async function isGooglePayReady(): Promise<boolean> {
  if (!isGooglePayConfigured()) return false;
  try {
    return await createGooglePayPaymentRequest().canMakePayment();
  } catch {
    return false;
  }
}
