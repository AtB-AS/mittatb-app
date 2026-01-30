import {PreassignedFareProduct} from '@atb-as/config-specs';
import {CustomerProfile} from '@atb/modules/ticketing';
import {APP_VERSION} from '@env';
import {appliesToAppVersion} from './converters';

export const isProductSellableInApp = (
  product: PreassignedFareProduct,
  customerProfile?: CustomerProfile,
  appVersion: string = APP_VERSION,
) => {
  if (
    !appliesToAppVersion(
      product.limitations.appVersionMin,
      product.limitations.appVersionMax,
      appVersion,
    )
  )
    return false;

  if (
    product.distributionChannel.some((channel) => channel === 'debug-app') &&
    customerProfile?.debug
  )
    return true;

  return product.distributionChannel.some((channel) => channel === 'app');
};
