import {useMutation, useQueryClient} from '@tanstack/react-query';
import {OfferReservation, ReserveOffer, reserveOffers} from '@atb/ticketing';
import {useAuthState} from '@atb/auth';
import {PaymentMethod, TicketRecipientType} from '@atb/stacks-hierarchy/types';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {FETCH_ON_BEHALF_OF_ACCOUNTS_QUERY_KEY} from '@atb/on-behalf-of/queries/use-fetch-on-behalf-of-accounts-query.ts';

type Args = {
  offers: ReserveOffer[];
  paymentMethod: PaymentMethod;
  recipient?: TicketRecipientType;
};

export const useReserveOfferMutation = ({
  offers,
  paymentMethod,
  recipient,
}: Args) => {
  const {abtCustomerId} = useAuthState();
  const {enable_auto_sale: autoSale} = useRemoteConfig();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<OfferReservation> => {
      return reserveOffers({
        offers,
        paymentType: paymentMethod.paymentType,
        recurringPaymentId: paymentMethod.recurringPaymentId,
        savePaymentMethod: paymentMethod.save ?? false,
        opts: {retry: true},
        scaExemption: true,
        customerAccountId: recipient?.accountId || abtCustomerId!,
        customerAlias: recipient?.name,
        phoneNumber: recipient?.phoneNumber,
        autoSale,
      });
    },
    onSuccess: () => {
      if (recipient?.name) {
        queryClient.invalidateQueries([FETCH_ON_BEHALF_OF_ACCOUNTS_QUERY_KEY]);
      }
    },
  });
};
