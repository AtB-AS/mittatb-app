import {useMutation, useQueryClient} from '@tanstack/react-query';
import {OfferReservation, ReserveOffer, reserveOffers} from '@atb/ticketing';
import {useAuthState} from '@atb/auth';
import {PaymentMethod, TicketRecipientType} from '@atb/stacks-hierarchy/types';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {FETCH_RECIPIENTS_QUERY_KEY} from '@atb/stacks-hierarchy/Root_ChooseTicketRecipientScreen/use-fetch-recipients-query.ts';

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
      const {paymentType} = paymentMethod;

      const recurringPaymentId =
        'recurringPaymentId' in paymentMethod
          ? paymentMethod.recurringPaymentId
          : undefined;

      const saveRecurringCard =
        'save' in paymentMethod ? paymentMethod.save : false;

      return reserveOffers({
        offers,
        paymentType: paymentType,
        recurringPaymentId: recurringPaymentId,
        savePaymentMethod: saveRecurringCard,
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
        queryClient.invalidateQueries([FETCH_RECIPIENTS_QUERY_KEY]);
      }
    },
  });
};
