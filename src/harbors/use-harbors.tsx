import {HarborConnectionOverrideType} from '@atb-as/config-specs';
import {StopPlaceFragment} from '@atb/api/types/generated/fragments/stop-places';
import {useHarborConnectionOverrides} from '@atb/harbors/use-harbor-connection-overrides';
import {useHarborsQuery} from '@atb/queries';
import {isDefined} from '@atb/utils/presence';
import _ from 'lodash';

export const useHarbors = (fromHarborId?: string) => {
  const harborsQuery = useHarborsQuery();
  const connectionsQuery = useHarborsQuery(fromHarborId);
  const overrides = useHarborConnectionOverrides(fromHarborId);

  const isLoading = harborsQuery.isLoading || connectionsQuery.isLoading;
  const isError = harborsQuery.isError || connectionsQuery.isError;
  const error = fromHarborId ? connectionsQuery.error : harborsQuery.error;
  const isSuccess = fromHarborId
    ? connectionsQuery.isSuccess
    : harborsQuery.isSuccess;
  const refetch = fromHarborId
    ? () =>
        Promise.all([connectionsQuery.refetch(), harborsQuery.refetch()]).then(
          ([connectionsQuery, harborsQuery]) =>
            applyOverrides(harborsQuery.data, connectionsQuery.data, overrides),
        )
    : harborsQuery.refetch;

  const data = fromHarborId
    ? applyOverrides(harborsQuery.data, connectionsQuery.data, overrides)
    : harborsQuery.data ?? [];

  return {
    isLoading,
    isSuccess,
    isError,
    error,
    data,
    refetch,
  };
};

export const useIsFree = (fromHarborId?: string, toHarborId?: string) => {
  const harborConnections = useHarbors(fromHarborId);

  const toPlaceConnection = harborConnections.data.find(
    (harbor) => harbor.id === toHarborId,
  );

  return !!toPlaceConnection?.isFree;
};

function applyOverrides(
  allHarbors: StopPlaceFragment[] | undefined,
  connections: StopPlaceFragment[] | undefined,
  overrides: HarborConnectionOverrideType[],
) {
  //Map overrides (if there are any) into complete StopPlaceFragments
  const overrideHarbors = mapOverridesToStopPlaceFragment(
    overrides,
    allHarbors,
  );

  // Add the extra stop places (override harbors) to the list of existing connections.
  return _.unionBy(overrideHarbors, connections ?? [], 'id');
}

function mapOverridesToStopPlaceFragment(
  overrides: HarborConnectionOverrideType[],
  harbors: StopPlaceFragment[] | undefined,
) {
  if (!harbors) return [];
  return overrides
    .map((override) => {
      const harbor = harbors.find((h) => h.id === override.to);
      if (!harbor) return undefined;
      return {
        ...harbor,
        ...override,
      };
    })
    .filter(isDefined);
}
