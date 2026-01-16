import {PreassignedFareProduct} from '@atb-as/config-specs';
import {CustomerProfile} from '@atb/modules/ticketing';
import {APP_VERSION} from '@env';
import {compareVersion} from './compare-version';

export const isProductSellableInApp = (
  product: PreassignedFareProduct,
  customerProfile?: CustomerProfile,
  appVersion: string = APP_VERSION,
) => {
  if (
    (product.limitations.appVersionMin &&
      compareVersion(product.limitations.appVersionMin, appVersion) > 0) ||
    (product.limitations.appVersionMax &&
      compareVersion(product.limitations.appVersionMax, appVersion) < 0)
  )
    return false;

  if (
    product.distributionChannel.some((channel) => channel === 'debug-app') &&
    customerProfile?.debug
  )
    return true;

  return product.distributionChannel.some((channel) => channel === 'app');
};
