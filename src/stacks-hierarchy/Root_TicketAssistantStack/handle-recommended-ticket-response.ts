import {isProductSellableInApp} from '@atb/reference-data/utils';
import {TariffZoneWithMetadata} from '@atb/tariff-zones-selector';
import {UserProfileWithCount} from '@atb/fare-contracts';
import {PreassignedFareProduct, UserProfile} from '@atb/reference-data/types';
import {TariffZone} from '@entur/sdk/lib/nsr/types';
import {
  RecommendedTicketSummary,
  RecommendedTicketResponse,
} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/types';
import {getLongestDurationTicket} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/TicketAssistant_SummaryScreen/TicketSummary/utils';
import {FareProductTypeConfig} from '@atb-as/config-specs';
import {CustomerProfile} from '@atb/ticketing';

export function handleRecommendedTicketResponse(
  response: RecommendedTicketResponse,
  tariffZones: TariffZone[],
  userProfiles: UserProfile[],
  preassignedFareProducts: PreassignedFareProduct[],
  fareProductTypeConfigs: FareProductTypeConfig[],
  customerProfile?: CustomerProfile,
) {
  const sellableProductsInApp = preassignedFareProducts.filter((product) =>
    isProductSellableInApp(product, customerProfile),
  );
  // TariffZones
  const tariffZonesWithMetaData = response.zones.map(
    (zoneId) =>
      tariffZones.find((z) => z.id === zoneId) as TariffZoneWithMetadata,
  );

  const travellerWithCount: UserProfileWithCount | undefined = {
    ...(getUserProfile(userProfiles, response.tickets?.[0]?.userProfileId) ??
      {}),
    count: 1,
  };

  const ticket = response
    ? getLongestDurationTicket(response.tickets)
    : undefined;

  const preAssignedFareProduct = sellableProductsInApp.find(
    (p) => p.id === ticket?.fareProduct,
  );

  const fareProductTypeConfig = fareProductTypeConfigs.find(
    (config) => config.type === preAssignedFareProduct?.type,
  );

  if (!ticket || !preAssignedFareProduct || !fareProductTypeConfig) return;

  let purchaseDetailsData: RecommendedTicketSummary = {
    tariffZones: tariffZonesWithMetaData,
    userProfileWithCount: [travellerWithCount],
    preassignedFareProduct: preAssignedFareProduct,
    fareProductTypeConfig: fareProductTypeConfig,
    ticket: ticket,
    singleTicketPrice: response.singleTicketPrice,
  };
  return purchaseDetailsData;
}

function getUserProfile(
  profiles: UserProfile[],
  profileId: string,
): UserProfile {
  const profile = profiles.find((profile) => profile.id === profileId);
  if (profile) {
    return profile;
  }
  return profiles[0];
}
