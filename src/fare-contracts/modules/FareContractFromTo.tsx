import {ContrastColor} from '@atb-as/theme';
import {type RecentFareContractType} from '@atb/recent-fare-contracts';
import {FareContract, TravelRightDirection} from '@atb/ticketing';
import {ZonesFromTo} from '@atb/fare-contracts/modules/ZonesFromTo';
import {HarborsFromTo} from '@atb/fare-contracts/modules/HarborsFromTo';
import {
  findReferenceDataById,
  useFirestoreConfigurationContext,
} from '@atb/configuration';

type FareContractFromToBaseProps = {
  backgroundColor: ContrastColor;
  mode: 'small' | 'large';
};

export type FareContractPropsSub = {
  fc: FareContract;
};

export type RecentFareContractPropsSub = {
  rfc: RecentFareContractType;
};

type FareContractFromToProps = FareContractFromToBaseProps &
  (FareContractPropsSub | RecentFareContractPropsSub);

export const FareContractFromTo = (props: FareContractFromToProps) => {
  const {
    shouldReturnNull,
    tariffZoneRefs,
    direction,
    startPointRef,
    endPointRef,
  } = useFareContractFromToController({
    fcOrRfc: 'rfc' in props ? props.rfc : props.fc,
  });

  if (shouldReturnNull) return null;

  if (tariffZoneRefs.length) {
    return (
      <ZonesFromTo
        tariffZoneRefs={tariffZoneRefs}
        mode={props.mode}
        backgroundColor={props.backgroundColor}
      />
    );
  } else if (startPointRef) {
    return (
      <HarborsFromTo
        startPointRef={startPointRef}
        endPointRef={endPointRef}
        direction={direction}
        mode={props.mode}
        backgroundColor={props.backgroundColor}
      />
    );
  }
  return null;
};

type FareContractFromToControllerProps = {
  fcOrRfc: FareContract | RecentFareContractType;
};

function useFareContractFromToController({
  fcOrRfc,
}: FareContractFromToControllerProps) {
  // shouldReturnNull
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

  const shouldReturnNull =
    fareProductTypeConfig?.configuration.zoneSelectionMode === 'none';

  // tarifZoneRefs
  const tariffZoneRefs = () => {
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
  };

  // direction
  const direction = () => {
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
  };

  // startPointRef / endPointRef
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
