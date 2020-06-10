declare module 'date-fns' {
  function formatDistanceToNowStrict(
    date: Date | number,
    options?: {
      addSuffix?: boolean;
      unit?: 'second' | 'minute' | 'hour' | 'day' | 'month' | 'year';
      roundingMethod?: 'floor' | 'ceil' | 'round';
      locale?: Locale;
      onlyNumeric?: boolean;
    },
  ): string;
  namespace formatDistanceToNowStrict {}
}
