import {FareProductTypeConfig} from '@atb/configuration';
import {productIsSellableInApp} from '@atb/reference-data/utils';
import {TariffZoneWithMetadata} from '@atb/stacks-hierarchy/Root_PurchaseTariffZonesSearchByMapScreen';
import {UserProfileWithCount} from '@atb/stacks-hierarchy/Root_PurchaseOverviewScreen/components/Travellers/use-user-count-state';
import {PreassignedFareProduct, UserProfile} from '@atb/reference-data/types';
import {TariffZone} from '@entur/sdk/lib/nsr/types';
import {
  PurchaseDetails,
  PurchaseTicketDetails,
  RecommendedTicketResponse,
} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/types';

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
    (zone) => getTariffZone(tariffZones, zone) as TariffZoneWithMetadata,
  );

  const travellerWithCount: UserProfileWithCount | undefined = {
    ...(getUserProfile(userProfiles, response.tickets?.[0]?.traveller?.id) ??
      {}),
    count: 1,
  };

  let ticketDetails: PurchaseTicketDetails[] = [];

  response.tickets.forEach((ticket) => {
    const recommendedTicket = sellableProductsInApp.find(
      (product) => product.id === ticket.fare_product,
    );
    if (!recommendedTicket) return;
    const ticketDetail: PurchaseTicketDetails = {
      fareProductTypeConfig: fareProductTypeConfigs.find(
        (config) => config.type === recommendedTicket?.type,
      ) as FareProductTypeConfig,
      preassignedFareProduct: recommendedTicket,
    };
    ticketDetails.push(ticketDetail);
  });

  let purchaseDetailsData: PurchaseDetails = {
    tariffZones: tariffZonesWithMetaData,
    userProfileWithCount: [travellerWithCount],
    purchaseTicketDetails: ticketDetails,
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
function getTariffZone(
  zones: TariffZone[],
  zoneId: string,
): TariffZone | undefined {
  const zone = zones.find((zone) => zone.id === zoneId);
  if (zone) {
    return zone;
  }
  return undefined;
}
