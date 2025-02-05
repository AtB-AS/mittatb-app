import {
  PreassignedFareProduct,
  findReferenceDataById,
  isOfFareProductRef,
  useFirestoreConfigurationContext,
} from '@atb/configuration';
import {useTicketingContext} from '@atb/ticketing';
import {FareContract} from '@atb-as/utils';

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
  const {findFareContractByOrderId} = useTicketingContext();
  const fareContract = findFareContractByOrderId(orderId);
  const firstTravelRight = fareContract?.travelRights[0];

  const {preassignedFareProducts} = useFirestoreConfigurationContext();
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
