import {useEffect, useRef} from 'react';

/**
 *
 * @param action The function to run only one time, as soon as the item is truthy.
 * @param item Can be any object.
 */
export const useDoOnceOnTruthy = (
  action: ((item: any) => void) | undefined,
  item: any | null | undefined,
) => {
  const hasRunOnceRef = useRef(false);

  useEffect(() => {
    if (!!item && action && !hasRunOnceRef.current) {
      hasRunOnceRef.current = true;
      action(item);
    }
  }, [item, action]);
};
