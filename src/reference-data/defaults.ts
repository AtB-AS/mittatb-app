import {
  DistributionChannel,
  PreassignedFareProduct,
  PreassignedFareProductType,
  TariffZone,
  UserProfile,
} from './types';
import preassignedFareProducts from './preassigned-fare-products.json';
import tariffZones from './tariff-zones.json';
import userProfiles from './user-profiles.json';

export const defaultPreassignedFareProducts: PreassignedFareProduct[] =
  preassignedFareProducts.map(
    /*
  Unfortunately necessary cast as importing json loses the literal types. This
  makes it extra important to ensure that the product type is correct when
  reviewing the pull requests from the RemoteConfig update job.
   */
    (p) => ({
      ...p,
      type: p.type as PreassignedFareProductType,
      distributionChannel: p.distributionChannel as DistributionChannel[],
    }),
  );
export const defaultTariffZones: TariffZone[] = tariffZones;
export const defaultUserProfiles: UserProfile[] = userProfiles;
