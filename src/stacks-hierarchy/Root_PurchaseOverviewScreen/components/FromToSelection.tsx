import React, {forwardRef} from 'react';
import {ZonesSelection} from '@atb/stacks-hierarchy/Root_PurchaseOverviewScreen/components/ZonesSelection';
import {HarborSelection} from '@atb/stacks-hierarchy/Root_PurchaseOverviewScreen/components/HarborSelection';
import {FareProductTypeConfig} from '@atb/configuration';
import {PreassignedFareProduct} from '@atb/configuration';
import {TariffZoneWithMetadata} from '@atb/tariff-zones-selector';
import {StyleProp, ViewStyle} from 'react-native';
import {Root_PurchaseTariffZonesSearchByMapScreenParams} from '@atb/stacks-hierarchy/navigation-types';
import {Root_PurchaseHarborSearchScreenParams} from '@atb/stacks-hierarchy/Root_PurchaseHarborSearchScreen/navigation-types';
import {FocusRefsType} from '@atb/utils/use-focus-refs';
import {StopPlaceFragmentWithIsFree} from '@atb/harbors/types';

type SelectionProps = {
  fareProductTypeConfig: FareProductTypeConfig;
  fromPlace: TariffZoneWithMetadata | StopPlaceFragmentWithIsFree | undefined;
  toPlace: TariffZoneWithMetadata | StopPlaceFragmentWithIsFree | undefined;
  preassignedFareProduct: PreassignedFareProduct;
  onSelect: (
    params:
      | Root_PurchaseHarborSearchScreenParams
      | Root_PurchaseTariffZonesSearchByMapScreenParams,
  ) => void;
  style?: StyleProp<ViewStyle>;
};

export const FromToSelection = forwardRef<FocusRefsType, SelectionProps>(
  (
    {
      fareProductTypeConfig,
      fromPlace,
      toPlace,
      preassignedFareProduct,
      onSelect,
      style,
    }: SelectionProps,
    ref,
  ) => {
    let selectionMode = fareProductTypeConfig.configuration.zoneSelectionMode;
    if (selectionMode === 'none') {
      return null;
    }

    if (selectionMode === 'multiple-stop-harbor') {
      return (
        <HarborSelection
          fromHarbor={
            fromPlace && isValidTariffZone(fromPlace) ? undefined : fromPlace
          }
          toHarbor={toPlace && isValidTariffZone(toPlace) ? undefined : toPlace}
          fareProductTypeConfig={fareProductTypeConfig}
          preassignedFareProduct={preassignedFareProduct}
          onSelect={onSelect}
          style={style}
          ref={ref}
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
    return fromPlace &&
      isValidTariffZone(fromPlace) &&
      toPlace &&
      isValidTariffZone(toPlace) ? (
      <ZonesSelection
        fromTariffZone={fromPlace}
        toTariffZone={toPlace}
        fareProductTypeConfig={fareProductTypeConfig}
        preassignedFareProduct={preassignedFareProduct}
        selectionMode={selectionMode}
        onSelect={onSelect}
        style={style}
        ref={ref}
      />
    ) : null;
  },
);

export function isValidTariffZone(
  place: TariffZoneWithMetadata | StopPlaceFragmentWithIsFree,
): place is TariffZoneWithMetadata {
  return !!place && 'geometry' in place;
}
