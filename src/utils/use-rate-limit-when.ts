import {useRef, useState} from 'react';

/**
 * Provides a boolean, `isRateLimited`, which indicates if a rate limit is
 * active, based on a predicate function that decides when the rate limit should
 * be enabled.
 *
 * @example
 * // Add a 15 second timeout on every 5th call of onSubmit
 * const {isRateLimited, rateLimitIfNeeded} = useRateLimitWhen<number>(
 *  (n) => n % 5 === 0,
 *  15000,
 * );
 * const [count, setCount] = useState(0);
 * const onSubmit = () => {
 *   if (isRateLimited) return;
 *   rateLimitIfNeeded(count);
 *   setCount(count + 1);
 *   // some rate limited event here
 * };
 */
export function useRateLimitWhen<T>(
  predicate: (arg: T) => boolean,
  rateLimitDurationMS: number = 10000,
) {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>();

  const rateLimitIfNeeded = (data: T) => {
    if (predicate(data)) {
      timeoutRef.current && clearTimeout(timeoutRef.current);
      setIsRateLimited(true);
      timeoutRef.current = setTimeout(
        () => setIsRateLimited(false),
        rateLimitDurationMS,
      );
    }
  };

  return {
    isRateLimited,
    rateLimitIfNeeded,
  };
}
