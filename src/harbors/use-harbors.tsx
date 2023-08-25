import {HarborConnectionOverrideType} from '@atb-as/config-specs';
import {StopPlaceFragment} from '@atb/api/types/generated/fragments/stop-places';
import {useHarborConnectionOverrides} from '@atb/harbors/use-harbor-connection-overrides';
import {useHarborsQuery} from '@atb/queries';
import {isDefined} from '@atb/utils/presence';
import _ from 'lodash';
import {useMemo} from 'react';

export const useHarbors = (fromHarborId?: string) => {
  const harbors = useHarborsQuery();
  const connections = useHarborsQuery(fromHarborId);
  const overrides = useHarborConnectionOverrides(fromHarborId);

  const isLoading = harbors.isLoading || connections.isLoading;
  const isError = harbors.isError || connections.isError;
  const error = fromHarborId ? connections.error : harbors.error;
  const isSuccess = fromHarborId ? connections.isSuccess : harbors.isSuccess;

  const data = useMemo(() => {
    if (!fromHarborId) {
      return harbors.data ?? [];
    }

    //Map overrides (if there are any) into complete StopPlaceFragments
    const overrideHarbors = mapOverridesToStopPlaceFragment(
      overrides,
      harbors.data,
    );
    // Add the extra stop places (override harbors) to the list of existing connections.
    return _.unionBy(connections.data ?? [], overrideHarbors, 'id');
  }, [fromHarborId, harbors.data, connections.data, overrides]);

  const refetch = fromHarborId ? harbors.refetch : connections.refetch;

  return {
    isLoading,
    isSuccess,
    isError,
    error,
    data,
    refetch,
  };
};

function mapOverridesToStopPlaceFragment(
  overrides: HarborConnectionOverrideType[],
  harbors: StopPlaceFragment[] | undefined,
) {
  if (!harbors) return [];
  return overrides
    .map((override) => harbors.find((h) => h.id === override.to))
    .filter(isDefined);
}
