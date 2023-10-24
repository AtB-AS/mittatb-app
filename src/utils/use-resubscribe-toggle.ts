import {useCallback, useState} from 'react';

export const useResubscribeToggle = () => {
  // A toggle to trigger resubscribe. The actual boolean value is not important.
  const [resubscribeToggle, setResubscribeToggle] = useState<boolean>(true);

  const resubscribe = useCallback(
    () => setResubscribeToggle((prev) => !prev),
    [],
  );

  return {resubscribeToggle, resubscribe};
};
