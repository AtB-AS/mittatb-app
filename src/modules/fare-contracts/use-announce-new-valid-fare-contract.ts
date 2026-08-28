import {useCallback, useEffect, useRef} from 'react';
import {AccessibilityInfo} from 'react-native';
import {FareContractType, getAvailabilityStatus} from '@atb-as/utils';
import {
  findReferenceDataById,
  getReferenceDataName,
} from '@atb/modules/configuration';
import {useGetFareProductsQuery} from '@atb/modules/ticketing';
import {TicketingTexts, useTranslation} from '@atb/translations';

type Args = {
  fareContracts: FareContractType[];
  now: number;
  isFocused: boolean;
};

/**
 * Fires an accessibility announcement when a fare contract in the given list
 * transitions to `valid`, either freshly purchased or newly activated. The
 * first render is skipped, and the announcement is only spoken when the screen
 * is focused.
 */
export const useAnnounceNewValidFareContract = ({
  fareContracts,
  now,
  isFocused,
}: Args) => {
  const getMessage = useNewValidTicketMessage();
  const seenValidIdsRef = useRef<Set<string> | undefined>(undefined);

  useEffect(() => {
    const previous = seenValidIdsRef.current;
    const validFcs = fareContracts.filter(
      (fc) => getAvailabilityStatus(fc, now).status === 'valid',
    );
    seenValidIdsRef.current = new Set(validFcs.map((fc) => fc.id));
    if (previous === undefined) return;
    if (!isFocused) return;

    const newValid = validFcs.find((fc) => !previous.has(fc.id));
    if (newValid) {
      const message = getMessage(newValid);
      // Wait 1s before queuing the announcement, so it isn't overridden by focus change events
      setTimeout(() => {
        AccessibilityInfo.announceForAccessibility(message);
      }, 1000);
    }
  }, [fareContracts, now, isFocused, getMessage]);
};

const useNewValidTicketMessage = () => {
  const {data: preassignedFareProducts} = useGetFareProductsQuery();
  const {t, language} = useTranslation();
  return useCallback(
    (fc: FareContractType) => {
      const product = findReferenceDataById(
        preassignedFareProducts,
        fc.travelRights[0]?.fareProductRef,
      );
      const productName = product
        ? getReferenceDataName(product, language)
        : '';
      return t(
        TicketingTexts.availableFareProductsAndReservationsTab.newValidTicketAnnouncement(
          productName,
        ),
      );
    },
    [preassignedFareProducts, language, t],
  );
};
