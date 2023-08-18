import {useHarborsQuery} from '@atb/queries';
import {useHarborConnectionOverrides} from '@atb/harbors/use-harbor-connection-overrides';
import {useEffect, useState} from 'react';
import {StopPlaceFragment} from '@atb/api/types/generated/fragments/stop-places';

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
    setIsError(fromHarborId ? connections.isError : harbors.isError);
    setIsSuccess(fromHarborId ? connections.isSuccess : harbors.isSuccess);
    setError(fromHarborId ? connections.isError : harbors.error);
    setData((fromHarborId ? connections.data : harbors.data) ?? []);
  }, [
    harbors.isLoading,
    harbors.isError,
    harbors.isSuccess,
    harbors.error,
    harbors.data,
    connections.isLoading,
    connections.isError,
    connections.isSuccess,
    connections.error,
    connections.data,
    fromHarborId,
  ]);

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
