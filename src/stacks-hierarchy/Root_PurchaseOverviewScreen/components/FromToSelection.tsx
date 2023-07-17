import React, {RefObject} from 'react';
import {ZonesSelection} from '@atb/stacks-hierarchy/Root_PurchaseOverviewScreen/components/ZonesSelection';
import {HarborSelection} from '@atb/stacks-hierarchy/Root_PurchaseOverviewScreen/components/HarborSelection';
import {FareProductTypeConfig} from '@atb/configuration';
import {PreassignedFareProduct} from '@atb/reference-data/types';
import {TariffZoneWithMetadata} from '@atb/tariff-zones-selector';
import {StyleProp, TouchableOpacity, ViewStyle} from 'react-native';
import {StopPlace} from '@atb/api/types/stopPlaces';
import {Root_PurchaseTariffZonesSearchByMapScreenParams} from '@atb/stacks-hierarchy/navigation-types';
import {Root_PurchaseHarborSearchScreenParams} from '@atb/stacks-hierarchy/Root_PurchaseHarborSearchScreen/navigation-types';

type SelectionProps = {
  fareProductTypeConfig: FareProductTypeConfig;
  fromHarbor?: StopPlace;
  toHarbor?: StopPlace;
  fromTariffZone?: TariffZoneWithMetadata;
  toTariffZone?: TariffZoneWithMetadata;
  preassignedFareProduct: PreassignedFareProduct;
  onSelect: (
    params:
      | Root_PurchaseHarborSearchScreenParams
      | Root_PurchaseTariffZonesSearchByMapScreenParams,
  ) => void;
  style?: StyleProp<ViewStyle>;
  ref?: RefObject<TouchableOpacity>;
};

export function FromToSelection({
  fromTariffZone,
  toTariffZone,
  fareProductTypeConfig,
  fromHarbor,
  toHarbor,
  preassignedFareProduct,
  onSelect,
  style,
  ref,
}: SelectionProps) {
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
  return fromTariffZone && toTariffZone ? (
    <ZonesSelection
      fromTariffZone={fromTariffZone}
      toTariffZone={toTariffZone}
      fareProductTypeConfig={fareProductTypeConfig}
      preassignedFareProduct={preassignedFareProduct}
      selectionMode={selectionMode}
      onSelect={onSelect}
      style={style}
      ref={ref}
    />
  ) : null;
}
