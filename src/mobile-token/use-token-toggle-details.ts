import {useMobileTokenContextState} from '@atb/mobile-token';
import {useIsFocused} from '@react-navigation/native';
import {useQuery} from '@tanstack/react-query';
import {MOBILE_TOKEN_QUERY_KEY} from '@atb/mobile-token/utils';
import {ONE_MINUTE_MS} from '@atb/utils/durations';

export const GET_TOKEN_TOGGLE_DETAILS_QUERY_KEY = 'getTokenToggleDetails';

const useTokenToggleDetailsQuery = () => {
  const {getTokenToggleDetails, mobileTokenStatus} =
    useMobileTokenContextState();
  const screenHasFocus = useIsFocused();
  const shouldFetchTokenDetails =
    screenHasFocus && mobileTokenStatus !== 'loading';
  return useQuery({
    enabled: shouldFetchTokenDetails,
    queryKey: [MOBILE_TOKEN_QUERY_KEY, GET_TOKEN_TOGGLE_DETAILS_QUERY_KEY],
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
    staleTime: ONE_MINUTE_MS,
    cacheTime: ONE_MINUTE_MS,
  });
};

export {useTokenToggleDetailsQuery};
