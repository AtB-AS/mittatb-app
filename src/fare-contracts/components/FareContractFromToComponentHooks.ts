import {
  findReferenceDataById,
  getReferenceDataName,
  useFirestoreConfigurationContext,
} from '@atb/configuration';
import type {PreassignedFareProduct} from '@atb-as/config-specs';
import {
  type FareContract,
  isNormalTravelRight,
  TravelRightDirection,
} from '@atb/ticketing';
import type {RecentFareContractType} from '@atb/recent-fare-contracts';
import {useTranslation} from '@atb/translations';
import {useHarbors} from '@atb/harbors';

type UseFareContractFromToProps = {
  fcOrRfc: FareContract | RecentFareContractType;
  preassignedFareProduct?: PreassignedFareProduct;
};

type FareContractFromToLogicType = {
  shouldReturnNull: boolean;
  tariffZoneRefs: string[];
  direction?: TravelRightDirection;
  startPointRef?: string;
  endPointRef?: string;
};

export function useFareContractFromTo({
  preassignedFareProduct,
  fcOrRfc,
}: UseFareContractFromToProps): FareContractFromToLogicType {
  // shouldReturnNull
  const {fareProductTypeConfigs} = useFirestoreConfigurationContext();
  const fareProductTypeConfig = fareProductTypeConfigs.find(
    (c) => c.type === preassignedFareProduct?.type,
  );
  const shouldReturnNull =
    fareProductTypeConfig?.configuration.zoneSelectionMode === 'none';

  // tarifZoneRefs
  const tariffZoneRefs = () => {
    if (isFareContract(fcOrRfc)) {
      const travelRight = fcOrRfc.travelRights[0];
      if (!isNormalTravelRight(travelRight)) return [];
      return travelRight.tariffZoneRefs ?? [];
    } else if (isRecentFareContract(fcOrRfc)) {
      if (fcOrRfc.fromTariffZone) {
        return [
          fcOrRfc.fromTariffZone.id,
          ...(fcOrRfc.toTariffZone ? [fcOrRfc.toTariffZone.id] : []),
        ];
      }
    }
    return [];
  };

  // direction
  const direction = () => {
    if (isFareContract(fcOrRfc)) {
      const travelRight = fcOrRfc.travelRights[0];
      if (!isNormalTravelRight(travelRight)) return undefined;
      if (!!travelRight.direction) {
        // A travelRight between quays (e.g. for boat)
        return travelRight.direction;
      } else if (travelRight.tariffZoneRefs?.length ?? 0 > 1) {
        // A travelRight between several zones (e.g. for bus)
        return TravelRightDirection.Both;
      }
    } else if (isRecentFareContract(fcOrRfc)) {
      if (!!fcOrRfc.direction) {
        return fcOrRfc.direction;
      } else if (fcOrRfc.fromTariffZone?.id !== fcOrRfc.toTariffZone?.id) {
        return TravelRightDirection.Both;
      }
    }
  };

  // startPointRef / endPointRef
  const {startPointRef = undefined, endPointRef = undefined} = (() => {
    if (isFareContract(fcOrRfc)) {
      const travelRight = fcOrRfc.travelRights[0];
      if (!isNormalTravelRight(travelRight)) return {};
      return {
        startPointRef: travelRight.startPointRef,
        endPointRef: travelRight.endPointRef,
      };
    } else if (isRecentFareContract(fcOrRfc) && fcOrRfc.pointToPointValidity) {
      return {
        startPointRef: fcOrRfc.pointToPointValidity.fromPlace,
        endPointRef: fcOrRfc.pointToPointValidity.toPlace,
      };
    }
    return {};
  })();

  return {
    shouldReturnNull,
    tariffZoneRefs: tariffZoneRefs(),
    direction: direction(),
    startPointRef,
    endPointRef,
  };
}

function isFareContract(
  fcOrRfc: FareContract | RecentFareContractType,
): fcOrRfc is FareContract {
  return 'travelRights' in fcOrRfc;
}

function isRecentFareContract(
  fcOrRfc: FareContract | RecentFareContractType,
): fcOrRfc is RecentFareContractType {
  return 'fromTariffZone' in fcOrRfc;
}

type UseZonesFromToProps = {tariffZoneRefs: string[]};
type ZonesFromToLogicType = {
  fromZoneName?: string;
  toZoneName?: string;
};

export function useZonesFromTo({
  tariffZoneRefs,
}: UseZonesFromToProps): ZonesFromToLogicType {
  const {tariffZones} = useFirestoreConfigurationContext();
  const {language} = useTranslation();

  const fromZoneId = tariffZoneRefs[0];
  const fromZone = findReferenceDataById(tariffZones, fromZoneId);
  const fromZoneName = !!fromZone
    ? getReferenceDataName(fromZone, language)
    : undefined;

  const toZoneId = tariffZoneRefs[tariffZoneRefs.length - 1];
  const toZone =
    fromZoneId !== toZoneId
      ? findReferenceDataById(tariffZones, toZoneId)
      : undefined;
  const toZoneName = toZone
    ? getReferenceDataName(toZone, language)
    : undefined;

  return {
    fromZoneName,
    toZoneName,
  };
}

type HarborsFromToProps = {
  startPointRef: string;
  endPointRef?: string;
};
type HarborsFromToLogicType = {
  startPointName?: string;
  endPointName?: string;
};

export function useHarborsFromTo({
  startPointRef,
  endPointRef,
}: HarborsFromToProps): HarborsFromToLogicType {
  const {data: harbors} = useHarbors();
  const startPointName = harbors.find((h) => h.id === startPointRef)?.name;

  const endPointName = endPointRef
    ? harbors.find((h) => h.id === endPointRef)?.name
    : undefined;
  return {
    startPointName,
    endPointName,
  };
}
