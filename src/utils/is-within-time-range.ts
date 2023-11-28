const MAX_DATE_VALUE = 8640000000000000;

export const isWithinTimeRange = <
  T extends {startDate?: number; endDate?: number},
>(
  {startDate, endDate}: T,
  now: number,
) => {
  const start = startDate ?? 0;
  const end = endDate ?? MAX_DATE_VALUE;

  return start <= now && end >= now;
};
