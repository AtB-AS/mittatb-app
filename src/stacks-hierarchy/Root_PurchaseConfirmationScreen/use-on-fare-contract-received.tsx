import {useTicketingContext} from '@atb/ticketing';
import {useEffect, useMemo} from 'react';

/**
 * Calls `callback()` once a fare contract with `orderId` appears in the
 * ticketing context.
 */
export const useOnFareContractReceived = ({
  orderId,
  callback,
}: {
  orderId: string | undefined;
  callback: () => void;
}) => {
  const {fareContracts, sentFareContracts} = useTicketingContext();

  const fareContractReceived = useMemo(() => {
    const allPossibleFareContracts = [
      ...(fareContracts ?? []),
      ...(sentFareContracts ?? []),
    ];
    return allPossibleFareContracts.some(
      (fc) => fc.orderId === orderId && orderId !== undefined,
    );
  }, [fareContracts, orderId, sentFareContracts]);

  useEffect(() => {
    if (fareContractReceived) {
      callback();
    }
  }, [fareContractReceived, callback]);
};
