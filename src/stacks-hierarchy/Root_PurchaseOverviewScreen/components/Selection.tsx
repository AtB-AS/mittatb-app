import React from 'react';
import {ZonesSelection} from '@atb/stacks-hierarchy/Root_PurchaseOverviewScreen/components/ZonesSelection';
import {HarborSelection} from '@atb/stacks-hierarchy/Root_PurchaseOverviewScreen/components/HarborSelection';
import {FareProductTypeConfig} from '@atb/configuration';
import {BoatStopPoint, PreassignedFareProduct} from '@atb/reference-data/types';
import {TariffZoneWithMetadata} from '@atb/tariff-zones-selector';
import {StyleProp, ViewStyle} from 'react-native';

export type HarborProps = {
  fromBoatStopPoint?: BoatStopPoint;
  fareProductTypeConfig: FareProductTypeConfig;
  preassignedFareProduct: PreassignedFareProduct;
};
type ZoneProps = {
  fromTariffZone: TariffZoneWithMetadata;
  toTariffZone: TariffZoneWithMetadata;
  fareProductTypeConfig: FareProductTypeConfig;
  preassignedFareProduct: PreassignedFareProduct;
};

type SelectionProps = {
  fareProductTypeConfig: FareProductTypeConfig;
  fromBoatStopPoint?: BoatStopPoint;
  fromTariffZone?: TariffZoneWithMetadata;
  toTariffZone?: TariffZoneWithMetadata;
  preassignedFareProduct: PreassignedFareProduct;
  onSelect: (t: HarborProps | ZoneProps) => void;
  style?: StyleProp<ViewStyle>;
};

export function Selection({
  fromTariffZone,
  toTariffZone,
  fareProductTypeConfig,
  fromBoatStopPoint,
  preassignedFareProduct,
  onSelect,
  style,
}: SelectionProps) {
  let selectionMode = fareProductTypeConfig.configuration.zoneSelectionMode;
  if (selectionMode === 'none') {
    return null;
  }

  if (selectionMode === 'stop-places-harbor') {
    return (
      <HarborSelection
        fromBoatStopPoint={fromBoatStopPoint}
        fareProductTypeConfig={fareProductTypeConfig}
        preassignedFareProduct={preassignedFareProduct}
        onSelect={onSelect}
        style={style}
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
    />
  ) : null;
}
