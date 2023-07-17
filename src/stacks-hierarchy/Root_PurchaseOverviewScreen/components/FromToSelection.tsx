import React, {RefObject, forwardRef} from 'react';
import {ZonesSelection} from '@atb/stacks-hierarchy/Root_PurchaseOverviewScreen/components/ZonesSelection';
import {HarborSelection} from '@atb/stacks-hierarchy/Root_PurchaseOverviewScreen/components/HarborSelection';
import {FareProductTypeConfig} from '@atb/configuration';
import {PreassignedFareProduct} from '@atb/reference-data/types';
import {TariffZoneWithMetadata} from '@atb/tariff-zones-selector';
import {StyleProp, TouchableOpacity, ViewStyle} from 'react-native';
import {Root_PurchaseTariffZonesSearchByMapScreenParams} from '@atb/stacks-hierarchy/navigation-types';
import {Root_PurchaseHarborSearchScreenParams} from '@atb/stacks-hierarchy/Root_PurchaseHarborSearchScreen/navigation-types';
import {StopPlaceFragment} from '@atb/api/types/generated/fragments/stop-places';

type SelectionProps = {
  fareProductTypeConfig: FareProductTypeConfig;
  fromHarbor?: StopPlaceFragment;
  toHarbor?: StopPlaceFragment;
  fromTariffZone?: TariffZoneWithMetadata;
  toTariffZone?: TariffZoneWithMetadata;
  preassignedFareProduct: PreassignedFareProduct;
  onSelect: (
    params:
      | Root_PurchaseHarborSearchScreenParams
      | Root_PurchaseTariffZonesSearchByMapScreenParams,
  ) => void;
  style?: StyleProp<ViewStyle>;
  focusRef?: RefObject<TouchableOpacity>;
};

export const FromToSelection = forwardRef<TouchableOpacity, SelectionProps>(
  (
    {
      fromTariffZone,
      toTariffZone,
      fareProductTypeConfig,
      fromHarbor,
      toHarbor,
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
          fromHarbor={fromHarbor}
          toHarbor={toHarbor}
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
    return fromTariffZone && toTariffZone ? (
      <ZonesSelection
        fromTariffZone={fromTariffZone}
        toTariffZone={toTariffZone}
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
