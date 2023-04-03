import {
  TariffZoneSelection,
  TariffZoneWithMetadata,
} from '@atb/stacks-hierarchy/Root_PurchaseTariffZonesSearchByMapScreen';
import {Root_PurchaseTariffZonesSearchByMapScreenParams} from '@atb/stacks-hierarchy/navigation-types';

type ZonesSelectorButtonsParams = {
  toTariffZone: TariffZoneWithMetadata;
  fromTariffZone: TariffZoneWithMetadata;
  isApplicableOnSingleZoneOnly: boolean;
};

export type ZonesSelectorButtonsProps = ZonesSelectorButtonsParams & {
  onVenueSearchClick: (
    callerRouteParam: keyof Root_PurchaseTariffZonesSearchByMapScreenParams,
  ) => void;
};

type ZonesSelectorMapParams = {
  selectedZones: TariffZoneSelection;
  isApplicableOnSingleZoneOnly: boolean;
};

export type ZonesSelectorMapsProps = ZonesSelectorMapParams & {
  setSelectedZones: (selectedZOnes: TariffZoneSelection) => void;
  onSave?: () => void;
};
