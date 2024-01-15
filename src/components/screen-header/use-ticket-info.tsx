import {useAnalytics} from '@atb/analytics';
import {
    PreassignedFareProduct,
  findReferenceDataById,
  isOfFareProductRef,
  useFirestoreConfiguration,
} from '@atb/configuration';
import {RootNavigationProps} from '@atb/stacks-hierarchy';
import {FareContract, useTicketingState} from '@atb/ticketing';
import {useNavigation} from '@react-navigation/native';

type TicketInfo = {
  navigateToTicketInfoScreen: () => void;
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

  const analytics = useAnalytics();
  const navigation = useNavigation<RootNavigationProps>();

  const ticketInfoParams = preassignedFareProduct && {
    fareProductTypeConfigType: preassignedFareProduct?.type,
    preassignedFareProductId: preassignedFareProduct?.id,
  };

  const navigateToTicketInfoScreen = () => {
    ticketInfoParams &&
      analytics.logEvent(
        'Ticketing',
        'Ticket information button clicked',
        ticketInfoParams,
      );
    ticketInfoParams &&
      navigation.navigate('Root_TicketInformationScreen', ticketInfoParams);
  };

  return {
    navigateToTicketInfoScreen,
    fareContract,
    preassignedFareProduct
  };
};
