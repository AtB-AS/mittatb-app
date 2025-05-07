import {
  PreassignedFareProduct,
  findReferenceDataById,
  isOfFareProductRef,
  useFirestoreConfigurationContext,
} from '@atb/modules/configuration';
import {useTicketingContext} from '@atb/ticketing';
import {FareContractType} from '@atb-as/utils';

type TicketInfoParams = {
  fareProductTypeConfigType: string;
  preassignedFareProductId: string;
};

type TicketInfo = {
  ticketInfoParams: TicketInfoParams | undefined;
  fareContract: FareContractType | undefined;
  preassignedFareProduct: PreassignedFareProduct | undefined;
};

export const useTicketInfo = (fareContractId: string): TicketInfo => {
  const {findFareContractById} = useTicketingContext();
  const fareContract = findFareContractById(fareContractId);
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
