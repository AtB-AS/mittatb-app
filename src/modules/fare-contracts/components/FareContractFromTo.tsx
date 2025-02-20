import {ContrastColor} from '@atb-as/theme';
import {type RecentFareContractType} from '@atb/recent-fare-contracts';
import {FareContractType, TravelRightDirection} from '@atb-as/utils';
import {ZonesFromTo} from './ZonesFromTo';
import {HarborsFromTo} from './HarborsFromTo';
import {
  findReferenceDataById,
  useFirestoreConfigurationContext,
} from '@atb/configuration';

type FareContractFromToBaseProps = {
  backgroundColor: ContrastColor;
  mode: 'small' | 'large';
};

export type FareContractPropsSub = {
  fc: FareContractType;
};

export type RecentFareContractPropsSub = {
  rfc: RecentFareContractType;
};

type FareContractFromToProps = FareContractFromToBaseProps &
  (FareContractPropsSub | RecentFareContractPropsSub);

export const FareContractFromTo = (props: FareContractFromToProps) => {
  const controllerData = useFareContractFromToController(
    'rfc' in props ? props.rfc : props.fc,
  );

  if (!controllerData) return null;

  if (controllerData.mode === 'zones') {
    return (
      <ZonesFromTo
        tariffZoneRefs={controllerData.tariffZoneRefs}
        mode={props.mode}
        backgroundColor={props.backgroundColor}
      />
    );
  } else if (controllerData.mode === 'harbors') {
    return (
      <HarborsFromTo
        startPointRef={controllerData.startPointRef}
        endPointRef={controllerData.endPointRef}
        direction={controllerData.direction}
        mode={props.mode}
        backgroundColor={props.backgroundColor}
      />
    );
  }
  return null;
};

type HarborsFromToData = {
  mode: 'harbors';
  startPointRef: string;
  endPointRef?: string;
  direction: TravelRightDirection;
};

type ZonesFromToData = {
  mode: 'zones';
  tariffZoneRefs: string[];
};

type FareContractFromToControllerDataType =
  | HarborsFromToData
  | ZonesFromToData
  | undefined;

function useFareContractFromToController(
  fcOrRfc: FareContractType | RecentFareContractType,
): FareContractFromToControllerDataType {
  const {fareProductTypeConfigs, preassignedFareProducts} =
    useFirestoreConfigurationContext();
  const fareProductTypeConfig = fareProductTypeConfigs.find((c) => {
    if (isFareContract(fcOrRfc)) {
      const productRef = fcOrRfc.travelRights[0].fareProductRef;
      const preassignedFareProduct = findReferenceDataById(
        preassignedFareProducts,
        productRef,
      );
      return c.type === preassignedFareProduct?.type;
    } else if (isRecentFareContract(fcOrRfc)) {
      return c.type === fcOrRfc.preassignedFareProduct.type;
    }
  });

  if (fareProductTypeConfig?.configuration.zoneSelectionMode === 'none') {
    return undefined;
  }

  const tariffZoneRefs = (() => {
    if (isFareContract(fcOrRfc)) {
      const travelRight = fcOrRfc.travelRights[0];
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
  })();

  const direction = (() => {
    if (isFareContract(fcOrRfc)) {
      const travelRight = fcOrRfc.travelRights[0];
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
    // Fall back to Forwards
    return TravelRightDirection.Forwards;
  })();

  const {startPointRef = undefined, endPointRef = undefined} = (() => {
    if (isFareContract(fcOrRfc)) {
      const travelRight = fcOrRfc.travelRights[0];
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

  if (!!startPointRef)
    return {
      mode: 'harbors',
      startPointRef,
      endPointRef,
      direction,
    };
  else if (!!tariffZoneRefs.length)
    return {
      mode: 'zones',
      tariffZoneRefs,
    };
}

function isFareContract(
  fcOrRfc: FareContractType | RecentFareContractType,
): fcOrRfc is FareContractType {
  return 'travelRights' in fcOrRfc;
}

function isRecentFareContract(
  fcOrRfc: FareContractType | RecentFareContractType,
): fcOrRfc is RecentFareContractType {
  return 'fromTariffZone' in fcOrRfc;
}
