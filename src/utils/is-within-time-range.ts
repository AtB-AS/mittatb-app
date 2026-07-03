const MAX_DATE_VALUE = 8640000000000000;

export const isWithinTimeRange = <T extends {startDate?: Date; endDate?: Date}>(
  {startDate, endDate}: T,
  now: number,
) => {
  const start = startDate?.valueOf() ?? 0;
  const end = endDate?.valueOf() ?? MAX_DATE_VALUE;

  return start <= now && end >= now;
};
