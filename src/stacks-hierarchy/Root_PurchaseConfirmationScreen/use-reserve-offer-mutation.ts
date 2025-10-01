import {useMutation, useQueryClient} from '@tanstack/react-query';
import {
  ReserveOfferResponse,
  ReserveOffer,
  TicketRecipientType,
  reserveOffers,
} from '@atb/modules/ticketing';
import {useAuthContext} from '@atb/modules/auth';
import {useRemoteConfigContext} from '@atb/modules/remote-config';
import {FETCH_ON_BEHALF_OF_ACCOUNTS_QUERY_KEY} from '@atb/modules/on-behalf-of';
import {PaymentMethod} from '@atb/modules/payment';

type Args = {
  offers: ReserveOffer[];
  paymentMethod?: PaymentMethod;
  recipient?: TicketRecipientType;
  shouldSavePaymentMethod: boolean;
  onSuccess?: (reserveOfferResponse: ReserveOfferResponse) => void;
};

export const useReserveOfferMutation = ({
  offers,
  paymentMethod,
  recipient,
  shouldSavePaymentMethod,
  onSuccess,
}: Args) => {
  const {abtCustomerId, phoneNumber} = useAuthContext();
  const {enable_auto_sale: autoSale} = useRemoteConfigContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<ReserveOfferResponse> => {
      if (!paymentMethod) {
        return Promise.reject(new Error('No payment method provided'));
      }
      return reserveOffers({
        offers,
        paymentType: paymentMethod.paymentType,
        recurringPaymentId: paymentMethod.recurringPayment?.id,
        shouldSavePaymentMethod,
        scaExemption: true,
        customerAccountId: recipient?.accountId || abtCustomerId!,
        phoneNumber,
        autoSale,
        recipient,
      });
    },
    onSuccess: (data) => {
      if (recipient?.name) {
        queryClient.invalidateQueries({
          queryKey: [FETCH_ON_BEHALF_OF_ACCOUNTS_QUERY_KEY],
        });
      }
      onSuccess?.(data);
    },
  });
};
