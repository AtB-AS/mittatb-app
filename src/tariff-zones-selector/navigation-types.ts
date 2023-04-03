import {
  TariffZoneSelection,
  TariffZoneWithMetadata,
} from '@atb/stacks-hierarchy/Root_PurchaseTariffZonesSearchByMapScreen';
import {Root_PurchaseTariffZonesSearchByMapScreenParams} from '@atb/stacks-hierarchy/navigation-types';

export type TariffZonesSelectorButtonsProps = {
  toTariffZone: TariffZoneWithMetadata;
  fromTariffZone: TariffZoneWithMetadata;
  isApplicableOnSingleZoneOnly: boolean;
  onVenueSearchClick: (
    callerRouteParam: keyof Root_PurchaseTariffZonesSearchByMapScreenParams,
  ) => void;
};

export type TariffZonesSelectorMapsProps = {
  selectedZones: TariffZoneSelection;
  isApplicableOnSingleZoneOnly: boolean;
  setSelectedZones: (selectedZOnes: TariffZoneSelection) => void;
  onSave?: () => void;
};
