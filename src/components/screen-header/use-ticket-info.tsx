import {
  PreassignedFareProduct,
  findReferenceDataById,
  isOfFareProductRef,
  useFirestoreConfiguration,
} from '@atb/configuration';
import {FareContract, useTicketingState} from '@atb/ticketing';

type TicketInfoParams = {
  fareProductTypeConfigType: string;
  preassignedFareProductId: string;
};

type TicketInfo = {
  ticketInfoParams: TicketInfoParams | undefined;
  fareContract: FareContract | undefined;
  preassignedFareProduct: PreassignedFareProduct | undefined;
};

export const useTicketInfo = (orderId: string): TicketInfo => {
  const {findFareContractByOrderId} = useTicketingState();
  const fareContract = findFareContractByOrderId(orderId);
  const firstTravelRight = fareContract?.travelRights[0];

  const {preassignedFareProducts} = useFirestoreConfiguration();
  const preassignedFareProduct = findReferenceDataById(
    preassignedFareProducts,
    isOfFareProductRef(firstTravelRight) ? firstTravelRight.fareProductRef : '',
  );

  const ticketInfoParams = preassignedFareProduct && {
    fareProductTypeConfigType: preassignedFareProduct?.type,
    preassignedFareProductId: preassignedFareProduct?.id,
  };

  return {
    ticketInfoParams,
    fareContract,
    preassignedFareProduct,
  };
};
