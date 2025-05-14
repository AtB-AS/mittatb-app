import {useDoOnceWhen} from '@atb/utils/use-do-once-when';

export const useDoOnceOnItemReceived = <T>(
  action: ((item: T) => void) | undefined,
  item: T | undefined | null,
) => {
  useDoOnceWhen(() => action?.(item!), !!item, true);
};
