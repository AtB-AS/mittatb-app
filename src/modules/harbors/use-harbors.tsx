import {
  HarborConnectionOverrideType,
  ProductTypeTransportModes,
} from '@atb/modules/configuration';
import {StopPlaceFragment} from '@atb/api/types/generated/fragments/stop-places';
import {useHarborConnectionOverrides} from './use-harbor-connection-overrides';
import {useHarborsQuery} from '@atb/queries';
import {isDefined} from '@atb/utils/presence';
import _ from 'lodash';
import {StopPlaceFragmentWithIsFree} from './types';
import {useConnectionsQuery} from '@atb/queries/use-connections-query';

/**
 * This hook is pretty generic, but it does serve a purpose as-is.
 * You can think of it as a "HarborService" in a way, as it encapsulates
 * everything needed to work with harbors and their connections, whether you
 * need all harbors or just those connected to a specific harbor.
 *
 * @param fromHarborId - If provided, fetches harbors connected to this harbor. If not provided, fetches all harbors.
 * @param transportModes - If provided, filters harbors by these transport modes.
 */
export const useHarbors = ({
  fromHarborId,
  transportModes,
}: {
  fromHarborId?: string;
  transportModes?: ProductTypeTransportModes[];
} = {}) => {
  const allHarborsQuery = useHarborsQuery(transportModes);
  const connectionsQuery = useConnectionsQuery(fromHarborId);
  const overrides = useHarborConnectionOverrides(fromHarborId);

  const isLoading = allHarborsQuery.isLoading || connectionsQuery.isFetching;
  const isError = allHarborsQuery.isError || connectionsQuery.isError;
  const error = fromHarborId ? connectionsQuery.error : allHarborsQuery.error;
  const isSuccess = fromHarborId
    ? connectionsQuery.isSuccess
    : allHarborsQuery.isSuccess;
  const refetch = fromHarborId
    ? () =>
        Promise.all([
          connectionsQuery.refetch(),
          allHarborsQuery.refetch(),
        ]).then(([connectionsQuery, allHarborsQuery]) =>
          applyOverrides(
            allHarborsQuery.data,
            connectionsQuery.data,
            overrides,
          ),
        )
    : allHarborsQuery.refetch;

  const data: StopPlaceFragmentWithIsFree[] = fromHarborId
    ? applyOverrides(allHarborsQuery.data, connectionsQuery.data, overrides)
    : allHarborsQuery.data ?? [];

  return {
    isLoading,
    isSuccess,
    isError,
    error,
    data,
    refetch,
  };
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
