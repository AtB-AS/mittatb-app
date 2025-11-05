import {
  PreassignedFareProduct,
  findReferenceDataById,
} from '@atb/modules/configuration';
import {
  useGetFareProductsQuery,
  useTicketingContext,
} from '@atb/modules/ticketing';
import {FareContractType} from '@atb-as/utils';

type TicketInfo = {
  fareContract: FareContractType | undefined;
  preassignedFareProduct: PreassignedFareProduct | undefined;
};

export const useTicketInfo = (fareContractId: string): TicketInfo => {
  const {findFareContractById} = useTicketingContext();
  const fareContract = findFareContractById(fareContractId);
  const firstTravelRight = fareContract?.travelRights[0];

  const {data: preassignedFareProducts} = useGetFareProductsQuery();
  const preassignedFareProduct = findReferenceDataById(
    preassignedFareProducts,
    firstTravelRight?.fareProductRef || '',
  );

  return {
    fareContract,
    preassignedFareProduct,
  };
};
