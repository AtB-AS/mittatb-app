import React, {RefObject, forwardRef} from 'react';
import {ZonesSelection} from '@atb/stacks-hierarchy/Root_PurchaseOverviewScreen/components/ZonesSelection';
import {HarborSelection} from '@atb/stacks-hierarchy/Root_PurchaseOverviewScreen/components/HarborSelection';
import {FareProductTypeConfig} from '@atb/configuration';
import {PreassignedFareProduct} from '@atb/reference-data/types';
import {TariffZoneWithMetadata} from '@atb/tariff-zones-selector';
import {StyleProp, ViewStyle} from 'react-native';
import {Root_PurchaseTariffZonesSearchByMapScreenParams} from '@atb/stacks-hierarchy/navigation-types';
import {Root_PurchaseHarborSearchScreenParams} from '@atb/stacks-hierarchy/Root_PurchaseHarborSearchScreen/navigation-types';
import {StopPlaceFragment} from '@atb/api/types/generated/fragments/stop-places';

type SelectionProps = {
  fareProductTypeConfig: FareProductTypeConfig;
  fromPlace: TariffZoneWithMetadata | StopPlaceFragment;
  toPlace: TariffZoneWithMetadata | StopPlaceFragment;
  preassignedFareProduct: PreassignedFareProduct;
  onSelect: (
    params:
      | Root_PurchaseHarborSearchScreenParams
      | Root_PurchaseTariffZonesSearchByMapScreenParams,
  ) => void;
  style?: StyleProp<ViewStyle>;
  focusRef?: RefObject<any>;
};

export const FromToSelection = forwardRef<any, SelectionProps>(
  (
    {
      fareProductTypeConfig,
      fromPlace,
      toPlace,
      preassignedFareProduct,
      onSelect,
      style,
    }: SelectionProps,
    focusRef,
  ) => {
    let selectionMode = fareProductTypeConfig.configuration.zoneSelectionMode;
    if (selectionMode === 'none') {
      return null;
    }

    if (selectionMode === 'multiple-stop-harbor') {
      return (
        <HarborSelection
          fromHarbor={isValidTariffZone(fromPlace) ? undefined : fromPlace}
          toHarbor={isValidTariffZone(toPlace) ? undefined : toPlace}
          fareProductTypeConfig={fareProductTypeConfig}
          preassignedFareProduct={preassignedFareProduct}
          onSelect={onSelect}
          style={style}
          ref={focusRef}
        />
      );
    }

    // Only support multiple/single zone in app for now. Stop place is built into selector.
    if (selectionMode == 'multiple-stop' || selectionMode == 'multiple-zone') {
      selectionMode = 'multiple';
    } else if (
      preassignedFareProduct.zoneSelectionMode?.includes('single') ||
      selectionMode == 'single-stop' ||
      selectionMode == 'single-zone'
    ) {
      selectionMode = 'single';
    }
    return isValidTariffZone(fromPlace) && isValidTariffZone(toPlace) ? (
      <ZonesSelection
        fromTariffZone={fromPlace}
        toTariffZone={toPlace}
        fareProductTypeConfig={fareProductTypeConfig}
        preassignedFareProduct={preassignedFareProduct}
        selectionMode={selectionMode}
        onSelect={onSelect}
        style={style}
        ref={focusRef}
      />
    ) : null;
  },
);

export function isValidTariffZone(
  place: TariffZoneWithMetadata | StopPlaceFragment,
): place is TariffZoneWithMetadata {
  return !!place && 'geometry' in place;
}
