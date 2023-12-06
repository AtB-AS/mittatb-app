import {useMobileTokenContextState} from '@atb/mobile-token';
import { useIsFocused } from '@react-navigation/native';
import {useQuery} from '@tanstack/react-query';

/**
 * 10 seconds stale/cache time to allow user get latest result in case they switch their phone/t:card
 */
const ONE_MINUTE = 1000 * 60;
export const GET_TOKEN_TOGGLE_DETAILS_QUERY_KEY = 'getTokenToggleDetails';

const useTokenToggleDetails = () => {
  const {getTokenToggleDetails, deviceInspectionStatus} = useMobileTokenContextState();
  const screenHasFocus = useIsFocused();
  const shouldFetchTokenDetails =
    screenHasFocus && deviceInspectionStatus !== 'loading';
  return useQuery({
    enabled: shouldFetchTokenDetails,
    queryKey: [GET_TOKEN_TOGGLE_DETAILS_QUERY_KEY],
    queryFn: async () => {
      let toggleLimit: number | undefined;
      let maxToggleLimit: number | undefined;

      const toggleToggleDetails = await getTokenToggleDetails();
      if (toggleToggleDetails) {
        const {toggleMaxLimit, toggledCount} = toggleToggleDetails;
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
};

export {useTokenToggleDetails};