import {Button} from '@atb/components/button';
import {useSupplementProductPurchaseSelection} from '@atb/modules/fare-contracts';
import type {FareContractType} from '@atb-as/utils';
import type {PurchaseSelectionType} from '@atb/modules/purchase-selection';
import {useThemeContext} from '@atb/theme';
import {
  useGetFareProductsQuery,
  useGetSupplementProductsQuery,
} from '@atb/modules/ticketing';
import {useSupplementProductPurchaseButtonConfig} from '../use-supplement-product-purchase-button-config';
import {hasReservationTypeSupplementProduct} from '../utils';

type Props = {
  existingFareContract: FareContractType;
  navigateToPurchaseFlow?: (selection: PurchaseSelectionType) => void;
};

export function SupplementPurchaseButton({
  existingFareContract,
  navigateToPurchaseFlow,
}: Props) {
  const {theme} = useThemeContext();
  const {data: preassignedFareProducts} = useGetFareProductsQuery();
  const {data: supplementProducts} = useGetSupplementProductsQuery();
  const hasReservationProduct = hasReservationTypeSupplementProduct(
    existingFareContract,
    preassignedFareProducts,
    supplementProducts,
  );
  const {selection: bookingPurchaseSelection} =
    useSupplementProductPurchaseSelection({
      existingFareContract,
      isEnabled: hasReservationProduct,
    });
  const {buttonMode, buttonText} =
    useSupplementProductPurchaseButtonConfig(existingFareContract);

  if (!hasReservationProduct || !navigateToPurchaseFlow) return null;

  return (
    <Button
      onPress={() =>
        bookingPurchaseSelection &&
        navigateToPurchaseFlow?.(bookingPurchaseSelection)
      }
      expanded={true}
      text={buttonText}
      mode={buttonMode}
      backgroundColor={theme.color.background.neutral[0]}
    />
  );
}
