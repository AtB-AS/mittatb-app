import {useEffect, useState} from 'react';
import {useMobileTokenContextState} from '@atb/mobile-token/MobileTokenContext';

const useTokenToggleDetails = (shouldFetchTokenDetails: boolean) => {
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [toggleLimit, setToggleLimit] = useState<number | undefined>();
  const [maxToggleLimit, setMaxToggleLimit] = useState<number | undefined>();

  const {getTokenToggleDetails} = useMobileTokenContextState();

  const fetchToggleLimit = async () => {
    setShowLoader(true);
    const toggleToggleDetails = await getTokenToggleDetails();
    if (toggleToggleDetails) {
      const {toggleMaxLimit, toggledCount} = toggleToggleDetails;
      if (toggleMaxLimit && toggleMaxLimit >= toggledCount) {
        setToggleLimit(toggleMaxLimit - toggledCount);
      }
      setMaxToggleLimit(toggleMaxLimit);
    }
    setShowLoader(false);
  };

  useEffect(() => {
    if (shouldFetchTokenDetails) {
      fetchToggleLimit();
    }
  }, [shouldFetchTokenDetails, getTokenToggleDetails]);

  return {showLoader, toggleLimit, maxToggleLimit};
};

export {useTokenToggleDetails};
