import humanizeDuration from 'humanize-duration';
import type {UnitMapType} from './types';

/**
 * These are following the rules from AtB-AS/kundevendt#4220, which apply for validityDuration of FareContracts
 * https://github.com/AtB-AS/kundevendt/issues/4220#issuecomment-2615206325
 * @param seconds
 */

export function fareContractValidityUnits(
  seconds: number,
): humanizeDuration.Unit[] {
  const oneMinuteInSeconds = 60;
  const oneHourInSeconds = oneMinuteInSeconds * 60;
  const oneDayInSeconds = oneHourInSeconds * 24;
  const sevenDaysInSeconds = oneDayInSeconds * 7;
  const unitMap: UnitMapType = [
    {range: {low: -Infinity, high: oneMinuteInSeconds - 1}, units: ['s']},
    {
      range: {low: oneMinuteInSeconds, high: oneHourInSeconds - 1},
      units: ['m', 's'],
    },
    {
      range: {low: oneHourInSeconds, high: oneDayInSeconds - 1},
      units: ['h', 'm'],
    },
    {
      range: {low: oneDayInSeconds, high: sevenDaysInSeconds - 1},
      units: ['d', 'h'],
    },
    {range: {low: sevenDaysInSeconds, high: Infinity}, units: ['d']},
  ];

  return (
    unitMap.find(({range}) => seconds >= range.low && seconds <= range.high)
      ?.units ?? ['d', 'h', 'm']
  );
}
