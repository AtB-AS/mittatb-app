import {getReferenceDataName} from '@atb/modules/configuration';
import {NativeApplePayHandler} from '@atb/modules/native';
import {Language} from '@atb/translations';
import {notifyBugsnag} from '@atb/utils/bugsnag-utils';
import {APP_NAME} from '@env';
import {Platform} from 'react-native';

export function startApplePayPayment({
  userProfilesWithCountAndOffer,
  supplementProductsWithCountAndOffer,
  totalPrice,
  language,
  setApplePayPaymentData,
}: {
  userProfilesWithCountAndOffer: any[];
  supplementProductsWithCountAndOffer: any[];
  totalPrice: number;
  setApplePayPaymentData: (data: string) => void;
  language: Language;
}) {
  if (!NativeApplePayHandler.canMakePayments()) {
    notifyBugsnag('Apple Pay was selected, but not available');
    return;
  }
  if (Platform.OS !== 'ios') {
    notifyBugsnag(`Attempted to start Apple Pay on ${Platform.OS}`);
    return;
  }

  const userProfileItems = userProfilesWithCountAndOffer.map((u) => ({
    price: (u.offer.price.amountFloat || 0) * u.count,
    label: `${u.count} ${getReferenceDataName(u, language)}`,
  }));
  const supplementItems = supplementProductsWithCountAndOffer.map((sp) => ({
    price: (sp.offer.supplementProducts[0].price.amountFloat || 0) * sp.count,
    label: `${sp.count} ${getReferenceDataName(sp, language)}`,
  }));

  NativeApplePayHandler.startPayment(
    [
      ...userProfileItems,
      ...supplementItems,
      // Final item is the total
      {price: totalPrice, label: APP_NAME},
    ],
    (paymentData) => {
      paymentData && setApplePayPaymentData(paymentData);
    },
  );
}
