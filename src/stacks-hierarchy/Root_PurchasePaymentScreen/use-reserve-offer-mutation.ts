import {useMutation} from '@tanstack/react-query';
import {OfferReservation, ReserveOffer, reserveOffers} from '@atb/ticketing';
import {useAuthState} from '@atb/auth';
import {PaymentMethod} from '@atb/stacks-hierarchy/types';
import {useRemoteConfig} from '@atb/RemoteConfigContext';

type Args = {
  offers: ReserveOffer[];
  paymentMethod: PaymentMethod;
  recipient?: {
    accountId: string;
    phoneNumber: string;
    name?: string;
  };
};

export const useReserveOfferMutation = ({
  offers,
  paymentMethod,
  recipient,
}: Args) => {
  const {abtCustomerId} = useAuthState();
  const {enable_auto_sale: autoSale} = useRemoteConfig();

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
  });
};
