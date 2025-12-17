import {useMobileTokenContext} from '@atb/modules/mobile-token';
import {useQuery} from '@tanstack/react-query';
import {MOBILE_TOKEN_QUERY_KEY} from '@atb/modules/mobile-token';
import {ONE_MINUTE_MS} from '@atb/utils/durations';

export const GET_TOKEN_TOGGLE_DETAILS_QUERY_KEY = 'getTokenToggleDetails';

const useTokenToggleDetailsQuery = (screenHasFocus: boolean) => {
  const {getTokenToggleDetails, mobileTokenStatus} = useMobileTokenContext();
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
    gcTime: ONE_MINUTE_MS,
  });
};

export {useTokenToggleDetailsQuery};
