export function dateToDateString(date: Date | undefined) {
  return (date ?? new Date()).toISOString();
}
