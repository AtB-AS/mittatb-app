import {productIsSellableInApp} from '@atb/reference-data/utils';
import {TariffZoneWithMetadata} from '@atb/stacks-hierarchy/Root_PurchaseTariffZonesSearchByMapScreen';
import {UserProfileWithCount} from '@atb/stacks-hierarchy/Root_PurchaseOverviewScreen/components/Travellers/use-user-count-state';
import {PreassignedFareProduct, UserProfile} from '@atb/reference-data/types';
import {TariffZone} from '@entur/sdk/lib/nsr/types';
import {
  RecommendedTicketSummary,
  RecommendedTicketResponse,
} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/types';
import {getLongestDurationTicket} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/TicketAssistant_SummaryScreen/TicketSummary/utils';
import {FareProductTypeConfig} from '@atb-as/config-specs';

export function handleRecommendedTicketResponse(
  response: RecommendedTicketResponse,
  tariffZones: TariffZone[],
  userProfiles: UserProfile[],
  preassignedFareProducts: PreassignedFareProduct[],
  fareProductTypeConfigs: FareProductTypeConfig[],
) {
  const sellableProductsInApp = preassignedFareProducts.filter(
    productIsSellableInApp,
  );
  // TariffZones
  const tariffZonesWithMetaData = response.zones.map(
    (zoneId) =>
      tariffZones.find((z) => z.id === zoneId) as TariffZoneWithMetadata,
  );

  const travellerWithCount: UserProfileWithCount | undefined = {
    ...(getUserProfile(userProfiles, response.tickets?.[0]?.traveller?.id) ??
      {}),
    count: 1,
  };

  const ticket = response
    ? getLongestDurationTicket(response.tickets)
    : undefined;

  const preAssignedFareProduct = sellableProductsInApp.find(
    (p) => p.id === ticket?.fare_product,
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
    singleTicketPrice: response.single_ticket_price,
  };
  return purchaseDetailsData;
}

function getUserProfile(
  profiles: UserProfile[],
  profileId: string,
): UserProfile {
  const profile = profiles.find(
    (profile) => profile.userTypeString === profileId,
  );
  if (profile) {
    return profile;
  }
  return profiles[0];
}
