import {useEffect, useState} from 'react';
import {useMobileTokenContextState} from '@atb/mobile-token';

const useTokenToggleDetails = (shouldFetchTokenDetails: boolean) => {
  const [shouldShowLoader, setShouldShowLoader] = useState<boolean>(false);
  const [toggleLimit, setToggleLimit] = useState<number | undefined>();
  const [maxToggleLimit, setMaxToggleLimit] = useState<number | undefined>();

  const {getTokenToggleDetails} = useMobileTokenContextState();

  useEffect(() => {
    (async function () {
      if (shouldFetchTokenDetails) {
        setShouldShowLoader(true);
        const toggleToggleDetails = await getTokenToggleDetails();
        if (toggleToggleDetails) {
          const {toggleMaxLimit, toggledCount} = toggleToggleDetails;
          if (toggleMaxLimit) {
            if (toggleMaxLimit >= toggledCount) {
              setToggleLimit(toggleMaxLimit - toggledCount);
            } else {
              //We can end up here if we decide to reduce max limit value in firestore
              setToggleLimit(0);
            }
          }
          setMaxToggleLimit(toggleMaxLimit);
        }
        setShouldShowLoader(false);
      }
    })();
  }, [shouldFetchTokenDetails, getTokenToggleDetails]);

  return {shouldShowLoader, toggleLimit, maxToggleLimit};
};

export {useTokenToggleDetails};
