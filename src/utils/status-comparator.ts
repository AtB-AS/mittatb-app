import {Statuses} from '@atb/theme';

/**
 * Comparator for comparing status levels. The order is:
 * 'error' -> 'warning' -> 'info' -> 'valid' -> undefined
 */
export const statusComparator = (s1: Statuses, s2: Statuses): number => {
  if (s1 === s2) return 0;
  switch (s1) {
    case 'error':
      return 1;
    case 'warning':
      return s2 === 'error' ? -1 : 1;
    case 'info':
      return s2 === 'error' || s2 === 'warning' ? -1 : 1;
    case 'valid':
      return !s2 ? 1 : -1;
    case undefined:
      return -1;
  }
};
