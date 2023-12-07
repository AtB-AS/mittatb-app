import {useMobileTokenContextState} from '@atb/mobile-token';
import { useIsFocused } from '@react-navigation/native';
import {useQuery} from '@tanstack/react-query';

const ONE_MINUTE = 1000 * 60;
export const GET_TOKEN_TOGGLE_DETAILS_QUERY_KEY = 'getTokenToggleDetails';

const useTokenToggleDetails = () => {
  const {getTokenToggleDetails, deviceInspectionStatus} = useMobileTokenContextState();
  const screenHasFocus = useIsFocused();
  const shouldFetchTokenDetails =
    screenHasFocus && deviceInspectionStatus !== 'loading';
  const queryResult = useQuery({
    enabled: shouldFetchTokenDetails,
    queryKey: [GET_TOKEN_TOGGLE_DETAILS_QUERY_KEY],
    queryFn: async () => {
      let toggleLimit: number | undefined;
      let maxToggleLimit: number | undefined;

      const tokenToggleDetails = await getTokenToggleDetails();
      if (tokenToggleDetails) {
        const {toggleMaxLimit, toggledCount} = tokenToggleDetails;
        if (toggleMaxLimit) {
          if (toggleMaxLimit >= toggledCount) {
            toggleLimit = toggleMaxLimit - toggledCount;
          } else {
            //We can end up here if we decide to reduce max limit value in firestore
            toggleLimit = 0;
          }
        }
        maxToggleLimit = toggleMaxLimit;
      }
      return {toggleLimit, maxToggleLimit};
    },
    staleTime: ONE_MINUTE,
    cacheTime: ONE_MINUTE,
  });
  return {
    ...queryResult,
    toggleLimit: queryResult?.data?.toggleLimit,
    maxToggleLimit: queryResult?.data?.maxToggleLimit,
  }
};

export {useTokenToggleDetails};
