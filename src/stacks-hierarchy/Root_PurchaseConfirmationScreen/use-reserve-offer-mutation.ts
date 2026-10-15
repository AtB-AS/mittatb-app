import {useMutation, useQueryClient} from '@tanstack/react-query';
import {
  ReserveOfferResponse,
  ReserveOffer,
  TicketRecipientType,
  getListPaymentAgreementsQueryKey,
  reserveOffers,
} from '@atb/modules/ticketing';
import {useAuthContext} from '@atb/modules/auth';
import {useRemoteConfigContext} from '@atb/modules/remote-config';
import {FETCH_ON_BEHALF_OF_ACCOUNTS_QUERY_KEY} from '@atb/modules/on-behalf-of';
import {PaymentMethod} from '@atb/modules/payment';
import {RequestError} from '@atb/api/utils';

type Args = {
  offers: ReserveOffer[];
  paymentMethod?: PaymentMethod;
  paymentAgreementId?: number;
  recipient?: TicketRecipientType;
  shouldSavePaymentMethod: boolean;
  onSuccess?: (reserveOfferResponse: ReserveOfferResponse) => void;
  paymentData?: string;
};

export const useReserveOfferMutation = ({
  offers,
  paymentMethod,
  paymentAgreementId,
  recipient,
  shouldSavePaymentMethod,
  onSuccess,
  paymentData,
}: Args) => {
  const {abtCustomerId, isLoggedIn, phoneNumber} = useAuthContext();
  const {enable_auto_sale: autoSale} = useRemoteConfigContext();
  const queryClient = useQueryClient();

  return useMutation<ReserveOfferResponse, RequestError>({
    mutationFn: async (): Promise<ReserveOfferResponse> => {
      return reserveOffers({
        offers,
        paymentType: paymentMethod?.paymentType,
        // Mutually exclusive with paymentAgreementId
        recurringPaymentId: paymentAgreementId
          ? undefined
          : paymentMethod?.recurringPayment?.id,
        paymentAgreementId,
        shouldSavePaymentMethod,
        scaExemption: true,
        customerAccountId: recipient?.accountId || abtCustomerId!,
        phoneNumber,
        autoSale,
        recipient,
        paymentData,
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
    onError: () => {
      // The payment agreement could have been stopped elsewhere, so refetch the
      // list before the next attempt.
      if (paymentAgreementId) {
        queryClient.invalidateQueries({
          queryKey: getListPaymentAgreementsQueryKey(abtCustomerId, isLoggedIn),
        });
      }
    },
  });
};
