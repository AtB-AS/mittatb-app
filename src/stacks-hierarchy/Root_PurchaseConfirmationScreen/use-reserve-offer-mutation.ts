import {useMutation, useQueryClient} from '@tanstack/react-query';
import {
  OfferReservation,
  ReserveOffer,
  TicketRecipientType,
  reserveOffers,
} from '@atb/ticketing';
import {useAuthState} from '@atb/auth';
import {PaymentMethod} from '@atb/stacks-hierarchy/types';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {FETCH_ON_BEHALF_OF_ACCOUNTS_QUERY_KEY} from '@atb/on-behalf-of/queries/use-fetch-on-behalf-of-accounts-query';

type Args = {
  offers: ReserveOffer[];
  paymentMethod?: PaymentMethod;
  recipient?: TicketRecipientType;
  shouldSavePaymentMethod: boolean;
};

export const useReserveOfferMutation = ({
  offers,
  paymentMethod,
  recipient,
  shouldSavePaymentMethod,
}: Args) => {
  const {abtCustomerId, phoneNumber} = useAuthState();
  const {enable_auto_sale: autoSale} = useRemoteConfig();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<OfferReservation> => {
      if (!paymentMethod) {
        return Promise.reject(new Error('No payment method provided'));
      }
      return reserveOffers({
        offers,
        paymentType: paymentMethod.paymentType,
        recurringPaymentId: paymentMethod.recurringCard?.id,
        shouldSavePaymentMethod,
        opts: {retry: true},
        scaExemption: true,
        customerAccountId: recipient?.accountId || abtCustomerId!,
        phoneNumber,
        autoSale,
        recipient,
      });
    },
    onSuccess: () => {
      if (recipient?.name) {
        queryClient.invalidateQueries([FETCH_ON_BEHALF_OF_ACCOUNTS_QUERY_KEY]);
      }
    },
  });
};
