import type {FareContractType} from '@atb-as/utils';
import {useMemo} from 'react';
import {TicketingTexts, useTranslation} from '@atb/translations';
import type {
  FareProductTypeConfig,
  PreassignedFareProduct,
} from '@atb-as/config-specs';
import {isDefined} from '@atb/utils/presence';
import {useFirestoreConfigurationContext} from '@atb/modules/configuration';

export function useSupplementProductPurchaseButtonConfig(
  existingFareContract: FareContractType,
): {
  buttonText: string;
  buttonMode: 'primary' | 'secondary';
} {
  const {fareProductTypeConfigs, preassignedFareProducts: products} =
    useFirestoreConfigurationContext();
  const {t} = useTranslation();

  return useMemo(() => {
    const hasBoatAndOthers = hasBoatTransportModeAndOthers(
      existingFareContract,
      products,
      fareProductTypeConfigs,
    );
    return {
      buttonText: t(
        hasBoatAndOthers
          ? TicketingTexts.availableFareProducts.reserveOnBoat
          : TicketingTexts.availableFareProducts.reserve,
      ),
      buttonMode: hasBoatAndOthers ? 'secondary' : 'primary',
    };
  }, [existingFareContract, fareProductTypeConfigs, products, t]);
}

function hasBoatTransportModeAndOthers(
  fareContract: FareContractType,
  preassignedFareProducts: PreassignedFareProduct[],
  fareProductTypeConfigs: FareProductTypeConfig[],
): boolean {
  const transportModes = fareContract.travelRights
    .flatMap((tr) => {
      const product = preassignedFareProducts.find(
        (p) => p.id === tr.fareProductRef,
      );
      const productTypeConfig = fareProductTypeConfigs.find(
        (c) => c.type === product?.type,
      );
      return productTypeConfig?.transportModes;
    })
    .filter(isDefined);
  const hasExpressboat = !!transportModes.find(
    (tm) => tm.mode === 'water' && tm.subMode === 'highSpeedPassengerService',
  );
  const hasOtherModes = transportModes.some(
    (tm) =>
      !(tm.mode === 'water' && tm.subMode === 'highSpeedPassengerService'),
  );
  return hasExpressboat && hasOtherModes;
}
