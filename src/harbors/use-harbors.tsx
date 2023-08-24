import {useHarborsQuery} from '@atb/queries';
import {useHarborConnectionOverrides} from '@atb/harbors/use-harbor-connection-overrides';
import {useEffect, useState} from 'react';
import {StopPlaceFragment} from '@atb/api/types/generated/fragments/stop-places';
import {HarborConnectionOverrideType} from '@atb-as/config-specs';
import {isDefined} from '@atb/utils/presence';
import _ from 'lodash';

export const useHarbors = (fromHarborId?: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<unknown>();
  const [data, setData] = useState<StopPlaceFragment[]>([]);

  const harbors = useHarborsQuery();
  const connections = useHarborsQuery(fromHarborId);
  const overrides = useHarborConnectionOverrides(fromHarborId);

  useEffect(() => {
    setIsLoading(harbors.isLoading || connections.isLoading);
  }, [harbors.isLoading, connections.isLoading]);

  useEffect(() => {
    setIsError(harbors.isError || connections.isError);
  }, [harbors.isError, connections.isError]);

  useEffect(() => {
    setError(fromHarborId ? connections.error : harbors.error);
  }, [fromHarborId, harbors.error, connections.error]);

  useEffect(() => {
    setIsSuccess(fromHarborId ? connections.isSuccess : harbors.isSuccess);
  }, [fromHarborId, harbors.isSuccess, connections.isSuccess]);

  useEffect(() => {
    if (!fromHarborId) {
      setData(harbors.data ?? []);
      return;
    }

    if (overrides.length === 0) {
      setData(connections.data ?? []);
    }
    // There is overrides for this harbor. Map these into complete StopPlaceFragments
    const overrideHarbors = mapOverridesToStopPlaceFragment(
      overrides,
      harbors.data,
    );
    // Add the extra stop places (override harbors) to the list of existing connections.
    const allConnections = _.unionBy(
      connections.data ?? [],
      overrideHarbors,
      'id',
    );
    setData(allConnections);
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
