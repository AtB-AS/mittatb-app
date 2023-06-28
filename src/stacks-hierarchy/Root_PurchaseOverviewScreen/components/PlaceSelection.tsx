import React from 'react';
import {ZonesSelection} from '@atb/stacks-hierarchy/Root_PurchaseOverviewScreen/components/ZonesSelection';
import {HarborSelection} from '@atb/stacks-hierarchy/Root_PurchaseOverviewScreen/components/HarborSelection';
import {FareProductTypeConfig} from '@atb/configuration';
import {PreassignedFareProduct} from '@atb/reference-data/types';
import {TariffZoneWithMetadata} from '@atb/tariff-zones-selector';
import {StyleProp, ViewStyle} from 'react-native';
import {StopPlace} from '@atb/api/types/stopPlaces';

export type StopPlaceProps = {
  fromHarbor?: StopPlace;
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
  fromHarbor?: StopPlace;
  toHarbor?: StopPlace;
  fromTariffZone?: TariffZoneWithMetadata;
  toTariffZone?: TariffZoneWithMetadata;
  preassignedFareProduct: PreassignedFareProduct;
  onSelect: (t: StopPlaceProps | ZoneProps) => void;
  style?: StyleProp<ViewStyle>;
};

export function PlaceSelection({
  fromTariffZone,
  toTariffZone,
  fareProductTypeConfig,
  fromHarbor,
  toHarbor,
  preassignedFareProduct,
  onSelect,
  style,
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
