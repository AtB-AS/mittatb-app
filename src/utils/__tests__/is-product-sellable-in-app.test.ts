import {PreassignedFareProduct} from '@atb-as/config-specs';
import {CustomerProfile} from '@atb/modules/ticketing';
import {isProductSellableInApp} from '../is-product-sellable-in-app';

const TEST_PRODUCT: PreassignedFareProduct = {
  id: 'P1',
  type: 'single',
  name: {lang: 'no', value: 'Produkt1'},
  version: 'v1',
  limitations: {
    userProfileRefs: ['UP1', 'UP2', 'UP3', 'UP4', 'UP5'],
    supplementProductRefs: ['SP1', 'SP2', 'SP3', 'SP4', 'SP5'],
    appVersionMax: '2.0',
    appVersionMin: '1.0',
  },
  distributionChannel: ['app'],
};

const TEST_CUSTOMER_PROFILE: CustomerProfile = {
  debug: false,
};

describe('isProductSellableInApp', () => {
  it('should return true for product sellable in app', () => {
    const result = isProductSellableInApp(
      TEST_PRODUCT,
      TEST_CUSTOMER_PROFILE,
      '1.5',
    );
    expect(result).toBe(true);
  });

  it('should return false for product not sellable in app due to app version min', () => {
    const result = isProductSellableInApp(
      TEST_PRODUCT,
      TEST_CUSTOMER_PROFILE,
      '0.9',
    );
    expect(result).toBe(false);
  });

  it('should return false for product not sellable in app due to app version max', () => {
    const result = isProductSellableInApp(
      TEST_PRODUCT,
      TEST_CUSTOMER_PROFILE,
      '2.1',
    );
    expect(result).toBe(false);
  });

  it('should return true for debug product when customer profile is in debug mode', () => {
    const debugProduct: PreassignedFareProduct = {
      ...TEST_PRODUCT,
      distributionChannel: ['debug-app'],
    };
    const debugCustomerProfile: CustomerProfile = {
      debug: true,
    };
    const result = isProductSellableInApp(
      debugProduct,
      debugCustomerProfile,
      '1.5',
    );
    expect(result).toBe(true);
  });

  it('should return false for debug product when customer profile is not in debug mode', () => {
    const debugProduct: PreassignedFareProduct = {
      ...TEST_PRODUCT,
      distributionChannel: ['debug-app'],
    };
    const result = isProductSellableInApp(
      debugProduct,
      TEST_CUSTOMER_PROFILE,
      '1.5',
    );
    expect(result).toBe(false);
  });
});
